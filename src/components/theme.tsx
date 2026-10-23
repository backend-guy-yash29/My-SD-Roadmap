"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DEFAULT_APPEARANCE, readAppearance, type Appearance } from "@/lib/appearance";
import { getAppearance, updateAppearance } from "@/server/actions";

declare global {
  interface Window {
    /** Defined by APPEARANCE_SCRIPT before first paint. */
    __applyAppearance?: (a: Appearance) => void;
  }
}

const STORAGE_KEY = "appearance";

/** The appearance saved on this device, including the Light/Dark choice from before settings existed. */
export function storedAppearance(): Appearance {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return readAppearance(JSON.parse(saved));
    const legacy = localStorage.getItem("theme");
    if (legacy === "dim" || legacy === "light")
      return { ...DEFAULT_APPEARANCE, mode: legacy === "dim" ? "dark" : "light" };
  } catch {
    // Unreadable storage: fall through to the defaults.
  }
  return DEFAULT_APPEARANCE;
}

// Counts changes made on this page, so a slower account fetch never overwrites a newer choice.
let changes = 0;

/** Applies an appearance to the page and remembers it on this device. */
export function applyAppearance(a: Appearance) {
  changes++;
  window.__applyAppearance?.(a);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    localStorage.removeItem("theme");
  } catch {
    // Storage can be unavailable (private mode); the choice still applies to this page.
  }
}

/** Forgets this device's appearance and shows the default look, e.g. on sign-out. */
export function clearAppearance() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("theme");
  } catch {
    // Nothing stored, or storage unavailable.
  }
  window.__applyAppearance?.(DEFAULT_APPEARANCE);
}

/**
 * Signed in: applies the account's appearance (a device choice from before accounts had one is
 * saved to the account instead). Signed out: appearance options belong to accounts, so the
 * default look is shown.
 */
export function AppearanceSync() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      if (JSON.stringify(storedAppearance()) !== JSON.stringify(DEFAULT_APPEARANCE))
        clearAppearance();
      return;
    }
    if (status !== "authenticated") return;
    let cancelled = false;
    const before = changes;
    getAppearance().then((res) => {
      if (cancelled || !res.ok || changes !== before) return;
      const local = storedAppearance();
      const same = (x: Appearance, y: Appearance) => JSON.stringify(x) === JSON.stringify(y);
      if (same(res.data, DEFAULT_APPEARANCE) && !same(local, DEFAULT_APPEARANCE))
        updateAppearance(local);
      else if (!same(res.data, local)) applyAppearance(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [status]);
  return null;
}

/** The Light/Dark mode currently on the page, following changes from anywhere. */
function useResolvedMode() {
  const [mode, setMode] = useState<"light" | "dim" | null>(null);
  useEffect(() => {
    const html = document.documentElement;
    const read = () => setMode(html.dataset.theme === "dim" ? "dim" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return mode;
}

/** Quick Light/Dark switch for signed-in users; saved to their account like the rest of Appearance. */
export function ThemeToggle() {
  const { status } = useSession();
  const mode = useResolvedMode();
  if (status !== "authenticated") return null;

  function choose(next: "light" | "dark") {
    const a = { ...storedAppearance(), mode: next };
    applyAppearance(a);
    if (status === "authenticated") updateAppearance(a);
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex rounded-full border border-border bg-surface p-[3px]"
    >
      {(
        [
          ["light", "light", "Light"],
          ["dark", "dim", "Dark"],
        ] as const
      ).map(([value, resolved, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={mode === resolved}
          onClick={() => choose(value)}
          className="rounded-full px-3 py-1 text-xs font-medium text-ink-2 aria-pressed:bg-ink aria-pressed:text-surface"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
