import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { StudyHeatmap } from "@/components/heatmap";
import { EnrollControl } from "@/components/enroll";
import { Card, PageHeader, PageMain } from "@/components/page-header";
import { ProgressBar } from "@/components/progress-bar";
import { listRoadmaps } from "@/server/content";
import { getDashboard } from "@/server/progress";

export const dynamic = "force-dynamic";

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <Card className="!p-4">
      <p className="text-[0.8125rem] font-semibold text-ink-2">{label}</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <b className="text-[2.125rem] font-bold leading-none tracking-tight">{value}</b>
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
  action,
}: {
  id: string;
  title: string;
  summary: string | null;
  footer: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <li className="relative flex flex-col rounded-[14px] border border-border bg-surface p-5 transition-shadow hover:border-accent hover:shadow-card">
      <span className="font-mono text-[0.6875rem] text-accent">ROADMAP</span>
      {/* The link covers the card; the action sits above it. */}
      <Link
        href={`/${id}`}
        className="mt-1 text-base font-semibold text-heading after:absolute after:inset-0 after:rounded-[14px]"
      >
        {title}
      </Link>
      {summary && <p className="mt-1 line-clamp-2 flex-1 text-ink-2">{summary}</p>}
      <div className="mt-4">{footer}</div>
      {action && <div className="relative z-10 mt-3">{action}</div>}
    </li>
  );
}

function RoadmapTabs({ tab, mine, available }: { tab: Tab; mine: number; available: number }) {
  const heading = "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]";
  if (mine === 0) return <h2 className={`${heading} mb-3 text-ink-3`}>Available roadmaps</h2>;
  return (
    <nav aria-label="Roadmap lists" className="mb-4 flex gap-5 border-b border-border">
      {(
        [
          ["mine", "My roadmaps", mine],
          ["available", "Available roadmaps", available],
        ] as const
      ).map(([key, label, n]) => (
        <Link
          key={key}
          href={key === "mine" ? "/" : "/?tab=available"}
          aria-current={tab === key ? "page" : undefined}
          scroll={false}
          className={`${heading} -mb-px border-b-2 pb-2.5 ${
            tab === key
              ? "border-accent text-accent"
              : "border-transparent text-ink-3 hover:text-ink-2"
          }`}
        >
          {label} <span className="font-mono font-medium">{n}</span>
        </Link>
      ))}
    </nav>
  );
}

type Tab = "mine" | "available";
type Props = { searchParams: Promise<{ tab?: string }> };

export default async function Home({ searchParams }: Props) {
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
          <h1 className="relative mb-3 mt-2 max-w-[640px] text-[1.75rem] font-bold leading-tight tracking-tight md:text-[2.125rem]">
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
        <RoadmapTabs tab="available" mine={0} available={roadmaps.length} />
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {roadmaps.map((r) => (
            <RoadmapCard
              key={r.id}
              {...r}
              footer={
                <span className="font-mono text-[0.6875rem] text-ink-3">
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
  const content = new Map(roadmaps.map((r) => [r.id, r]));
  const mine = dash.roadmaps.filter((r) => r.enrolled);
  const tab: Tab =
    mine.length > 0 && (await searchParams).tab !== "available" ? "mine" : "available";
  const shown = tab === "mine" ? mine : dash.roadmaps;
  const firstName = session.user.name?.split(" ")[0];
  return (
    <PageMain>
      <PageHeader crumbs={[{ label: "Dashboard" }]} />
      <h1 className="mb-5 mt-5 text-[1.625rem] font-bold tracking-tight md:text-[1.875rem]">
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
            <p className="text-[0.8125rem] font-semibold text-ink-2">Continue where you left off</p>
            <p className="mt-1.5 line-clamp-1 font-semibold text-heading">
              {dash.lastActivity.trackTitle}
            </p>
            <p className="line-clamp-1 text-ink-2">{dash.lastActivity.itemTitle}</p>
          </Link>
        ) : (
          <Card className="!p-4">
            <p className="text-[0.8125rem] font-semibold text-ink-2">Continue where you left off</p>
            <p className="mt-1.5 text-ink-2">Enroll in a roadmap below to start.</p>
          </Card>
        )}
      </section>

      <Card className="mb-7">
        <h2 className="mb-3 text-[0.9375rem] font-semibold">Activity</h2>
        <StudyHeatmap heatmap={dash.heatmap} />
      </Card>

      <RoadmapTabs tab={tab} mine={mine.length} available={dash.roadmaps.length} />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((r) => {
          const c = content.get(r.id);
          return (
            <RoadmapCard
              key={r.id}
              id={r.id}
              title={r.title}
              summary={c?.summary ?? null}
              footer={
                r.enrolled || r.done > 0 ? (
                  <ProgressBar
                    done={r.done}
                    total={r.total}
                    label={`${r.title} progress`}
                    gradient
                  />
                ) : (
                  <span className="font-mono text-[0.6875rem] text-ink-3">
                    {c?.trackCount} tracks · {c?.itemCount} topics
                  </span>
                )
              }
              action={<EnrollControl roadmapId={r.id} title={r.title} />}
            />
          );
        })}
      </ul>
    </PageMain>
  );
}
