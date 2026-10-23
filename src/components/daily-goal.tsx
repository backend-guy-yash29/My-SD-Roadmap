"use client";

import { useState } from "react";
import { setDailyGoal } from "@/server/actions";

/** Today's progress towards the daily target, with a stepper to change the target. */
export function DailyGoalCard({ done, goal: initial }: { done: number; goal: number }) {
  const [goal, setGoal] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const pct = Math.min(100, Math.round((done / goal) * 100));
  const left = Math.max(0, goal - done);

  async function change(next: number) {
    if (next < 1 || next > 50) return;
    const before = goal;
    setGoal(next);
    setError(null);
    const res = await setDailyGoal(next);
    if (!res.ok) {
      setGoal(before);
      setError(res.error.message);
    }
  }

  const step =
    "grid h-6 w-6 place-items-center rounded-md border border-border text-ink-2 hover:border-accent hover:text-accent disabled:opacity-40";
  return (
    <section className="rounded-[14px] border border-border bg-surface p-4 md:p-5">
      <h2 className="mb-3 text-[0.8125rem] font-semibold text-ink-2">Today&apos;s goal</h2>
      <div className="flex items-center gap-3.5">
        <span
          className="grid h-14 w-14 flex-none place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--${left ? "accent" : "done"}) ${pct}%, var(--surface-2) 0)`,
          }}
          role="img"
          aria-label={`${done} of ${goal} topics today`}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-surface text-[0.8125rem] font-bold">
            {done}/{goal}
          </span>
        </span>
        <div className="min-w-0">
          <p className="font-semibold">
            {left ? `${left} more ${left === 1 ? "topic" : "topics"}` : "Goal reached 🎉"}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-3">
            <button
              type="button"
              className={step}
              onClick={() => change(goal - 1)}
              disabled={goal <= 1}
              aria-label="Lower daily goal"
            >
              −
            </button>
            <span>{goal} a day</span>
            <button
              type="button"
              className={step}
              onClick={() => change(goal + 1)}
              disabled={goal >= 50}
              aria-label="Raise daily goal"
            >
              +
            </button>
          </div>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </section>
  );
}
