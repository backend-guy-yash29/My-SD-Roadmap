export function ProgressBar({
  done,
  total,
  label,
  gradient,
}: {
  done: number;
  total: number;
  label?: string;
  gradient?: boolean;
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label={label ?? "Progress"}
      >
        <div
          className={`h-full rounded-full transition-[width] ${gradient ? "bar-gradient" : "bg-done"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-[86px] shrink-0 text-right font-mono text-[0.6875rem] text-ink-3">
        {done}/{total} · {pct}%
      </span>
    </div>
  );
}
