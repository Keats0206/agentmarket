import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { tools, getToolBySlug, formatStars, comparisons, categories } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: `${tool.name} — ${tool.shortDescription}`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} — AgentIndex`,
      description: tool.shortDescription,
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const relatedComparisons = comparisons.filter(
    (c) => c.toolASlug === slug || c.toolBSlug === slug
  );

  const relatedCategories = categories.filter((c) => c.toolSlugs.includes(slug));

  const similarTools = tools
    .filter((t) => t.slug !== slug && t.category === tool.category)
    .slice(0, 4);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.websiteUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: tool.pricingModel === "Free" || tool.pricingModel === "Open Source" ? "0" : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    ...(tool.githubStars && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Math.min(5, 3 + (tool.githubStars / 50000) * 2).toFixed(1),
        bestRating: "5",
        ratingCount: tool.githubStars,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/search?q=${tool.category}`} className="hover:text-foreground transition-colors">{CATEGORY_LABELS[tool.category]}s</Link>
        <span>/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-card border border-border text-2xl font-semibold font-serif text-foreground">
            {tool.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">{tool.name}</h1>
              {tool.featured && (
                <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-[10px] font-medium text-accent uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{tool.shortDescription}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[tool.category]}`}>
                {CATEGORY_LABELS[tool.category]}
              </span>
              <span className="rounded-full bg-card border border-border px-2.5 py-0.5 text-xs text-muted font-medium">
                {tool.pricingModel}
              </span>
              {tool.pricing && (
                <span className="text-xs text-muted">{tool.pricing}</span>
              )}
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                tool.maturity === "Mature"
                  ? "bg-emerald-100/70 text-emerald-700"
                  : tool.maturity === "Growing"
                  ? "bg-blue-100/70 text-blue-700"
                  : "bg-amber-100/70 text-amber-700"
              }`}>
                {tool.maturity}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 gap-2">
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Visit Website
          </a>
          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-card"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {tool.githubStars && formatStars(tool.githubStars)}
            </a>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">About</h2>
            <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{tool.description}</p>
          </section>

          {/* Pros & Cons */}
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl bg-[#D9E8DC] border border-[#C5D8C9] p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Strengths</h2>
              <ul className="mt-3 space-y-2">
                {tool.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2 text-sm text-foreground/80">
                    <svg className="mt-0.5 shrink-0 text-emerald-700" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl bg-[#EADAD7] border border-[#D8C8C4] p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-red-800">Limitations</h2>
              <ul className="mt-3 space-y-2">
                {tool.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-sm text-foreground/80">
                    <svg className="mt-0.5 shrink-0 text-red-700" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    {con}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Use Cases */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Use Cases</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tool.useCases.map((uc) => (
                <span key={uc} className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground/80">
                  {uc}
                </span>
              ))}
            </div>
          </section>

          {/* Integrations */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Integrations</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tool.integrations.map((int) => (
                <span key={int} className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground/70 font-mono">
                  {int}
                </span>
              ))}
            </div>
          </section>

          {/* Related Comparisons */}
          {relatedComparisons.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Comparisons</h2>
              <div className="mt-3 space-y-2">
                {relatedComparisons.map((comp) => {
                  const other = comp.toolASlug === slug ? comp.toolBSlug : comp.toolASlug;
                  const otherTool = tools.find((t) => t.slug === other);
                  return (
                    <Link
                      key={comp.slug}
                      href={`/compare/${comp.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:bg-card-hover"
                    >
                      <span className="text-sm font-medium text-foreground">{tool.name}</span>
                      <span className="text-xs font-bold text-muted">VS</span>
                      <span className="text-sm font-medium text-foreground">{otherTool?.name}</span>
                      <svg className="ml-auto text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Quick Facts */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Quick Facts</h3>
            <dl className="mt-4 space-y-3">
              <div className="flex justify-between">
                <dt className="text-xs text-muted">Category</dt>
                <dd className="text-xs font-medium text-foreground">{CATEGORY_LABELS[tool.category]}</dd>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <dt className="text-xs text-muted">Setup Complexity</dt>
                <dd className={`text-xs font-medium ${
                  tool.setupComplexity === "Low" ? "text-emerald-700" :
                  tool.setupComplexity === "Medium" ? "text-amber-700" :
                  "text-red-700"
                }`}>{tool.setupComplexity}</dd>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <dt className="text-xs text-muted">Maturity</dt>
                <dd className="text-xs font-medium text-foreground">{tool.maturity}</dd>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <dt className="text-xs text-muted">Pricing</dt>
                <dd className="text-xs font-medium text-foreground">{tool.pricingModel}</dd>
              </div>
              {tool.githubStars && (
                <>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between">
                    <dt className="text-xs text-muted">GitHub Stars</dt>
                    <dd className="text-xs font-medium text-foreground">{formatStars(tool.githubStars)}</dd>
                  </div>
                </>
              )}
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <dt className="text-xs text-muted">Last Updated</dt>
                <dd className="text-xs font-medium text-foreground">{tool.lastUpdated}</dd>
              </div>
            </dl>
          </section>

          {/* Links */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Links</h3>
            <div className="mt-3 space-y-2">
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                Website
              </a>
              {tool.githubUrl && (
                <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </a>
              )}
              {tool.docsUrl && (
                <a href={tool.docsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  Documentation
                </a>
              )}
            </div>
          </section>

          {/* In Categories */}
          {relatedCategories.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Appears In</h3>
              <div className="mt-3 space-y-2">
                {relatedCategories.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="block text-sm text-accent hover:text-accent-hover transition-colors">
                    {cat.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Similar Tools */}
          {similarTools.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Similar Tools</h3>
              <div className="mt-3 space-y-2">
                {similarTools.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tool/${t.slug}`}
                    className="flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-card-hover"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background border border-border text-xs font-semibold font-serif text-foreground">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{t.name}</div>
                      <div className="text-[10px] text-muted truncate">{t.shortDescription}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
