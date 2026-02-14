/**
 * AI enrichment: given a candidate (name + URL), fetch its content and use
 * an LLM to produce a full Tool record matching the Hot 100 AI schema.
 *
 * Used by the ingestion pipeline. Not imported by the Next.js app.
 */

import OpenAI from "openai";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ToolRow {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  category: "agent" | "mcp-server" | "framework" | "infra" | "platform";
  subcategories: string[];
  use_cases: string[];
  integrations: string[];
  pricing_model: "Free" | "Open Source" | "Freemium" | "Paid" | "Enterprise";
  pricing: string | null;
  github_url: string | null;
  github_stars: number | null;
  website_url: string;
  docs_url: string | null;
  featured: boolean;
  sponsored_tier: null;
  last_updated: string;
  pros: string[];
  cons: string[];
  setup_complexity: "Low" | "Medium" | "High";
  maturity: "Early" | "Growing" | "Mature";
  account_id: null;
  status: "published";
}

interface CandidateInput {
  name: string;
  websiteUrl: string;
  githubUrl?: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = ["agent", "mcp-server", "framework", "infra", "platform"] as const;
const VALID_PRICING = ["Free", "Open Source", "Freemium", "Paid", "Enterprise"] as const;
const VALID_COMPLEXITY = ["Low", "Medium", "High"] as const;
const VALID_MATURITY = ["Early", "Growing", "Mature"] as const;

async function fetchText(url: string, timeoutMs = 10000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const text = await res.text();
    // Limit to first 8000 chars to stay within token limits
    return text.slice(0, 8000);
  } catch {
    return null;
  }
}

async function fetchGitHubStars(githubUrl: string): Promise<number | null> {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  try {
    const res = await fetch(apiUrl, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

// ── LLM enrichment ──────────────────────────────────────────────────────────

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a technical writer for "Hot 100 AI", a developer-focused directory of AI agents, MCP servers, and agentic tools.

Given a tool's name, URLs, and raw content (README or website text), produce a structured JSON profile.

Return ONLY a JSON object with these exact fields:
{
  "name": "Tool Name",
  "short_description": "One-line description (max 100 chars)",
  "description": "2-4 sentence description of what this tool does, who it's for, and key capabilities.",
  "category": "agent" | "mcp-server" | "framework" | "infra" | "platform",
  "subcategories": ["up to 3 relevant subcategories"],
  "use_cases": ["3-5 specific use cases"],
  "integrations": ["3-8 key integrations or compatible tools"],
  "pricing_model": "Free" | "Open Source" | "Freemium" | "Paid" | "Enterprise",
  "pricing": "pricing details or null",
  "docs_url": "documentation URL or null",
  "pros": ["3-5 strengths"],
  "cons": ["3-5 limitations"],
  "setup_complexity": "Low" | "Medium" | "High",
  "maturity": "Early" | "Growing" | "Mature"
}

Guidelines:
- Be factual and concise. Don't invent features not mentioned in the content.
- short_description should be informative, not marketing-speak.
- description should explain what it does, not just that it exists.
- Choose category carefully: "agent" for autonomous/coding agents, "mcp-server" for MCP protocol servers, "framework" for LLM/agent frameworks, "infra" for vector DBs/hosting/inference, "platform" for full platforms.
- Pros/cons should be specific and useful to a developer evaluating the tool.`;

export async function enrichCandidate(candidate: CandidateInput): Promise<ToolRow | null> {
  // 1. Fetch content
  let content = "";

  if (candidate.githubUrl) {
    // Try raw README
    const readmeUrl = candidate.githubUrl
      .replace("github.com", "raw.githubusercontent.com")
      .replace(/\/$/, "") + "/main/README.md";
    const readme = await fetchText(readmeUrl);
    if (!readme) {
      // Try master branch
      const readmeMaster = await fetchText(readmeUrl.replace("/main/", "/master/"));
      if (readmeMaster) content = readmeMaster;
    } else {
      content = readme;
    }
  }

  if (!content && candidate.websiteUrl) {
    const html = await fetchText(candidate.websiteUrl);
    if (html) {
      // Strip HTML tags for a rough text extraction
      content = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }
  }

  if (!content) {
    console.log(`  ✗ No content for ${candidate.name}`);
    return null;
  }

  // 2. Fetch GitHub stars
  const stars = candidate.githubUrl ? await fetchGitHubStars(candidate.githubUrl) : null;

  // 3. LLM enrichment
  const userMessage = `Tool: ${candidate.name}
Website: ${candidate.websiteUrl}
GitHub: ${candidate.githubUrl || "N/A"}
GitHub Stars: ${stars ?? "Unknown"}

--- Content ---
${content}`;

  let parsed: Record<string, unknown>;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const raw = response.choices[0]?.message?.content || "{}";
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`  ✗ LLM error for ${candidate.name}:`, err);
    return null;
  }

  // 4. Validate
  const category = VALID_CATEGORIES.find((c) => c === parsed.category);
  const pricingModel = VALID_PRICING.find((p) => p === parsed.pricing_model);
  const complexity = VALID_COMPLEXITY.find((c) => c === parsed.setup_complexity);
  const maturity = VALID_MATURITY.find((m) => m === parsed.maturity);

  if (!category || !pricingModel || !complexity || !maturity) {
    console.log(`  ✗ Invalid enums for ${candidate.name}: category=${parsed.category} pricing=${parsed.pricing_model} complexity=${parsed.setup_complexity} maturity=${parsed.maturity}`);
    return null;
  }

  const name = (parsed.name as string) || candidate.name;
  const shortDesc = parsed.short_description as string;
  const desc = parsed.description as string;

  if (!shortDesc || !desc) {
    console.log(`  ✗ Missing description for ${candidate.name}`);
    return null;
  }

  // Determine website URL: prefer non-GitHub URL if available
  let websiteUrl = candidate.websiteUrl;
  if (candidate.githubUrl && websiteUrl === candidate.githubUrl) {
    // Use GitHub as website if no other URL
    websiteUrl = candidate.githubUrl;
  }

  return {
    slug: slugify(name),
    name,
    short_description: shortDesc.slice(0, 200),
    description: desc.slice(0, 1000),
    category,
    subcategories: Array.isArray(parsed.subcategories) ? (parsed.subcategories as string[]).slice(0, 5) : [],
    use_cases: Array.isArray(parsed.use_cases) ? (parsed.use_cases as string[]).slice(0, 5) : [],
    integrations: Array.isArray(parsed.integrations) ? (parsed.integrations as string[]).slice(0, 10) : [],
    pricing_model: pricingModel,
    pricing: (parsed.pricing as string) || null,
    github_url: candidate.githubUrl || null,
    github_stars: stars,
    website_url: websiteUrl,
    docs_url: (parsed.docs_url as string) || null,
    featured: false,
    sponsored_tier: null,
    last_updated: today(),
    pros: Array.isArray(parsed.pros) ? (parsed.pros as string[]).slice(0, 5) : [],
    cons: Array.isArray(parsed.cons) ? (parsed.cons as string[]).slice(0, 5) : [],
    setup_complexity: complexity,
    maturity,
    account_id: null,
    status: "published",
  };
}
