import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { comparisons, getComparisonBySlug, getToolBySlug } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";

export async function generateStaticParams() {
  return comparisons.map((comp) => ({ slug: comp.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return { title: "Comparison Not Found" };
  return {
    title: comparison.seoTitle,
    description: comparison.seoDescription,
    openGraph: {
      title: comparison.seoTitle,
      description: comparison.seoDescription,
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) notFound();

  const toolA = getToolBySlug(comparison.toolASlug);
  const toolB = getToolBySlug(comparison.toolBSlug);
  if (!toolA || !toolB) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Compare</span>
        <span>/</span>
        <span className="text-foreground">{toolA.name} vs {toolB.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          {toolA.name} <span className="text-muted">vs</span> {toolB.name}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted leading-relaxed">
          A detailed comparison to help you choose the right tool for your use case.
        </p>
      </div>

      {/* Tool Cards Side by Side */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[toolA, toolB].map((tool) => (
          <div key={tool.slug} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border text-xl font-semibold font-serif text-foreground">
                {tool.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{tool.name}</h2>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[tool.category]}`}>
                  {CATEGORY_LABELS[tool.category]}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">{tool.shortDescription}</p>
            <div className="mt-4 flex items-center gap-3">
              <Link href={`/tool/${tool.slug}`} className="text-xs text-accent hover:text-accent-hover transition-colors">
                View full profile →
              </Link>
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted hover:text-foreground transition-colors">
                Website ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-10 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-3 border-b border-border bg-card-hover">
          <div className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Feature</div>
          <div className="px-5 py-3 text-xs font-semibold text-foreground text-center">{toolA.name}</div>
          <div className="px-5 py-3 text-xs font-semibold text-foreground text-center">{toolB.name}</div>
        </div>
        {comparison.features.map((feature, i) => (
          <div
            key={feature.name}
            className={`grid grid-cols-3 ${i < comparison.features.length - 1 ? "border-b border-border" : ""} ${i % 2 === 0 ? "bg-card" : "bg-background/50"}`}
          >
            <div className="px-5 py-3.5 text-sm font-medium text-foreground">{feature.name}</div>
            <div className="px-5 py-3.5 text-sm text-foreground/70 text-center">{feature.toolA}</div>
            <div className="px-5 py-3.5 text-sm text-foreground/70 text-center">{feature.toolB}</div>
          </div>
        ))}
      </div>

      {/* Pros & Cons Side by Side */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[toolA, toolB].map((tool) => (
          <div key={tool.slug} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold text-foreground">{tool.name}</h3>
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Strengths</h4>
              <ul className="mt-2 space-y-1.5">
                {tool.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-xs text-foreground/70">
                    <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-red-700">Limitations</h4>
              <ul className="mt-2 space-y-1.5">
                {tool.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-xs text-foreground/70">
                    <svg className="mt-0.5 shrink-0 text-red-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <section className="mt-8 rounded-2xl bg-[#E8DDD4] border border-[#D8CCBE] p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-accent">Verdict</h2>
        <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{comparison.verdict}</p>
      </section>

      {/* Other Comparisons */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-serif text-xl font-medium text-foreground">More Comparisons</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons
            .filter((c) => c.slug !== slug)
            .map((comp) => {
              const a = getToolBySlug(comp.toolASlug);
              const b = getToolBySlug(comp.toolBSlug);
              if (!a || !b) return null;
              return (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="group rounded-2xl border border-border bg-card p-4 transition-all hover:bg-card-hover"
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {a.name} vs {b.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2">{comp.verdict}</p>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
