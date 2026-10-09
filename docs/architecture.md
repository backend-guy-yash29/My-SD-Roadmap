# Architecture

A multi-user study tracker in the style of Striver's A2Z sheet or AlgoMaster: signed-in users follow structured roadmaps, tick off items, open the linked study resources, and see their progress over time.

## Principles

- **Content and progress are separate.** Content is the same for everyone, read-heavy and rarely changes. Progress is per user, write-heavy and small. They are stored, cached and served differently.
- **Content is code.** Roadmaps live as markdown in `content/` and change through commits and pull requests. The database holds a synced copy, never the source of truth.
- **Adding a roadmap is new data, not new code.** A new folder under `content/` plus a sync run is all it takes.
- **Progress survives content edits.** Items have stable IDs, and removed items are archived rather than deleted.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript): pages, server components and API in one codebase |
| Database | PostgreSQL: Neon in production and previews, Docker locally |
| ORM and migrations | Drizzle |
| Auth | Auth.js with Google and GitHub OAuth, sessions stored in Postgres |
| UI | Tailwind CSS + shadcn/ui |
| Content validation | Zod, run by the sync script and in CI |
| Hosting | Vercel, with a preview deployment per pull request |
| CI | GitHub Actions: lint, typecheck, tests, content validation |

Business logic lives in plain modules under `src/server/`, separate from the UI, so it can move to a standalone API later without a rewrite.

## Content

### Hierarchy

```
Roadmap   content/<roadmap>/            e.g. system-design
 └─ Part     "## …" in roadmap.md        e.g. Core Foundations (a label only)
     └─ Track    one NN-slug.md file      e.g. 04-scaling-data.md
         └─ Group    "## …" in the track  e.g. Replication
             └─ Item     "- …" bullet     e.g. Leader-Follower Replication
                 └─ Resource  "  - [Source: Title](url)"
```

