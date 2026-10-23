"use client";

import Link from "next/link";
import type { RoadmapView } from "@/server/content";
import { ProgressBar } from "./progress-bar";
import { useRoadmapProgress } from "./roadmap-progress";
import { RoadmapProgressCard, StreakCard, UpNextCard } from "./study-rail";

const pad = (n: number) => String(n).padStart(2, "0");

export function RoadmapMain({ roadmap }: { roadmap: RoadmapView }) {
  const { trackDone, state } = useRoadmapProgress();
  const tracks = roadmap.parts.flatMap((p) => p.tracks);
  const items = tracks.reduce((n, t) => n + t.itemCount, 0);
  let number = 0;

  return (
    <>
      <section className="hero-glow mb-7 mt-5 rounded-2xl border border-border bg-surface px-6 py-6 shadow-card md:px-7">
        <p className="relative font-mono text-xs tracking-[0.04em] text-accent">ROADMAP</p>
        <h1 className="relative mb-2 mt-1.5 text-[26px] font-bold leading-tight tracking-tight md:text-[30px]">
          {roadmap.title}
        </h1>
        {roadmap.summary && <p className="relative max-w-[640px] text-ink-2">{roadmap.summary}</p>}
        <div className="relative mt-5 flex flex-wrap gap-7">
          {[
            [
              state.status === "ready" ? `${state.progress.done}/${items}` : items,
              state.status === "ready" ? "Completed" : "Topics",
            ],
            [tracks.length, "Tracks"],
            [roadmap.parts.length, "Parts"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-[22px] font-bold tracking-tight">{v}</div>
              <div className="text-xs text-ink-3">{l}</div>
            </div>
          ))}
        </div>
        {state.status === "ready" && (
          <div className="relative mt-[18px] h-2 overflow-hidden rounded-full bg-surface-2">
            <i
              className="bar-gradient block h-full rounded-full"
              style={{ width: `${items ? (state.progress.done / items) * 100 : 0}%` }}
            />
          </div>
        )}
      </section>

      {roadmap.parts.map((part) => (
        <section key={part.id} className="mb-7">
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            {part.title}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {part.tracks.map((t) => {
              number++;
              const done = trackDone(t.id);
              return (
                <li key={t.id}>
                  <Link
                    href={`/${t.id}`}
                    className="flex h-full flex-col rounded-[14px] border border-border bg-surface p-4 transition-shadow hover:border-accent hover:shadow-card"
                  >
                    <span className="font-mono text-[11px] text-accent">TRACK {pad(number)}</span>
                    <span className="mt-1 font-semibold">{t.title}</span>
                    {t.summary && (
                      <span className="mt-1 line-clamp-2 flex-1 text-ink-2">{t.summary}</span>
                    )}
                    <div className="mt-3">
                      {done === null ? (
                        <span className="font-mono text-[11px] text-ink-3">
                          {t.itemCount} topics
                        </span>
                      ) : (
                        <ProgressBar
                          done={done}
                          total={t.itemCount}
                          label={`${t.title} progress`}
                        />
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

/** Right rail for a roadmap: streak, the next unfinished tracks, overall progress. */
export function RoadmapRail({ roadmap }: { roadmap: RoadmapView }) {
  const { trackDone, state } = useRoadmapProgress();
  const next = roadmap.parts
    .flatMap((p) => p.tracks)
    .filter((t) => (trackDone(t.id) ?? 0) < t.itemCount)
    .slice(0, 4)
    .map((t) => ({ id: t.id, title: t.title, href: `/${t.id}` }));
  return (
    <>
      <StreakCard />
      {state.status === "ready" && (
        <UpNextCard title="Continue with" entries={next} empty="Every track is complete. 🎉" />
      )}
      <RoadmapProgressCard />
    </>
  );
}
