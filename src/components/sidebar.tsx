"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { Navigation } from "@/server/content";
import { useRoadmapProgress } from "./roadmap-progress";
import { ThemeToggle } from "./theme";

const pad = (n: number) => String(n).padStart(2, "0");

function RoadmapSwitcher({ nav, currentId }: { nav: Navigation; currentId: string | null }) {
  const [open, setOpen] = useState(false);
  const current = nav.find((r) => r.id === currentId);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="mb-4 flex w-full items-center justify-between rounded-[10px] border border-border bg-surface-2 px-3 py-2.5 text-left text-sm font-semibold hover:border-border-2">
        <span className="truncate">{current?.title ?? "All roadmaps"}</span>
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current text-ink-3">
          <path d="M4 6l4 4 4-4z" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-xl border border-border bg-surface p-1.5 shadow-card"
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`block rounded-lg px-3 py-2 text-sm hover:bg-surface-2 ${currentId ? "text-ink-2" : "font-semibold text-accent"}`}
          >
            Dashboard
          </Link>
          <div className="my-1 border-t border-border" />
          {nav.map((r) => (
            <Link
              key={r.id}
              href={`/${r.id}`}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm hover:bg-surface-2 ${r.id === currentId ? "font-semibold text-accent" : "text-ink-2"}`}
            >
              {r.title}
            </Link>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function TrackList({ roadmap }: { roadmap: Navigation[number] }) {
  const pathname = usePathname();
  const { trackDone } = useRoadmapProgress();
  return (
    <nav aria-label={`${roadmap.title} tracks`}>
      {roadmap.parts.map((part) => (
        <div key={part.id}>
          <p className="mx-2 mb-1.5 mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            {part.title}
          </p>
          {part.tracks.map((t) => {
            const active = pathname === `/${t.id}`;
            const done = trackDone(t.id);
            const pct = done !== null && t.itemCount ? Math.round((done / t.itemCount) * 100) : 0;
            return (
              <Link
                key={t.id}
                href={`/${t.id}`}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-sm ${
                  active
                    ? "bg-accent-soft font-semibold text-accent"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
              >
                <span
                  className={`w-[18px] font-mono text-[11px] ${active ? "text-accent" : "text-ink-3"}`}
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
    </nav>
  );
}

function RoadmapList({ nav }: { nav: Navigation }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Roadmaps">
      <p className="mx-2 mb-1.5 mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
        Roadmaps
      </p>
      <Link
        href="/"
        className={`flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-sm ${pathname === "/" ? "bg-accent-soft font-semibold text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink"}`}
      >
        <span className="w-[18px] text-center">⌂</span>
        Dashboard
      </Link>
      {nav.map((r) => {
        const tracks = r.parts.reduce((n, p) => n + p.tracks.length, 0);
        return (
          <Link
            key={r.id}
            href={`/${r.id}`}
            className="flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-sm text-ink-2 hover:bg-surface-2 hover:text-ink"
          >
            <span className="w-[18px] text-center text-ink-3">›</span>
            <span className="min-w-0 flex-1 truncate">{r.title}</span>
            <span className="font-mono text-[11px] text-ink-3" title={`${tracks} tracks`}>
              {tracks}
            </span>
          </Link>
        );
      })}
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
        onClick={() => signOut({ redirectTo: "/" })}
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
  const roadmap = nav.find((r) => r.id === roadmapId);

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
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-[13px] text-white">
            MR
          </span>
          My Roadmaps
        </Link>
        <RoadmapSwitcher nav={nav} currentId={roadmapId} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          {roadmap ? <TrackList roadmap={roadmap} /> : <RoadmapList nav={nav} />}
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <Account />
        </div>
      </aside>
    </>
  );
}
