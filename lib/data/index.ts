import type { Tool, CategoryPage, ComparisonPage, MCPPlatform } from "../types";
import { tools } from "./tools";
import { categories } from "./categories";
import { comparisons } from "./comparisons";
import { mcpPlatforms } from "./mcpPlatforms";

export { tools, categories, comparisons, mcpPlatforms };

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getFeaturedTools(): Tool[] {
  return sortByPremium(tools.filter((t) => t.featured));
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();

  // Score each tool by relevance (higher = better)
  const scored = tools
    .map((t) => {
      let score = 0;
      const name = t.name.toLowerCase();
      const shortDesc = t.shortDescription.toLowerCase();
      const desc = t.description.toLowerCase();
      const cat = t.category.toLowerCase();

      // Name matches are most important
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 80;
      else if (name.includes(q)) score += 60;

      // Short description
      if (shortDesc.includes(q)) score += 30;

      // Category exact match
      if (cat === q || cat.replace("-", " ") === q) score += 40;

      // Full description
      if (desc.includes(q)) score += 10;

      // Subcategories
      if (t.subcategories.some((s) => s.toLowerCase().includes(q))) score += 20;

      // Use cases
      if (t.useCases.some((u) => u.toLowerCase().includes(q))) score += 15;

      // Integrations
      if (t.integrations.some((i) => i.toLowerCase().includes(q))) score += 10;

      // Boost sponsored / featured
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

export function getCategoryBySlug(slug: string): CategoryPage | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getComparisonBySlug(slug: string): ComparisonPage | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getMCPPlatformBySlug(slug: string): MCPPlatform | undefined {
  return mcpPlatforms.find((p) => p.slug === slug);
}

export function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(stars >= 10000 ? 0 : 1)}K`;
  }
  return stars.toString();
}

// Sort tools by sponsored tier (premium > category > basic > none), then featured, then name
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

export const stats = {
  totalTools: tools.length,
  totalCategories: categories.length,
  totalComparisons: comparisons.length,
  totalMCPServers: tools.filter((t) => t.category === "mcp-server").length,
};
