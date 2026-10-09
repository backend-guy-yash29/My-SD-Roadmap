import { and, count, desc, eq, gte, isNull, sql } from "drizzle-orm";
import type { Db } from "@/db";
import {
  activityEvents,
  itemCompletions,
  items,
  notes,
  roadmaps,
  tracks,
  userItemProgress,
  users,
} from "@/db/schema";
import { addDays, localDate, streaks } from "./dates";
import { AppError } from "./errors";

const WRITE_LIMIT_PER_MINUTE = 60;

/** Rejects a write when the user has logged too many events in the last minute. */
export async function checkWriteLimit(db: Db, userId: string, now = new Date()) {
  const since = new Date(now.getTime() - 60_000);
  const [row] = await db
    .select({ n: count() })
    .from(activityEvents)
    .where(and(eq(activityEvents.userId, userId), gte(activityEvents.createdAt, since)));
  if (row.n >= WRITE_LIMIT_PER_MINUTE)
    throw new AppError("RATE_LIMITED", "Too many changes, try again in a minute");
}

async function liveItem(db: Db, itemId: string) {
  const [item] = await db
    .select({ id: items.id })
    .from(items)
    .where(and(eq(items.id, itemId), isNull(items.archivedAt)));
  if (!item) throw new AppError("NOT_FOUND", "Item not found");
}

async function userTimezone(db: Db, userId: string) {
  const [user] = await db
    .select({ timezone: users.timezone })
    .from(users)
    .where(eq(users.id, userId));
  if (!user) throw new AppError("UNAUTHENTICATED", "Unknown user");
  return user.timezone;
}

async function studyStats(db: Db, userId: string, timezone: string, now: Date) {
  const days = await db
    .selectDistinct({ day: itemCompletions.localDate })
    .from(itemCompletions)
    .where(eq(itemCompletions.userId, userId));
  const today = localDate(now, timezone);
  const { current, longest } = streaks(
    days.map((d) => d.day),
    today,
  );
  const from = addDays(today, -364);
  const heat = await db
    .select({ date: itemCompletions.localDate, count: count() })
    .from(itemCompletions)
    .where(and(eq(itemCompletions.userId, userId), gte(itemCompletions.localDate, from)))
    .groupBy(itemCompletions.localDate)
    .orderBy(itemCompletions.localDate);
  return {
    currentStreak: current,
    longestStreak: longest,
    heatmap: { from, to: today, days: heat },
  };
}

export async function setItemDone(
  db: Db,
  userId: string,
  itemId: string,
  done: boolean,
  now = new Date(),
) {
  await liveItem(db, itemId);
  await checkWriteLimit(db, userId, now);
  const timezone = await userTimezone(db, userId);
  const firstCompletion = await db.transaction(async (tx) => {
    await tx
      .insert(userItemProgress)
      .values({ userId, itemId, isDone: done, doneAt: done ? now : null, updatedAt: now })
      .onConflictDoUpdate({
        target: [userItemProgress.userId, userItemProgress.itemId],
        set: {
          isDone: done,
          // Keep the original done time when an already-done item is marked done again.
          doneAt: done
            ? sql`COALESCE(${userItemProgress.doneAt}, ${now.toISOString()}::timestamptz)`
            : null,
          updatedAt: now,
        },
      });
    let first = false;
    if (done) {
      const inserted = await tx
        .insert(itemCompletions)
        .values({ userId, itemId, completedAt: now, localDate: localDate(now, timezone) })
        .onConflictDoNothing()
        .returning({ itemId: itemCompletions.itemId });
      first = inserted.length > 0;
    }
    await tx
      .insert(activityEvents)
      .values({ userId, itemId, type: done ? "item_done" : "item_undone", createdAt: now });
    return first;
  });
  const { currentStreak } = await studyStats(db, userId, timezone, now);
  return { isDone: done, firstCompletion, currentStreak };
}

export async function setNeedsRevision(
  db: Db,
  userId: string,
  itemId: string,
  flag: boolean,
  now = new Date(),
) {
  await liveItem(db, itemId);
  await checkWriteLimit(db, userId, now);
  await db.transaction(async (tx) => {
    await tx
      .insert(userItemProgress)
      .values({ userId, itemId, needsRevision: flag, updatedAt: now })
      .onConflictDoUpdate({
        target: [userItemProgress.userId, userItemProgress.itemId],
        set: { needsRevision: flag, updatedAt: now },
      });
    await tx.insert(activityEvents).values({
      userId,
      itemId,
      type: flag ? "revision_flagged" : "revision_cleared",
      createdAt: now,
    });
  });
  return { needsRevision: flag };
}

