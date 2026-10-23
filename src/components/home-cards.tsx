import Link from "next/link";
import type { Home } from "@/server/home";
import { DailyGoalCard } from "./daily-goal";
import { EnrollControl } from "./enroll";

const ago = (date: Date, now: Date) => {
  const minutes = Math.round((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 60) return minutes <= 1 ? "just now" : `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
};

export function HomeCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[14px] border border-border bg-surface p-4 md:p-5 ${className}`}>
      <h2 className="mb-3 text-[0.8125rem] font-semibold text-ink-2">{title}</h2>
      {children}
    </section>
  );
}

function Big({ value, unit }: { value: number; unit: string }) {
  return (
    <p className="flex items-baseline gap-1.5">
      <b className="text-[1.875rem] font-bold leading-none tracking-tight">{value}</b>
      <span className="text-ink-2">{unit}</span>
    </p>
  );
}

const plural = (n: number, one: string, many = `${one}s`) => (n === 1 ? one : many);

/** Today's goal, streak, this week and revision: the top row of the dashboard. */
export function SummaryRow({
  home,
  currentStreak,
  longestStreak,
}: {
  home: Home;
  currentStreak: number;
  longestStreak: number;
}) {
  const { week } = home;
  const diff = week.total - week.previousTotal;
  const peak = Math.max(1, ...week.days.map((d) => d.count));
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DailyGoalCard done={home.today} goal={home.dailyGoal} />
      <HomeCard title="Streak">
        <Big value={currentStreak} unit={plural(currentStreak, "day")} />
        <p className="mt-1.5 text-xs text-ink-3">
          Longest: {longestStreak} {plural(longestStreak, "day")}
          {home.today === 0 && currentStreak > 0 ? " · Tick a topic today to keep it" : ""}
        </p>
      </HomeCard>
      <HomeCard title="This week">
        <Big value={week.total} unit={plural(week.total, "topic")} />
        <p className="mt-1.5 text-xs text-ink-3">
          {diff === 0 ? "Same as" : diff > 0 ? `▲ ${diff} more than` : `▼ ${-diff} fewer than`} the
          week before · {week.activeDays} of 7 days active
        </p>
        <div className="mt-3 grid h-9 grid-cols-7 items-end gap-1.5" aria-hidden>
          {week.days.map((d) => (
            <i
              key={d.date}
              className={`block rounded-[4px] ${d.count ? "bg-accent" : "bg-surface-2"}`}
              style={{ height: `${d.count ? 25 + (d.count / peak) * 75 : 18}%` }}
              title={`${d.date}: ${d.count}`}
            />
          ))}
        </div>
      </HomeCard>
      <HomeCard title="Due for revision">
        <Big value={home.revision.total} unit={plural(home.revision.total, "topic")} />
        {home.revision.items.length ? (
          <ul className="mt-2 space-y-1">
            {home.revision.items.slice(0, 3).map((r) => (
              <li key={r.itemId} className="truncate text-[0.8125rem]">
                <Link href={`/${r.trackId}`} className="text-accent hover:underline">
                  {r.itemTitle}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1.5 text-xs text-ink-3">
            Mark topics with ↻ on a track to revisit them.
          </p>
        )}
      </HomeCard>
    </div>
  );
}

export function ContinueCard({ home }: { home: Home }) {
  return (
    <HomeCard title="Continue learning">
      {home.continueLearning.length ? (
        <ul className="space-y-2">
          {home.continueLearning.map((c) => (
            <li key={c.roadmapId}>
              <Link
                href={`/${c.trackId}`}
                className="flex items-center gap-3 rounded-[10px] border border-border px-3.5 py-2.5 hover:border-accent"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.04em] text-accent">
                    {c.roadmapTitle} · {c.total ? Math.round((c.done / c.total) * 100) : 0}%
                  </span>
                  <span className="block truncate font-medium">{c.itemTitle}</span>
                  <span className="block truncate text-xs text-ink-3">{c.trackTitle}</span>
                </span>
                <span className="text-sm text-ink-3">Continue →</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-3">Every enrolled roadmap is complete. 🎉</p>
      )}
    </HomeCard>
  );
}

export function NotesCard({ home, now }: { home: Home; now: Date }) {
  return (
    <HomeCard title="Recent notes">
      {home.notes.length ? (
        <ul className="divide-y divide-dashed divide-border">
          {home.notes.map((n) => (
            <li key={n.itemId} className="py-2 first:pt-0 last:pb-0">
              <Link href={`/${n.trackId}`} className="group block">
                <span className="flex items-baseline gap-2">
                  <b className="min-w-0 flex-1 truncate text-[0.8125rem] group-hover:text-accent">
                    {n.itemTitle}
                  </b>
                  <span className="text-[0.6875rem] text-ink-3">{ago(n.updatedAt, now)}</span>
                </span>
                <span className="line-clamp-2 text-[0.8125rem] text-ink-2">{n.snippet}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-3">Notes you write on topics show up here.</p>
      )}
    </HomeCard>
  );
}

export function ResourcesCard({ home, now }: { home: Home; now: Date }) {
  return (
    <HomeCard title="Recently opened">
      {home.resources.length ? (
        <ul className="divide-y divide-dashed divide-border">
          {home.resources.map((r) => (
            <li key={r.resourceId} className="flex items-baseline gap-2 py-2 first:pt-0 last:pb-0">
              <a
                href={`/r/${r.resourceId}`}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 truncate text-[0.8125rem] hover:text-accent"
              >
                <span className="text-ink-3">{r.source}:</span> {r.title}
              </a>
              <span className="text-[0.6875rem] text-ink-3">{ago(r.openedAt, now)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-3">Videos and lessons you open show up here.</p>
      )}
    </HomeCard>
  );
}

export function MilestonesCard({ home }: { home: Home }) {
  const { badges, closestTrack, tracksDone } = home.milestones;
  const earned = badges.filter((b) => b.earned);
  const next = badges.filter((b) => !b.earned).slice(0, Math.max(2, 5 - earned.length));
  return (
    <HomeCard title="Milestones">
      <ul className="flex flex-wrap gap-2">
        {[...earned, ...next].map((b) => (
          <li
            key={b.id}
            title={b.earned ? "Earned" : "Not earned yet"}
            className={`flex items-center gap-1.5 rounded-[10px] border border-border px-2.5 py-1.5 text-[0.8125rem] ${
              b.earned ? "" : "opacity-45"
            }`}
          >
            <span aria-hidden>{b.icon}</span>
            {b.label}
            <span className="sr-only">{b.earned ? "(earned)" : "(not earned yet)"}</span>
          </li>
        ))}
      </ul>
      {closestTrack && (
        <p className="mt-3 text-xs text-ink-3">
          Next: finish{" "}
          <Link
            href={`/${closestTrack.trackId}`}
            className="font-semibold text-ink hover:text-accent"
          >
            {closestTrack.title}
          </Link>{" "}
          ({closestTrack.left} left) to complete track {tracksDone + 1}.
        </p>
      )}
    </HomeCard>
  );
}

export function SuggestionCard({ home }: { home: Home }) {
  const s = home.suggestion;
  return (
    <HomeCard title="Suggested next">
      {s ? (
        <>
          <p className="mb-3 text-sm text-ink-2">
            You&apos;re {s.from.percent}% through <b className="text-ink">{s.from.title}</b>. A good
            next roadmap:
          </p>
          <div className="flex items-center gap-3 rounded-[10px] border border-border px-3.5 py-2.5">
            <Link
              href={`/${s.to.id}`}
              className="min-w-0 flex-1 truncate font-semibold hover:text-accent"
            >
              {s.to.title}
            </Link>
            <EnrollControl roadmapId={s.to.id} title={s.to.title} />
          </div>
        </>
      ) : (
        <p className="text-sm text-ink-3">You&apos;re enrolled in every roadmap.</p>
      )}
    </HomeCard>
  );
}
