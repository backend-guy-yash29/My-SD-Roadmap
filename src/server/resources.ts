import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { activityEvents, resources } from "@/db/schema";

/** Returns the resource URL, logging the open for signed-in users. Null if the resource doesn't exist. */
export async function openResource(db: Db, resourceId: number, userId: string | null) {
  const [resource] = await db
    .select({ id: resources.id, itemId: resources.itemId, url: resources.url })
    .from(resources)
    .where(eq(resources.id, resourceId));
  if (!resource) return null;
  if (userId) {
    await db.insert(activityEvents).values({
      userId,
      type: "resource_opened",
      itemId: resource.itemId,
      resourceId: resource.id,
    });
  }
  return resource.url;
}
