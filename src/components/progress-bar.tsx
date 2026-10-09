export function ProgressBar({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label?: string;
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-20 shrink-0 text-right text-xs tabular-nums text-ink-2">
        {done}/{total} · {pct}%
      </span>
    </div>
  );
}
