import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { PageHeader } from "@/components/page-header";
import { WithRail } from "@/components/study-rail";
import { TrackMain, TrackRail } from "@/components/track-items";
import { getRoadmap, getTrack } from "@/server/content";
import { AppError } from "@/server/errors";

export const revalidate = 300;

// Render on first request, then serve from cache (content changes only on deploy).
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ roadmap: string; track: string }> };

async function load(roadmapId: string, slug: string) {
  try {
    const [roadmap, track] = await Promise.all([
      getRoadmap(db, roadmapId),
      getTrack(db, `${roadmapId}/${slug}`),
    ]);
    if (track.roadmapId !== roadmap.id) notFound();
    return { roadmap, track };
  } catch (err) {
    if (err instanceof AppError && err.code === "NOT_FOUND") notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roadmap, track } = await params;
  const data = await load(roadmap, track);
  return {
    title: `${data.track.title} · ${data.roadmap.title}`,
    description: data.track.summary ?? undefined,
  };
}

export default async function TrackPage({ params }: Props) {
  const p = await params;
  const { roadmap, track } = await load(p.roadmap, p.track);
  const all = roadmap.parts.flatMap((part) => part.tracks.map((t) => ({ ...t, part: part.title })));
  const index = all.findIndex((t) => t.id === track.id);
  const part = all[index]?.part ?? "";
  const prev = all[index - 1];
  const next = all[index + 1];

  return (
    <WithRail rail={<TrackRail track={track} />}>
      <PageHeader crumbs={[{ label: roadmap.title, href: `/${roadmap.id}` }, { label: part }]} />
      <TrackMain
        track={track}
        eyebrow={`TRACK ${String(index + 1).padStart(2, "0")} · ${part.toUpperCase()}`}
      />
      <nav className="mt-8 flex justify-between gap-4" aria-label="Track navigation">
        {prev ? (
          <Link
            href={`/${prev.id}`}
            className="rounded-xl border border-border bg-surface px-4 py-3 hover:border-accent"
          >
            <span className="block text-xs text-ink-3">← Previous</span>
            <span className="font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${next.id}`}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-right hover:border-accent"
          >
            <span className="block text-xs text-ink-3">Next →</span>
            <span className="font-medium">{next.title}</span>
          </Link>
        )}
      </nav>
    </WithRail>
  );
}
