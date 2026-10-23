import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { PageHeader } from "@/components/page-header";
import { RoadmapMain, RoadmapRail } from "@/components/roadmap-view";
import { WithRail } from "@/components/study-rail";
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
  return (
    <WithRail rail={<RoadmapRail roadmap={roadmap} />}>
      <PageHeader crumbs={[{ label: "Dashboard", href: "/" }, { label: roadmap.title }]} />
      <RoadmapMain roadmap={roadmap} />
    </WithRail>
  );
}
