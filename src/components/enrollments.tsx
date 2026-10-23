"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  enroll as enrollAction,
  getEnrollments,
  unenroll as unenrollAction,
} from "@/server/actions";

type ContextValue = {
  /** False until the first fetch answers. */
  loaded: boolean;
  /** Enrolled roadmap ids; null while loading or when signed out. */
  ids: string[] | null;
  signedIn: boolean;
  isEnrolled: (roadmapId: string) => boolean;
  enroll: (roadmapId: string) => Promise<string | null>;
  unenroll: (roadmapId: string, deleteProgress: boolean) => Promise<string | null>;
  /** Records an enrollment the server made on its own, e.g. after a first tick. */
  markEnrolled: (roadmapId: string) => void;
  /** Bumps when a roadmap's progress was deleted, so progress views reload. */
  resetVersion: number;
};

const EnrollmentsContext = createContext<ContextValue | null>(null);

export function EnrollmentsProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [ids, setIds] = useState<string[] | null>(null);
  const [resetVersion, setResetVersion] = useState(0);

  // Fetch straight away rather than waiting for the session check; the action itself reports a
  // signed-out visitor. Refetch only when the session turns out to be signed out (e.g. sign-out).
  const maybeSignedIn = status !== "unauthenticated";
  useEffect(() => {
    let cancelled = false;
    getEnrollments()
      .then((res) => {
        if (!cancelled) setIds(res.ok ? res.data : null);
      })
      .catch(() => {}) // offline: show everything, as for a signed-out visitor
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [maybeSignedIn]);

  const enroll = useCallback(
    async (roadmapId: string) => {
      const res = await enrollAction(roadmapId);
      if (!res.ok) return res.error.message;
      setIds(res.data);
      router.refresh();
      return null;
    },
    [router],
  );

  const unenroll = useCallback(
    async (roadmapId: string, deleteProgress: boolean) => {
      const res = await unenrollAction(roadmapId, deleteProgress);
      if (!res.ok) return res.error.message;
      setIds(res.data);
      if (deleteProgress) setResetVersion((v) => v + 1);
      router.refresh();
      return null;
    },
    [router],
  );

  const markEnrolled = useCallback((roadmapId: string) => {
    setIds((cur) => (cur && !cur.includes(roadmapId) ? [...cur, roadmapId] : cur));
  }, []);

  const value: ContextValue = {
    loaded,
    ids,
    signedIn: ids !== null,
    isEnrolled: (id) => ids?.includes(id) ?? false,
    enroll,
    unenroll,
    markEnrolled,
    resetVersion,
  };
  return <EnrollmentsContext.Provider value={value}>{children}</EnrollmentsContext.Provider>;
}

export function useEnrollments() {
  const ctx = useContext(EnrollmentsContext);
  if (!ctx) throw new Error("useEnrollments must be used inside EnrollmentsProvider");
  return ctx;
}
