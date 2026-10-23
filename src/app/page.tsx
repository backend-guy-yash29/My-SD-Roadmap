import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { StudyHeatmap } from "@/components/heatmap";
import { Card, PageHeader, PageMain } from "@/components/page-header";
import { ProgressBar } from "@/components/progress-bar";
import { listRoadmaps } from "@/server/content";
import { getDashboard } from "@/server/progress";

export const dynamic = "force-dynamic";

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <Card className="!p-4">
      <p className="text-[13px] font-semibold text-ink-2">{label}</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <b className="text-[34px] font-bold leading-none tracking-tight">{value}</b>
        <span className="text-ink-2">{unit}</span>
      </p>
    </Card>
  );
}

function RoadmapCard({
  id,
  title,
  summary,
  footer,
}: {
  id: string;
  title: string;
  summary: string | null;
  footer: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={`/${id}`}
        className="flex h-full flex-col rounded-[14px] border border-border bg-surface p-5 transition-shadow hover:border-accent hover:shadow-card"
      >
        <span className="font-mono text-[11px] text-accent">ROADMAP</span>
        <span className="mt-1 text-base font-semibold">{title}</span>
        {summary && <span className="mt-1 line-clamp-2 flex-1 text-ink-2">{summary}</span>}
        <div className="mt-4">{footer}</div>
      </Link>
    </li>
  );
}

export default async function Home() {
  const session = await auth();
  const roadmaps = await listRoadmaps(db);

  if (!session?.user?.id) {
    return (
      <PageMain>
        <PageHeader crumbs={[{ label: "Dashboard" }]} />
        <section className="hero-glow mb-7 mt-5 rounded-2xl border border-border bg-surface px-6 py-8 shadow-card md:px-8">
          <p className="relative font-mono text-xs tracking-[0.04em] text-accent">
            STRUCTURED STUDY ROADMAPS
          </p>
          <h1 className="relative mb-3 mt-2 max-w-[640px] text-[28px] font-bold leading-tight tracking-tight md:text-[34px]">
            System design, ML and AI, one topic at a time.
          </h1>
          <p className="relative max-w-[600px] text-ink-2">
            Five roadmaps broken into tracks you can tick off, with links to the exact lesson or
            video for every topic, notes, and a daily streak.
          </p>
          <Link
            href="/sign-in"
            className="relative mt-5 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-accent-ink"
          >
            Sign in to track progress
          </Link>
        </section>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {roadmaps.map((r) => (
            <RoadmapCard
              key={r.id}
              {...r}
              footer={
                <span className="font-mono text-[11px] text-ink-3">
                  {r.trackCount} tracks · {r.itemCount} topics
                </span>
              }
            />
          ))}
        </ul>
      </PageMain>
    );
  }

  const dash = await getDashboard(db, session.user.id);
  const summaries = new Map(roadmaps.map((r) => [r.id, r.summary]));
  const firstName = session.user.name?.split(" ")[0];
  return (
    <PageMain>
      <PageHeader crumbs={[{ label: "Dashboard" }]} />
      <h1 className="mb-5 mt-5 text-[26px] font-bold tracking-tight md:text-[30px]">
        Welcome back{firstName ? `, ${firstName}` : ""}
      </h1>

      <section className="mb-4 grid gap-4 md:grid-cols-3">
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
            className="rounded-[14px] border border-border bg-surface p-4 hover:border-accent"
          >
            <p className="text-[13px] font-semibold text-ink-2">Continue where you left off</p>
            <p className="mt-1.5 line-clamp-1 font-semibold">{dash.lastActivity.trackTitle}</p>
            <p className="line-clamp-1 text-ink-2">{dash.lastActivity.itemTitle}</p>
          </Link>
        ) : (
          <Card className="!p-4">
            <p className="text-[13px] font-semibold text-ink-2">Continue where you left off</p>
            <p className="mt-1.5 text-ink-2">Pick a roadmap below to start.</p>
          </Card>
        )}
      </section>

      <Card className="mb-7">
        <h2 className="mb-3 text-[15px] font-semibold">Activity</h2>
        <StudyHeatmap heatmap={dash.heatmap} />
      </Card>

      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
        Your roadmaps
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dash.roadmaps.map((r) => (
          <RoadmapCard
            key={r.id}
            id={r.id}
            title={r.title}
            summary={summaries.get(r.id) ?? null}
            footer={
              <ProgressBar done={r.done} total={r.total} label={`${r.title} progress`} gradient />
            }
          />
        ))}
      </ul>
    </PageMain>
  );
}
