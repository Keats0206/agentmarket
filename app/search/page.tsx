"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { searchTools, tools } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_COLORS, type ToolCategory } from "@/lib/types";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const results = query ? searchTools(query) : tools;

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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded-2xl bg-card" />
            <div className="h-8 w-48 rounded bg-card" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-card" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
