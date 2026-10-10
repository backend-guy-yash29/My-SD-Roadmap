import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

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
    <div className="mx-auto max-w-sm space-y-6 pt-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-ink-2">Track your progress, keep notes and build a streak.</p>
      </div>
      <div className="space-y-3">
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
              className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:border-accent"
            >
              {p.label}
            </button>
          </form>
        ))}
      </div>
      <p className="text-center text-xs text-ink-3">
        We only use your name, email and avatar. No passwords are stored.
      </p>
    </div>
  );
}
