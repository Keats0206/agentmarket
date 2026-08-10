#!/usr/bin/env node
/**
 * Generate llms.txt and llms-full.txt for LLM discovery.
 * Reads from the static tools data file.
 * Usage: node scripts/generate-llms-feed.mjs
 */
import { writeFileSync } from "fs";

const BASE_URL = "https://hot100ai.dev";

// Inline a subset of tools data so this runs without TS compilation
// Update this array when tools change, or regenerate from lib/data/tools.ts
const tools = [];

// Try loading from Supabase if env vars are available
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getTools() {
  if (SUPABASE_URL && ANON_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(SUPABASE_URL, ANON_KEY);
      const { data } = await supabase
        .from("tools")
        .select("slug,name,short_description,category,use_cases,integrations,pricing_model,website_url,featured")
        .eq("status", "published")
        .order("name");
      if (data?.length) {
        console.log(`Loaded ${data.length} tools from Supabase`);
        return data.map((r) => ({
          slug: r.slug,
          name: r.name,
          shortDescription: r.short_description,
          category: r.category,
          useCases: r.use_cases || [],
          integrations: r.integrations || [],
          pricingModel: r.pricing_model,
          websiteUrl: r.website_url,
          featured: r.featured,
        }));
      }
    } catch (e) {
      console.log("Supabase unavailable, using static data:", e.message);
    }
  }

  // Fall back to require from compiled JS
  try {
    const mod = await import("../.next/server/app/page.js").catch(() => null);
  } catch {}

  console.log(`Using static data (${tools.length} tools)`);
  return tools;
}

async function main() {
  const toolList = await getTools();
  if (toolList.length === 0) {
    console.log("No tools available, skipping llms.txt generation");
    return;
  }

  const categories = [...new Set(toolList.map((t) => t.category))];
  const useCases = [...new Set(toolList.flatMap((t) => t.useCases))].sort();
  const integrations = [...new Set(toolList.flatMap((t) => t.integrations))].sort();

  // ── llms.txt (concise) ──
  const concise = [
    `# Hot 100 AI — LLM Discovery Feed`,
    ``,
    `> ${toolList.length} AI tools, MCP servers, frameworks, and platforms.`,
    `> Site: ${BASE_URL}`,
    `> Updated: ${new Date().toISOString().split("T")[0]}`,
    ``,
    `## Quick Links`,
    ``,
    `- Home: ${BASE_URL}`,
    `- Search: ${BASE_URL}/search`,
    `- Submit: ${BASE_URL}/submit`,
    `- MCP Servers: ${BASE_URL}/mcp-servers`,
    `- Full catalog: ${BASE_URL}/llms-full.txt`,
    ``,
    `## Categories (${categories.length})`,
    ``,
    ...categories.map((c) => `- ${c}: ${BASE_URL}/search?q=${encodeURIComponent(c)}`),
    ``,
    `## Use Cases (${useCases.length})`,
    ``,
    ...useCases.map((u) => `- ${u}: ${BASE_URL}/search?q=${encodeURIComponent(u)}`),
    ``,
    `## Integrations (${integrations.length})`,
    ``,
    ...integrations.map((i) => `- ${i}: ${BASE_URL}/search?q=${encodeURIComponent(i)}`),
    ``,
    `## Featured Tools`,
    ``,
    ...toolList.filter((t) => t.featured).slice(0, 20).map((t) =>
      `- **${t.name}** [${t.category}] — ${t.shortDescription} — ${BASE_URL}/tool/${t.slug}`
    ),
    ``,
    `---`,
    `For the complete tool catalog with metadata, see llms-full.txt`,
  ].join("\n");

  writeFileSync("public/llms.txt", concise);
  console.log(`Wrote llms.txt (${concise.length} chars)`);

  // ── llms-full.txt (comprehensive) ──
  const full = [
    `# Hot 100 AI — Complete Tool Catalog`,
    ``,
    `> ${toolList.length} AI tools, MCP servers, frameworks, and platforms.`,
    `> Site: ${BASE_URL}`,
    `> Updated: ${new Date().toISOString().split("T")[0]}`,
    ``,
    `## All Tools`,
    ``,
    ...toolList.map((t) => {
      const lines = [
        `### ${t.name}`,
        `- Slug: ${t.slug}`,
        `- Category: ${t.category}`,
        `- Description: ${t.shortDescription}`,
        `- URL: ${BASE_URL}/tool/${t.slug}`,
        `- Pricing: ${t.pricingModel}`,
        `- Website: ${t.websiteUrl}`,
      ];
      if (t.useCases.length) lines.push(`- Use Cases: ${t.useCases.join(", ")}`);
      if (t.integrations.length) lines.push(`- Integrations: ${t.integrations.join(", ")}`);
      if (t.featured) lines.push(`- Featured: true`);
      return lines.join("\n") + "\n";
    }),
    ``,
    `## Categories`,
    ``,
    ...categories.map((c) => {
      const count = toolList.filter((t) => t.category === c).length;
      return `- ${c} (${count} tools): ${BASE_URL}/search?q=${encodeURIComponent(c)}`;
    }),
    ``,
    `## Use Cases`,
    ``,
    ...useCases.map((u) => {
      const count = toolList.filter((t) => t.useCases.includes(u)).length;
      return `- ${u} (${count} tools): ${BASE_URL}/search?q=${encodeURIComponent(u)}`;
    }),
    ``,
    `## Integrations`,
    ``,
    ...integrations.map((i) => {
      const count = toolList.filter((t) => t.integrations.includes(i)).length;
      return `- ${i} (${count} tools): ${BASE_URL}/search?q=${encodeURIComponent(i)}`;
    }),
  ].join("\n");

  writeFileSync("public/llms-full.txt", full);
  console.log(`Wrote llms-full.txt (${full.length} chars)`);
}

main().catch(console.error);