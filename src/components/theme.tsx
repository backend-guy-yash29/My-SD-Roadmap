"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dim";
const STORAGE_KEY = "theme";

/** Runs before first paint: applies the saved theme, or Semi-dark if the device prefers dark. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dim")t=matchMedia("(prefers-color-scheme: dark)").matches?"dim":"light";document.documentElement.dataset.theme=t}catch(e){}})()`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dim" ? "dim" : "light");
  }, []);

  function choose(next: Theme) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the choice still applies to this page.
    }
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex rounded-full border border-border bg-surface p-[3px]"
    >
      {(
        [
          ["light", "Light"],
          ["dim", "Semi-dark"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          onClick={() => choose(value)}
          className="rounded-full px-3 py-1 text-xs font-medium text-ink-2 aria-pressed:bg-ink aria-pressed:text-surface"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
