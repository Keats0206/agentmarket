/**
 * Seed script: inserts all tools from static data into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { tools } from "../lib/data/tools";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log(`Seeding ${tools.length} tools into Supabase...`);

  const rows = tools.map((t) => ({
    slug: t.slug,
    name: t.name,
    short_description: t.shortDescription,
    description: t.description,
    category: t.category,
    subcategories: t.subcategories,
    use_cases: t.useCases,
    integrations: t.integrations,
    pricing_model: t.pricingModel,
    pricing: t.pricing ?? null,
    github_url: t.githubUrl ?? null,
    github_stars: t.githubStars ?? null,
    website_url: t.websiteUrl,
    docs_url: t.docsUrl ?? null,
    featured: t.featured,
    sponsored_tier: t.sponsoredTier ?? null,
    last_updated: t.lastUpdated,
    pros: t.pros,
    cons: t.cons,
    setup_complexity: t.setupComplexity,
    maturity: t.maturity,
    account_id: null,
    status: "published",
  }));

  const { data, error } = await supabase
    .from("tools")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }

  console.log("Seed complete! Inserted/updated all tools.");
}

seed();
