import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { EnrollmentsProvider } from "@/components/enrollments";
import { RoadmapProgressProvider } from "@/components/roadmap-progress";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { getNavigation, type Navigation } from "@/server/content";

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

/** The main app: sidebar plus page. Settings has its own layout without the sidebar. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const nav = await loadNavigation();
  return (
    <EnrollmentsProvider>
      <RoadmapProgressProvider roadmapIds={nav.map((r) => r.id)}>
        <div className="md:grid md:min-h-screen md:grid-cols-[264px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
          <Sidebar nav={nav} />
          <div className="min-w-0">
            <TopNav nav={nav} />
            {children}
          </div>
        </div>
      </RoadmapProgressProvider>
    </EnrollmentsProvider>
  );
}
