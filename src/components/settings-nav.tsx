"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { clearAppearance } from "./theme";

const LINKS = [
  { href: "/settings", label: "Profile", hint: "Name, username, timezone, privacy" },
  { href: "/settings/appearance", label: "Appearance", hint: "Theme, font, text size, colours" },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Settings sections" className="mb-6 md:mb-0">
      <ul className="flex gap-2 overflow-x-auto md:flex-col md:gap-1">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.href} className="flex-none">
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-accent-soft font-semibold text-accent"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {l.label}
                <span className="hidden text-xs font-normal text-ink-3 md:block">{l.hint}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => {
          clearAppearance();
          signOut({ redirectTo: "/" });
        }}
        className="mt-4 hidden rounded-lg px-3 py-2 text-sm text-ink-3 hover:bg-surface-2 hover:text-danger md:block"
      >
        Sign out
      </button>
    </nav>
  );
}
