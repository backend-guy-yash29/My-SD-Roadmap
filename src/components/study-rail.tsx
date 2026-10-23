"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStudySummary } from "@/server/actions";
import { useRoadmapProgress } from "./roadmap-progress";

type Summary = Extract<Awaited<ReturnType<typeof getStudySummary>>, { ok: true }>["data"];

export function RailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3.5 rounded-[14px] border border-border bg-surface p-4">
      <h3 className="mb-2.5 text-[0.8125rem] font-semibold text-ink-2">{title}</h3>
      {children}
    </section>
  );
}

const weekday = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en", { weekday: "narrow", timeZone: "UTC" });

/** Current streak plus the last seven days, refreshed after every tick. */
export function StreakCard() {
  const { version, state } = useRoadmapProgress();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    getStudySummary().then((res) => {
      if (res.ok) setSummary(res.data);
      else if (res.error.code === "UNAUTHENTICATED") setSignedOut(true);
    });
  }, [version]);

  if (signedOut || state.status === "signed-out") {
    return (
      <RailCard title="Track your progress">
        <p className="text-ink-2">
          Sign in to tick off topics, keep notes and build a daily streak.
        </p>
        <Link
          href="/sign-in"
          className="mt-3 inline-block rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink"
        >
          Sign in
        </Link>
      </RailCard>
    );
  }
  return (
    <RailCard title="Current streak">
      <div className="flex items-baseline gap-1.5">
        <b className="text-[2.125rem] font-bold leading-none tracking-tight">
          {summary?.currentStreak ?? "–"}
        </b>
        <span className="text-ink-2">{summary?.currentStreak === 1 ? "day" : "days"}</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {(
          summary?.week ?? Array.from({ length: 7 }, (_, i) => ({ date: String(i), count: 0 }))
        ).map((d) => (
          <span
            key={d.date}
            className="flex-1 text-center text-[0.6875rem] text-ink-3"
            title={summary ? `${d.date}: ${d.count} completed` : undefined}
          >
            <i className={`mb-1 block h-7 rounded-md ${d.count ? "bg-done" : "bg-surface-2"}`} />
            {summary ? weekday(d.date) : ""}
          </span>
        ))}
      </div>
      {summary && (
        <p className="mt-3 text-xs text-ink-3">
          Longest streak: {summary.longestStreak} {summary.longestStreak === 1 ? "day" : "days"}
        </p>
      )}
    </RailCard>
  );
}

/** Overall progress through the current roadmap. */
export function RoadmapProgressCard() {
  const { state } = useRoadmapProgress();
  if (state.status !== "ready") return null;
  const { done, total } = state.progress;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <RailCard title="Roadmap progress">
      <div className="text-[1.625rem] font-bold tracking-tight">{pct}%</div>
      <div className="mt-1 text-xs text-ink-3">
        {done} of {total} topics
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
        <i
          className="bar-gradient block h-full rounded-full transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </RailCard>
  );
}

export type UpNextEntry = { id: string; title: string; href?: string };

export function UpNextCard({
  title,
  entries,
  empty,
}: {
  title: string;
  entries: UpNextEntry[];
  empty: string;
}) {
  return (
    <RailCard title={title}>
      {entries.length === 0 ? (
        <p className="text-ink-3">{empty}</p>
      ) : (
        <ol>
          {entries.map((e, i) => {
            const inner = (
              <>
                <span className="font-semibold text-accent">{i + 1}</span>
                <span>{e.title}</span>
              </>
            );
            return (
              <li key={e.id} className="border-b border-dashed border-border last:border-0">
                {e.href ? (
                  <Link href={e.href} className="flex gap-2.5 py-2 text-ink-2 hover:text-ink">
                    {inner}
                  </Link>
                ) : (
                  <span className="flex gap-2.5 py-2 text-ink-2">{inner}</span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </RailCard>
  );
}

/** Main column plus a sticky right rail that appears on wide screens. */
export function WithRail({ children, rail }: { children: React.ReactNode; rail: React.ReactNode }) {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_300px]">
      <main className="min-w-0 px-4 pb-20 pt-6 md:px-10 md:pt-7">{children}</main>
      <aside className="hidden border-l border-border px-[22px] py-7 xl:sticky xl:top-0 xl:block xl:h-screen xl:overflow-y-auto">
        {rail}
      </aside>
    </div>
  );
}
