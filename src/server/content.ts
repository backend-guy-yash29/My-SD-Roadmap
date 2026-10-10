import { and, asc, count, eq, inArray, isNull } from "drizzle-orm";
import type { Db } from "@/db";
import { groups, items, parts, resources, roadmaps, tracks } from "@/db/schema";
import { AppError } from "./errors";

const live = {
  roadmap: isNull(roadmaps.archivedAt),
  part: isNull(parts.archivedAt),
  track: isNull(tracks.archivedAt),
  group: isNull(groups.archivedAt),
  item: isNull(items.archivedAt),
};

async function itemCounts(db: Db, roadmapId?: string) {
  const rows = await db
    .select({ roadmapId: items.roadmapId, trackId: items.trackId, n: count() })
    .from(items)
    .where(and(live.item, roadmapId ? eq(items.roadmapId, roadmapId) : undefined))
    .groupBy(items.roadmapId, items.trackId);
  return rows;
}

export async function listRoadmaps(db: Db) {
  const [rs, ts, counts] = await Promise.all([
    db.select().from(roadmaps).where(live.roadmap).orderBy(asc(roadmaps.position)),
    db.select({ id: tracks.id, roadmapId: tracks.roadmapId }).from(tracks).where(live.track),
    itemCounts(db),
  ]);
  return rs.map((r) => ({
    id: r.id,
    title: r.title,
    summary: r.summary,
    trackCount: ts.filter((t) => t.roadmapId === r.id).length,
    itemCount: counts.filter((c) => c.roadmapId === r.id).reduce((n, c) => n + c.n, 0),
  }));
}

export async function getRoadmap(db: Db, roadmapId: string) {
  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(and(eq(roadmaps.id, roadmapId), live.roadmap));
  if (!roadmap) throw new AppError("NOT_FOUND", "Roadmap not found");
  const [ps, ts, counts] = await Promise.all([
    db
      .select()
      .from(parts)
      .where(and(eq(parts.roadmapId, roadmapId), live.part))
      .orderBy(asc(parts.position)),
    db
      .select()
      .from(tracks)
      .where(and(eq(tracks.roadmapId, roadmapId), live.track))
      .orderBy(asc(tracks.position)),
    itemCounts(db, roadmapId),
  ]);
  return {
    id: roadmap.id,
    title: roadmap.title,
    summary: roadmap.summary,
    parts: ps.map((p) => ({
      id: p.id,
      title: p.title,
      tracks: ts
        .filter((t) => t.partId === p.id)
        .map((t) => ({
          id: t.id,
          slug: t.id.slice(roadmapId.length + 1),
          title: t.title,
          summary: t.summary,
          position: t.position,
          itemCount: counts.find((c) => c.trackId === t.id)?.n ?? 0,
        })),
    })),
  };
}

export async function getTrack(db: Db, trackId: string) {
  const [track] = await db
    .select()
    .from(tracks)
    .where(and(eq(tracks.id, trackId), live.track));
  if (!track) throw new AppError("NOT_FOUND", "Track not found");
  const [gs, is] = await Promise.all([
    db
      .select()
      .from(groups)
      .where(and(eq(groups.trackId, trackId), live.group))
      .orderBy(asc(groups.position)),
    db
      .select()
      .from(items)
      .where(and(eq(items.trackId, trackId), live.item))
      .orderBy(asc(items.position)),
  ]);
  const rs = is.length
    ? await db
        .select()
        .from(resources)
        .where(
          inArray(
            resources.itemId,
            is.map((i) => i.id),
          ),
        )
        .orderBy(asc(resources.position))
    : [];
  return {
    id: track.id,
    roadmapId: track.roadmapId,
    title: track.title,
    summary: track.summary,
    position: track.position,
    groups: gs.map((g) => ({
      id: g.id,
      title: g.title,
      note: g.note,
      items: is
        .filter((i) => i.groupId === g.id)
        .map((i) => ({
          id: i.id,
          title: i.title,
          type: i.type,
          resources: rs
            .filter((r) => r.itemId === i.id)
            .map((r) => ({ id: r.id, source: r.source, title: r.title, url: r.url })),
        })),
    })),
  };
}

export type RoadmapView = Awaited<ReturnType<typeof getRoadmap>>;
export type TrackView = Awaited<ReturnType<typeof getTrack>>;
