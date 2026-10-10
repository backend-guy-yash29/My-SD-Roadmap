import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { RoadmapProgressProvider } from "@/components/roadmap-progress";
import { RoadmapOverallProgress, TrackCardProgress } from "@/components/track-card-progress";
import { getRoadmap } from "@/server/content";
import { AppError } from "@/server/errors";

export const revalidate = 300;

// Render on first request, then serve from cache (content changes only on deploy).
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ roadmap: string }> };

async function load(id: string) {
  try {
    return await getRoadmap(db, id);
  } catch (err) {
    if (err instanceof AppError && err.code === "NOT_FOUND") notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const roadmap = await load((await params).roadmap);
  return { title: roadmap.title, description: roadmap.summary ?? undefined };
}

export default async function RoadmapPage({ params }: Props) {
  const roadmap = await load((await params).roadmap);
  let n = 0;
  return (
    <RoadmapProgressProvider roadmapId={roadmap.id}>
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{roadmap.title}</h1>
          {roadmap.summary && <p className="max-w-3xl text-ink-2">{roadmap.summary}</p>}
          <div className="max-w-xl">
            <RoadmapOverallProgress title={roadmap.title} />
          </div>
        </header>
        {roadmap.parts.map((part) => (
          <section key={part.id}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-3">
              {part.title}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {part.tracks.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/${t.id}`}
                    className="flex h-full flex-col rounded-lg border border-border bg-surface p-4 hover:border-accent"
                  >
                    <span className="text-xs text-ink-3">Track {++n}</span>
                    <span className="mt-0.5 font-medium">{t.title}</span>
                    {t.summary && (
                      <span className="mt-1 line-clamp-2 flex-1 text-sm text-ink-2">
                        {t.summary}
                      </span>
                    )}
                    <div className="mt-3">
                      <TrackCardProgress trackId={t.id} total={t.itemCount} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </RoadmapProgressProvider>
  );
}
