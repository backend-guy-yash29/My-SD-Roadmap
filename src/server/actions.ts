"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUserId } from "@/auth";
import { db } from "@/db";
import { AppError, toResult } from "./errors";
import { getNote as readNote, saveNote as writeNote } from "./notes";
import {
  getRoadmapProgress as readProgress,
  setItemDone as writeDone,
  setNeedsRevision as writeRevision,
} from "./progress";
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

export async function getRoadmapProgress(roadmapId: string) {
  return toResult(async () =>
    readProgress(db, await requireUser(), parse(z.string().min(1).max(100), roadmapId)),
  );
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
