import Link from "next/link";
import { Tool, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";
import { formatStars } from "@/lib/data";

export default function ToolCard({ tool, rank }: { tool: Tool; rank?: number }) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-border-hover hover:bg-card-hover hover:shadow-sm"
    >
      {/* Sponsored Badge */}
      {tool.featured && (
        <div className="absolute -top-2.5 right-4 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-[10px] font-medium text-accent uppercase tracking-wider">
          Featured
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Rank */}
          {rank && (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-border/50 text-xs font-bold text-muted">
              {rank}
            </div>
          )}

          {/* Icon placeholder */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background border border-border text-lg font-semibold text-foreground font-serif">
            {tool.name.charAt(0)}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
              {tool.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted line-clamp-2">{tool.shortDescription}</p>
          </div>
        </div>
      </div>

      {/* Meta Row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[tool.category]}`}>
          {CATEGORY_LABELS[tool.category]}
        </span>
        <span className="rounded-full bg-background border border-border px-2 py-0.5 text-[10px] text-muted font-medium">
          {tool.pricingModel}
        </span>
        {tool.githubStars && (
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
            </svg>
            {formatStars(tool.githubStars)}
          </span>
        )}
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${
          tool.setupComplexity === "Low"
            ? "bg-emerald-100/70 text-emerald-700"
            : tool.setupComplexity === "Medium"
            ? "bg-amber-100/70 text-amber-700"
            : "bg-red-100/70 text-red-700"
        }`}>
          {tool.setupComplexity} setup
        </span>
      </div>

      {/* Use Cases */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.useCases.slice(0, 3).map((uc) => (
          <span key={uc} className="rounded-md bg-background/80 border border-border/50 px-2 py-0.5 text-[10px] text-muted">
            {uc}
          </span>
        ))}
      </div>
    </Link>
  );
}
