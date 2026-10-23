import Link from "next/link";
import { PageMain } from "@/components/page-header";

export default function NotFound() {
  return (
    <PageMain narrow>
      <div className="mt-16 rounded-2xl border border-border bg-surface px-6 py-10 text-center shadow-card">
        <p className="font-mono text-xs text-accent">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Not found</h1>
        <p className="mt-1 text-ink-2">That page doesn&apos;t exist, or it&apos;s private.</p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-accent-ink"
        >
          Back to the dashboard
        </Link>
      </div>
    </PageMain>
  );
}
