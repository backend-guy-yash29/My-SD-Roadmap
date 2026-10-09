"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

const TIMEZONE_COOKIE = "tz";

/** Stores the browser's timezone in a cookie so a new account starts in the right timezone. */
function TimezoneCookie() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz)
      document.cookie = `${TIMEZONE_COOKIE}=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TimezoneCookie />
      {children}
    </SessionProvider>
  );
}
