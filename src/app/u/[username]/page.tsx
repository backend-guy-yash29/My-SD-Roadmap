import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { StudyHeatmap } from "@/components/heatmap";
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
    <div className="space-y-8">
      {!profile.isPublic && (
        <p className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink-2">
          Only you can see this page. Make your profile public in Settings to share it.
        </p>
      )}
      <header className="flex items-center gap-4">
        {profile.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.image} alt="" className="h-16 w-16 rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile.name ?? profile.username}
          </h1>
          <p className="text-sm text-ink-3">@{profile.username}</p>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-ink-3">Current streak</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{profile.currentStreak}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-ink-3">Longest streak</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{profile.longestStreak}</p>
        </div>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 font-semibold">Activity</h2>
        <StudyHeatmap heatmap={profile.heatmap} />
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Progress</h2>
        {profile.roadmaps.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-surface p-4">
            <p className="mb-2 font-medium">{r.title}</p>
            <ProgressBar done={r.done} total={r.total} label={`${r.title} progress`} />
          </div>
        ))}
      </section>
    </div>
  );
}
