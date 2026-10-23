import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { PageHeader, PageMain } from "@/components/page-header";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

/** Only allow same-site relative redirects after sign-in. */
const safePath = (url?: string) =>
  url && url.startsWith("/") && !url.startsWith("//") ? url : "/";

export default async function SignInPage({ searchParams }: Props) {
  const redirectTo = safePath((await searchParams).callbackUrl);
  if (await auth()) redirect(redirectTo);

  const providers = [{ id: "google", label: "Continue with Google" }];
  return (
    <PageMain narrow>
      <PageHeader crumbs={[{ label: "Dashboard", href: "/" }, { label: "Sign in" }]} />
      <div className="hero-glow mx-auto mt-14 max-w-[420px] rounded-2xl border border-border bg-surface px-7 py-8 shadow-card">
        <div className="relative text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 font-bold text-white">
            MR
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Sign in to My Roadmaps</h1>
          <p className="mt-1 text-ink-2">Track your progress, keep notes and build a streak.</p>
        </div>
        <div className="relative mt-6 space-y-3">
          {providers.map((p) => (
            <form
              key={p.id}
              action={async () => {
                "use server";
                await signIn(p.id, { redirectTo });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-border bg-surface px-4 py-2.5 font-semibold hover:border-accent hover:bg-surface-2"
              >
                <svg aria-hidden viewBox="0 0 48 48" className="h-[18px] w-[18px]">
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
                  />
                </svg>
                {p.label}
              </button>
            </form>
          ))}
        </div>
        <p className="relative mt-5 text-center text-xs text-ink-3">
          We only use your name, email and avatar. No passwords are stored.
        </p>
      </div>
    </PageMain>
  );
}
