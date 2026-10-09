"use client";

import { ProgressBar } from "./progress-bar";
import { useRoadmapProgress } from "./roadmap-progress";

export function TrackCardProgress({ trackId, total }: { trackId: string; total: number }) {
  const { state } = useRoadmapProgress();
  const done = state.status === "ready" ? (state.progress.tracks[trackId]?.done ?? 0) : null;
  if (done === null) return <p className="text-xs text-ink-3">{total} items</p>;
  return <ProgressBar done={done} total={total} />;
}

export function RoadmapOverallProgress({ title }: { title: string }) {
  const { state } = useRoadmapProgress();
  if (state.status !== "ready") return null;
  return (
    <ProgressBar
      done={state.progress.done}
      total={state.progress.total}
      label={`${title} progress`}
    />
  );
}
