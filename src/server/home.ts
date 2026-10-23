import { and, asc, count, desc, eq, gte, inArray, isNull, or, sql } from "drizzle-orm";
import type { Db } from "@/db";
import {
  activityEvents,
  itemCompletions,
  items,
  notes,
  resources,
  tracks,
  userItemProgress,
  users,
} from "@/db/schema";
import { addDays, localDate } from "./dates";
import { AppError } from "./errors";
import { getStudyStats, roadmapTotals } from "./progress";

const liveItemAndTrack = and(isNull(items.archivedAt), isNull(tracks.archivedAt));

/** Achievements, in the order they are usually earned. */
const BADGES = [
  { id: "topics-10", icon: "✅", label: "10 topics", metric: "topics", at: 10 },
  { id: "streak-3", icon: "🔥", label: "3-day streak", metric: "streak", at: 3 },
  { id: "track-1", icon: "🏁", label: "First track done", metric: "tracks", at: 1 },
  { id: "streak-7", icon: "🔥", label: "7-day streak", metric: "streak", at: 7 },
  { id: "topics-100", icon: "💯", label: "100 topics", metric: "topics", at: 100 },
  { id: "track-10", icon: "🏁", label: "10 tracks done", metric: "tracks", at: 10 },
  { id: "roadmap-1", icon: "🗺️", label: "First roadmap done", metric: "roadmaps", at: 1 },
  { id: "streak-30", icon: "⚡", label: "30-day streak", metric: "streak", at: 30 },
  { id: "topics-500", icon: "🚀", label: "500 topics", metric: "topics", at: 500 },
  { id: "streak-100", icon: "🏆", label: "100-day streak", metric: "streak", at: 100 },
  { id: "topics-1000", icon: "🏆", label: "1,000 topics", metric: "topics", at: 1000 },
] as const;

/** Per live track: how many items it has and how many the user has done. */
async function trackCompletion(db: Db, userId: string) {
  return db
    .select({
      trackId: tracks.id,
      trackTitle: tracks.title,
      roadmapId: tracks.roadmapId,
      total: count(items.id),
      done: sql<number>`count(*) filter (where ${userItemProgress.isDone})`.mapWith(Number),
    })
    .from(items)
    .innerJoin(tracks, eq(tracks.id, items.trackId))
    .leftJoin(
      userItemProgress,
      and(eq(userItemProgress.itemId, items.id), eq(userItemProgress.userId, userId)),
    )
    .where(liveItemAndTrack)
    .groupBy(tracks.id, tracks.title, tracks.roadmapId);
}

