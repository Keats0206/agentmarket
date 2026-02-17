import Link from "next/link";
import type { Metadata } from "next";
import { mcpPlatforms, getAllTools } from "@/lib/db/tools";
import ToolCard from "@/components/ToolCard";
import { BASE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "MCP Server Directory — Find the Best Model Context Protocol Servers",
  description:
    "The most comprehensive directory of MCP (Model Context Protocol) servers. Browse by platform, use case, and integration. Find MCP servers for GitHub, Slack, Notion, databases, and more.",
  alternates: { canonical: "/mcp-servers" },
};

const MCP_FAQ_ANSWER =
  "The Model Context Protocol (MCP) is an open standard developed by Anthropic that enables AI assistants to connect with external data sources and tools. Think of it as a USB port for AI — a standardized way for AI agents to interact with the world. MCP servers expose capabilities (tools, resources, prompts) that AI clients like Claude, Cursor, and Windsurf can use. This allows AI agents to read files, query databases, send messages, browse the web, and much more — all through a secure, standardized protocol. The ecosystem is growing rapidly, with servers available for GitHub, Slack, Notion, PostgreSQL, web browsing, and dozens of other platforms and services.";

export default async function MCPServersPage() {
  const tools = await getAllTools();
  const allMCPServers = tools.filter((t) => t.category === "mcp-server");

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "MCP Server Directory — Find the Best Model Context Protocol Servers",
    description:
      "The most comprehensive directory of MCP (Model Context Protocol) servers. Browse by platform, use case, and integration.",
    url: `${BASE_URL}/mcp-servers`,
    mainEntity: {
      "@type": "ItemList",
      name: "MCP Servers",
      numberOfItems: allMCPServers.length,
      itemListElement: allMCPServers.slice(0, 50).map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.name,
        url: `${BASE_URL}/tool/${tool.slug}`,
      })),
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is MCP (Model Context Protocol)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: MCP_FAQ_ANSWER,
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">MCP Servers</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">MCP Server Directory</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
          The most comprehensive directory of Model Context Protocol (MCP) servers.
          MCP enables AI agents to interact with external tools and services through a standardized protocol.
          Browse by platform or use case.
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted">
          <span>{allMCPServers.length} MCP servers indexed</span>
          <span className="text-border">&middot;</span>
          <span>{mcpPlatforms.length} categories</span>
        </div>
      </div>

      {/* Platform Categories — sage green section */}
      <section aria-label="Browse by platform" className="rounded-2xl bg-[#D9E8DC] border border-[#C5D8C9] p-6 mb-12">
        <h2 className="sr-only">Browse by Platform</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mcpPlatforms.map((platform) => (
            <Link
              key={platform.slug}
              href={`/mcp-servers/${platform.slug}`}
              className="group rounded-xl bg-white/60 border border-[#C5D8C9]/50 p-4 transition-all hover:bg-white/80 hover:shadow-sm"
            >
              <h3 className="font-semibold text-foreground group-hover:text-emerald-800 transition-colors">
                {platform.name}
              </h3>
              <p className="mt-1 text-xs text-[#5A6E5D] line-clamp-2">{platform.description}</p>
              <div className="mt-2 flex items-center gap-2 text-xs font-medium text-emerald-800">
                <span>{platform.toolSlugs.length} {platform.toolSlugs.length === 1 ? "server" : "servers"}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All MCP Servers */}
      <section>
        <h2 className="font-serif text-xl font-medium text-foreground">All MCP Servers</h2>
        <p className="mt-1 text-sm text-muted">Complete list of indexed MCP servers</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {allMCPServers.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
          ))}
        </div>
      </section>

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
          <p>
            The ecosystem is growing rapidly, with servers available for GitHub, Slack, Notion, PostgreSQL,
            web browsing, and dozens of other platforms and services.
          </p>
        </div>
      </section>
    </div>
  );
}