export async function getRoadmapProgress(db: Db, userId: string, roadmapId: string) {
  const liveInRoadmap = and(eq(items.roadmapId, roadmapId), isNull(items.archivedAt));
  const [progress, noted, totals] = await Promise.all([
    db
      .select({
        itemId: userItemProgress.itemId,
        trackId: items.trackId,
        isDone: userItemProgress.isDone,
        needsRevision: userItemProgress.needsRevision,
      })
      .from(userItemProgress)
      .innerJoin(items, eq(items.id, userItemProgress.itemId))
      .where(and(eq(userItemProgress.userId, userId), liveInRoadmap)),
    db
      .select({ itemId: notes.itemId })
      .from(notes)
      .innerJoin(items, eq(items.id, notes.itemId))
      .where(and(eq(notes.userId, userId), liveInRoadmap)),
    db
      .select({ trackId: items.trackId, n: count() })
      .from(items)
      .where(liveInRoadmap)
      .groupBy(items.trackId),
  ]);
  const doneItemIds = progress.filter((p) => p.isDone).map((p) => p.itemId);
  const trackStats: Record<string, { done: number; total: number }> = {};
  for (const t of totals) trackStats[t.trackId] = { done: 0, total: t.n };
  for (const p of progress) if (p.isDone && trackStats[p.trackId]) trackStats[p.trackId].done++;
  return {
    doneItemIds,
    revisionItemIds: progress.filter((p) => p.needsRevision).map((p) => p.itemId),
    notedItemIds: noted.map((n) => n.itemId),
    tracks: trackStats,
    done: doneItemIds.length,
    total: totals.reduce((n, t) => n + t.n, 0),
  };
}

/** Done/total per live roadmap for one user. */
export async function roadmapTotals(db: Db, userId: string) {
  const [all, done] = await Promise.all([
    db
      .select({ id: roadmaps.id, title: roadmaps.title, total: count(items.id) })
      .from(roadmaps)
      .leftJoin(items, and(eq(items.roadmapId, roadmaps.id), isNull(items.archivedAt)))
      .where(isNull(roadmaps.archivedAt))
      .groupBy(roadmaps.id, roadmaps.title, roadmaps.position)
      .orderBy(roadmaps.position),
    db
      .select({ roadmapId: items.roadmapId, n: count() })
      .from(userItemProgress)
      .innerJoin(items, eq(items.id, userItemProgress.itemId))
      .where(
        and(
          eq(userItemProgress.userId, userId),
          eq(userItemProgress.isDone, true),
          isNull(items.archivedAt),
        ),
      )
      .groupBy(items.roadmapId),
  ]);
  return all.map((r) => ({
    id: r.id,
    title: r.title,
    total: r.total,
    done: done.find((d) => d.roadmapId === r.id)?.n ?? 0,
  }));
}

export async function getStudyStats(db: Db, userId: string, now = new Date()) {
  return studyStats(db, userId, await userTimezone(db, userId), now);
}

export async function getDashboard(db: Db, userId: string, now = new Date()) {
  const [roadmapsProgress, stats, last] = await Promise.all([
    roadmapTotals(db, userId),
    getStudyStats(db, userId, now),
    db
      .select({
        type: activityEvents.type,
        at: activityEvents.createdAt,
        itemId: items.id,
        itemTitle: items.title,
        trackId: tracks.id,
        trackTitle: tracks.title,
        roadmapId: tracks.roadmapId,
      })
      .from(activityEvents)
      .innerJoin(items, eq(items.id, activityEvents.itemId))
      .innerJoin(tracks, eq(tracks.id, items.trackId))
      .where(
        and(eq(activityEvents.userId, userId), isNull(items.archivedAt), isNull(tracks.archivedAt)),
      )
      .orderBy(desc(activityEvents.createdAt), desc(activityEvents.id))
      .limit(1),
  ]);
  return { roadmaps: roadmapsProgress, ...stats, lastActivity: last[0] ?? null };
}
