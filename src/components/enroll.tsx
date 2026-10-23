"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useEnrollments } from "./enrollments";

/** Asks whether to keep or delete progress when leaving a roadmap. */
function LeaveDialog({
  roadmapId,
  title,
  open,
  onClose,
}: {
  roadmapId: string;
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { unenroll } = useEnrollments();
  const [busy, setBusy] = useState<"keep" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  async function leave(deleteProgress: boolean) {
    setBusy(deleteProgress ? "delete" : "keep");
    setError(null);
    const message = await unenroll(roadmapId, deleteProgress);
    setBusy(null);
    if (message) setError(message);
    else onClose();
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={`leave-${roadmapId}`}
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-2xl border border-border bg-surface p-6 text-ink shadow-card backdrop:bg-black/40"
    >
      <h2 id={`leave-${roadmapId}`} className="text-lg font-semibold">
        Leave {title}?
      </h2>
      <p className="mt-1.5 text-ink-2">
        It will be removed from your sidebar and dashboard. What should happen to your progress?
      </p>
      <div className="mt-5 grid gap-2.5">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => leave(false)}
          className="rounded-[10px] border border-border px-4 py-3 text-left hover:border-accent disabled:opacity-50"
        >
          <span className="block font-semibold">
            {busy === "keep" ? "Leaving…" : "Keep my progress"}
          </span>
          <span className="block text-xs text-ink-3">
            Ticks and notes stay. Enroll again any time to pick up where you left off.
          </span>
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => leave(true)}
          className="rounded-[10px] border border-border px-4 py-3 text-left hover:border-danger disabled:opacity-50"
        >
          <span className="block font-semibold text-danger">
            {busy === "delete" ? "Deleting…" : "Delete my progress"}
          </span>
          <span className="block text-xs text-ink-3">
            Removes your ticks and notes in this roadmap. This can&apos;t be undone. Your streak
            keeps the days you already earned.
          </span>
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <div className="mt-4 text-right">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm text-ink-2 hover:bg-surface-2"
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
}

/** Enroll button, or an Enrolled badge with a Leave option. */
export function EnrollControl({ roadmapId, title }: { roadmapId: string; title: string }) {
  const { loaded, signedIn, isEnrolled, enroll } = useEnrollments();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  if (!loaded) return <span className="inline-block h-[30px]" />;
  if (!signedIn) {
    return (
      <Link
        href="/sign-in"
        className="inline-block rounded-lg border border-border bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-ink-2 hover:border-accent hover:text-accent"
      >
        Sign in to enroll
      </Link>
    );
  }
  if (!isEnrolled(roadmapId)) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(await enroll(roadmapId));
            setBusy(false);
          }}
          className="rounded-lg bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-accent-ink disabled:opacity-50"
        >
          {busy ? "Enrolling…" : "Enroll"}
        </button>
        {error && <span className="text-xs text-danger">{error}</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="rounded-lg bg-done-soft px-2.5 py-1.5 text-[13px] font-semibold text-done">
        ✓ Enrolled
      </span>
      <button
        type="button"
        onClick={() => setLeaving(true)}
        aria-label={`Leave ${title}`}
        className="rounded-lg px-2.5 py-1.5 text-[13px] text-ink-3 hover:bg-surface-2 hover:text-danger"
      >
        Leave
      </button>
      <LeaveDialog
        roadmapId={roadmapId}
        title={title}
        open={leaving}
        onClose={() => setLeaving(false)}
      />
    </span>
  );
}
