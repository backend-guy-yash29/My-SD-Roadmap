import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/db";
import { StudyHeatmap } from "@/components/heatmap";
import { Card, PageHeader, PageMain } from "@/components/page-header";
import { listRecentNotes } from "@/server/notes";
import { getStudyStats } from "@/server/progress";

export const dynamic = "force-dynamic";

const NOTE_PREVIEW = 280;

function when(date: Date, now: Date) {
  const days = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <PageMain>
        <PageHeader crumbs={[{ label: "Dashboard" }]} />
        <section className="hero-glow mt-5 rounded-2xl border border-border bg-surface px-6 py-8 shadow-card md:px-8">
          <p className="relative font-mono text-xs tracking-[0.04em] text-accent">
            STRUCTURED STUDY ROADMAPS
          </p>
          <h1 className="relative mb-3 mt-2 max-w-[640px] text-[1.75rem] font-bold leading-tight tracking-tight md:text-[2.125rem]">
            Maths, programming, ML, AI engineering and system design, one topic at a time.
          </h1>
          <p className="relative max-w-[600px] text-ink-2">
            Pick a roadmap from the menu to start. Sign in to tick off topics, keep notes and build
            a daily streak.
          </p>
          <Link
            href="/sign-in"
            className="relative mt-5 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-accent-ink"
          >
            Sign in to track progress
          </Link>
        </section>
      </PageMain>
    );
  }

  const now = new Date();
  const [stats, notes] = await Promise.all([
    getStudyStats(db, userId, now),
    listRecentNotes(db, userId),
  ]);
  const firstName = session.user?.name?.split(" ")[0];

  return (
    <PageMain>
      <PageHeader crumbs={[{ label: "Dashboard" }]} />
      <h1 className="mb-5 mt-5 text-[1.625rem] font-bold tracking-tight md:text-[1.875rem]">
        Welcome back{firstName ? `, ${firstName}` : ""}
      </h1>

      <Card>
        <h2 className="mb-3 text-[0.9375rem] font-semibold">Activity</h2>
        <StudyHeatmap heatmap={stats.heatmap} />
      </Card>

      {notes.length > 0 && (
        <Card className="mt-5">
          <h2 className="mb-1 text-[0.9375rem] font-semibold">Notes</h2>
          <ul className="divide-y divide-border">
            {notes.map((n) => (
              <li key={n.itemId} className="py-3.5 last:pb-0">
                <Link href={`/${n.trackId}`} className="group block">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <b className="font-semibold text-heading group-hover:text-accent">
                      {n.itemTitle}
                    </b>
                    <span className="text-xs text-ink-3">
                      {n.roadmapTitle} · {n.trackTitle}
                    </span>
                    <span className="ml-auto text-xs text-ink-3">{when(n.updatedAt, now)}</span>
                  </span>
                  <span className="mt-1 block whitespace-pre-line text-sm text-ink-2">
                    {n.body.length > NOTE_PREVIEW
                      ? `${n.body.slice(0, NOTE_PREVIEW).trimEnd()}…`
                      : n.body}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </PageMain>
  );
}
