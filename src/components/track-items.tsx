"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TrackView as Track } from "@/server/content";
import { NoteEditor } from "./note-editor";
import { ResourcePopover } from "./resource-popover";
import { useRoadmapProgress } from "./roadmap-progress";
import { StreakCard, RoadmapProgressCard, UpNextCard } from "./study-rail";

const TYPE_LABEL: Record<string, string> = {
  "case-study": "Case study",
  exercise: "Exercise",
  practice: "Practice",
  reading: "Reading",
};

type Item = Track["groups"][number]["items"][number];
type Filter = "all" | "todo" | "done" | "revise" | "links";

const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ["todo", "To do"],
  ["done", "Done"],
  ["revise", "To revise"],
  ["links", "Has study links"],
];

function Checkbox({
  checked,
  disabled,
  label,
  onToggle,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-[1.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked
          ? "border-done bg-done text-white"
          : "border-border-2 bg-surface hover:border-accent"
      }`}
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className={`h-3 w-3 fill-current ${checked ? "" : "opacity-0"}`}
      >
        <path d="M6.2 11.6 2.6 8l1.1-1.1 2.5 2.5 6-6 1.1 1.1z" />
      </svg>
    </button>
  );
}

function ItemRow({ item, trackId, signedIn }: { item: Item; trackId: string; signedIn: boolean }) {
  const { isDone, hasNote, needsRevision, toggleDone, toggleRevision, markNoted } =
    useRoadmapProgress();
  const [noteOpen, setNoteOpen] = useState(false);
  const done = isDone(item.id);
  const noted = hasNote(item.id);
  const revise = needsRevision(item.id);
  return (
    <li className="border-b border-border px-[18px] py-[11px] last:border-0 hover:bg-surface-2">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={done}
          disabled={!signedIn}
          label={`Mark "${item.title}" as ${done ? "not done" : "done"}`}
          onToggle={() => toggleDone(item.id, trackId)}
        />
        <span
          className={`min-w-0 flex-1 ${done ? "text-ink-3 line-through decoration-border-2" : ""}`}
        >
          {item.title}
        </span>
        {TYPE_LABEL[item.type] && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-accent">
            {TYPE_LABEL[item.type]}
          </span>
        )}
        {signedIn && (
          <button
            type="button"
            onClick={() => toggleRevision(item.id)}
            aria-pressed={revise}
            aria-label={`${revise ? "Remove" : "Mark"} ${item.title} for revision`}
            title={revise ? "Marked for revision" : "Mark for revision"}
            className={`rounded-lg border px-2 py-0.5 text-xs font-medium ${
              revise
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-ink-2 hover:border-accent hover:text-accent"
            }`}
          >
            ↻{revise ? " Revise" : ""}
          </button>
        )}
        {signedIn && (
          <button
            type="button"
            onClick={() => setNoteOpen((o) => !o)}
            aria-expanded={noteOpen}
            aria-label={`${noted ? "Edit" : "Add"} note for ${item.title}`}
            className={`rounded-lg border px-2 py-0.5 text-xs font-medium ${
              noted
                ? "border-accent text-accent"
                : "border-border text-ink-2 hover:border-accent hover:text-accent"
            }`}
          >
            ✎{noted ? " Note" : ""}
          </button>
        )}
        {item.resources.length > 0 && (
          <ResourcePopover itemTitle={item.title} resources={item.resources} />
        )}
      </div>
      {noteOpen && (
        <div className="pl-8">
          <NoteEditor
            itemId={item.id}
            itemTitle={item.title}
            onSaved={(has) => markNoted(item.id, has)}
          />
        </div>
      )}
    </li>
  );
}

function Group({
  group,
  trackId,
  signedIn,
  filter,
}: {
  group: Track["groups"][number];
  trackId: string;
  signedIn: boolean;
  filter: Filter;
}) {
  const { isDone, needsRevision } = useRoadmapProgress();
  const [open, setOpen] = useState(true);
  const items = group.items.filter((i) =>
    filter === "all"
      ? true
      : filter === "links"
        ? i.resources.length > 0
        : filter === "revise"
          ? needsRevision(i.id)
          : (filter === "done") === isDone(i.id),
  );
  if (!items.length) return null;
  const done = group.items.filter((i) => isDone(i.id)).length;
  return (
    <section className="mb-3.5 overflow-hidden rounded-[14px] border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-[18px] py-3.5 text-left"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`h-3.5 w-3.5 fill-current text-ink-3 transition-transform ${open ? "" : "-rotate-90"}`}
        >
          <path d="M4 6l4 4 4-4z" />
        </svg>
        <h2 className="flex-1 text-[0.9375rem] font-semibold">{group.title}</h2>
        {signedIn && (
          <>
            <span className="font-mono text-xs text-ink-3">
              {done}/{group.items.length}
            </span>
            <span className="hidden h-[5px] w-20 overflow-hidden rounded-full bg-surface-2 sm:block">
              <i
                className="block h-full bg-done"
                style={{ width: `${(done / group.items.length) * 100}%` }}
              />
            </span>
          </>
        )}
      </button>
      {open && (
        <>
          {group.note && (
            <p className="mx-[18px] mb-2.5 whitespace-pre-line rounded-lg bg-surface-2 px-3 py-2.5 font-mono text-xs text-ink-2">
              {group.note}
            </p>
          )}
          <ul className="border-t border-border">
            {items.map((item) => (
              <ItemRow key={item.id} item={item} trackId={trackId} signedIn={signedIn} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function TrackMain({ track, eyebrow }: { track: Track; eyebrow: string }) {
  const { state, error } = useRoadmapProgress();
  const [filter, setFilter] = useState<Filter>("all");
  const signedIn = state.status === "ready";
  const stats = signedIn ? state.progress.tracks[track.id] : null;
  const all = useMemo(() => track.groups.flatMap((g) => g.items), [track]);
  const links = all.reduce((n, i) => n + i.resources.length, 0);
  const pct = stats && stats.total ? (stats.done / stats.total) * 100 : 0;

  return (
    <>
      <section className="hero-glow mb-6 mt-5 rounded-2xl border border-border bg-surface px-6 py-6 shadow-card md:px-7">
        <p className="relative font-mono text-xs tracking-[0.04em] text-accent">{eyebrow}</p>
        <h1 className="relative mb-2 mt-1.5 text-[1.625rem] font-bold leading-tight tracking-tight md:text-[1.875rem]">
          {track.title}
        </h1>
        {track.summary && <p className="relative max-w-[620px] text-ink-2">{track.summary}</p>}
        <div className="relative mt-5 flex flex-wrap gap-7">
          <div>
            <div className="text-[1.375rem] font-bold tracking-tight">
              {stats ? `${stats.done}/${stats.total}` : all.length}
            </div>
            <div className="text-xs text-ink-3">{stats ? "Completed" : "Topics"}</div>
          </div>
          <div>
            <div className="text-[1.375rem] font-bold tracking-tight">{track.groups.length}</div>
            <div className="text-xs text-ink-3">Subtopics</div>
          </div>
          <div>
            <div className="text-[1.375rem] font-bold tracking-tight">{links}</div>
            <div className="text-xs text-ink-3">Study links</div>
          </div>
        </div>
        {signedIn ? (
          <div className="relative mt-[18px] h-2 overflow-hidden rounded-full bg-surface-2">
            <i
              className="bar-gradient block h-full rounded-full transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        ) : state.status === "signed-out" ? (
          <p className="relative mt-4 text-ink-2">
            <Link href="/sign-in" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>{" "}
            to track your progress and take notes.
          </p>
        ) : state.status === "error" ? (
          <p className="relative mt-4 text-danger">{state.message}</p>
        ) : (
          <div className="relative mt-[18px] h-2 animate-pulse rounded-full bg-surface-2" />
        )}
        {error && (
          <p role="alert" className="relative mt-3 text-danger">
            {error}
          </p>
        )}
      </section>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter topics">
        {FILTERS.filter(([f]) => signedIn || f === "all" || f === "links").map(([f, label]) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-[0.78125rem] font-medium text-ink-2 aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent"
          >
            {label}
          </button>
        ))}
      </div>

      {track.groups.map((g) => (
        <Group key={g.id} group={g} trackId={track.id} signedIn={signedIn} filter={filter} />
      ))}
    </>
  );
}

/** Right rail for a track: streak, the next few undone topics, roadmap progress. */
export function TrackRail({ track }: { track: Track }) {
  const { isDone, state } = useRoadmapProgress();
  const next = track.groups
    .flatMap((g) => g.items)
    .filter((i) => !isDone(i.id))
    .slice(0, 4)
    .map((i) => ({ id: i.id, title: i.title }));
  return (
    <>
      <StreakCard />
      {state.status === "ready" && (
        <UpNextCard
          title="Up next in this track"
          entries={next}
          empty="Every topic in this track is done. 🎉"
        />
      )}
      <RoadmapProgressCard />
    </>
  );
}
