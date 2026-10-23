import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Breadcrumbs for the current page; the theme switch lives in the top bar. */
export function PageHeader({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <nav aria-label="Breadcrumb" className="min-w-0 truncate text-[0.8125rem] text-ink-3">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-1.5">/</span>}
            {c.href ? (
              <Link href={c.href} className="hover:text-accent">
                {c.label}
              </Link>
            ) : (
              <span className={i === crumbs.length - 1 ? "font-medium text-ink-2" : ""}>
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}

/** Main column for pages without a right rail. */
export function PageMain({ children, narrow }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <main
      className={`min-w-0 px-4 pb-20 pt-6 md:px-10 md:pt-7 ${narrow ? "max-w-[720px]" : "max-w-[1180px]"}`}
    >
      {children}
    </main>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[14px] border border-border bg-surface p-5 ${className}`}>
      {children}
    </section>
  );
}
