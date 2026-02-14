import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { tools, categories, comparisons, stats, getFeaturedTools } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_COLORS, type ToolCategory } from "@/lib/types";

export default function Home() {
  const featured = getFeaturedTools();
  const categoryGroups: { category: ToolCategory; count: number }[] = [
    { category: "agent", count: tools.filter((t) => t.category === "agent").length },
    { category: "mcp-server", count: tools.filter((t) => t.category === "mcp-server").length },
    { category: "framework", count: tools.filter((t) => t.category === "framework").length },
    { category: "infra", count: tools.filter((t) => t.category === "infra").length },
    { category: "platform", count: tools.filter((t) => t.category === "platform").length },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-medium text-muted">
              {stats.totalTools} tools indexed &middot; Updated daily
            </span>
          </div>

          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15]">
            The canonical index of AI agents, MCP servers & agentic tools
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted leading-relaxed">
            Discover, compare, and choose the right tools for your AI stack.
            Built by developers, for developers.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar size="lg" />
          </div>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
            <span>Popular:</span>
            <Link href="/search?q=mcp+server" className="rounded-full border border-border bg-card px-3 py-1 transition-colors hover:bg-card-hover hover:text-foreground">MCP Servers</Link>
            <Link href="/search?q=code+review" className="rounded-full border border-border bg-card px-3 py-1 transition-colors hover:bg-card-hover hover:text-foreground">Code Review</Link>
            <Link href="/compare/langchain-vs-llamaindex" className="rounded-full border border-border bg-card px-3 py-1 transition-colors hover:bg-card-hover hover:text-foreground">LangChain vs LlamaIndex</Link>
            <Link href="/search?q=vector+database" className="rounded-full border border-border bg-card px-3 py-1 transition-colors hover:bg-card-hover hover:text-foreground">Vector DBs</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-4xl items-center justify-around px-4 py-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-serif font-semibold text-foreground">{stats.totalTools}+</div>
            <div className="text-xs text-muted">Tools Indexed</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-serif font-semibold text-foreground">{stats.totalMCPServers}</div>
            <div className="text-xs text-muted">MCP Servers</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-serif font-semibold text-foreground">{stats.totalCategories}</div>
            <div className="text-xs text-muted">Categories</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-serif font-semibold text-foreground">{stats.totalComparisons}</div>
            <div className="text-xs text-muted">Comparisons</div>
          </div>
        </div>
      </section>

      {/* Browse by Type */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-medium text-foreground">Browse by Type</h2>
        <p className="mt-1.5 text-sm text-muted">Explore the AI agent ecosystem by category</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categoryGroups.map(({ category, count }) => (
            <Link
              key={category}
              href={`/search?q=${category}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-card-hover hover:shadow-sm"
            >
              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[category]}`}>
                {CATEGORY_LABELS[category]}
              </span>
              <span className="text-xs text-muted">{count} tools</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-medium text-foreground">Featured Tools</h2>
              <p className="mt-1.5 text-sm text-muted">Highlighted by the AgentIndex team</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Category Pages — Anthropic-style colored sections */}
      <section className="rounded-3xl mx-4 sm:mx-6 lg:mx-8" style={{ background: "var(--section-green-bg)", borderColor: "var(--section-green-border)", borderWidth: 1, borderStyle: "solid" }}>
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <h2 className="font-serif text-2xl font-medium text-foreground">Curated Lists</h2>
          <p className="mt-1.5 text-sm" style={{ color: "var(--section-green-muted)" }}>Hand-picked categories optimized for developer discovery</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group rounded-2xl bg-white/60 p-5 transition-all hover:bg-white/80 hover:shadow-sm"
                style={{ borderColor: "color-mix(in srgb, var(--section-green-border) 50%, transparent)", borderWidth: 1, borderStyle: "solid" }}
              >
                <h3 className="font-semibold text-foreground group-hover:text-emerald-800 transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-1.5 text-xs line-clamp-2" style={{ color: "var(--section-green-muted)" }}>{cat.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-800">
                  <span>{cat.toolSlugs.length} tools</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparisons — lavender section */}
      <section className="rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6" style={{ background: "var(--section-lavender-bg)", borderColor: "var(--section-lavender-border)", borderWidth: 1, borderStyle: "solid" }}>
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
          <h2 className="font-serif text-2xl font-medium text-foreground">Head-to-Head Comparisons</h2>
          <p className="mt-1.5 text-sm" style={{ color: "var(--section-lavender-muted)" }}>Detailed side-by-side analysis of popular tools</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((comp) => {
              const toolA = tools.find((t) => t.slug === comp.toolASlug);
              const toolB = tools.find((t) => t.slug === comp.toolBSlug);
              if (!toolA || !toolB) return null;
              return (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="group rounded-2xl bg-white/60 p-5 transition-all hover:bg-white/80 hover:shadow-sm"
                  style={{ borderColor: "color-mix(in srgb, var(--section-lavender-border) 50%, transparent)", borderWidth: 1, borderStyle: "solid" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold font-serif text-foreground" style={{ background: "var(--section-lavender-bg)", borderColor: "var(--section-lavender-border)", borderWidth: 1, borderStyle: "solid" }}>
                      {toolA.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold" style={{ color: "var(--section-lavender-accent)" }}>VS</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold font-serif text-foreground" style={{ background: "var(--section-lavender-bg)", borderColor: "var(--section-lavender-border)", borderWidth: 1, borderStyle: "solid" }}>
                      {toolB.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-violet-800 transition-colors">
                    {toolA.name} vs {toolB.name}
                  </h3>
                  <p className="mt-1 text-xs line-clamp-2" style={{ color: "var(--section-lavender-muted)" }}>{comp.verdict}</p>
                  <div className="mt-3 text-xs font-medium text-violet-800 flex items-center gap-1">
                    Read comparison
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — warm section */}
      <section className="rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 mb-8" style={{ background: "var(--section-warm-bg)", borderColor: "var(--section-warm-border)", borderWidth: 1, borderStyle: "solid" }}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-medium text-foreground">Building an AI tool?</h2>
          <p className="mt-3 text-sm" style={{ color: "var(--section-warm-muted)" }}>
            Get your product in front of high-intent developers searching exactly for your use case.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/submit"
              className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Submit Your Tool — Free
            </Link>
            <Link
              href="/submit"
              className="rounded-xl bg-white/50 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/80"
              style={{ borderColor: "var(--section-warm-border-alt)", borderWidth: 1, borderStyle: "solid" }}
            >
              Sponsor a Listing — from $99/mo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
