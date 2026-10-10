"use client";

import * as Popover from "@radix-ui/react-popover";
import { useRef, useState } from "react";

export type ResourceLink = { id: number; source: string; title: string; url: string };

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/** A count badge that lists an item's resources on hover (or tap). Links go through /r/[id]. */
export function ResourcePopover({
  itemTitle,
  resources,
}: {
  itemTitle: string;
  resources: ResourceLink[];
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs text-ink-2 hover:border-accent hover:text-accent data-[state=open]:border-accent data-[state=open]:text-accent"
        onMouseEnter={show}
        onMouseLeave={hideSoon}
        aria-label={`${resources.length} study resource${resources.length === 1 ? "" : "s"} for ${itemTitle}`}
      >
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
          <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v12a.5.5 0 0 1-.79.41L8 11.94l-4.21 2.97A.5.5 0 0 1 3 14.5v-12Z" />
        </svg>
        {resources.length}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={6}
          collisionPadding={16}
          onMouseEnter={show}
          onMouseLeave={hideSoon}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="z-50 w-80 max-w-[calc(100vw-32px)] rounded-lg border border-border bg-surface p-2 shadow-lg"
        >
          <p className="px-2 pb-1 pt-0.5 text-xs font-medium text-ink-3">Study resources</p>
          <ul>
            {resources.map((r) => (
              <li key={r.id}>
                <a
                  href={`/r/${r.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md px-2 py-1.5 hover:bg-surface-2"
                >
                  <span className="block text-xs font-medium text-accent">{r.source}</span>
                  <span className="block text-sm text-ink">{r.title}</span>
                  <span className="block text-xs text-ink-3">{hostOf(r.url)}</span>
                </a>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
