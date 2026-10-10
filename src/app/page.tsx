import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { ProgressBar } from "@/components/progress-bar";
import { StudyHeatmap } from "@/components/heatmap";
import { listRoadmaps } from "@/server/content";
import { getDashboard } from "@/server/progress";

export const dynamic = "force-dynamic";

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs text-ink-3">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">
        {value}
        <span className="ml-1 text-sm font-normal text-ink-2">{unit}</span>
      </p>
    </div>
  );
}

export default async function Home() {
  const session = await auth();
  const roadmaps = await listRoadmaps(db);

  if (!session?.user?.id) {
    return (
      <div className="space-y-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Structured study roadmaps</h1>
          <p className="max-w-2xl text-ink-2">
            System design, ML foundations, deep learning, RAG and AI system design, broken into
            tracks you can tick off, with links to the exact lesson or video for every topic.
          </p>
          <Link
            href="/sign-in"
            className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
          >
            Sign in to track progress
          </Link>
        </section>
        <ul className="grid gap-4 sm:grid-cols-2">
          {roadmaps.map((r) => (
            <li key={r.id}>
              <Link
                href={`/${r.id}`}
                className="block h-full rounded-lg border border-border bg-surface p-4 hover:border-accent"
              >
                <h2 className="font-semibold">{r.title}</h2>
                {r.summary && <p className="mt-1 line-clamp-2 text-sm text-ink-2">{r.summary}</p>}
                <p className="mt-3 text-xs text-ink-3">
                  {r.trackCount} tracks · {r.itemCount} items
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const dash = await getDashboard(db, session.user.id);
  const summaries = new Map(roadmaps.map((r) => [r.id, r]));
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
      </h1>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Current streak"
          value={dash.currentStreak}
          unit={dash.currentStreak === 1 ? "day" : "days"}
        />
        <Stat
          label="Longest streak"
          value={dash.longestStreak}
          unit={dash.longestStreak === 1 ? "day" : "days"}
        />
        {dash.lastActivity ? (
          <Link
            href={`/${dash.lastActivity.trackId}`}
            className="rounded-lg border border-border bg-surface p-4 hover:border-accent"
          >
            <p className="text-xs text-ink-3">Continue where you left off</p>
            <p className="mt-1 line-clamp-1 font-medium">{dash.lastActivity.trackTitle}</p>
            <p className="line-clamp-1 text-sm text-ink-2">{dash.lastActivity.itemTitle}</p>
          </Link>
        ) : (
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-ink-3">Continue where you left off</p>
            <p className="mt-1 text-sm text-ink-2">Pick a roadmap below to start.</p>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 font-semibold">Activity</h2>
        <StudyHeatmap heatmap={dash.heatmap} />
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Your roadmaps</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {dash.roadmaps.map((r) => (
            <li key={r.id}>
              <Link
                href={`/${r.id}`}
                className="block h-full rounded-lg border border-border bg-surface p-4 hover:border-accent"
              >
                <h3 className="font-semibold">{r.title}</h3>
                {summaries.get(r.id)?.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink-2">
                    {summaries.get(r.id)!.summary}
                  </p>
                )}
                <div className="mt-3">
                  <ProgressBar done={r.done} total={r.total} label={`${r.title} progress`} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
