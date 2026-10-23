"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getRoadmapProgress, setItemDone, setNeedsRevision } from "@/server/actions";
import { useEnrollments } from "./enrollments";

type Progress = Extract<Awaited<ReturnType<typeof getRoadmapProgress>>, { ok: true }>["data"];

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "error"; message: string }
  | { status: "ready"; progress: Progress };

type ContextValue = {
  roadmapId: string | null;
  state: State;
  isDone: (itemId: string) => boolean;
  hasNote: (itemId: string) => boolean;
  needsRevision: (itemId: string) => boolean;
  toggleRevision: (itemId: string) => Promise<void>;
  trackDone: (trackId: string) => number | null;
  toggleDone: (itemId: string, trackId: string) => Promise<void>;
  markNoted: (itemId: string, noted: boolean) => void;
  /** Bumps whenever a change could affect streaks, so summaries can refetch. */
  version: number;
  error: string | null;
};

const RoadmapProgressContext = createContext<ContextValue | null>(null);

/** Loads the signed-in user's progress for whichever roadmap the URL is in. */
export function RoadmapProgressProvider({
  roadmapIds,
  children,
}: {
  roadmapIds: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const roadmapId = roadmapIds.includes(segment) ? segment : null;
  const [state, setState] = useState<State>({ status: "idle" });
  const [version, setVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { markEnrolled, resetVersion } = useEnrollments();

  useEffect(() => {
    if (!roadmapId) {
      setState({ status: "idle" });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    getRoadmapProgress(roadmapId).then((res) => {
      if (cancelled) return;
      if (res.ok) setState({ status: "ready", progress: res.data });
      else if (res.error.code === "UNAUTHENTICATED") setState({ status: "signed-out" });
      else setState({ status: "error", message: res.error.message });
    });
    return () => {
      cancelled = true;
    };
  }, [roadmapId, resetVersion]);

  const done = useMemo(
    () => new Set(state.status === "ready" ? state.progress.doneItemIds : []),
    [state],
  );
  const noted = useMemo(
    () => new Set(state.status === "ready" ? state.progress.notedItemIds : []),
    [state],
  );
  const revise = useMemo(
    () => new Set(state.status === "ready" ? state.progress.revisionItemIds : []),
    [state],
  );

  const setRevision = useCallback((itemId: string, value: boolean) => {
    setState((s) => {
      if (s.status !== "ready") return s;
      const ids = s.progress.revisionItemIds.filter((i) => i !== itemId);
      return {
        status: "ready",
        progress: { ...s.progress, revisionItemIds: value ? [...ids, itemId] : ids },
      };
    });
  }, []);

  const toggleRevision = useCallback(
    async (itemId: string) => {
      const next = !revise.has(itemId);
      setRevision(itemId, next); // optimistic
      setError(null);
      const res = await setNeedsRevision(itemId, next);
      if (!res.ok) {
        setRevision(itemId, !next);
        setError(res.error.message);
      }
    },
    [revise, setRevision],
  );

  const apply = useCallback((itemId: string, trackId: string, value: boolean) => {
    setState((s) => {
      if (s.status !== "ready") return s;
      const was = s.progress.doneItemIds.includes(itemId);
      if (was === value) return s;
      const delta = value ? 1 : -1;
      const track = s.progress.tracks[trackId];
      return {
        status: "ready",
        progress: {
          ...s.progress,
          doneItemIds: value
            ? [...s.progress.doneItemIds, itemId]
            : s.progress.doneItemIds.filter((i) => i !== itemId),
          done: s.progress.done + delta,
          tracks: track
            ? { ...s.progress.tracks, [trackId]: { ...track, done: track.done + delta } }
            : s.progress.tracks,
        },
      };
    });
  }, []);

  const toggleDone = useCallback(
    async (itemId: string, trackId: string) => {
      const next = !done.has(itemId);
      apply(itemId, trackId, next); // optimistic
      setError(null);
      const res = await setItemDone(itemId, next);
      if (res.ok) {
        setVersion((v) => v + 1);
        if (next && roadmapId) markEnrolled(roadmapId);
      } else {
        apply(itemId, trackId, !next);
        setError(res.error.message);
      }
    },
    [apply, done, markEnrolled, roadmapId],
  );

  const markNoted = useCallback((itemId: string, value: boolean) => {
    setState((s) => {
      if (s.status !== "ready") return s;
      const ids = s.progress.notedItemIds.filter((i) => i !== itemId);
      return {
        status: "ready",
        progress: { ...s.progress, notedItemIds: value ? [...ids, itemId] : ids },
      };
    });
  }, []);

  const value: ContextValue = {
    roadmapId,
    state,
    isDone: (id) => done.has(id),
    hasNote: (id) => noted.has(id),
    needsRevision: (id) => revise.has(id),
    toggleRevision,
    trackDone: (id) => (state.status === "ready" ? (state.progress.tracks[id]?.done ?? 0) : null),
    toggleDone,
    markNoted,
    version,
    error,
  };
  return (
    <RoadmapProgressContext.Provider value={value}>{children}</RoadmapProgressContext.Provider>
  );
}

export function useRoadmapProgress() {
  const ctx = useContext(RoadmapProgressContext);
  if (!ctx) throw new Error("useRoadmapProgress must be used inside RoadmapProgressProvider");
  return ctx;
}
