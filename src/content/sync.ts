import { and, eq, inArray, isNull, notInArray, sql } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import type { Db } from "@/db";
import { groups, items, parts, resources, roadmaps, tracks } from "@/db/schema";
import { flatten, type Content } from "./parse";

type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

const CHUNK = 500;

function chunks<T>(rows: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += CHUNK) out.push(rows.slice(i, i + CHUNK));
  return out;
}

/** Sets every non-key column from the incoming row on conflict. */
function excludedSet(columns: Record<string, PgColumn>, skip: string[]) {
  return Object.fromEntries(
    Object.entries(columns)
      .filter(([key]) => !skip.includes(key))
      .map(([key, col]) => [key, sql.raw(`excluded."${col.name}"`)]),
  );
}

async function upsert<T extends PgTable>(
  tx: Tx,
  table: T,
  rows: Record<string, unknown>[],
  columns: Record<string, PgColumn>,
) {
  for (const batch of chunks(rows)) {
    await tx
      .insert(table)
      .values(batch.map((r) => ({ ...r, archivedAt: null })) as never)
      .onConflictDoUpdate({ target: columns.id, set: excludedSet(columns, ["id"]) as never });
  }
}

/** Archives rows of `table` that are not in `keep`; un-archiving happens through the upsert. */
async function archiveMissing(tx: Tx, table: PgTable, idCol: PgColumn, archivedCol: PgColumn, keep: string[]) {
  const result = await tx
    .update(table)
    .set({ archivedAt: new Date() } as never)
    .where(and(isNull(archivedCol), keep.length ? notInArray(idCol, keep) : undefined))
    .returning({ id: idCol });
  return result.length;
}

export type SyncReport = {
  renamed: number;
  roadmaps: number;
  tracks: number;
  items: number;
  resources: number;
  archived: { roadmaps: number; parts: number; tracks: number; groups: number; items: number };
};

/** Writes parsed content into the database in one transaction. Safe to run repeatedly. */
export async function syncContent(db: Db, content: Content): Promise<SyncReport> {
  const rows = flatten(content);
  const itemIds = rows.items.map((i) => i.id);

  return db.transaction(async (tx) => {
    // 1. Renames. If the new ID does not exist yet, change the item's key and let ON UPDATE CASCADE
    // carry user data along. If it already exists, move user rows over where they don't collide.
    let renamed = 0;
    for (const { from, to } of content.renames) {
      const [source] = await tx.select({ id: items.id }).from(items).where(eq(items.id, from));
      if (!source) continue; // already applied
      const [target] = await tx.select({ id: items.id }).from(items).where(eq(items.id, to));
      if (!target) {
        await tx.update(items).set({ id: to }).where(eq(items.id, from));
      } else {
        for (const table of ["user_item_progress", "item_completions", "notes"]) {
          await tx.execute(sql`
            UPDATE ${sql.identifier(table)} AS t SET item_id = ${to}
            WHERE t.item_id = ${from}
              AND NOT EXISTS (SELECT 1 FROM ${sql.identifier(table)} u WHERE u.user_id = t.user_id AND u.item_id = ${to})`);
        }
        await tx.execute(sql`UPDATE activity_events SET item_id = ${to} WHERE item_id = ${from}`);
      }
      renamed++;
    }

    // 2. Content tree, parents first.
    await upsert(tx, roadmaps, rows.roadmaps.map((r) => ({ ...r, updatedAt: new Date() })), {
      id: roadmaps.id,
      title: roadmaps.title,
      summary: roadmaps.summary,
      position: roadmaps.position,
      updatedAt: roadmaps.updatedAt,
      archivedAt: roadmaps.archivedAt,
    });
    await upsert(tx, parts, rows.parts, {
      id: parts.id,
      roadmapId: parts.roadmapId,
      title: parts.title,
      position: parts.position,
      archivedAt: parts.archivedAt,
    });
    await upsert(tx, tracks, rows.tracks, {
      id: tracks.id,
      roadmapId: tracks.roadmapId,
      partId: tracks.partId,
      title: tracks.title,
      summary: tracks.summary,
      position: tracks.position,
      archivedAt: tracks.archivedAt,
    });
    await upsert(tx, groups, rows.groups, {
      id: groups.id,
      trackId: groups.trackId,
      title: groups.title,
      note: groups.note,
      position: groups.position,
      archivedAt: groups.archivedAt,
    });
    await upsert(tx, items, rows.items, {
      id: items.id,
      roadmapId: items.roadmapId,
      trackId: items.trackId,
      groupId: items.groupId,
      title: items.title,
      type: items.type,
      position: items.position,
      archivedAt: items.archivedAt,
    });

    // 3. Archive what is no longer in the content. Rows stay so user data keeps its references.
    const archived = {
      items: await archiveMissing(tx, items, items.id, items.archivedAt, itemIds),
      groups: await archiveMissing(tx, groups, groups.id, groups.archivedAt, rows.groups.map((g) => g.id)),
      tracks: await archiveMissing(tx, tracks, tracks.id, tracks.archivedAt, rows.tracks.map((t) => t.id)),
      parts: await archiveMissing(tx, parts, parts.id, parts.archivedAt, rows.parts.map((p) => p.id)),
      roadmaps: await archiveMissing(tx, roadmaps, roadmaps.id, roadmaps.archivedAt, rows.roadmaps.map((r) => r.id)),
    };

    // 4. Resources: upsert by (item, url) so IDs stay stable, then drop links no longer listed.
    for (const batch of chunks(rows.resources)) {
      await tx
        .insert(resources)
        .values(batch)
        .onConflictDoUpdate({
          target: [resources.itemId, resources.url],
          set: { source: sql`excluded.source`, title: sql`excluded.title`, position: sql`excluded.position` },
        });
    }
    const keep = new Set(rows.resources.map((r) => `${r.itemId}\u0000${r.url}`));
    const existing = await tx.select({ id: resources.id, itemId: resources.itemId, url: resources.url }).from(resources);
    const stale = existing.filter((r) => !keep.has(`${r.itemId}\u0000${r.url}`)).map((r) => r.id);
    for (const batch of chunks(stale)) await tx.delete(resources).where(inArray(resources.id, batch));

    return {
      renamed,
      roadmaps: rows.roadmaps.length,
      tracks: rows.tracks.length,
      items: rows.items.length,
      resources: rows.resources.length,
      archived,
    };
  });
}
