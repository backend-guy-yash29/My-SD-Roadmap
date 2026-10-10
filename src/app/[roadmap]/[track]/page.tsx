import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { RoadmapProgressProvider } from "@/components/roadmap-progress";
import { TrackItems } from "@/components/track-items";
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
  const all = roadmap.parts.flatMap((part) => part.tracks);
  const index = all.findIndex((t) => t.id === track.id);
  const prev = all[index - 1];
  const next = all[index + 1];

  return (
    <RoadmapProgressProvider roadmapId={roadmap.id}>
      <nav className="mb-4 text-sm text-ink-3">
        <Link href={`/${roadmap.id}`} className="hover:text-accent">
          {roadmap.title}
        </Link>{" "}
        / Track {index + 1}
      </nav>
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{track.title}</h1>
        {track.summary && <p className="max-w-3xl text-ink-2">{track.summary}</p>}
      </header>
      <TrackItems track={track} />
      <nav className="mt-8 flex justify-between gap-4 text-sm">
        {prev ? (
          <Link
            href={`/${prev.id}`}
            className="rounded-md border border-border px-3 py-2 hover:border-accent"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${next.id}`}
            className="rounded-md border border-border px-3 py-2 text-right hover:border-accent"
          >
            {next.title} →
          </Link>
        )}
      </nav>
    </RoadmapProgressProvider>
  );
}
