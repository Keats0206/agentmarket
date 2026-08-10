import type { Metadata } from "next";
import Link from "next/link";
import { getAllTools } from "@/lib/db/tools";
import ToolCard from "@/components/ToolCard";
import { BASE_URL } from "@/lib/config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tools = await getAllTools();
  const integration = slug.replace(/-/g, " ");
  const matching = tools.filter((t) =>
    t.integrations.some((i) => i.toLowerCase() === integration)
  );

  if (matching.length === 0) {
    return { title: "Integration Not Found — Hot 100 AI" };
  }

  const title = `${matching.length} AI Tools with ${capitalize(integration)} Integration — Hot 100 AI`;
  const description = `Compare ${matching.length} AI tools and MCP servers that integrate with ${capitalize(integration)}. Production-ready ratings, pricing, and compatibility.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `${BASE_URL}/integration/${slug}` },
    alternates: { canonical: `${BASE_URL}/integration/${slug}` },
  };
}

export async function generateStaticParams() {
  const tools = await getAllTools();
  const slugs = new Set<string>();
  for (const t of tools) {
    for (const int of t.integrations) {
      slugs.add(int.toLowerCase().replace(/\s+/g, "-"));
    }
  }
  return [...slugs].map((slug) => ({ slug }));
}

export default async function IntegrationPage({ params }: Props) {
  const { slug } = await params;
  const tools = await getAllTools();
  const integration = slug.replace(/-/g, " ");
  const matching = tools.filter((t) =>
    t.integrations.some((i) => i.toLowerCase() === integration)
  );

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Integrations", item: `${BASE_URL}/search` },
      { "@type": "ListItem", position: 3, name: capitalize(integration) },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `AI Tools with ${capitalize(integration)} Integration`,
    description: `${matching.length} AI tools and MCP servers integrating with ${capitalize(integration)}`,
    url: `${BASE_URL}/integration/${slug}`,
    numberOfItems: matching.length,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <nav className="mb-6 text-xs text-muted">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{capitalize(integration)} Integration</span>
      </nav>

      <h1 className="font-serif text-3xl font-medium text-foreground">
        AI Tools with {capitalize(integration)} Integration
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        {matching.length} AI tools and MCP servers that integrate with {capitalize(integration)}. Compare features, pricing, and setup complexity.
      </p>

      {matching.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matching.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted">No tools found for this integration.</p>
      )}

      {/* Related integrations */}
      <RelatedIntegrations current={integration} tools={tools} />
    </div>
  );
}

function RelatedIntegrations({ current, tools }: { current: string; tools: Awaited<ReturnType<typeof getAllTools>> }) {
  const related = new Set<string>();
  const matchingTools = tools.filter((t) => t.integrations.some((i) => i.toLowerCase() === current));
  for (const t of matchingTools) {
    for (const int of t.integrations) {
      if (int.toLowerCase() !== current) related.add(int.toLowerCase());
    }
  }

  if (related.size === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="font-serif text-lg font-medium text-foreground">Related Integrations</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {[...related].slice(0, 12).map((int) => (
          <Link
            key={int}
            href={`/integration/${int.replace(/\s+/g, "-")}`}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs transition-colors hover:bg-card-hover hover:text-foreground"
          >
            {capitalize(int)}
          </Link>
        ))}
      </div>
    </section>
  );
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}