import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/db";
import * as s from "@/db/schema";
import { parseContent } from "@/content/parse";
import { syncContent } from "@/content/sync";
import { basicContent, contentDir } from "@/test/fixtures";
import { testDb } from "@/test/db";
import { getNavigation, getRoadmap, getTrack, listRoadmaps } from "./content";
import { enroll, listEnrollments, unenroll } from "./enrollments";
import { getAppearance, updateAppearance } from "./appearance";
import { AppError } from "./errors";
import { getNote, saveNote } from "./notes";
import { generateUsername, getMyProfile, getPublicProfile, updateProfile } from "./profile";
import { getDashboard, getRoadmapProgress, setItemDone, setNeedsRevision } from "./progress";
import { openResource } from "./resources";

let t: Awaited<ReturnType<typeof testDb>>;
let db: Db;
beforeAll(async () => {
  t = await testDb();
  db = t.db as unknown as Db;
});
afterAll(() => t.client.end());
beforeEach(async () => {
  await t.reset();
  await syncContent(db, parseContent(contentDir(basicContent)));
  await db.insert(s.users).values([
    { id: "u1", email: "ada@example.com", username: "ada", timezone: "Asia/Kolkata" },
    { id: "u2", email: "bob@example.com", username: "bob" },
  ]);
});

const at = (iso: string) => new Date(iso);
const ALPHA = "demo/first/alpha";
const BETA = "demo/first/beta";
const GAMMA = "demo/first/gamma";
const DELTA = "demo/second/delta";

async function expectCode(p: Promise<unknown>, code: string) {
  await expect(p).rejects.toSatisfy((e) => e instanceof AppError && e.code === code);
}

describe("content reads", () => {
  it("lists roadmaps with counts", async () => {
    expect(await listRoadmaps(db)).toEqual([
      {
        id: "demo",
        title: "Demo",
        summary: "A demo roadmap.",
        menu: null,
        menuNote: null,
        category: null,
        tagline: null,
        trackCount: 2,
        itemCount: 4,
      },
    ]);
  });
  it("returns the roadmap tree and a track with resources", async () => {
    const roadmap = await getRoadmap(db, "demo");
    expect(roadmap.parts[0].tracks.map((x) => [x.slug, x.itemCount])).toEqual([
      ["first", 3],
      ["second", 1],
    ]);
    const track = await getTrack(db, "demo/first");
    expect(track.groups[0].items[0].resources.map((r) => r.source)).toEqual(["Src", "Other Src"]);
    await expectCode(getTrack(db, "demo/nope"), "NOT_FOUND");
  });
  it("returns navigation with tracks numbered across parts", async () => {
    expect(await getNavigation(db)).toEqual([
      {
        id: "demo",
        title: "Demo",
        menu: null,
        menuNote: null,
        category: null,
        tagline: null,
        parts: [
          {
            id: "demo/basics",
            title: "Basics",
            tracks: [
              { id: "demo/first", number: 1, title: "First Track", itemCount: 3 },
              { id: "demo/second", number: 2, title: "Second Track", itemCount: 1 },
            ],
          },
        ],
      },
    ]);
  });
});

describe("setItemDone and streaks", () => {
  it("records a first completion with the user's local date", async () => {
    const res = await setItemDone(db, "u1", ALPHA, true, at("2026-03-01T20:30:00Z"));
    expect(res).toEqual({ isDone: true, firstCompletion: true, currentStreak: 1 });
    const [c] = await db.select().from(s.itemCompletions);
    expect(c.localDate).toBe("2026-03-02"); // 02:00 the next day in Kolkata
  });

  it("does not give credit twice for the same item, even after unmarking", async () => {
    await setItemDone(db, "u1", ALPHA, true, at("2026-03-01T06:00:00Z"));
    const undone = await setItemDone(db, "u1", ALPHA, false, at("2026-03-01T07:00:00Z"));
    expect(undone.isDone).toBe(false);
    expect(undone.currentStreak).toBe(1); // unmarking keeps the credit
    const again = await setItemDone(db, "u1", ALPHA, true, at("2026-03-02T06:00:00Z"));
    expect(again).toEqual({ isDone: true, firstCompletion: false, currentStreak: 1 });
    expect(await db.select().from(s.itemCompletions)).toHaveLength(1);
  });

  it("builds a streak across consecutive days and resets after a gap", async () => {
    await setItemDone(db, "u1", ALPHA, true, at("2026-03-01T06:00:00Z"));
    await setItemDone(db, "u1", BETA, true, at("2026-03-02T06:00:00Z"));
    const day3 = await setItemDone(db, "u1", GAMMA, true, at("2026-03-03T06:00:00Z"));
    expect(day3.currentStreak).toBe(3);
    const dash = await getDashboard(db, "u1", at("2026-03-05T06:00:00Z"));
    expect(dash.currentStreak).toBe(0);
    expect(dash.longestStreak).toBe(3);
    expect(dash.heatmap.days).toEqual([
      { date: "2026-03-01", count: 1 },
      { date: "2026-03-02", count: 1 },
      { date: "2026-03-03", count: 1 },
    ]);
  });

  it("rejects unknown and archived items", async () => {
    await expectCode(setItemDone(db, "u1", "demo/first/nope", true), "NOT_FOUND");
    await db.update(s.items).set({ archivedAt: new Date() }).where(eq(s.items.id, ALPHA));
    await expectCode(setItemDone(db, "u1", ALPHA, true), "NOT_FOUND");
  });

  it("logs activity for every change", async () => {
    await setItemDone(db, "u1", ALPHA, true);
    await setItemDone(db, "u1", ALPHA, false);
    await setNeedsRevision(db, "u1", ALPHA, true);
    const events = await db
      .select({ type: s.activityEvents.type })
      .from(s.activityEvents)
      .orderBy(s.activityEvents.id);
    expect(events.map((e) => e.type)).toEqual(["item_done", "item_undone", "revision_flagged"]);
  });

  it("rate-limits writes per user", async () => {
    const now = at("2026-03-01T06:00:00Z");
    await db.insert(s.activityEvents).values(
      Array.from({ length: 60 }, () => ({
        userId: "u1",
        type: "item_done" as const,
        createdAt: now,
      })),
    );
    await expectCode(setItemDone(db, "u1", ALPHA, true, now), "RATE_LIMITED");
    await setItemDone(db, "u2", ALPHA, true, now); // other users are unaffected
    await setItemDone(db, "u1", ALPHA, true, at("2026-03-01T06:01:01Z")); // window has passed
  });
});

