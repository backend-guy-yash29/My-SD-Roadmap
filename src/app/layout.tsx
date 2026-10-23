import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { Providers } from "@/components/providers";
import { RoadmapProgressProvider } from "@/components/roadmap-progress";
import { Sidebar } from "@/components/sidebar";
import { THEME_SCRIPT } from "@/components/theme";
import { getNavigation, type Navigation } from "@/server/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains" });

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
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans text-sm leading-normal antialiased">
        <Providers>
          <RoadmapProgressProvider roadmapIds={nav.map((r) => r.id)}>
            <div className="md:grid md:min-h-screen md:grid-cols-[264px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
              <Sidebar nav={nav} />
              <div className="min-w-0">{children}</div>
            </div>
          </RoadmapProgressProvider>
        </Providers>
      </body>
    </html>
  );
}
