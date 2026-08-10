import type { Metadata } from "next";
import Link from "next/link";
import { getAllTools } from "@/lib/db/tools";
import ToolCard from "@/components/ToolCard";
import { BASE_URL } from "@/lib/config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tools = await getAllTools();
  const useCase = slug.replace(/-/g, " ");
  const matching = tools.filter((t) =>
    t.useCases.some((u) => u.toLowerCase() === useCase)
  );

  if (matching.length === 0) {
    return { title: "Use Case Not Found — Hot 100 AI" };
  }

  const title = `${matching.length} Best AI Tools for ${capitalize(useCase)} — Hot 100 AI`;
  const description = `Compare the ${matching.length} best AI tools and MCP servers for ${useCase}. Production-ready ratings, pricing, and compatibility for Claude Code, Cursor, and more.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `${BASE_URL}/use-case/${slug}` },
    alternates: { canonical: `${BASE_URL}/use-case/${slug}` },
  };
}

export async function generateStaticParams() {
  const tools = await getAllTools();
  const slugs = new Set<string>();
  for (const t of tools) {
    for (const uc of t.useCases) {
      slugs.add(uc.toLowerCase().replace(/\s+/g, "-"));
    }
  }
  return [...slugs].map((slug) => ({ slug }));
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  const tools = await getAllTools();
  const useCase = slug.replace(/-/g, " ");
  const matching = tools.filter((t) =>
    t.useCases.some((u) => u.toLowerCase() === useCase)
  );

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Use Cases", item: `${BASE_URL}/search` },
      { "@type": "ListItem", position: 3, name: capitalize(useCase) },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best AI Tools for ${capitalize(useCase)}`,
    description: `${matching.length} AI tools and MCP servers for ${useCase}`,
    url: `${BASE_URL}/use-case/${slug}`,
    numberOfItems: matching.length,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <nav className="mb-6 text-xs text-muted">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{capitalize(useCase)}</span>
      </nav>

      <h1 className="font-serif text-3xl font-medium text-foreground">
        Best AI Tools for {capitalize(useCase)}
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        {matching.length} tools and MCP servers for {useCase}. Compare pricing, compatibility, setup complexity, and production readiness.
      </p>

      {matching.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matching.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted">No tools found for this use case.</p>
      )}

      {/* Related use cases */}
      <RelatedUseCases current={useCase} tools={tools} />
    </div>
  );
}

function RelatedUseCases({ current, tools }: { current: string; tools: Awaited<ReturnType<typeof getAllTools>> }) {
  const related = new Set<string>();
  const matchingTools = tools.filter((t) => t.useCases.some((u) => u.toLowerCase() === current));
  for (const t of matchingTools) {
    for (const uc of t.useCases) {
      if (uc.toLowerCase() !== current) related.add(uc.toLowerCase());
    }
  }

  if (related.size === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="font-serif text-lg font-medium text-foreground">Related Use Cases</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {[...related].slice(0, 12).map((uc) => (
          <Link
            key={uc}
            href={`/use-case/${uc.replace(/\s+/g, "-")}`}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs transition-colors hover:bg-card-hover hover:text-foreground"
          >
            {capitalize(uc)}
          </Link>
        ))}
      </div>
    </section>
  );
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}