The file layout rules are in the [README](../README.md#content-layout).

### Item IDs

- An item's ID is `<roadmap>/<track-slug>/<item-slug>`, where `track-slug` is the file name without its `NN-` prefix and `item-slug` is the item title lower-cased with non-alphanumerics replaced by `-`. Example: `system-design/scaling-data/leader-follower-replication`.
- The group is not part of the ID, so items can move between groups without losing progress. Reordering tracks (changing `NN`) also keeps IDs.
- Item slugs must be unique within a track; the sync fails otherwise.
- **Renaming an item changes its ID.** To keep progress, add a line `old-id -> new-id` to `content/renames.txt`. The sync moves progress, completions, notes and activity to the new ID.
- **Roadmap order** on the dashboard comes from `content/roadmaps.md`, which lists the roadmap folders in order.

### Types and resources

- An item's type comes from its tag: no tag is `topic`; otherwise `case-study`, `exercise`, `practice` or `reading`.
- An item can have any number of resources, kept in file order. Each has a source label (the text before the first `:`), a title and an exact URL. YouTube links to a chapter carry a `&t=` timestamp.

### Sync

`npm run content:sync` parses `content/`, validates it with Zod and upserts it into Postgres. It is idempotent and runs on every deploy.

1. Parse every roadmap folder and `roadmap.md` into the hierarchy above.
2. Validate: layout rules, unique slugs, known tags, well-formed `https://` URLs, and every file listed in `roadmap.md` exists.
3. Apply `renames.txt`.
4. Upsert roadmaps, parts, tracks, groups, items and resources by ID, with their positions.
5. Mark roadmaps, parts, tracks, groups and items no longer in the files as `archived_at = now()`. Archived rows are hidden but stay in the database, so user data keeps its references; anything that reappears is un-archived.
6. Upsert resources by `(item_id, url)`, so resource IDs (and `/r/[id]` links) stay stable, and delete links no longer listed.

CI runs steps 1–2 on every pull request, so a malformed content change fails before it reaches production.

## Progress rules

- **An item is either done or not done.** Users mark and unmark items freely; there is no restriction on unmarking.
- **Revision flag.** Each item also has a `needs_revision` flag, independent of done. It is stored and exposed by the API but not shown in the UI yet.
- **Streak credit comes from first completions only.** The first time a user marks an item done, a completion is recorded with the date in the user's timezone. That record is permanent:
  - Unmarking the item does not remove it.
  - Marking the same item done again later does not add another one.
- **A study day** is a local date with at least one first completion.
- **Current streak:** the number of consecutive study days ending today. If today has no completion yet, it counts back from yesterday, so a streak stays alive until the user's day ends.
- **Longest streak:** the longest run of consecutive study days ever.
- **Timezone.** Each user has a timezone in their profile (defaults to the browser's timezone on first sign-in). A completion's local date is fixed when it is recorded, so changing timezone later does not rewrite history.
- **Archived items** (removed from content) keep their progress but are excluded from progress percentages. Their completions still count toward streaks.

## Data model

PostgreSQL. All timestamps are `timestamptz`. Content tables are written only by the sync; user tables only by the API.

### Content

```sql
CREATE TYPE item_type AS ENUM ('topic', 'case-study', 'exercise', 'practice', 'reading');

CREATE TABLE roadmaps (
  id          text PRIMARY KEY,                 -- 'system-design'
  title       text NOT NULL,
  summary     text,
  position    int  NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE TABLE parts (
  id          text PRIMARY KEY,                 -- 'system-design/core-foundations'
  roadmap_id  text NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  title       text NOT NULL,
  position    int  NOT NULL
);

CREATE TABLE tracks (
  id          text PRIMARY KEY,                 -- 'system-design/scaling-data'
  roadmap_id  text NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  part_id     text NOT NULL REFERENCES parts(id),
  title       text NOT NULL,
  summary     text,
  position    int  NOT NULL
);

CREATE TABLE groups (
  id          text PRIMARY KEY,                 -- 'system-design/scaling-data/replication'
  track_id    text NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  title       text NOT NULL,
  note        text,
  position    int  NOT NULL
);

CREATE TABLE items (
  id          text PRIMARY KEY,                 -- 'system-design/scaling-data/leader-follower-replication'
  roadmap_id  text NOT NULL REFERENCES roadmaps(id),
  track_id    text NOT NULL REFERENCES tracks(id),
  group_id    text NOT NULL REFERENCES groups(id),
  title       text NOT NULL,
  type        item_type NOT NULL DEFAULT 'topic',
  position    int  NOT NULL,
  metadata    jsonb NOT NULL DEFAULT '{}',
  archived_at timestamptz
);
CREATE INDEX items_track_position ON items (track_id, position) WHERE archived_at IS NULL;
CREATE INDEX items_roadmap ON items (roadmap_id) WHERE archived_at IS NULL;

CREATE TABLE resources (
  id          bigserial PRIMARY KEY,
  item_id     text NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  source      text NOT NULL,                    -- 'AlgoMaster', 'CampusX', ...
  title       text NOT NULL,
  url         text NOT NULL CHECK (url LIKE 'https://%'),
  position    int  NOT NULL,
  UNIQUE (item_id, url)
);
```

`roadmaps`, `parts`, `tracks` and `groups` also have an `archived_at` column; the sync never hard-deletes content rows. User tables reference `items(id)` with `ON UPDATE CASCADE`, which is how renames carry user data.

### Users and auth

The Auth.js Drizzle adapter tables (`users`, `accounts`, `sessions`, `verification_tokens`), with profile columns added to `users`:

```sql
CREATE TABLE users (
  id              text PRIMARY KEY,
  name            text,
  email           text UNIQUE,
  email_verified  timestamptz,
  image           text,
  -- profile
  username        text UNIQUE CHECK (username ~ '^[a-z0-9_-]{3,30}$'),
  timezone        text NOT NULL DEFAULT 'UTC',     -- IANA name, validated in the API
  profile_public  boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);
```

### Progress, completions, notes, activity

```sql
CREATE TABLE user_item_progress (
  user_id         text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id         text NOT NULL REFERENCES items(id),
  is_done         boolean NOT NULL DEFAULT false,
  needs_revision  boolean NOT NULL DEFAULT false,
  done_at         timestamptz,                      -- set when marked done, cleared when unmarked
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);
CREATE INDEX progress_user_done ON user_item_progress (user_id) WHERE is_done;

-- First completion per user and item. Never updated or deleted by the app.
CREATE TABLE item_completions (
  user_id       text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id       text NOT NULL REFERENCES items(id),
  completed_at  timestamptz NOT NULL DEFAULT now(),
  local_date    date NOT NULL,                      -- completed_at in the user's timezone at the time
  PRIMARY KEY (user_id, item_id)
);
CREATE INDEX completions_user_date ON item_completions (user_id, local_date);

CREATE TABLE notes (
  user_id     text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id     text NOT NULL REFERENCES items(id),
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

CREATE TYPE activity_type AS ENUM (
  'item_done', 'item_undone', 'revision_flagged', 'revision_cleared',
  'note_saved', 'note_deleted', 'resource_opened'
);

CREATE TABLE activity_events (
  id           bigserial PRIMARY KEY,
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         activity_type NOT NULL,
  item_id      text REFERENCES items(id),
  resource_id  bigint REFERENCES resources(id) ON DELETE SET NULL,
  metadata     jsonb NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX activity_user_time ON activity_events (user_id, created_at DESC);
```

- `item_completions` enforces "a first completion counts once" with its primary key: the insert uses `ON CONFLICT DO NOTHING`.
- `activity_events` is the full history, including unmarks and resource opens; `item_completions` is only for streaks and the heatmap.
- A rename changes `items.id`, and `ON UPDATE CASCADE` moves user rows with it. If the new ID already exists (content synced before the rename was recorded), the sync moves user rows across where they don't collide.

## API

Reads run in server components; writes are server actions. Inputs are validated with Zod. Every user-specific call requires a session unless marked public.

Errors are returned as `{ ok: false, error: { code, message } }`, with `code` one of:
- `UNAUTHENTICATED`
- `NOT_FOUND`: unknown or archived item, resource, roadmap, or a private profile
- `VALIDATION`
- `CONFLICT`: username taken
- `RATE_LIMITED`

### Content (public, cached)

| Function | Returns |
|---|---|
| `listRoadmaps()` | Roadmaps with part and track counts and total items |
| `getRoadmap(roadmapId)` | Parts → tracks, each with title, summary and item count |
| `getTrack(trackId)` | Track → groups → items (id, title, type) → resources (id, source, title, url) |

### Progress (signed in)

| Function | Input | Behaviour and result |
|---|---|---|
| `getRoadmapProgress(roadmapId)` | — | `{ doneItemIds, revisionItemIds, notedItemIds, tracks: { [trackId]: { done, total } }, done, total }` |
| `setItemDone(itemId, done)` | `done: boolean` | Upserts `is_done` and `done_at`. If `done` and the user has no completion for the item, inserts one with today's local date. Logs `item_done` or `item_undone`. Returns `{ isDone, firstCompletion, currentStreak }` |
| `setNeedsRevision(itemId, flag)` | `flag: boolean` | Upserts `needs_revision`, logs the event. Not used by the UI yet |
| `getDashboard()` | — | Per roadmap `{ done, total }`; `currentStreak`, `longestStreak`; `lastActivity` (item, track and time of the latest event) for "continue where you left off"; `heatmap`: completions per local date for the last 365 days |

### Notes (signed in)

| Function | Input | Behaviour |
|---|---|---|
| `getNote(itemId)` | — | `{ body, updatedAt }` or `null` |
| `saveNote(itemId, body)` | plain text, up to 10,000 characters | Empty or whitespace-only `body` deletes the note (`note_deleted`); otherwise upserts (`note_saved`) |

### Resource tracking

- Resource links in the UI point to `/r/[resourceId]`, a route handler. It looks up the resource, logs `resource_opened` with the item and resource if the user is signed in, and responds with a `302` redirect to the resource URL.
- Signed-out visitors are redirected without logging.
- Because the redirect is server-side, every open is tracked even when the link is opened in a new tab or with a middle click.

### Profile

| Function | Input | Behaviour |
|---|---|---|
| `getMyProfile()` | — | `{ username, name, image, timezone, profilePublic }` |
| `updateProfile(patch)` | any of `username`, `name`, `timezone` (IANA), `profilePublic` | Validates and saves. `CONFLICT` if the username is taken |
| `getPublicProfile(username)` | public | If `profile_public` (or the viewer is the owner): name, image, per-roadmap `{ done, total }`, streaks and heatmap. Otherwise `NOT_FOUND`, so private profiles are indistinguishable from missing ones. Never exposes notes, email or activity details |

### Rate limits

Writes are limited per user to 60 a minute (`RATE_LIMITED` beyond that), counted from the user's `activity_events` in the last 60 seconds, so no extra store is needed. Resource redirects are not limited.

## Reads and caching

- **Content pages are cached.** Roadmap and track pages render on first request and are served from the cache (revalidated every 5 minutes); they read no session, so every visitor gets the same page. The header loads the session on the client.
- **Progress is one small query per page:** `getRoadmapProgress` joins `user_item_progress` to `items` on `roadmap_id`, skipping archived items. The client merges the result into the static content tree.
- Ticking an item updates the UI immediately (optimistic update), then saves through `setItemDone`.
- Progress percentages per track and roadmap are computed from that query. Precomputed counters can be added if it ever gets slow.

## Pages

| Route | Contents |
|---|---|
| `/` | Dashboard: every roadmap with a progress bar, current streak, "continue where you left off" |
| `/[roadmap]` | Parts as section headers, tracks as cards with progress bars |
| `/[roadmap]/[track]` | Groups as collapsible blocks; items as rows with a done checkbox, type badge, note button and resources |
| `/sign-in` | Google and GitHub sign-in |
| `/u/[username]` | Public profile: progress per roadmap, streaks and heatmap (only if the owner made it public) |
| `/settings` | Username, name, timezone, profile visibility |

Content pages are public; signing in unlocks tracking and notes.

### Resources on an item

- An item with resources shows a resource indicator with a count.
- **Hovering** (or tapping on touch screens) opens a popover listing every resource: source label, title, and timestamp if any. Each opens the exact URL in a new tab.
- An item with a single resource can also link directly from its title.
- Each resource link goes through `/r/[resourceId]`, which logs the open and redirects (see Resource tracking).

## Auth

- Auth.js runs inside the app, with Google and GitHub providers. Google and GitHub verify the user; the app never stores passwords.
- Users, linked accounts and sessions live in the same Postgres, so progress joins directly to `users`.
- Server code reads the current user with `auth()`; writes reject requests without a session.

## Environments

| Environment | Database | Deploy |
|---|---|---|
| Local | Postgres in Docker (`docker compose up`) | `npm run dev` |
| Preview (per PR) | Neon branch of production | Vercel preview |
| Production | Neon | Vercel, on merge to `main` |

Secrets (`DATABASE_URL`, `AUTH_SECRET`, OAuth client IDs and secrets) live in `.env.local` locally and in Vercel environment settings; `.env*` files stay out of git.

## Repository layout

```
content/            curriculum markdown (source of truth)
docs/               architecture and decisions
src/
  app/              Next.js routes and pages
  components/       UI components
  server/           business logic: progress, notes, activity
  db/               Drizzle schema and migrations
  content/          markdown parser, Zod schema, sync script
```

## Build order

All steps below are implemented.

1. This document.
2. Scaffold: Next.js, Tailwind, shadcn/ui, Drizzle, lint and format, CI.
3. Schema and first migration.
4. Content parser, validation and sync script, with tests against `content/`.
5. Auth.
6. Pages: dashboard, roadmap, track, with the resource popover.
7. Progress tracking, streaks and activity logging.
8. Notes.
9. Profile settings and public profiles.
