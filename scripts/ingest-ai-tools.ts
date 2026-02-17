/**
 * AI-powered tool ingestion pipeline.
 *
 * Discovers candidate tools from curated sources, enriches each with an LLM
 * to produce a full tool record, and inserts them into Supabase as published.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... \
 *   NEXT_PUBLIC_SUPABASE_URL=... \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   npx tsx scripts/ingest-ai-tools.ts
 *
 * Options (env vars):
 *   DRY_RUN=true          — log only, no DB insert
 *   GITHUB_TOKEN=ghp_...  — optional, for higher GitHub API rate limits
 *
 * Estimated cost: ~$0.01-0.03 per tool (GPT-4o-mini for discovery + enrichment).
 * A run of 100 new tools costs roughly $1-3.
 *
 * When run locally, loads .env.local automatically — just run:
 *   npx tsx scripts/ingest-ai-tools.ts
 */

import "./load-env";
import { createClient } from "@supabase/supabase-js";
import { discoverCandidates, type Candidate } from "./discover-candidates";
import { enrichCandidate, type ToolRow } from "../lib/ai/enrich-tool";

// ── Config ──────────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = process.env.DRY_RUN === "true";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Check if a tool already exists in Supabase by slug or website_url.
 */
async function toolExists(slug: string, websiteUrl: string): Promise<boolean> {
  const { data: bySlug } = await supabase
    .from("tools")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (bySlug && bySlug.length > 0) return true;

  const { data: byUrl } = await supabase
    .from("tools")
    .select("id")
    .eq("website_url", websiteUrl)
    .limit(1);

  return !!(byUrl && byUrl.length > 0);
}

/**
 * Ensure slug uniqueness by appending a numeric suffix if needed.
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let attempt = 0;
  while (true) {
    const { data } = await supabase
      .from("tools")
      .select("id")
      .eq("slug", slug)
      .limit(1);
    if (!data || data.length === 0) return slug;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }
}

// ── Main pipeline ───────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log("Hot 100 AI — Tool Ingestion Pipeline");
  console.log(dryRun ? "MODE: DRY RUN (no DB writes)" : "MODE: LIVE (will insert into Supabase)");
  console.log("=".repeat(60));
  console.log();

  // 1. Discover candidates
  console.log("Step 1: Discovering candidates...\n");
  let candidates: Candidate[];
  try {
    candidates = await discoverCandidates();
  } catch (err) {
    console.error("Discovery failed:", err);
    process.exit(1);
  }

  if (candidates.length === 0) {
    console.log("No candidates found. Exiting.");
    return;
  }

  // 2. Filter out existing tools
  console.log("\nStep 2: Checking for existing tools...\n");
  const newCandidates: Candidate[] = [];

  for (const candidate of candidates) {
    const slug = slugify(candidate.name);
    const exists = await toolExists(slug, candidate.websiteUrl);
    if (exists) {
      console.log(`  ↳ Skip (exists): ${candidate.name}`);
    } else {
      newCandidates.push(candidate);
    }
  }

  console.log(`\n${newCandidates.length} new candidates to enrich.\n`);

  if (newCandidates.length === 0) {
    console.log("All candidates already exist. Exiting.");
    return;
  }

  // 3. Enrich and insert
  console.log("Step 3: Enriching and inserting...\n");
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const candidate of newCandidates) {
    console.log(`Processing: ${candidate.name}...`);

    try {
      const toolRow = await enrichCandidate(candidate);

      if (!toolRow) {
        console.log(`  ✗ Enrichment returned null — skipping.`);
        skipped++;
        await sleep(1000);
        continue;
      }

      // Ensure unique slug
      toolRow.slug = await ensureUniqueSlug(toolRow.slug);

      if (dryRun) {
        console.log(`  ✓ [DRY RUN] Would insert: ${toolRow.name} (${toolRow.slug})`);
        console.log(`    Category: ${toolRow.category} | Pricing: ${toolRow.pricing_model} | Maturity: ${toolRow.maturity}`);
        inserted++;
      } else {
        const { error } = await supabase.from("tools").insert(toolRow);

        if (error) {
          console.error(`  ✗ DB insert error for ${toolRow.name}:`, error.message);
          errors++;
        } else {
          console.log(`  ✓ Inserted: ${toolRow.name} (${toolRow.slug})`);
          inserted++;
        }
      }
    } catch (err) {
      console.error(`  ✗ Error processing ${candidate.name}:`, err);
      errors++;
    }

    // Rate limit: 1 tool per second
    await sleep(1000);
  }

  // 4. Summary
  console.log("\n" + "=".repeat(60));
  console.log("Pipeline complete!");
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("Pipeline error:", err);
  process.exit(1);
});
