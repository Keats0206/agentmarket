import type { Tool, ToolCategory } from "../types";
import { categories } from "../data/categories";
import { comparisons } from "../data/comparisons";
import { listicles, getListicleBySlug } from "../data/listicles";
import { mcpPlatforms } from "../data/mcpPlatforms";

export { categories, comparisons, listicles, getListicleBySlug, mcpPlatforms };
export type { CategoryPage, ComparisonPage, Listicle, MCPPlatform } from "../types";

// ---------------------------------------------------------------------------
// Unified data access layer for tools.
// When NEXT_PUBLIC_SUPABASE_URL is set, reads from Supabase.
// Otherwise falls back to the static in-memory data so the site always works.
//
// All pages should import from this module (via @/lib/db/tools) instead of
// @/lib/data so that DB-added tools appear automatically.
// ---------------------------------------------------------------------------

const USE_DB = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

// Static fallback (tree-shaken when DB is used)
async function getStaticData() {
  const { tools } = await import("../data/tools");
  return tools;
}

// Map a Supabase row → our Tool type
function rowToTool(row: Record<string, unknown>): Tool {
  return {
    slug: row.slug as string,
    name: row.name as string,
    shortDescription: row.short_description as string,
    description: row.description as string,
    category: row.category as ToolCategory,
    subcategories: (row.subcategories ?? []) as string[],
    useCases: (row.use_cases ?? []) as string[],
    integrations: (row.integrations ?? []) as string[],
    pricingModel: row.pricing_model as Tool["pricingModel"],
    pricing: (row.pricing ?? undefined) as string | undefined,
    githubUrl: (row.github_url ?? undefined) as string | undefined,
    githubStars: (row.github_stars ?? undefined) as number | undefined,
    websiteUrl: row.website_url as string,
    docsUrl: (row.docs_url ?? undefined) as string | undefined,
    featured: row.featured as boolean,
    sponsoredTier: (row.sponsored_tier ?? undefined) as Tool["sponsoredTier"],
    lastUpdated: row.last_updated as string,
    pros: (row.pros ?? []) as string[],
    cons: (row.cons ?? []) as string[],
    setupComplexity: row.setup_complexity as Tool["setupComplexity"],
    maturity: row.maturity as Tool["maturity"],
  };
}

// ── Core async queries ────────────────────────────────────────────────────

export async function getAllTools(): Promise<Tool[]> {
  if (!USE_DB) return getStaticData();

  const { createServiceClient } = await import("../supabase/server");
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("status", "published")
    .order("name");

  if (error || !data) {
    console.error("Supabase getAllTools error, falling back to static:", error);
    return getStaticData();
  }
  return data.map(rowToTool);
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  if (!USE_DB) {
    const tools = await getStaticData();
    return tools.find((t) => t.slug === slug);
  }

  const { createServiceClient } = await import("../supabase/server");
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    const tools = await getStaticData();
    return tools.find((t) => t.slug === slug);
  }
  return rowToTool(data);
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  if (!USE_DB) {
    const tools = await getStaticData();
    return tools.filter((t) => t.category === category);
  }

  const { createServiceClient } = await import("../supabase/server");
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("name");

  if (error || !data) {
    const tools = await getStaticData();
    return tools.filter((t) => t.category === category);
  }
  return data.map(rowToTool);
}

export async function getFeaturedTools(): Promise<Tool[]> {
  if (!USE_DB) {
    const tools = await getStaticData();
    return tools.filter((t) => t.featured);
  }

  const { createServiceClient } = await import("../supabase/server");
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("featured", true)
    .eq("status", "published")
    .order("name");

  if (error || !data) {
    const tools = await getStaticData();
    return tools.filter((t) => t.featured);
  }
  return data.map(rowToTool);
}

// ── Search (in-memory scoring over DB or static tools) ────────────────────

export async function searchTools(query: string): Promise<Tool[]> {
  const tools = await getAllTools();
  if (!query) return tools;

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

// ── Helpers (re-exported for convenience) ─────────────────────────────────

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getComparisonBySlug(slug: string) {
  return comparisons.find((c) => c.slug === slug);
}

export function getMCPPlatformBySlug(slug: string) {
  return mcpPlatforms.find((p) => p.slug === slug);
}

export function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(stars >= 10000 ? 0 : 1)}K`;
  }
  return stars.toString();
}

const TIER_PRIORITY: Record<string, number> = { premium: 4, category: 3, featured: 3, basic: 2 };

export function sortByPremium(toolList: Tool[]): Tool[] {
  return [...toolList].sort((a, b) => {
    const aPriority = TIER_PRIORITY[a.sponsoredTier || ""] || 0;
    const bPriority = TIER_PRIORITY[b.sponsoredTier || ""] || 0;
    if (bPriority !== aPriority) return bPriority - aPriority;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function getStats() {
  const tools = await getAllTools();
  return {
    totalTools: tools.length,
    totalCategories: categories.length,
    totalComparisons: comparisons.length,
    totalMCPServers: tools.filter((t) => t.category === "mcp-server").length,
  };
}