describe("progress views", () => {
  it("summarises one roadmap", async () => {
    await setItemDone(db, "u1", ALPHA, true);
    await setItemDone(db, "u1", DELTA, true);
    await setNeedsRevision(db, "u1", BETA, true);
    await saveNote(db, "u1", GAMMA, "remember this");
    expect(await getRoadmapProgress(db, "u1", "demo")).toEqual({
      doneItemIds: expect.arrayContaining([ALPHA, DELTA]),
      revisionItemIds: [BETA],
      notedItemIds: [GAMMA],
      tracks: { "demo/first": { done: 1, total: 3 }, "demo/second": { done: 1, total: 1 } },
      done: 2,
      total: 4,
    });
  });

  it("excludes archived items from totals but keeps their streak credit", async () => {
    await setItemDone(db, "u1", ALPHA, true, at("2026-03-01T06:00:00Z"));
    await db.update(s.items).set({ archivedAt: new Date() }).where(eq(s.items.id, ALPHA));
    const progress = await getRoadmapProgress(db, "u1", "demo");
    expect([progress.done, progress.total]).toEqual([0, 3]);
    expect((await getDashboard(db, "u1", at("2026-03-01T08:00:00Z"))).currentStreak).toBe(1);
  });

  it("points 'continue where you left off' at the latest activity", async () => {
    await setItemDone(db, "u1", ALPHA, true, at("2026-03-01T06:00:00Z"));
    await setItemDone(db, "u1", DELTA, true, at("2026-03-01T07:00:00Z"));
    const dash = await getDashboard(db, "u1", at("2026-03-01T08:00:00Z"));
    expect(dash.lastActivity).toMatchObject({
      itemId: DELTA,
      trackId: "demo/second",
      roadmapId: "demo",
    });
    expect(dash.roadmaps).toEqual([
      { id: "demo", title: "Demo", total: 4, done: 2, enrolled: true },
    ]);
  });
});

describe("enrollments", () => {
  it("enrolls and leaves, keeping progress by default", async () => {
    expect(await enroll(db, "u1", "demo")).toEqual(["demo"]);
    expect(await enroll(db, "u1", "demo")).toEqual(["demo"]); // idempotent
    await expectCode(enroll(db, "u1", "nope"), "NOT_FOUND");
    await setItemDone(db, "u1", ALPHA, true);
    await saveNote(db, "u1", BETA, "keep me");
    expect(await unenroll(db, "u1", "demo", false)).toEqual([]);
    const progress = await getRoadmapProgress(db, "u1", "demo");
    expect([progress.doneItemIds, progress.notedItemIds]).toEqual([[ALPHA], [BETA]]);
  });

  it("enrolls on the first tick, not on unticking", async () => {
    await setItemDone(db, "u1", ALPHA, false);
    expect(await listEnrollments(db, "u1")).toEqual([]);
    await setItemDone(db, "u1", ALPHA, true);
    expect(await listEnrollments(db, "u1")).toEqual(["demo"]);
    expect(await listEnrollments(db, "u2")).toEqual([]);
  });

  it("deletes ticks and notes on request but keeps streak credit", async () => {
    await setItemDone(db, "u1", ALPHA, true, at("2026-03-01T06:00:00Z"));
    await saveNote(db, "u1", BETA, "gone soon");
    await setItemDone(db, "u2", ALPHA, true);
    await unenroll(db, "u1", "demo", true, at("2026-03-01T07:00:00Z"));
    const progress = await getRoadmapProgress(db, "u1", "demo");
    expect([progress.done, progress.notedItemIds]).toEqual([0, []]);
    expect((await getDashboard(db, "u1", at("2026-03-01T08:00:00Z"))).currentStreak).toBe(1);
    expect((await getRoadmapProgress(db, "u2", "demo")).done).toBe(1);
  });
});

