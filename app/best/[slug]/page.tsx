import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getListicleBySlug,
  getCategoryBySlug,
  getToolBySlug,
  sortByPremium,
  listicles,
  comparisons,
} from "@/lib/db/tools";
import ToolCard from "@/components/ToolCard";
import { BASE_URL } from "@/lib/config";

export async function generateStaticParams() {
  return listicles.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listicle = getListicleBySlug(slug);
  if (!listicle) return { title: "List Not Found" };
  return {
    title: listicle.seoTitle,
    description: listicle.seoDescription,
    alternates: { canonical: `/best/${slug}` },
    openGraph: {
      title: listicle.seoTitle,
      description: listicle.seoDescription,
    },
  };
}

export default async function BestListiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listicle = getListicleBySlug(slug);
  if (!listicle) notFound();

  const allSlugs: string[] = [];
  for (const catSlug of listicle.categorySlugs) {
    const cat = getCategoryBySlug(catSlug);
    if (cat) allSlugs.push(...cat.toolSlugs);
  }
  const uniqueSlugs = [...new Set(allSlugs)];

  const resolvedTools = await Promise.all(
    uniqueSlugs.map((s) => getToolBySlug(s))
  );
  const tools = sortByPremium(
    resolvedTools.filter((t): t is NonNullable<typeof t> => t != null)
  );

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: listicle.title,
        item: `${BASE_URL}/best/${slug}`,
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listicle.title,
    description: listicle.description,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `${BASE_URL}/tool/${tool.slug}`,
    })),
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: listicle.title,
    description: listicle.description,
    url: `${BASE_URL}/best/${slug}`,
    datePublished: listicle.datePublished ?? "2025-01-01",
    dateModified: listicle.dateModified ?? "2025-02-01",
    author: { "@type": "Organization" as const, name: "Hot 100 AI" },
    mainEntity: itemListLd,
  };

  const faqLd =
    listicle.customSection &&
    /^what is/i.test(listicle.customSection.title.trim())
      ? {
          "@context": "https://schema.org" as const,
          "@type": "FAQPage" as const,
          mainEntity: [
            {
              "@type": "Question" as const,
              name: listicle.customSection.title,
              acceptedAnswer: {
                "@type": "Answer" as const,
                text: listicle.customSection.body.replace(/\n\n/g, " ").trim(),
              },
            },
          ],
        }
      : null;

  const relevantComparisons = comparisons
    .filter(
      (c) =>
        uniqueSlugs.includes(c.toolASlug) || uniqueSlugs.includes(c.toolBSlug)
    )
    .slice(0, 6);

  const otherListicles = listicles.filter((l) => l.slug !== slug).slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">{listicle.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          {listicle.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
          {listicle.description}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted">
          <span>{tools.length} tools</span>
          <span className="text-border">&middot;</span>
          <span>Updated February 2025</span>
        </div>
      </div>

      {tools.some((t) => t.featured) && (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-2.5 text-xs text-accent">
          Tools marked &quot;Featured&quot; are sponsored listings. Rankings
          are based on editorial assessment.
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
        ))}
      </div>

      {/* Optional custom section (e.g. What is MCP?) */}
      {listicle.customSection && (
        <section className="mt-16 rounded-2xl border border-border bg-card p-8">
          <h2 className="font-serif text-xl font-medium text-foreground">
            {listicle.customSection.title}
          </h2>
          <div className="mt-4 space-y-3 text-sm text-foreground/70 leading-relaxed">
            {listicle.customSection.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* Head-to-Head Comparisons */}
      {relevantComparisons.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-serif text-xl font-medium text-foreground">
            Head-to-Head Comparisons
          </h2>
          <p className="mt-1 text-sm text-muted">
            Detailed side-by-side analysis of popular tools
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relevantComparisons.map((comp) => {
              const title = comp.seoTitle.split(" (")[0] ?? comp.seoTitle;
              return (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="group rounded-2xl border border-border bg-card p-4 transition-all hover:bg-card-hover"
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2">
                    {comp.verdict}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* More Curated Lists */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-serif text-xl font-medium text-foreground">
          More Curated Lists
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherListicles.map((l) => (
            <Link
              key={l.slug}
              href={`/best/${l.slug}`}
              className="group rounded-2xl border border-border bg-card p-4 transition-all hover:bg-card-hover"
            >
              <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                {l.title}
              </h3>
              <p className="mt-1 text-xs text-muted line-clamp-1">
                {l.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
