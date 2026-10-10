import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 pt-12 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-ink-2">That page doesn&apos;t exist, or it&apos;s private.</p>
      <Link href="/" className="text-accent hover:underline">
        Back to the dashboard
      </Link>
    </div>
  );
}
