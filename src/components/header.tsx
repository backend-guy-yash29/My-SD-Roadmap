"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          My Roadmaps
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {status === "authenticated" && session.user ? (
            <>
              <Link href="/settings" className="flex items-center gap-2 text-ink-2 hover:text-ink">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="" className="h-7 w-7 rounded-full" />
                ) : null}
                <span className="hidden sm:inline">{session.user.name ?? "Settings"}</span>
              </Link>
              <button
                type="button"
                onClick={() => signOut({ redirectTo: "/" })}
                className="rounded-md px-2 py-1 text-ink-2 hover:bg-surface-2 hover:text-ink"
              >
                Sign out
              </button>
            </>
          ) : status === "unauthenticated" ? (
            <Link
              href="/sign-in"
              className="rounded-md bg-accent px-3 py-1.5 font-medium text-accent-ink"
            >
              Sign in
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