describe("appearance", () => {
  it("returns defaults, saves a valid appearance and rejects bad input", async () => {
    expect(await getAppearance(db, "u1")).toMatchObject({ palette: "crisp", mode: "system" });
    const saved = await updateAppearance(db, "u1", {
      palette: "paper",
      mode: "dark",
      colors: { dark: { accent: "#2dd4bf" } },
    });
    expect(saved).toMatchObject({ palette: "paper", font: "inter", colors: { light: {} } });
    expect(await getAppearance(db, "u1")).toEqual(saved);
    expect((await getAppearance(db, "u2")).palette).toBe("crisp");
    await expectCode(updateAppearance(db, "u1", { palette: "neon" }), "VALIDATION");
    await expectCode(
      updateAppearance(db, "u1", { colors: { light: { heading: "red;}" } } }),
      "VALIDATION",
    );
    await expectCode(updateAppearance(db, "u1", { extra: true }), "VALIDATION");
  });
});

describe("notes", () => {
  it("saves, updates and deletes one plain-text note per item", async () => {
    expect(await getNote(db, "u1", ALPHA)).toBeNull();
    await saveNote(db, "u1", ALPHA, "first");
    await saveNote(db, "u1", ALPHA, "second");
    expect((await getNote(db, "u1", ALPHA))?.body).toBe("second");
    expect(await saveNote(db, "u1", ALPHA, "   ")).toBeNull();
    expect(await getNote(db, "u1", ALPHA)).toBeNull();
  });
  it("enforces the length limit", async () => {
    await expectCode(saveNote(db, "u1", ALPHA, "x".repeat(10_001)), "VALIDATION");
  });
});

describe("resources", () => {
  it("returns the URL and logs opens for signed-in users only", async () => {
    const [r] = await db.select().from(s.resources).orderBy(s.resources.id).limit(1);
    expect(await openResource(db, r.id, "u1")).toBe("https://example.com/alpha");
    expect(await openResource(db, r.id, null)).toBe("https://example.com/alpha");
    const events = await db.select().from(s.activityEvents);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: "resource_opened", itemId: ALPHA, resourceId: r.id });
    expect(await openResource(db, 999_999, "u1")).toBeNull();
  });
});

describe("profiles", () => {
  it("updates and validates profile fields", async () => {
    const p = await updateProfile(db, "u1", {
      username: "ada-l",
      timezone: "Europe/London",
      profilePublic: true,
    });
    expect(p).toMatchObject({ username: "ada-l", timezone: "Europe/London", profilePublic: true });
    await expectCode(updateProfile(db, "u1", { username: "bob" }), "CONFLICT");
    await expectCode(updateProfile(db, "u1", { username: "Bad Name" }), "VALIDATION");
    await expectCode(updateProfile(db, "u1", { timezone: "Mars/Base" }), "VALIDATION");
    await expectCode(updateProfile(db, "u1", { email: "x@y.z" }), "VALIDATION");
  });

  it("hides private profiles from everyone but their owner", async () => {
    await expectCode(getPublicProfile(db, "ada", null), "NOT_FOUND");
    await expectCode(getPublicProfile(db, "ada", "u2"), "NOT_FOUND");
    expect((await getPublicProfile(db, "ada", "u1")).isPublic).toBe(false);
    await updateProfile(db, "u1", { profilePublic: true });
    await setItemDone(db, "u1", ALPHA, true);
    const pub = await getPublicProfile(db, "ada", null);
    expect(pub).toMatchObject({ username: "ada", isPublic: true, currentStreak: 1 });
    expect(pub.roadmaps).toEqual([
      { id: "demo", title: "Demo", total: 4, done: 1, enrolled: true },
    ]);
    expect(pub).not.toHaveProperty("email");
    await expectCode(getPublicProfile(db, "nobody", null), "NOT_FOUND");
  });

  it("generates a free username", async () => {
    expect(await generateUsername(db, "carol@example.com", null)).toBe("carol");
    expect(await generateUsername(db, "ada@example.com", null)).toMatch(/^ada-\d{4}$/);
    expect(await generateUsername(db, "x@example.com", null)).toBe("x-user");
    expect((await getMyProfile(db, "u2")).timezone).toBe("UTC");
  });
});
