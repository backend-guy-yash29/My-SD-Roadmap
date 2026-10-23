import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SettingsNav } from "@/components/settings-nav";

export const metadata: Metadata = { title: { default: "Settings", template: "%s · Settings" } };

/** Settings is a page of its own: no sidebar, just a way back to the app. */
export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/settings");
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-[0.8125rem] text-white">
              MR
            </span>
            My Roadmaps
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-border px-3 py-1.5 text-[0.8125rem] font-medium text-ink-2 hover:border-accent hover:text-accent"
          >
            ← Back to roadmaps
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-[1040px] px-4 pb-20 pt-8 md:px-8">
        <h1 className="text-[1.75rem] font-bold tracking-tight">Settings</h1>
        <p className="mb-6 text-ink-2">Your profile, privacy and how the app looks.</p>
        <div className="md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-8">
          <SettingsNav />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
