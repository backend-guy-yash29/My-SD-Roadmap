import type { Metadata } from "next";
import {
  Atkinson_Hyperlegible,
  Geist,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
} from "next/font/google";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { EnrollmentsProvider } from "@/components/enrollments";
import { Providers } from "@/components/providers";
import { RoadmapProgressProvider } from "@/components/roadmap-progress";
import { Sidebar } from "@/components/sidebar";
import { APPEARANCE_SCRIPT, appearanceCss } from "@/lib/appearance";
import { getNavigation, type Navigation } from "@/server/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains" });
// Fonts users can pick in Settings. Not preloaded: a browser only downloads the one in use.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", preload: false });
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  preload: false,
});
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", preload: false });
const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  preload: false,
});
const fontVariables = [inter, mono, geist, plex, serif, atkinson].map((f) => f.variable).join(" ");
const APPEARANCE_CSS = appearanceCss();

export const metadata: Metadata = {
  title: { default: "My Roadmaps", template: "%s · My Roadmaps" },
  description: "Structured study roadmaps for system design, ML and AI, with progress tracking.",
};

const cachedNavigation = unstable_cache(() => getNavigation(db), ["navigation"], {
  revalidate: 300,
});

/** The sidebar's roadmap tree. Empty when the database is unreachable (e.g. a CI build), so pages still render. */
async function loadNavigation(): Promise<Navigation> {
  try {
    return await cachedNavigation();
  } catch {
    return [];
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = await loadNavigation();
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: APPEARANCE_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans text-sm leading-normal antialiased">
        <Providers>
          <EnrollmentsProvider>
            <RoadmapProgressProvider roadmapIds={nav.map((r) => r.id)}>
              <div className="md:grid md:min-h-screen md:grid-cols-[264px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
                <Sidebar nav={nav} />
                <div className="min-w-0">{children}</div>
              </div>
            </RoadmapProgressProvider>
          </EnrollmentsProvider>
        </Providers>
      </body>
    </html>
  );
}
