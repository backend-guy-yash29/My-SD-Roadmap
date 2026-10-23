"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { Navigation } from "@/server/content";
import { useEnrollments } from "./enrollments";
import { useRoadmapProgress } from "./roadmap-progress";
import { clearAppearance, ThemeToggle } from "./theme";

const pad = (n: number) => String(n).padStart(2, "0");

function TrackList({ roadmap, showRings }: { roadmap: Navigation[number]; showRings: boolean }) {
  const pathname = usePathname();
  const { trackDone } = useRoadmapProgress();
  return (
    <div
      id={`tracks-${roadmap.id}`}
      className="mb-2 ml-[17px] border-l border-border pl-2"
      role="group"
      aria-label={`${roadmap.title} tracks`}
    >
      {roadmap.parts.map((part) => (
        <div key={part.id}>
          <p className="mx-2 mb-1 mt-3 text-[0.65625rem] font-semibold uppercase tracking-[0.08em] text-ink-3">
            {part.title}
          </p>
          {part.tracks.map((t) => {
            const active = pathname === `/${t.id}`;
            const done = showRings ? trackDone(t.id) : null;
            const pct = done !== null && t.itemCount ? Math.round((done / t.itemCount) * 100) : 0;
            return (
              <Link
                key={t.id}
                href={`/${t.id}`}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-2 py-[6px] text-[0.84375rem] ${
                  active
                    ? "bg-accent-soft font-semibold text-accent"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
              >
                <span
                  className={`w-[18px] font-mono text-[0.6875rem] ${active ? "text-accent" : "text-ink-3"}`}
                >
                  {pad(t.number)}
                </span>
                <span className="min-w-0 flex-1 truncate">{t.title}</span>
                {done !== null && (
                  <span
                    className="ring"
                    title={`${done}/${t.itemCount} done`}
                    style={
                      {
                        "--p": pct,
                        "--ring-hole": active ? "var(--accent-soft)" : "var(--surface)",
                      } as React.CSSProperties
                    }
                  />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function RoadmapEntry({
  roadmap,
  current,
  expanded,
  onToggle,
}: {
  roadmap: Navigation[number];
  current: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const onOverview = pathname === `/${roadmap.id}`;
  const tracks = roadmap.parts.reduce((n, p) => n + p.tracks.length, 0);
  return (
    <div>
      <div
        className={`flex items-center rounded-lg ${onOverview ? "bg-accent-soft" : "hover:bg-surface-2"}`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`tracks-${roadmap.id}`}
          aria-label={`${expanded ? "Hide" : "Show"} ${roadmap.title} tracks`}
          className="grid h-8 w-8 flex-none place-items-center rounded-lg text-ink-3 hover:text-ink"
        >
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className={`h-3 w-3 fill-current transition-transform ${expanded ? "rotate-90" : ""}`}
          >
            <path d="M6 3.5L10.5 8 6 12.5z" />
          </svg>
        </button>
        <Link
          href={`/${roadmap.id}`}
          aria-current={onOverview ? "page" : undefined}
          className={`flex min-w-0 flex-1 items-center gap-2 py-[7px] pr-2 text-sm ${
            onOverview
              ? "font-semibold text-accent"
              : current
                ? "font-semibold text-ink"
                : "text-ink-2 hover:text-ink"
          }`}
        >
          <span className="min-w-0 flex-1 truncate">{roadmap.title}</span>
          <span
            className="font-mono text-[0.6875rem] font-normal text-ink-3"
            title={`${tracks} tracks`}
          >
            {tracks}
          </span>
        </Link>
      </div>
      {expanded && <TrackList roadmap={roadmap} showRings={current} />}
    </div>
  );
}

function RoadmapNav({ nav, currentId }: { nav: Navigation; currentId: string | null }) {
  const pathname = usePathname();
  const { loaded, ids } = useEnrollments();
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(currentId ? [currentId] : []),
  );
  // Open the roadmap the page is in whenever navigation moves into it.
  useEffect(() => {
    if (currentId) setExpanded((cur) => (cur.has(currentId) ? cur : new Set(cur).add(currentId)));
  }, [currentId]);

  // Signed in: enrolled roadmaps (plus the one being viewed). Signed out, or none enrolled: all of them.
  const filtered = ids !== null && ids.length > 0;
  const shown = !loaded
    ? nav.filter((r) => r.id === currentId)
    : filtered
      ? nav.filter((r) => ids.includes(r.id))
      : nav;
  // A roadmap being viewed without enrolling gets its own heading below the enrolled ones.
  const viewing =
    filtered && currentId && !ids.includes(currentId)
      ? nav.find((r) => r.id === currentId)
      : undefined;
  const entry = (r: Navigation[number]) => (
    <RoadmapEntry
      key={r.id}
      roadmap={r}
      current={r.id === currentId}
      expanded={expanded.has(r.id)}
      onToggle={() => toggle(r.id)}
    />
  );

  const toggle = (id: string) =>
    setExpanded((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <nav aria-label="Roadmaps">
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={`mb-3 flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-sm ${pathname === "/" ? "bg-accent-soft font-semibold text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink"}`}
      >
        <span className="w-4 text-center">⌂</span>
        Dashboard
      </Link>
      <p className="mx-2 mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-3">
        {filtered ? "My roadmaps" : "Roadmaps"}
      </p>
      {shown.map(entry)}
      {viewing && (
        <>
          <p className="mx-2 mb-1.5 mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-3">
            Viewing · not enrolled
          </p>
          {entry(viewing)}
        </>
      )}
      {filtered && shown.length < nav.length && (
        <Link
          href="/?tab=available"
          className="mt-2 block rounded-lg px-2 py-[7px] text-[0.8125rem] text-accent hover:bg-surface-2"
        >
          Browse all roadmaps →
        </Link>
      )}
    </nav>
  );
}

function Account() {
  const { data: session, status } = useSession();
  if (status === "loading") return <div className="h-11" />;
  if (!session?.user) {
    return (
      <Link
        href="/sign-in"
        className="block rounded-lg bg-accent px-3 py-2 text-center text-sm font-semibold text-accent-ink"
      >
        Sign in
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2.5">
      <Link
        href="/settings"
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-surface-2"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" />
        ) : (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
            {(session.user.name ?? "?").slice(0, 1)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">
            {session.user.name ?? "Your account"}
          </span>
          <span className="block text-xs text-ink-3">Settings</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => {
          clearAppearance();
          signOut({ redirectTo: "/" });
        }}
        className="rounded-lg px-2 py-1.5 text-xs text-ink-3 hover:bg-surface-2 hover:text-ink"
      >
        Sign out
      </button>
    </div>
  );
}

export function Sidebar({ nav }: { nav: Navigation }) {
  const { roadmapId } = useRoadmapProgress();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]); // close the mobile drawer after navigating

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="sidebar"
          className="rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium"
        >
          ☰ Menu
        </button>
        <ThemeToggle />
      </div>

      <aside
        id="sidebar"
        className={`${open ? "block" : "hidden"} border-b border-border bg-surface px-3.5 pb-6 pt-[18px] md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r`}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2 pb-[18px] font-bold tracking-tight"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-[0.8125rem] text-white">
            MR
          </span>
          My Roadmaps
        </Link>
        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
          <RoadmapNav nav={nav} currentId={roadmapId} />
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <Account />
        </div>
      </aside>
    </>
  );
}
