"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { CATEGORY_LABELS, CATEGORY_COLORS, type ToolCategory, type Tool } from "@/lib/types";

function scoreTools(tools: Tool[], query: string): Tool[] {
  const q = query.toLowerCase();
  const scored = tools
    .map((t) => {
      let score = 0;
      const name = t.name.toLowerCase();
      const shortDesc = t.shortDescription.toLowerCase();
      const desc = t.description.toLowerCase();
      const cat = t.category.toLowerCase();

      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 80;
      else if (name.includes(q)) score += 60;

      if (shortDesc.includes(q)) score += 30;
      if (cat === q || cat.replace("-", " ") === q) score += 40;
      if (desc.includes(q)) score += 10;
      if (t.subcategories.some((s) => s.toLowerCase().includes(q))) score += 20;
      if (t.useCases.some((u) => u.toLowerCase().includes(q))) score += 15;
      if (t.integrations.some((i) => i.toLowerCase().includes(q))) score += 10;

      if (t.sponsoredTier === "premium") score += 5;
      else if (t.sponsoredTier === "category") score += 3;
      else if (t.sponsoredTier === "basic") score += 1;
      if (t.featured) score += 2;

      return { tool: t, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.tool);
}

export default function SearchResultsClient({ allTools }: { allTools: Tool[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const results = query ? scoreTools(allTools, query) : allTools;

  const categoryFilter = searchParams.get("category");
  const filteredResults = categoryFilter
    ? results.filter((t) => t.category === categoryFilter)
    : results;

  const categoryCounts = results.reduce<Record<string, number>>((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Search</span>
        {query && (
          <>
            <span>/</span>
            <span className="text-foreground">&quot;{query}&quot;</span>
          </>
        )}
      </nav>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar size="lg" defaultValue={query} />
      </div>

      {/* Results Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-xl font-medium text-foreground">
            {query ? `Results for "${query}"` : "All Tools"}
          </h1>
          <p className="mt-1 text-xs text-muted">
            {filteredResults.length} tool{filteredResults.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            !categoryFilter
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted hover:text-foreground"
          }`}
        >
          All ({results.length})
        </Link>
        {(Object.entries(categoryCounts) as [ToolCategory, number][]).map(([cat, count]) => (
          <Link
            key={cat}
            href={`/search?${query ? `q=${encodeURIComponent(query)}&` : ""}category=${cat}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              categoryFilter === cat
                ? `${CATEGORY_COLORS[cat]}`
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {CATEGORY_LABELS[cat]} ({count})
          </Link>
        ))}
      </div>

      {/* Results Grid */}
      {filteredResults.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredResults.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <h2 className="font-serif text-lg font-medium text-foreground">No tools found</h2>
          <p className="mt-2 text-sm text-muted">
            Try a different search term or{" "}
            <Link href="/search" className="text-accent hover:text-accent-hover">
              browse all tools
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
