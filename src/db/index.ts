import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

function createClient() {
  // postgres() connects lazily, so a missing URL only fails when a query runs (not at build time).
  return postgres(process.env.DATABASE_URL ?? "postgres://unset-database-url/none", {
    max: 10,
    // Neon's pooled endpoint runs PgBouncer in transaction mode, which can't keep named prepared statements.
    prepare: false,
  });
}

// Reuse one connection pool across hot reloads in development.
export const client = globalForDb.sql ?? createClient();
if (process.env.NODE_ENV !== "production") globalForDb.sql = client;

export const db = drizzle(client, { schema });
export type Db = typeof db;
export { schema };
