/**
 * AI-powered tool discovery script.
 *
 * Fetches candidate tools from curated sources (awesome-* repos, GitHub topic
 * search) and uses an LLM to filter them to relevant AI agents, MCP servers,
 * frameworks, and developer tools.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx tsx scripts/discover-candidates.ts
 *
 * Output: writes candidates to stdout as JSON array.
 */

import OpenAI from "openai";

// ── Types ──────────────────────────────────────────────────────────────────

export interface Candidate {
  name: string;
  websiteUrl: string;
  githubUrl?: string;
  sourceList: string;
}

// ── Sources ────────────────────────────────────────────────────────────────

const AWESOME_REPOS = [
  // Awesome lists with AI agent / LLM / MCP tool collections
  "https://raw.githubusercontent.com/e2b-dev/awesome-ai-agents/main/README.md",
  "https://raw.githubusercontent.com/Significant-Gravitas/AutoGPT/master/README.md",
  "https://raw.githubusercontent.com/kyrolabs/awesome-langchain/main/README.md",
  "https://raw.githubusercontent.com/phdkiran/awesome-mcp-servers/main/README.md",
  "https://raw.githubusercontent.com/continuedev/what-llm-to-use/main/README.md",
];

const GITHUB_TOPIC_QUERIES = [
  "topic:llm-agent",
  "topic:mcp-server",
  "topic:ai-agent",
  "topic:langchain",
  "topic:agent-framework",
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract GitHub repo URLs from a markdown README.
 */
function extractGitHubUrls(markdown: string): string[] {
  const regex = /https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+/g;
  const matches = markdown.match(regex) || [];
  // Dedupe and clean trailing characters
  const unique = [...new Set(matches.map((u) => u.replace(/[).,;:'"]+$/, "")))];
  return unique;
}

/**
 * Extract name from a GitHub URL (e.g. "owner/repo" → "repo").
 */
function repoNameFromUrl(url: string): string {
  const parts = url.replace("https://github.com/", "").split("/");
  return parts[1] || parts[0] || url;
}

/**
 * Fetch a URL with timeout. Returns text or null on failure.
 */
async function fetchText(url: string, timeoutMs = 10000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Search GitHub API for repos by topic. Returns repo URLs.
 */
async function searchGitHubByTopic(query: string): Promise<string[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=30`;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((item: { html_url: string }) => item.html_url);
  } catch {
    return [];
  }
}

// ── LLM Filter ──────────────────────────────────────────────────────────────

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Ask the LLM whether a list of repo names/URLs are relevant AI tools.
 * Batches up to 20 at a time for efficiency.
 */
async function filterWithLLM(
  items: { name: string; url: string }[]
): Promise<{ name: string; url: string; relevant: boolean }[]> {
  if (items.length === 0) return [];

  const itemList = items.map((it, i) => `${i + 1}. ${it.name} — ${it.url}`).join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a curator for an AI developer tools directory called "Hot 100 AI". 
You evaluate whether GitHub repositories or tools are AI agents, MCP servers, agent frameworks, LLM tools, vector databases, AI inference platforms, or other agentic developer tools.

Given a numbered list of tool names and URLs, return a JSON object:
{ "results": [{ "index": 1, "relevant": true/false }] }

Mark relevant=true only for:
- AI agents (autonomous agents, coding agents, multi-agent frameworks)
- MCP (Model Context Protocol) servers
- LLM application frameworks (like LangChain, LlamaIndex)
- Vector databases for AI
- AI inference platforms
- AI developer tools and SDKs
- AI code assistants

Mark relevant=false for:
- General ML/DL libraries (PyTorch, TensorFlow)
- Datasets or model weights
- Tutorials, courses, or documentation-only repos
- Non-AI tools
- Duplicate or deprecated projects`,
      },
      { role: "user", content: itemList },
    ],
  });

  const content = response.choices[0]?.message?.content || "{}";
  try {
    const parsed = JSON.parse(content) as { results: { index: number; relevant: boolean }[] };
    return items.map((it, i) => ({
      ...it,
      relevant: parsed.results?.find((r) => r.index === i + 1)?.relevant ?? false,
    }));
  } catch {
    console.error("Failed to parse LLM response:", content);
    return items.map((it) => ({ ...it, relevant: false }));
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function discoverCandidates(): Promise<Candidate[]> {
  const allUrls: { name: string; url: string; source: string }[] = [];

  // 1. Fetch awesome-* README files and extract GitHub URLs
  console.log("Fetching awesome-* lists...");
  for (const repoUrl of AWESOME_REPOS) {
    const md = await fetchText(repoUrl);
    if (!md) {
      console.log(`  ✗ Failed to fetch: ${repoUrl}`);
      continue;
    }
    const urls = extractGitHubUrls(md);
    console.log(`  ✓ ${repoUrl.split("/")[4]}/${repoUrl.split("/")[5]}: ${urls.length} URLs`);
    for (const u of urls) {
      allUrls.push({ name: repoNameFromUrl(u), url: u, source: repoUrl });
    }
    await sleep(500); // Be polite
  }

  // 2. GitHub topic search
  console.log("\nSearching GitHub topics...");
  for (const query of GITHUB_TOPIC_QUERIES) {
    const urls = await searchGitHubByTopic(query);
    console.log(`  ✓ ${query}: ${urls.length} repos`);
    for (const u of urls) {
      allUrls.push({ name: repoNameFromUrl(u), url: u, source: query });
    }
    await sleep(1000); // Respect rate limits
  }

  // 3. Dedupe by URL
  const seen = new Set<string>();
  const unique = allUrls.filter((it) => {
    const normalized = it.url.toLowerCase().replace(/\/+$/, "");
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });

  console.log(`\n${unique.length} unique candidate URLs found. Filtering with LLM...`);

  // 4. Filter with LLM in batches
  const batchSize = 20;
  const relevant: Candidate[] = [];

  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const results = await filterWithLLM(batch.map((it) => ({ name: it.name, url: it.url })));
    for (const r of results) {
      if (r.relevant) {
        relevant.push({
          name: r.name,
          websiteUrl: r.url, // GitHub URL as website; enrichment may update this
          githubUrl: r.url,
          sourceList: batch.find((b) => b.url === r.url)?.source || "unknown",
        });
      }
    }
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}: ${results.filter((r) => r.relevant).length} relevant`);
    await sleep(1000); // Rate limit LLM calls
  }

  console.log(`\n${relevant.length} relevant candidates found.`);
  return relevant;
}

// Run if executed directly
if (require.main === module) {
  discoverCandidates()
    .then((candidates) => {
      console.log(JSON.stringify(candidates, null, 2));
    })
    .catch((err) => {
      console.error("Discovery failed:", err);
      process.exit(1);
    });
}
