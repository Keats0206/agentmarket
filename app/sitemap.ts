import type { MetadataRoute } from "next";
import { tools, categories, comparisons, mcpPlatforms } from "@/lib/data";

const BASE_URL = "https://agentindex.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/submit`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/mcp-servers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tool/${tool.slug}`,
    lastModified: tool.lastUpdated || now,
    changeFrequency: "weekly" as const,
    priority: tool.featured ? 0.9 : 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((comp) => ({
    url: `${BASE_URL}/compare/${comp.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const mcpPages: MetadataRoute.Sitemap = mcpPlatforms.map((p) => ({
    url: `${BASE_URL}/mcp-servers/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...comparisonPages, ...mcpPages];
}
