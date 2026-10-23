import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import type { Db } from "@/db";
import { enrollments, items, notes, roadmaps, userItemProgress } from "@/db/schema";
import { AppError } from "./errors";
import { checkWriteLimit } from "./progress";

/** Ids of the live roadmaps a user is enrolled in, in roadmap order. */
export async function listEnrollments(db: Db, userId: string) {
  const rows = await db
    .select({ id: roadmaps.id })
    .from(enrollments)
    .innerJoin(roadmaps, eq(roadmaps.id, enrollments.roadmapId))
    .where(and(eq(enrollments.userId, userId), isNull(roadmaps.archivedAt)))
    .orderBy(asc(roadmaps.position));
  return rows.map((r) => r.id);
}

export async function enroll(db: Db, userId: string, roadmapId: string, now = new Date()) {
  const [roadmap] = await db
    .select({ id: roadmaps.id })
    .from(roadmaps)
    .where(and(eq(roadmaps.id, roadmapId), isNull(roadmaps.archivedAt)));
  if (!roadmap) throw new AppError("NOT_FOUND", "Roadmap not found");
  await checkWriteLimit(db, userId, now);
  await db.insert(enrollments).values({ userId, roadmapId, enrolledAt: now }).onConflictDoNothing();
  return listEnrollments(db, userId);
}

/**
 * Leaves a roadmap. With deleteProgress, the user's ticks and notes in it are removed too;
 * first completions stay, so streaks never lose credit.
 */
export async function unenroll(
  db: Db,
  userId: string,
  roadmapId: string,
  deleteProgress: boolean,
  now = new Date(),
) {
  await checkWriteLimit(db, userId, now);
  await db.transaction(async (tx) => {
    await tx
      .delete(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.roadmapId, roadmapId)));
    if (deleteProgress) {
      const inRoadmap = tx
        .select({ id: items.id })
        .from(items)
        .where(eq(items.roadmapId, roadmapId));
      await tx
        .delete(userItemProgress)
        .where(
          and(eq(userItemProgress.userId, userId), inArray(userItemProgress.itemId, inRoadmap)),
        );
      await tx.delete(notes).where(and(eq(notes.userId, userId), inArray(notes.itemId, inRoadmap)));
    }
  });
  return listEnrollments(db, userId);
}
