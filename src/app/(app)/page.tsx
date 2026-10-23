import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { ExploreRoadmaps } from "@/components/explore";
import { StudyHeatmap } from "@/components/heatmap";
import {
  ContinueCard,
  HomeCard,
  MilestonesCard,
  NotesCard,
  ResourcesCard,
  SuggestionCard,
  SummaryRow,
} from "@/components/home-cards";
import { PageHeader, PageMain } from "@/components/page-header";
import { listRoadmaps } from "@/server/content";
import { getHome } from "@/server/home";
import { getDashboard } from "@/server/progress";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function Home({ searchParams }: Props) {
  const [session, roadmaps, { tab }] = await Promise.all([auth(), listRoadmaps(db), searchParams]);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <PageMain>
        <PageHeader crumbs={[{ label: "Dashboard" }]} />
        <section className="hero-glow mb-2 mt-5 rounded-2xl border border-border bg-surface px-6 py-8 shadow-card md:px-8">
          <p className="relative font-mono text-xs tracking-[0.04em] text-accent">
            STRUCTURED STUDY ROADMAPS
          </p>
          <h1 className="relative mb-3 mt-2 max-w-[640px] text-[1.75rem] font-bold leading-tight tracking-tight md:text-[2.125rem]">
            Maths, programming, ML, AI engineering and system design, one topic at a time.
          </h1>
          <p className="relative max-w-[600px] text-ink-2">
            {roadmaps.length} roadmaps broken into tracks you can tick off, with links to the exact
            lesson or video for each topic, notes, and a daily streak.
          </p>
          <Link
            href="/sign-in"
            className="relative mt-5 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-accent-ink"
          >
            Sign in to track progress
          </Link>
        </section>
        <ExploreRoadmaps roadmaps={roadmaps} tab={tab} signedIn={false} />
      </PageMain>
    );
  }

  const now = new Date();
  const [dash, home] = await Promise.all([getDashboard(db, userId, now), getHome(db, userId, now)]);
  const progress = new Map(dash.roadmaps.map((r) => [r.id, r]));
  const enrolled = dash.roadmaps.filter((r) => r.enrolled).length;
  const firstName = session.user?.name?.split(" ")[0];

  return (
    <PageMain>
      <PageHeader crumbs={[{ label: "Dashboard" }]} />
      <h1 className="mt-5 text-[1.625rem] font-bold tracking-tight md:text-[1.875rem]">
        Welcome {enrolled ? "back" : ""}
        {firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mb-5 text-ink-2">
        {enrolled
          ? `${enrolled} ${enrolled === 1 ? "roadmap" : "roadmaps"} in progress`
          : "Enroll in a roadmap below to start. Your progress, streak and notes will show up here."}
      </p>

      {enrolled > 0 && (
        <>
          <SummaryRow
            home={home}
            currentStreak={dash.currentStreak}
            longestStreak={dash.longestStreak}
          />
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <ContinueCard home={home} />
            <HomeCard title="Activity">
              <StudyHeatmap heatmap={dash.heatmap} />
            </HomeCard>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <NotesCard home={home} now={now} />
            <MilestonesCard home={home} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ResourcesCard home={home} now={now} />
            <SuggestionCard home={home} />
          </div>
        </>
      )}

      <ExploreRoadmaps roadmaps={roadmaps} progress={progress} tab={tab} signedIn />
    </PageMain>
  );
}
