import { sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

const tz = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

// Content: written only by the content sync.

export const itemType = pgEnum("item_type", [
  "topic",
  "case-study",
  "exercise",
  "practice",
  "reading",
]);

export const roadmaps = pgTable("roadmaps", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  position: integer("position").notNull(),
  updatedAt: tz("updated_at").notNull().defaultNow(),
  archivedAt: tz("archived_at"),
});

export const parts = pgTable("parts", {
  id: text("id").primaryKey(),
  roadmapId: text("roadmap_id")
    .notNull()
    .references(() => roadmaps.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  position: integer("position").notNull(),
  archivedAt: tz("archived_at"),
});

export const tracks = pgTable("tracks", {
  id: text("id").primaryKey(),
  roadmapId: text("roadmap_id")
    .notNull()
    .references(() => roadmaps.id, { onDelete: "cascade" }),
  partId: text("part_id")
    .notNull()
    .references(() => parts.id),
  title: text("title").notNull(),
  summary: text("summary"),
  position: integer("position").notNull(),
  archivedAt: tz("archived_at"),
});

export const groups = pgTable("groups", {
  id: text("id").primaryKey(),
  trackId: text("track_id")
    .notNull()
    .references(() => tracks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  note: text("note"),
  position: integer("position").notNull(),
  archivedAt: tz("archived_at"),
});

export const items = pgTable(
  "items",
  {
    id: text("id").primaryKey(),
    roadmapId: text("roadmap_id")
      .notNull()
      .references(() => roadmaps.id),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id),
    title: text("title").notNull(),
    type: itemType("type").notNull().default("topic"),
    position: integer("position").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    archivedAt: tz("archived_at"),
  },
  (t) => [
    index("items_track_position")
      .on(t.trackId, t.position)
      .where(sql`${t.archivedAt} IS NULL`),
    index("items_roadmap")
      .on(t.roadmapId)
      .where(sql`${t.archivedAt} IS NULL`),
  ],
);

export const resources = pgTable(
  "resources",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade", onUpdate: "cascade" }),
    source: text("source").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    position: integer("position").notNull(),
  },
  (t) => [
    unique("resources_item_url").on(t.itemId, t.url),
    check("resources_https", sql`${t.url} LIKE 'https://%'`),
  ],
);

// Users and auth (Auth.js Drizzle adapter tables, with profile columns on users).

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: tz("email_verified"),
    image: text("image"),
    username: text("username").unique(),
    timezone: text("timezone").notNull().default("UTC"),
    profilePublic: boolean("profile_public").notNull().default(false),
    createdAt: tz("created_at").notNull().defaultNow(),
  },
  (t) => [check("users_username_format", sql`${t.username} ~ '^[a-z0-9_-]{3,30}$'`)],
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: tz("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: tz("expires").notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Progress, completions, notes and activity: written only by the API.

export const userItemProgress = pgTable(
  "user_item_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onUpdate: "cascade" }),
    isDone: boolean("is_done").notNull().default(false),
    needsRevision: boolean("needs_revision").notNull().default(false),
    doneAt: tz("done_at"),
    updatedAt: tz("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.itemId] }),
    index("progress_user_done")
      .on(t.userId)
      .where(sql`${t.isDone}`),
  ],
);

/** First completion per user and item. Never updated or deleted by the app. */
export const itemCompletions = pgTable(
  "item_completions",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onUpdate: "cascade" }),
    completedAt: tz("completed_at").notNull().defaultNow(),
    localDate: date("local_date", { mode: "string" }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.itemId] }),
    index("completions_user_date").on(t.userId, t.localDate),
  ],
);

export const notes = pgTable(
  "notes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onUpdate: "cascade" }),
    body: text("body").notNull(),
    updatedAt: tz("updated_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.itemId] }),
    check("notes_body_length", sql`char_length(${t.body}) BETWEEN 1 AND 10000`),
  ],
);

export const activityType = pgEnum("activity_type", [
  "item_done",
  "item_undone",
  "revision_flagged",
  "revision_cleared",
  "note_saved",
  "note_deleted",
  "resource_opened",
]);

export const activityEvents = pgTable(
  "activity_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: activityType("type").notNull(),
    itemId: text("item_id").references(() => items.id, { onUpdate: "cascade" }),
    resourceId: bigint("resource_id", { mode: "number" }).references(() => resources.id, {
      onDelete: "set null",
    }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: tz("created_at").notNull().defaultNow(),
  },
  (t) => [index("activity_user_time").on(t.userId, t.createdAt.desc())],
);
