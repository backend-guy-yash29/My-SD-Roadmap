"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUserId } from "@/auth";
import { db } from "@/db";
import { getAppearance as readAppearance, updateAppearance as writeAppearance } from "./appearance";
import { AppError, toResult } from "./errors";
import { enroll as writeEnroll, listEnrollments, unenroll as writeUnenroll } from "./enrollments";
import { getNote as readNote, saveNote as writeNote } from "./notes";
import { addDays } from "./dates";
import {
  getRoadmapProgress as readProgress,
  getStudyStats,
  setItemDone as writeDone,
  setNeedsRevision as writeRevision,
} from "./progress";
import { setDailyGoal as writeDailyGoal } from "./home";
import { updateProfile as writeProfile } from "./profile";

async function requireUser() {
  const userId = await currentUserId();
  if (!userId) throw new AppError("UNAUTHENTICATED", "Sign in to track progress");
  return userId;
}

function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const res = schema.safeParse(value);
  if (!res.success)
    throw new AppError("VALIDATION", res.error.issues.map((i) => i.message).join("; "));
  return res.data;
}

const itemId = z.string().min(1).max(300);
const roadmapId = z.string().min(1).max(100);

export async function setItemDone(id: string, done: boolean) {
  return toResult(async () =>
    writeDone(db, await requireUser(), parse(itemId, id), parse(z.boolean(), done)),
  );
}

export async function setNeedsRevision(id: string, flag: boolean) {
  return toResult(async () =>
    writeRevision(db, await requireUser(), parse(itemId, id), parse(z.boolean(), flag)),
  );
}

export async function getRoadmapProgress(id: string) {
  return toResult(async () => readProgress(db, await requireUser(), parse(roadmapId, id)));
}

export async function getNote(id: string) {
  return toResult(async () => readNote(db, await requireUser(), parse(itemId, id)));
}

export async function saveNote(id: string, body: string) {
  return toResult(async () =>
    writeNote(db, await requireUser(), parse(itemId, id), parse(z.string(), body)),
  );
}

export async function updateProfile(patch: unknown) {
  return toResult(async () => {
    const profile = await writeProfile(db, await requireUser(), patch);
    revalidatePath("/", "layout");
    return profile;
  });
}

/** Streaks plus first completions for each of the last 7 days (oldest first), for the right rail. */
export async function getStudySummary() {
  return toResult(async () => {
    const stats = await getStudyStats(db, await requireUser());
    const counts = new Map(stats.heatmap.days.map((d) => [d.date, d.count]));
    const week = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(stats.heatmap.to, i - 6);
      return { date, count: counts.get(date) ?? 0 };
    });
    return { currentStreak: stats.currentStreak, longestStreak: stats.longestStreak, week };
  });
}

/** Roadmap ids the signed-in user is enrolled in. */
export async function getEnrollments() {
  return toResult(async () => listEnrollments(db, await requireUser()));
}

export async function enroll(id: string) {
  return toResult(async () => writeEnroll(db, await requireUser(), parse(roadmapId, id)));
}

/** Leaves a roadmap, optionally deleting the user's ticks and notes in it. */
export async function unenroll(id: string, deleteProgress: boolean) {
  return toResult(async () =>
    writeUnenroll(
      db,
      await requireUser(),
      parse(roadmapId, id),
      parse(z.boolean(), deleteProgress),
    ),
  );
}

export async function getAppearance() {
  return toResult(async () => readAppearance(db, await requireUser()));
}

export async function updateAppearance(value: unknown) {
  return toResult(async () => writeAppearance(db, await requireUser(), value));
}

export async function setDailyGoal(goal: number) {
  return toResult(async () => {
    const saved = await writeDailyGoal(db, await requireUser(), parse(z.number(), goal));
    revalidatePath("/");
    return saved;
  });
}
