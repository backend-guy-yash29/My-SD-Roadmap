import Link from "next/link";
import { slugify } from "@/content/parse";
import type { listRoadmaps } from "@/server/content";
import { EnrollControl } from "./enroll";
import { ProgressBar } from "./progress-bar";

type Roadmap = Awaited<ReturnType<typeof listRoadmaps>>[number];
type Progress = { done: number; total: number; enrolled: boolean };

/** Category names in roadmap order, each once. */
export function categories(roadmaps: Roadmap[]) {
  return [...new Set(roadmaps.map((r) => r.category ?? "Other"))];
}

/**
 * Every roadmap as a card, with tabs for "All", "My roadmaps" (when enrolled) and each category.
 * Tabs are links (?tab=...) so the page stays server-rendered and shareable.
 */
export function ExploreRoadmaps({
  roadmaps,
  progress,
  tab,
  signedIn,
}: {
  roadmaps: Roadmap[];
  progress?: Map<string, Progress>;
  tab?: string;
  signedIn: boolean;
}) {
  const mine = roadmaps.filter((r) => progress?.get(r.id)?.enrolled);
  const cats = categories(roadmaps);
  const tabs = [
    { key: "all", label: "All", count: roadmaps.length },
    ...(mine.length ? [{ key: "mine", label: "My roadmaps", count: mine.length }] : []),
    ...cats.map((c) => ({
      key: slugify(c),
      label: c,
      count: roadmaps.filter((r) => (r.category ?? "Other") === c).length,
    })),
  ];
  const active = tabs.find((t) => t.key === tab)?.key ?? "all";
  const shown =
    active === "all"
      ? roadmaps
      : active === "mine"
        ? mine
        : roadmaps.filter((r) => slugify(r.category ?? "Other") === active);

  return (
    <section id="explore" className="scroll-mt-6">
      <div className="mb-3 mt-9 flex items-baseline gap-2.5">
        <h2 className="text-lg font-semibold tracking-tight">Explore roadmaps</h2>
        <span className="text-xs text-ink-3">grouped by area</span>
      </div>
      <nav
        aria-label="Roadmap categories"
        className="-mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1"
      >
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "all" ? "/#explore" : `/?tab=${t.key}#explore`}
            scroll={false}
            aria-current={t.key === active ? "page" : undefined}
            className={`flex-none rounded-full border px-3.5 py-1.5 text-[0.8125rem] ${
              t.key === active
                ? "border-ink bg-ink font-semibold text-bg"
                : "border-border bg-surface text-ink-2 hover:border-border-2 hover:text-ink"
            }`}
          >
            {t.label}
            <span className="ml-1 text-[0.6875rem] opacity-60">{t.count}</span>
          </Link>
        ))}
      </nav>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {shown.map((r) => {
          const p = progress?.get(r.id);
          return (
            <li
              key={r.id}
              className="relative flex flex-col rounded-[14px] border border-border bg-surface p-5 transition-shadow hover:border-accent hover:shadow-card"
            >
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.04em] text-accent">
                {r.category ?? "Roadmap"}
              </span>
              {/* The link covers the card; the enroll control sits above it. */}
              <Link
                href={`/${r.id}`}
                className="mt-1 text-base font-semibold text-heading after:absolute after:inset-0 after:rounded-[14px]"
              >
                {r.title}
              </Link>
              <p className="mt-1 line-clamp-2 flex-1 text-[0.8125rem] text-ink-2">
                {r.tagline ?? r.summary}
              </p>
              <div className="mt-4">
                {p && (p.enrolled || p.done > 0) ? (
                  <ProgressBar
                    done={p.done}
                    total={p.total}
                    label={`${r.title} progress`}
                    gradient
                  />
                ) : (
                  <span className="font-mono text-[0.6875rem] text-ink-3">
                    {r.trackCount} tracks · {r.itemCount} topics
                  </span>
                )}
              </div>
              {signedIn && (
                <div className="relative z-10 mt-3">
                  <EnrollControl roadmapId={r.id} title={r.title} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
