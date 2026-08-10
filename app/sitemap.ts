import type { MetadataRoute } from "next";
import { tools as staticTools, categories, comparisons, mcpPlatforms } from "@/lib/data";
import { listicles } from "@/lib/data/listicles";
import { BASE_URL } from "@/lib/config";

/**
 * Fetch published tools from Supabase when available, otherwise fall back to
 * the static in-memory tool list. This ensures DB-added tools appear in the
 * sitemap once the database is connected.
 */
async function getToolsForSitemap() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data, error } = await supabase
        .from("tools")
        .select("slug, featured, last_updated, updated_at")
        .eq("status", "published");

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          slug: row.slug as string,
          featured: row.featured as boolean,
          lastUpdated: (row.last_updated || row.updated_at || null) as string | null,
        }));
      }
    } catch {
      // Fall through to static data
    }
  }

  return staticTools.map((t) => ({
    slug: t.slug,
    featured: t.featured,
    lastUpdated: t.lastUpdated as string | null,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const tools = await getToolsForSitemap();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/submit`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/mcp-servers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/\s+/).slice(0, 5).join("-");
}

// pSEO: use-case pages
  const useCaseSlugs = new Set<string>();
  for (const t of tools) {
    for (const uc of (t as any).useCases || []) {
      useCaseSlugs.add(slugify(uc));
    }
  }
  const useCasePages: MetadataRoute.Sitemap = [...useCaseSlugs].map((slug) => ({
    url: `${BASE_URL}/use-case/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // pSEO: integration pages
  const integrationSlugs = new Set<string>();
  for (const t of tools) {
    for (const int of (t as any).integrations || []) {
      integrationSlugs.add(int.toLowerCase().replace(/\s+/g, "-"));
    }
  }
  const integrationPages: MetadataRoute.Sitemap = [...integrationSlugs].map((slug) => ({
    url: `${BASE_URL}/integration/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const listiclePages: MetadataRoute.Sitemap = listicles.map((l) => ({
    url: `${BASE_URL}/best/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

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

  return [...staticPages, ...listiclePages, ...toolPages, ...categoryPages, ...comparisonPages, ...mcpPages, ...useCasePages, ...integrationPages];
}
