import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { activityEvents, items, notes } from "@/db/schema";
import { AppError } from "./errors";
import { checkWriteLimit } from "./progress";

export const NOTE_MAX_LENGTH = 10_000;

export async function getNote(db: Db, userId: string, itemId: string) {
  const [note] = await db
    .select({ body: notes.body, updatedAt: notes.updatedAt })
    .from(notes)
    .where(and(eq(notes.userId, userId), eq(notes.itemId, itemId)));
  return note ?? null;
}

/** Saves a plain-text note; an empty or whitespace-only body deletes it. */
export async function saveNote(
  db: Db,
  userId: string,
  itemId: string,
  body: string,
  now = new Date(),
) {
  if (body.length > NOTE_MAX_LENGTH)
    throw new AppError("VALIDATION", `Notes are limited to ${NOTE_MAX_LENGTH} characters`);
  const [item] = await db.select({ id: items.id }).from(items).where(eq(items.id, itemId));
  if (!item) throw new AppError("NOT_FOUND", "Item not found");
  await checkWriteLimit(db, userId, now);
  const empty = body.trim() === "";
  await db.transaction(async (tx) => {
    if (empty) {
      await tx.delete(notes).where(and(eq(notes.userId, userId), eq(notes.itemId, itemId)));
    } else {
      await tx
        .insert(notes)
        .values({ userId, itemId, body, updatedAt: now })
        .onConflictDoUpdate({
          target: [notes.userId, notes.itemId],
          set: { body, updatedAt: now },
        });
    }
    await tx
      .insert(activityEvents)
      .values({ userId, itemId, type: empty ? "note_deleted" : "note_saved", createdAt: now });
  });
  return empty ? null : { body, updatedAt: now };
}
