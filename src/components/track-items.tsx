"use client";

import Link from "next/link";
import { useState } from "react";
import type { TrackView } from "@/server/content";
import { NoteEditor } from "./note-editor";
import { ProgressBar } from "./progress-bar";
import { ResourcePopover } from "./resource-popover";
import { useRoadmapProgress } from "./roadmap-progress";

const TYPE_LABEL: Record<string, string> = {
  "case-study": "Case study",
  exercise: "Exercise",
  practice: "Practice",
  reading: "Reading",
};

type Item = TrackView["groups"][number]["items"][number];

function ItemRow({ item, trackId, signedIn }: { item: Item; trackId: string; signedIn: boolean }) {
  const { isDone, hasNote, toggleDone, markNoted } = useRoadmapProgress();
  const [noteOpen, setNoteOpen] = useState(false);
  const done = isDone(item.id);
  const single = item.resources.length === 1 ? item.resources[0] : null;

  return (
    <li className="py-2">
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={`Mark "${item.title}" as ${done ? "not done" : "done"}`}
          disabled={!signedIn}
          onClick={() => toggleDone(item.id, trackId)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            done ? "border-done bg-done text-white" : "border-border hover:border-accent"
          }`}
        >
          {done && (
            <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3 fill-current">
              <path d="M6.2 11.6 2.6 8l1.1-1.1 2.5 2.5 6-6 1.1 1.1-7.1 7.1Z" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {single ? (
              <a
                href={`/r/${single.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm hover:text-accent hover:underline ${done ? "text-ink-3 line-through" : ""}`}
              >
                {item.title}
              </a>
            ) : (
              <span className={`text-sm ${done ? "text-ink-3 line-through" : ""}`}>
                {item.title}
              </span>
            )}
            {TYPE_LABEL[item.type] && (
              <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent">
                {TYPE_LABEL[item.type]}
              </span>
            )}
          </div>
          {noteOpen && (
            <NoteEditor
              itemId={item.id}
              itemTitle={item.title}
              onSaved={(has) => markNoted(item.id, has)}
            />
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {signedIn && (
            <button
              type="button"
              onClick={() => setNoteOpen((o) => !o)}
              aria-expanded={noteOpen}
              aria-label={`${hasNote(item.id) ? "Edit" : "Add"} note for ${item.title}`}
              className={`rounded-md border px-2 py-0.5 text-xs ${
                hasNote(item.id)
                  ? "border-accent text-accent"
                  : "border-border text-ink-2 hover:text-ink"
              }`}
            >
              {hasNote(item.id) ? "Note ✓" : "Note"}
            </button>
          )}
          {item.resources.length > 0 && (
            <ResourcePopover itemTitle={item.title} resources={item.resources} />
          )}
        </div>
      </div>
    </li>
  );
}

export function TrackItems({ track }: { track: TrackView }) {
  const { state, error, streak } = useRoadmapProgress();
  const signedIn = state.status === "ready";
  const stats = state.status === "ready" ? state.progress.tracks[track.id] : null;

  return (
    <div>
      <div className="mb-6 rounded-lg border border-border bg-surface p-4">
        {state.status === "ready" && stats ? (
          <>
            <ProgressBar done={stats.done} total={stats.total} label={`${track.title} progress`} />
            {streak !== null && (
              <p className="mt-2 text-xs text-ink-2">
                Current streak: <span className="font-semibold text-ink">{streak}</span> day
                {streak === 1 ? "" : "s"}
              </p>
            )}
          </>
        ) : state.status === "signed-out" ? (
          <p className="text-sm text-ink-2">
            <Link href="/sign-in" className="font-medium text-accent hover:underline">
              Sign in
            </Link>{" "}
            to track your progress and take notes.
          </p>
        ) : state.status === "error" ? (
          <p className="text-sm text-red-600">{state.message}</p>
        ) : (
          <div className="h-5 animate-pulse rounded bg-surface-2" />
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {track.groups.map((g) => (
          <section key={g.id} className="rounded-lg border border-border bg-surface">
            <details open>
              <summary className="cursor-pointer select-none px-4 py-3 font-medium">
                {g.title}
                <span className="ml-2 text-xs font-normal text-ink-3">{g.items.length}</span>
              </summary>
              <div className="border-t border-border px-4 pb-2">
                {g.note && (
                  <p className="whitespace-pre-line pt-3 font-mono text-xs text-ink-2">{g.note}</p>
                )}
                <ul className="divide-y divide-border">
                  {g.items.map((item) => (
                    <ItemRow key={item.id} item={item} trackId={track.id} signedIn={signedIn} />
                  ))}
                </ul>
              </div>
            </details>
          </section>
        ))}
      </div>
    </div>
  );
}
