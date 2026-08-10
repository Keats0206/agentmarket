#!/usr/bin/env node
/**
 * Generate llms.txt and llms-full.txt for LLM discovery.
 * llms.txt: concise directory index for LLM context windows.
 * llms-full.txt: full tool catalog with metadata.
 * 
 * Usage: node scripts/generate-llms-feed.mjs
 */
import { writeFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { tools } = require("../lib/data/tools.js");

const BASE_URL = "https://hot100ai.dev";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getTools() {
  return tools.map((t: any) => ({
    slug: t.slug,
    name: t.name,
    shortDescription: t.shortDescription,
    category: t.category,
    useCases: t.useCases || [],
    integrations: t.integrations || [],
    pricingModel: t.pricingModel,
    websiteUrl: t.websiteUrl,
    featured: t.featured,
  }));
}

async function main() {
  const tools = await getTools();
  const categories = [...new Set(tools.map((t) => t.category))];
  const useCases = [...new Set(tools.flatMap((t) => t.useCases))].sort();
  const integrations = [...new Set(tools.flatMap((t) => t.integrations))].sort();

  // ── llms.txt (concise) ──
  const concise = [
    `# Hot 100 AI — LLM Discovery Feed`,
    ``,
    `> ${tools.length} AI tools, MCP servers, frameworks, and platforms.`,
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
    ...tools.filter((t) => t.featured).slice(0, 20).map((t) =>
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
    `> ${tools.length} AI tools, MCP servers, frameworks, and platforms.`,
    `> Site: ${BASE_URL}`,
    `> Updated: ${new Date().toISOString().split("T")[0]}`,
    ``,
    `## All Tools`,
    ``,
    ...tools.map((t) => {
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
      const count = tools.filter((t) => t.category === c).length;
      return `- ${c} (${count} tools): ${BASE_URL}/search?q=${encodeURIComponent(c)}`;
    }),
    ``,
    `## Use Cases`,
    ``,
    ...useCases.map((u) => {
      const count = tools.filter((t) => t.useCases.includes(u)).length;
      return `- ${u} (${count} tools): ${BASE_URL}/search?q=${encodeURIComponent(u)}`;
    }),
    ``,
    `## Integrations`,
    ``,
    ...integrations.map((i) => {
      const count = tools.filter((t) => t.integrations.includes(i)).length;
      return `- ${i} (${count} tools): ${BASE_URL}/search?q=${encodeURIComponent(i)}`;
    }),
  ].join("\n");

  writeFileSync("public/llms-full.txt", full);
  console.log(`Wrote llms-full.txt (${full.length} chars)`);
}

main().catch(console.error);