/** Everything the signed-in dashboard shows beyond streaks and the heatmap. */
export async function getHome(db: Db, userId: string, now = new Date()) {
  const [user] = await db
    .select({ timezone: users.timezone, dailyGoal: users.dailyGoal })
    .from(users)
    .where(eq(users.id, userId));
  if (!user) throw new AppError("UNAUTHENTICATED", "Unknown user");
  const today = localDate(now, user.timezone);

  const [
    recentDays,
    totals,
    stats,
    completions,
    revision,
    revisionTotal,
    recentNotes,
    opened,
    perTrack,
  ] = await Promise.all([
    db
      .select({ date: itemCompletions.localDate, n: count() })
      .from(itemCompletions)
      .where(
        and(
          eq(itemCompletions.userId, userId),
          gte(itemCompletions.localDate, addDays(today, -13)),
        ),
      )
      .groupBy(itemCompletions.localDate),
    roadmapTotals(db, userId),
    getStudyStats(db, userId, now),
    db.select({ n: count() }).from(itemCompletions).where(eq(itemCompletions.userId, userId)),
    db
      .select({
        itemId: items.id,
        itemTitle: items.title,
        trackId: tracks.id,
        trackTitle: tracks.title,
      })
      .from(userItemProgress)
      .innerJoin(items, eq(items.id, userItemProgress.itemId))
      .innerJoin(tracks, eq(tracks.id, items.trackId))
      .where(
        and(
          eq(userItemProgress.userId, userId),
          eq(userItemProgress.needsRevision, true),
          liveItemAndTrack,
        ),
      )
      .orderBy(desc(userItemProgress.updatedAt))
      .limit(5),
    db
      .select({ n: count() })
      .from(userItemProgress)
      .innerJoin(items, eq(items.id, userItemProgress.itemId))
      .innerJoin(tracks, eq(tracks.id, items.trackId))
      .where(
        and(
          eq(userItemProgress.userId, userId),
          eq(userItemProgress.needsRevision, true),
          liveItemAndTrack,
        ),
      ),
    db
      .select({
        itemId: items.id,
        itemTitle: items.title,
        trackId: tracks.id,
        body: notes.body,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .innerJoin(items, eq(items.id, notes.itemId))
      .innerJoin(tracks, eq(tracks.id, items.trackId))
      .where(and(eq(notes.userId, userId), liveItemAndTrack))
      .orderBy(desc(notes.updatedAt))
      .limit(4),
    db
      .select({
        resourceId: resources.id,
        source: resources.source,
        title: resources.title,
        url: resources.url,
        itemTitle: items.title,
        trackId: tracks.id,
        openedAt: activityEvents.createdAt,
      })
      .from(activityEvents)
      .innerJoin(resources, eq(resources.id, activityEvents.resourceId))
      .innerJoin(items, eq(items.id, resources.itemId))
      .innerJoin(tracks, eq(tracks.id, items.trackId))
      .where(
        and(
          eq(activityEvents.userId, userId),
          eq(activityEvents.type, "resource_opened"),
          liveItemAndTrack,
        ),
      )
      .orderBy(desc(activityEvents.createdAt), desc(activityEvents.id))
      .limit(25),
    trackCompletion(db, userId),
  ]);

  // Today and the last two weeks.
  const byDate = new Map(recentDays.map((d) => [d.date, d.n]));
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i - 6);
    return { date, count: byDate.get(date) ?? 0 };
  });
  const sumDays = (from: number, to: number) =>
    Array.from(
      { length: to - from + 1 },
      (_, i) => byDate.get(addDays(today, from + i)) ?? 0,
    ).reduce((a, b) => a + b, 0);

  // Continue learning: the first unfinished item of each enrolled roadmap, in course order.
  const enrolled = totals.filter((r) => r.enrolled);
  const nextItems = enrolled.length
    ? await db
        .selectDistinctOn([items.roadmapId], {
          roadmapId: items.roadmapId,
          itemId: items.id,
          itemTitle: items.title,
          trackId: tracks.id,
          trackTitle: tracks.title,
        })
        .from(items)
        .innerJoin(tracks, eq(tracks.id, items.trackId))
        .leftJoin(
          userItemProgress,
          and(eq(userItemProgress.itemId, items.id), eq(userItemProgress.userId, userId)),
        )
        .where(
          and(
            inArray(
              items.roadmapId,
              enrolled.map((r) => r.id),
            ),
            liveItemAndTrack,
            or(isNull(userItemProgress.isDone), eq(userItemProgress.isDone, false)),
          ),
        )
        .orderBy(asc(items.roadmapId), asc(tracks.position), asc(items.position))
    : [];
  const continueLearning = enrolled.flatMap((r) => {
    const next = nextItems.find((n) => n.roadmapId === r.id);
    return next ? [{ ...next, roadmapTitle: r.title, done: r.done, total: r.total }] : [];
  });

  // Milestones.
  const finishedTracks = perTrack.filter((t) => t.total > 0 && t.done === t.total);
  const finishedRoadmaps = totals.filter((r) => r.total > 0 && r.done === r.total).length;
  const metrics = {
    topics: completions[0].n,
    streak: stats.longestStreak,
    tracks: finishedTracks.length,
    roadmaps: finishedRoadmaps,
  };
  const enrolledIds = new Set(enrolled.map((r) => r.id));
  const closest = perTrack
    .filter((t) => enrolledIds.has(t.roadmapId) && t.done > 0 && t.done < t.total)
    .sort((a, b) => a.total - a.done - (b.total - b.done))[0];

  // Suggested next: the roadmap after the one you're furthest through, in course order.
  const pct = (r: { done: number; total: number }) => (r.total ? r.done / r.total : 0);
  const furthest = [...enrolled].sort((a, b) => pct(b) - pct(a))[0];
  const position = (id: string) => totals.findIndex((r) => r.id === id);
  const candidates = totals.filter((r) => !r.enrolled);
  const suggestion = furthest
    ? (candidates.find((r) => position(r.id) > position(furthest.id)) ?? candidates[0] ?? null)
    : null;

  // The same video can be linked from several topics; list each link once.
  const seen = new Set<string>();
  return {
    dailyGoal: user.dailyGoal,
    today: byDate.get(today) ?? 0,
    week: {
      days: week,
      total: sumDays(-6, 0),
      previousTotal: sumDays(-13, -7),
      activeDays: week.filter((d) => d.count > 0).length,
    },
    continueLearning,
    revision: { total: revisionTotal[0].n, items: revision },
    notes: recentNotes.map(({ body, ...n }) => ({
      ...n,
      snippet: body.length > 140 ? `${body.slice(0, 140).trimEnd()}…` : body,
    })),
    resources: opened.filter((o) => !seen.has(o.url) && seen.add(o.url)).slice(0, 5),
    milestones: {
      badges: BADGES.map((b) => ({
        id: b.id,
        icon: b.icon,
        label: b.label,
        earned: metrics[b.metric] >= b.at,
      })),
      closestTrack: closest
        ? {
            trackId: closest.trackId,
            title: closest.trackTitle,
            left: closest.total - closest.done,
          }
        : null,
      tracksDone: finishedTracks.length,
    },
    suggestion:
      furthest && suggestion
        ? {
            from: {
              id: furthest.id,
              title: furthest.title,
              percent: Math.round(pct(furthest) * 100),
            },
            to: { id: suggestion.id, title: suggestion.title },
          }
        : null,
  };
}

export type Home = Awaited<ReturnType<typeof getHome>>;

export async function setDailyGoal(db: Db, userId: string, goal: number) {
  if (!Number.isInteger(goal) || goal < 1 || goal > 50)
    throw new AppError("VALIDATION", "Daily goal must be between 1 and 50 topics");
  await db.update(users).set({ dailyGoal: goal }).where(eq(users.id, userId));
  return goal;
}
