"use client";

import { useState } from "react";

type Heatmap = { from: string; to: string; days: { date: string; count: number }[] };

const level = (n: number) => (n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 5 ? 3 : 4);
const LEVEL_LABEL = ["0", "1", "2–3", "4–5", "6+"];

function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();
const fmt = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

/** Calendar heatmap of first completions per day, oldest week on the left. */
export function StudyHeatmap({ heatmap }: { heatmap: Heatmap }) {
  const counts = new Map(heatmap.days.map((d) => [d.date, d.count]));
  const [hover, setHover] = useState<{ date: string; count: number; x: number; y: number } | null>(
    null,
  );

  // Start the grid on the Sunday on or before `from` so rows line up with weekdays.
  const start = addDays(heatmap.from, -weekday(heatmap.from));
  const weeks: string[][] = [];
  for (let day = start; day <= heatmap.to; day = addDays(day, 1)) {
    if (weekday(day) === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
  }
  const total = heatmap.days.reduce((n, d) => n + d.count, 0);
  const activeDays = heatmap.days.length;

  return (
    <figure className="relative">
      <figcaption className="mb-2 text-sm text-ink-2">
        <span className="font-semibold text-ink">{total}</span> item{total === 1 ? "" : "s"}{" "}
        completed for the first time on <span className="font-semibold text-ink">{activeDays}</span>{" "}
        day{activeDays === 1 ? "" : "s"} in the last year
      </figcaption>
      <div className="overflow-x-auto pb-1">
        <div
          className="flex gap-[3px]"
          role="grid"
          aria-label="Study activity heatmap"
          onMouseLeave={() => setHover(null)}
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]" role="row">
              {week.map((date) => {
                const inRange = date >= heatmap.from;
                const count = counts.get(date) ?? 0;
                return (
                  <div
                    key={date}
                    role="gridcell"
                    aria-label={inRange ? `${fmt(date)}: ${count} completed` : undefined}
                    onMouseEnter={(e) => {
                      if (!inRange) return;
                      const box = e.currentTarget.getBoundingClientRect();
                      const parent = e.currentTarget.closest("figure")!.getBoundingClientRect();
                      setHover({
                        date,
                        count,
                        x: box.left - parent.left + box.width / 2,
                        y: box.top - parent.top,
                      });
                    }}
                    className={`h-[11px] w-[11px] rounded-[2px] ${inRange ? "" : "invisible"}`}
                    style={{ background: `var(--heat-${level(count)})` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-surface px-2 py-1 text-xs shadow-md"
          style={{ left: hover.x, top: hover.y - 4 }}
        >
          <span className="font-semibold text-ink">{hover.count}</span>
          <span className="text-ink-2"> on {fmt(hover.date)}</span>
        </div>
      )}
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-ink-3" aria-hidden>
        Less
        {LEVEL_LABEL.map((label, i) => (
          <span
            key={label}
            title={label}
            className="h-[11px] w-[11px] rounded-[2px]"
            style={{ background: `var(--heat-${i})` }}
          />
        ))}
        More
      </div>
    </figure>
  );
}
