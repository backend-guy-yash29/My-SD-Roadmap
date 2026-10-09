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
- **Renaming an item changes its ID.** To keep progress, add a line `old-id -> new-id` to `content/renames.txt`. The sync moves progress, notes and activity to the new ID.

### Types and resources

- An item's type comes from its tag: no tag is `topic`; otherwise `case-study`, `exercise`, `practice` or `reading`.
- An item can have any number of resources, kept in file order. Each has a source label (the text before the first `:`), a title and an exact URL. YouTube links to a chapter carry a `&t=` timestamp.

### Sync

`npm run content:sync` parses `content/`, validates it with Zod and upserts it into Postgres. It is idempotent and runs on every deploy.

1. Parse every roadmap folder and `roadmap.md` into the hierarchy above.
2. Validate: layout rules, unique slugs, known tags, well-formed `https://` URLs, and every file listed in `roadmap.md` exists.
3. Apply `renames.txt`.
4. Upsert roadmaps, parts, tracks, groups, items and resources by ID, with their positions.
5. Mark items no longer in the files as `archived_at = now()`. Archived items are hidden but keep their progress and notes; reappearing items are un-archived.

CI runs steps 1–2 on every pull request, so a malformed content change fails before it reaches production.

## Data model

| Table | Key columns |
|---|---|
| `roadmaps` | `id` (slug), `title`, `summary`, `position` |
| `parts` | `id`, `roadmap_id`, `title`, `position` |
| `tracks` | `id` (`roadmap/track-slug`), `part_id`, `title`, `summary`, `position` |
| `groups` | `id`, `track_id`, `title`, `note`, `position` |
| `items` | `id`, `track_id`, `group_id`, `title`, `type`, `position`, `metadata` (JSONB), `archived_at` |
| `resources` | `id`, `item_id`, `source`, `title`, `url`, `position` |
| `users`, `accounts`, `sessions`, `verification_tokens` | Auth.js schema |
| `user_item_progress` | `user_id`, `item_id`, `status` (`todo` / `in_progress` / `done` / `revise`), `updated_at`; unique on `(user_id, item_id)` |
| `notes` | `user_id`, `item_id`, `body` (markdown, capped at 50 KB), `created_at`, `updated_at`; unique on `(user_id, item_id)` |
| `activity_events` | `id`, `user_id`, `item_id`, `type` (e.g. `status_changed`, `note_saved`, `resource_opened`), `payload` (JSONB), `created_at` |

- `user_item_progress` answers "what is my status?" quickly; `activity_events` is an append-only history for streaks, heatmaps and "continue where you left off".
- Changing a status is one transaction: an upsert into `user_item_progress` (`ON CONFLICT DO UPDATE`) plus an insert into `activity_events`.
- Foreign keys from progress, notes and activity to `items` and `users` keep the data consistent; deleting a user cascades.

## Reads and caching

- **Content pages are static.** Roadmap and track pages render at build or sync time and are served from the CDN; they change only when content syncs.
- **Progress is one small query per page:** the signed-in user's statuses for one roadmap (`WHERE user_id = ? AND item_id LIKE 'roadmap/%'`, or a join on `tracks`). The client merges it into the static content tree.
- Ticking an item updates the UI immediately (optimistic update), then saves through a server action.
- Progress percentages per track and roadmap are computed from that query. Precomputed counters can be added if it ever gets slow.

## Pages

| Route | Contents |
|---|---|
| `/` | Dashboard: every roadmap with a progress bar, current streak, "continue where you left off" |
| `/[roadmap]` | Parts as section headers, tracks as cards with progress bars |
| `/[roadmap]/[track]` | Groups as collapsible blocks; items as rows with a status control, type badge, note button and resources |
| `/sign-in` | Google and GitHub sign-in |

Content pages are public; signing in unlocks tracking and notes.

### Resources on an item

- An item with resources shows a resource indicator with a count.
- **Hovering** (or tapping on touch screens) opens a popover listing every resource: source label, title, and timestamp if any. Each opens the exact URL in a new tab.
- An item with a single resource can also link directly from its title.
- Opening a resource logs a `resource_opened` activity event.

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

1. This document.
2. Scaffold: Next.js, Tailwind, shadcn/ui, Drizzle, lint and format, CI.
3. Schema and first migration.
4. Content parser, validation and sync script, with tests against `content/`.
5. Auth.
6. Pages: dashboard, roadmap, track, with the resource popover.
7. Progress tracking and activity logging.
8. Notes.
