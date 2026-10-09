import { eq } from "drizzle-orm";
import { z } from "zod";
import type { Db } from "@/db";
import { users } from "@/db/schema";
import { isValidTimezone } from "./dates";
import { AppError } from "./errors";
import { getStudyStats, roadmapTotals } from "./progress";

export const USERNAME_RE = /^[a-z0-9_-]{3,30}$/;

export const profilePatch = z
  .object({
    username: z.string().regex(USERNAME_RE, "3–30 lowercase letters, digits, _ or -"),
    name: z.string().trim().min(1).max(80),
    timezone: z.string().refine(isValidTimezone, "Unknown timezone"),
    profilePublic: z.boolean(),
  })
  .partial()
  .strict();

export async function getMyProfile(db: Db, userId: string) {
  const [user] = await db
    .select({
      username: users.username,
      name: users.name,
      image: users.image,
      timezone: users.timezone,
      profilePublic: users.profilePublic,
    })
    .from(users)
    .where(eq(users.id, userId));
  if (!user) throw new AppError("UNAUTHENTICATED", "Unknown user");
  return user;
}

export async function updateProfile(db: Db, userId: string, patch: unknown) {
  const parsed = profilePatch.safeParse(patch);
  if (!parsed.success)
    throw new AppError("VALIDATION", parsed.error.issues.map((i) => i.message).join("; "));
  const values = parsed.data;
  if (values.username) {
    const [taken] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, values.username));
    if (taken && taken.id !== userId) throw new AppError("CONFLICT", "That username is taken");
  }
  if (Object.keys(values).length) await db.update(users).set(values).where(eq(users.id, userId));
  return getMyProfile(db, userId);
}

/** Public view of a profile. Private and missing profiles both return NOT_FOUND. */
export async function getPublicProfile(
  db: Db,
  username: string,
  viewerId: string | null,
  now = new Date(),
) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      image: users.image,
      profilePublic: users.profilePublic,
    })
    .from(users)
    .where(eq(users.username, username));
  if (!user || (!user.profilePublic && user.id !== viewerId))
    throw new AppError("NOT_FOUND", "Profile not found");
  const [roadmapsProgress, stats] = await Promise.all([
    roadmapTotals(db, user.id),
    getStudyStats(db, user.id, now),
  ]);
  return {
    username: user.username!,
    name: user.name,
    image: user.image,
    isPublic: user.profilePublic,
    roadmaps: roadmapsProgress,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    heatmap: stats.heatmap,
  };
}

/** Picks a free username from the user's email or name, e.g. "ada" or "ada-4821". */
export async function generateUsername(db: Db, email: string | null, name: string | null) {
  const base =
    (email?.split("@")[0] ?? name ?? "user")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24) || "user";
  const padded = base.length < 3 ? `${base}-user` : base;
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate =
      attempt === 0 ? padded : `${padded}-${Math.floor(1000 + Math.random() * 9000)}`;
    const [taken] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, candidate));
    if (!taken) return candidate;
  }
  return `user-${crypto.randomUUID().slice(0, 8)}`;
}
