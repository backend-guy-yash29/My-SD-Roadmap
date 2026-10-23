"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Navigation } from "@/server/content";
import { useEnrollments } from "./enrollments";
import { ThemeToggle } from "./theme";

type Menu = {
  title: string;
  note: string | null;
  categories: { title: string; roadmaps: Navigation }[];
};

/** Groups roadmaps into menus, then category columns, keeping content order. */
function menus(nav: Navigation): Menu[] {
  const out: Menu[] = [];
  for (const r of nav) {
    const title = r.menu ?? "Roadmaps";
    let menu = out.find((m) => m.title === title);
    if (!menu) out.push((menu = { title, note: r.menuNote, categories: [] }));
    const cat = r.category ?? title;
    let column = menu.categories.find((c) => c.title === cat);
    if (!column) menu.categories.push((column = { title: cat, roadmaps: [] }));
    column.roadmaps.push(r);
  }
  return out;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 flex-none fill-none stroke-current stroke-2 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Desktop top bar: one dropdown per menu, with a column per category. */
export function TopNav({ nav }: { nav: Navigation }) {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bar = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { isEnrolled } = useEnrollments();
  const current = pathname.split("/")[1] ?? "";
  const list = menus(nav);

  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (bar.current && !bar.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const hover = (title: string | null) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (title) setOpen(title);
    else closeTimer.current = setTimeout(() => setOpen(null), 150);
  };

  return (
    <header
      ref={bar}
      className="sticky top-0 z-30 hidden border-b border-border bg-surface md:block"
      onMouseLeave={() => hover(null)}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-6 lg:px-8">
        <nav aria-label="Browse roadmaps" className="hidden lg:block">
          <ul className="flex h-16 items-stretch gap-1 xl:gap-3">
            {list.map((m) => {
              const isOpen = open === m.title;
              const active = m.categories.some((c) => c.roadmaps.some((r) => r.id === current));
              return (
                <li key={m.title} onMouseEnter={() => hover(m.title)}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`menu-${m.title}`}
                    onClick={() => setOpen(isOpen ? null : m.title)}
                    className={`flex h-full items-center gap-2 border-b-2 px-2.5 text-left ${
                      isOpen || active ? "border-accent" : "border-transparent"
                    }`}
                  >
                    <span>
                      <span className="block text-[0.9375rem] font-semibold leading-tight text-heading">
                        {m.title}
                      </span>
                      {m.note && (
                        <span className="hidden text-[0.6875rem] text-ink-3 xl:block">
                          {m.note}
                        </span>
                      )}
                    </span>
                    <Chevron open={isOpen} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {list.map((m) => {
        const single = m.categories.length === 1;
        return (
          <div
            key={m.title}
            id={`menu-${m.title}`}
            hidden={open !== m.title}
            onMouseEnter={() => hover(m.title)}
            className="absolute inset-x-0 top-full border-b border-border bg-surface shadow-card"
          >
            <div
              className="grid gap-x-8 px-8 py-6"
              style={{
                gridTemplateColumns: `repeat(${single ? 1 : m.categories.length}, minmax(0, 1fr))`,
              }}
            >
              {m.categories.map((c, i) => (
                <section key={c.title} className={i ? "border-l border-border pl-8" : ""}>
                  <h3 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-3">
                    {c.title}
                  </h3>
                  <ul className={single ? "grid grid-cols-2 gap-x-8 xl:grid-cols-3" : ""}>
                    {c.roadmaps.map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/${r.id}`}
                          className="group -mx-3 block rounded-lg px-3 py-2.5 hover:bg-surface-2"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base font-medium text-heading group-hover:text-accent">
                              {r.title}
                            </span>
                            {isEnrolled(r.id) && (
                              <span className="rounded-full bg-done-soft px-2 py-px text-[0.625rem] font-semibold text-done">
                                ENROLLED
                              </span>
                            )}
                          </span>
                          {r.tagline && (
                            <span className="mt-0.5 block text-xs text-ink-3">{r.tagline}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        );
      })}
    </header>
  );
}
