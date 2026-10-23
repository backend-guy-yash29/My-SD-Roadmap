import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { StudyHeatmap } from "@/components/heatmap";
import { Card, PageHeader, PageMain } from "@/components/page-header";
import { ProgressBar } from "@/components/progress-bar";
import { AppError } from "@/server/errors";
import { getPublicProfile } from "@/server/profile";

type Props = { params: Promise<{ username: string }> };

async function load(username: string) {
  const session = await auth();
  try {
    return await getPublicProfile(db, username, session?.user?.id ?? null);
  } catch (err) {
    if (err instanceof AppError && err.code === "NOT_FOUND") notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await load((await params).username);
  return { title: profile.name ?? profile.username };
}

export default async function ProfilePage({ params }: Props) {
  const profile = await load((await params).username);
  return (
    <PageMain>
      <PageHeader crumbs={[{ label: "Profiles" }, { label: `@${profile.username}` }]} />
      {!profile.isPublic && (
        <p className="mt-5 rounded-[10px] border border-border bg-surface-2 px-4 py-2.5 text-ink-2">
          Only you can see this page. Make your profile public in Settings to share it.
        </p>
      )}
      <section className="hero-glow mb-4 mt-5 flex items-center gap-5 rounded-2xl border border-border bg-surface px-6 py-6 shadow-card">
        {profile.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.image} alt="" className="relative h-16 w-16 rounded-full" />
        ) : (
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-2xl font-bold text-accent">
            {(profile.name ?? profile.username).slice(0, 1)}
          </span>
        )}
        <div className="relative">
          <h1 className="text-[1.625rem] font-bold tracking-tight">
            {profile.name ?? profile.username}
          </h1>
          <p className="font-mono text-xs text-ink-3">@{profile.username}</p>
        </div>
      </section>
      <section className="mb-4 grid gap-4 sm:grid-cols-2">
        {[
          ["Current streak", profile.currentStreak],
          ["Longest streak", profile.longestStreak],
        ].map(([label, value]) => (
          <Card key={label} className="!p-4">
            <p className="text-[0.8125rem] font-semibold text-ink-2">{label}</p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <b className="text-[2.125rem] font-bold leading-none tracking-tight">{value}</b>
              <span className="text-ink-2">{value === 1 ? "day" : "days"}</span>
            </p>
          </Card>
        ))}
      </section>
      <Card className="mb-7">
        <h2 className="mb-3 text-[0.9375rem] font-semibold">Activity</h2>
        <StudyHeatmap heatmap={profile.heatmap} />
      </Card>
      <h2 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-3">
        Progress
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {profile.roadmaps.map((r) => (
          <Card key={r.id} className="!p-4">
            <p className="mb-2.5 font-semibold">{r.title}</p>
            <ProgressBar done={r.done} total={r.total} label={`${r.title} progress`} gradient />
          </Card>
        ))}
        {profile.roadmaps.length === 0 && (
          <p className="text-ink-3">Not enrolled in any roadmap yet.</p>
        )}
      </div>
    </PageMain>
  );
}
