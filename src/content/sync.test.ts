import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as s from "@/db/schema";
import type { Db } from "@/db";
import { basicContent, contentDir } from "@/test/fixtures";
import { testDb } from "@/test/db";
import { parseContent } from "./parse";
import { syncContent } from "./sync";

let t: Awaited<ReturnType<typeof testDb>>;
let db: Db;
beforeAll(async () => {
  t = await testDb();
  db = t.db as unknown as Db;
});
afterAll(() => t.client.end());
beforeEach(() => t.reset());

const sync = (files: Record<string, string>) => syncContent(db, parseContent(contentDir(files)));

describe("syncContent", () => {
  it("inserts the content tree and resources", async () => {
    const report = await sync(basicContent);
    expect(report).toMatchObject({ roadmaps: 1, tracks: 2, items: 4, resources: 2 });
    const rows = await db.select().from(s.items).orderBy(s.items.trackId, s.items.position);
    expect(rows.map((r) => [r.id, r.type, r.archivedAt])).toEqual([
      ["demo/first/alpha", "topic", null],
      ["demo/first/beta", "exercise", null],
      ["demo/first/gamma", "topic", null],
      ["demo/second/delta", "case-study", null],
    ]);
  });

  it("is idempotent and keeps resource IDs stable", async () => {
    await sync(basicContent);
    const before = await db.select().from(s.resources).orderBy(s.resources.id);
    await sync(basicContent);
    expect(await db.select().from(s.resources).orderBy(s.resources.id)).toEqual(before);
  });

  it("archives removed items, groups and tracks, and restores them when they return", async () => {
    await sync(basicContent);
    const smaller = {
      ...basicContent,
      "demo/roadmap.md": "# Demo\n\n## Basics\n\n- 01-first\n",
      "demo/01-first.md": "# First Track\n\n## Group A\n\n- Alpha\n",
    };
    delete (smaller as Record<string, string>)["demo/02-second.md"];
    const report = await sync(smaller);
    expect(report.archived).toEqual({ items: 3, groups: 2, tracks: 1, parts: 0, roadmaps: 0 });
    expect(await db.select().from(s.resources)).toEqual([]);

    await sync(basicContent);
    const archived = await db.select().from(s.items).where(eq(s.items.id, "demo/second/delta"));
    expect(archived[0].archivedAt).toBeNull();
  });

  it("moves user data when an item is renamed", async () => {
    await sync(basicContent);
    await db.insert(s.users).values({ id: "u1", email: "u1@example.com" });
    await db.insert(s.userItemProgress).values({ userId: "u1", itemId: "demo/first/alpha", isDone: true });
    await db.insert(s.itemCompletions).values({ userId: "u1", itemId: "demo/first/alpha", localDate: "2026-01-02" });
    await db.insert(s.notes).values({ userId: "u1", itemId: "demo/first/alpha", body: "my note" });

    const renamed = {
      ...basicContent,
      "demo/01-first.md": basicContent["demo/01-first.md"].replace("- Alpha", "- Alpha Prime"),
      "renames.txt": "demo/first/alpha -> demo/first/alpha-prime\n",
    };
    const report = await sync(renamed);
    expect(report.renamed).toBe(1);
    const progress = await db.select().from(s.userItemProgress);
    expect(progress.map((p) => p.itemId)).toEqual(["demo/first/alpha-prime"]);
    expect((await db.select().from(s.notes))[0].itemId).toBe("demo/first/alpha-prime");
    expect((await db.select().from(s.itemCompletions))[0].itemId).toBe("demo/first/alpha-prime");
    expect(await db.select().from(s.items).where(eq(s.items.id, "demo/first/alpha"))).toEqual([]);

    // Running again is a no-op.
    expect((await sync(renamed)).renamed).toBe(0);
  });

  it("merges user data into an existing item when the rename target was already synced", async () => {
    const renamedFile = basicContent["demo/01-first.md"].replace("- Alpha", "- Alpha Prime\n- Alpha");
    await sync({ ...basicContent, "demo/01-first.md": renamedFile });
    await db.insert(s.users).values({ id: "u1", email: "u1@example.com" });
    await db.insert(s.userItemProgress).values({ userId: "u1", itemId: "demo/first/alpha", isDone: true });

    await sync({
      ...basicContent,
      "demo/01-first.md": basicContent["demo/01-first.md"].replace("- Alpha", "- Alpha Prime"),
      "renames.txt": "demo/first/alpha -> demo/first/alpha-prime\n",
    });
    const progress = await db.select().from(s.userItemProgress);
    expect(progress.map((p) => p.itemId)).toEqual(["demo/first/alpha-prime"]);
  });
});
