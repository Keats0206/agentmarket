import type { Tool, ToolCategory } from "../types";

// ---------------------------------------------------------------------------
// Data access layer for tools.
// When NEXT_PUBLIC_SUPABASE_URL is set, reads from Supabase.
// Otherwise falls back to the static in-memory data so the site always works.
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
    // Fallback to static
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

export async function searchToolsFromDB(query: string): Promise<Tool[]> {
  // Always use in-memory search for now (works with both DB and static)
  // because Supabase full-text search would require a dedicated column/index.
  const { searchTools } = await import("../data/index");
  return searchTools(query);
}
