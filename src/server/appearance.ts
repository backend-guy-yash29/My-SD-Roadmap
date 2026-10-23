import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { users } from "@/db/schema";
import { appearanceSchema, readAppearance } from "@/lib/appearance";
import { AppError } from "./errors";

export async function getAppearance(db: Db, userId: string) {
  const [user] = await db
    .select({ appearance: users.appearance })
    .from(users)
    .where(eq(users.id, userId));
  if (!user) throw new AppError("UNAUTHENTICATED", "Unknown user");
  return readAppearance(user.appearance);
}

/** Replaces the user's appearance; defaults fill anything left out. */
export async function updateAppearance(db: Db, userId: string, value: unknown) {
  const res = appearanceSchema.safeParse(value);
  if (!res.success)
    throw new AppError("VALIDATION", res.error.issues.map((i) => i.message).join("; "));
  await db.update(users).set({ appearance: res.data }).where(eq(users.id, userId));
  return res.data;
}
