import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  getToolBySlug,
  sortByPremium,
  categories,
  comparisons,
} from "@/lib/db/tools";
import ToolCard from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Best AI Agent Frameworks for 2025 — LangChain, CrewAI, AutoGen & More",
  description:
    "Compare the best AI agent frameworks for 2025: LangChain, CrewAI, AutoGen, LangGraph, LlamaIndex, MetaGPT. Build multi-agent systems, RAG apps, and autonomous agents with the right framework.",
  alternates: { canonical: "/best-ai-agent-frameworks" },
  openGraph: {
    title: "Best AI Agent Frameworks for 2025 — LangChain, CrewAI, AutoGen & More",
    description:
      "Compare the best AI agent frameworks for 2025. Build multi-agent systems, RAG apps, and autonomous agents with LangChain, CrewAI, AutoGen, and more.",
  },
};

export default async function BestAIAgentFrameworksPage() {
  const multiAgent = getCategoryBySlug("best-multi-agent-frameworks");
  const llmFrameworks = getCategoryBySlug("best-llm-frameworks");

  const allSlugs = [
    ...(multiAgent?.toolSlugs ?? []),
    ...(llmFrameworks?.toolSlugs ?? []),
  ];
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hot100ai.dev" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Best AI Agent Frameworks",
        item: "https://hot100ai.dev/best-ai-agent-frameworks",
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best AI Agent Frameworks for 2025",
    description: "Hand-picked AI agent and LLM frameworks for building intelligent applications.",
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
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">Best AI Agent Frameworks</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Best AI Agent Frameworks for 2025
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
          Frameworks for building AI agents, multi-agent systems, and LLM-powered applications.
          From general-purpose chains to role-based agent crews — find the right framework for your use case.
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted">
          <span>{tools.length} frameworks</span>
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

      {/* Head-to-Head Comparisons */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-serif text-xl font-medium text-foreground">
          Head-to-Head Comparisons
        </h2>
        <p className="mt-1 text-sm text-muted">
          Detailed side-by-side analysis of popular frameworks
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons
            .filter(
              (c) =>
                uniqueSlugs.includes(c.toolASlug) || uniqueSlugs.includes(c.toolBSlug)
            )
            .slice(0, 6)
            .map((comp) => {
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
                  <p className="mt-1 text-xs text-muted line-clamp-2">{comp.verdict}</p>
                </Link>
              );
            })}
        </div>
      </section>

      {/* Related Categories */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-serif text-xl font-medium text-foreground">
          More Curated Lists
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter(
              (c) =>
                c.slug !== "best-multi-agent-frameworks" &&
                c.slug !== "best-llm-frameworks"
            )
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
