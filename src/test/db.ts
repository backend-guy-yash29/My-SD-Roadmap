import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "@/db/schema";

/** Connects to TEST_DATABASE_URL, applies migrations once, and returns a db plus a reset helper. */
export async function testDb() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is not set");
  const client = postgres(url, { max: 1, onnotice: () => {} });
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  return {
    db,
    client,
    async reset() {
      await db.execute(sql`TRUNCATE roadmaps, parts, tracks, groups, items, resources, users,
        accounts, sessions, verification_tokens, user_item_progress, item_completions, notes,
        activity_events RESTART IDENTITY CASCADE`);
    },
  };
}
