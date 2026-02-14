import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryBySlug, getToolBySlug, sortByPremium, categories } from "@/lib/db/tools";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Best MCP Servers for 2025 — Top Model Context Protocol Servers",
  description:
    "The best MCP (Model Context Protocol) servers for 2025. Compare MCP servers for GitHub, Slack, Notion, databases, web search, and more. Hand-picked for developers building AI agents.",
  alternates: { canonical: "/best-mcp-servers-for-2025" },
  openGraph: {
    title: "Best MCP Servers for 2025 — Top Model Context Protocol Servers",
    description:
      "The best MCP servers for 2025. Compare MCP servers for GitHub, Slack, Notion, databases, and more. Hand-picked for developers building AI agents.",
  },
};

export default async function BestMCPServersPage() {
  const category = getCategoryBySlug("best-mcp-servers");
  if (!category) throw new Error("best-mcp-servers category not found");

  const resolvedTools = await Promise.all(
    category.toolSlugs.map((s) => getToolBySlug(s))
  );
  const tools = sortByPremium(
    resolvedTools.filter(
      (t): t is NonNullable<typeof t> => t != null
    )
  );

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hot100ai.dev" },
      { "@type": "ListItem", position: 2, name: "Best MCP Servers for 2025", item: "https://hot100ai.dev/best-mcp-servers-for-2025" },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best MCP Servers for 2025",
    description: "Hand-picked MCP servers for developers building AI agents in 2025.",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: `https://hot100ai.dev/tool/${tool.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Best MCP Servers for 2025</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Best MCP Servers for 2025
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
          Hand-picked Model Context Protocol servers that extend AI agents with real-world capabilities.
          From GitHub and Slack to databases and web search — find the right MCP servers for your stack.
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted">
          <span>{tools.length} MCP servers</span>
          <span className="text-border">&middot;</span>
          <span>Updated February 2025</span>
        </div>
      </div>

      {tools.some((t) => t.featured) && (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-2.5 text-xs text-accent">
          Tools marked &quot;Featured&quot; are sponsored listings. Rankings are based on editorial assessment.
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
        ))}
      </div>

      {/* What is MCP */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-8">
        <h2 className="font-serif text-xl font-medium text-foreground">What is MCP (Model Context Protocol)?</h2>
        <div className="mt-4 space-y-3 text-sm text-foreground/70 leading-relaxed">
          <p>
            The Model Context Protocol (MCP) is an open standard developed by Anthropic that enables AI assistants
            to connect with external data sources and tools. Think of it as a USB port for AI — a standardized way
            for AI agents to interact with the world.
          </p>
          <p>
            MCP servers expose capabilities (tools, resources, prompts) that AI clients like Claude, Cursor, and
            Windsurf can use. This allows AI agents to read files, query databases, send messages, browse the web,
            and much more — all through a secure, standardized protocol.
          </p>
        </div>
      </section>

      {/* Related Categories */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-serif text-xl font-medium text-foreground">More Curated Lists</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((c) => c.slug !== "best-mcp-servers")
            .slice(0, 6)
            .map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group rounded-2xl border border-border bg-card p-4 transition-all hover:bg-card-hover"
              >
                <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-1 text-xs text-muted line-clamp-1">{cat.description}</p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
