#!/usr/bin/env node

/**
 * GitHub MCP Scraper
 *
 * Scrapes the official MCP servers repository and popular community MCP implementations
 * to discover and index new MCP servers for Hot 100 AI.
 *
 * Usage: node scripts/scrape-mcp-repos.js [--output tools.json]
 *
 * Requires: GITHUB_TOKEN environment variable
 */

import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_FILE = process.argv.includes("--output")
  ? process.argv[process.argv.indexOf("--output") + 1]
  : "mcp-repos.json";

const REPOS_TO_SEARCH = [
  // Official MCP servers
  "modelcontextprotocol/servers",
  // Popular community implementations
  "groveco/mcp-py-logging",
  "zeyus/mcp-crewai-server",
  "simonwiles/mcp-server-nextjs",
  "zacharyc/mcp-dotenv-server",
  "kamiazya/mcp-server-document-qa",
];

interface MCPServer {
  name: string;
  slug: string;
  description: string;
  repo: string;
  stars: number;
  language: string;
  url: string;
  topics: string[];
  maturity: "Early" | "Growing" | "Mature";
}

async function fetchGitHubAPI(
  endpoint: string,
  options: Record<string, any> = {}
) {
  const url = `https://api.github.com${endpoint}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers, ...options });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

async function searchMCPServers(): Promise<MCPServer[]> {
  console.log("🔍 Searching for MCP servers on GitHub...\n");

  const servers: MCPServer[] = [];
  const seen = new Set<string>();

  // Search main repos
  for (const repo of REPOS_TO_SEARCH) {
    console.log(`📦 Checking ${repo}...`);

    try {
      // Get repo info
      const repoData = await fetchGitHubAPI(`/repos/${repo}`);

      // Search for MCP-related files in the repo
      try {
        const searchResults = await fetchGitHubAPI(
          `/search/repositories?q=path:server in:repo:${repo} mcp`,
          { per_page: 10 }
        );

        if (searchResults.items && searchResults.items.length > 0) {
          for (const item of searchResults.items) {
            const slug = item.name.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

            if (!seen.has(item.html_url)) {
              seen.add(item.html_url);

              servers.push({
                name: item.name
                  .replace(/-/g, " ")
                  .replace(/mcp\s*/i, "")
                  .replace(/server\s*/i, "")
                  .trim() + " MCP Server",
                slug: `mcp-${slug}`,
                description: item.description || `MCP server for ${item.name}`,
                repo: item.full_name,
                stars: item.stargazers_count || 0,
                language: item.language || "Python",
                url: item.html_url,
                topics: item.topics || [],
                maturity:
                  item.stargazers_count > 5000
                    ? "Mature"
                    : item.stargazers_count > 500
                      ? "Growing"
                      : "Early",
              });
            }
          }
        }
      } catch (e) {
        console.log(
          `  ⚠️  Could not search repo (API limit): ${(e as Error).message}`
        );
      }
    } catch (e) {
      console.log(`  ❌ Error: ${(e as Error).message}`);
    }
  }

  // Search GitHub for MCP servers (general search)
  console.log("\n🔎 Searching GitHub for MCP servers...");
  try {
    const searchResults = await fetchGitHubAPI(
      `/search/repositories?q=topic:mcp+server+language:python+language:javascript+language:rust&sort=stars&order=desc&per_page=30`,
      {}
    );

    if (searchResults.items) {
      for (const item of searchResults.items.slice(0, 20)) {
        const slug = item.name.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

        if (!seen.has(item.html_url)) {
          seen.add(item.html_url);

          servers.push({
            name: item.name
              .replace(/-/g, " ")
              .replace(/mcp\s*/i, "")
              .replace(/server\s*/i, "")
              .trim() + " MCP Server",
            slug: `mcp-${slug}`,
            description: item.description || `MCP server for ${item.name}`,
            repo: item.full_name,
            stars: item.stargazers_count || 0,
            language: item.language || "Unknown",
            url: item.html_url,
            topics: item.topics || [],
            maturity:
              item.stargazers_count > 5000
                ? "Mature"
                : item.stargazers_count > 500
                  ? "Growing"
                  : "Early",
          });
        }
      }
    }
  } catch (e) {
    console.log(`⚠️  GitHub search limit reached: ${(e as Error).message}`);
  }

  // Sort by stars
  servers.sort((a, b) => b.stars - a.stars);

  return servers;
}

async function main() {
  if (!GITHUB_TOKEN) {
    console.warn(
      "⚠️  GITHUB_TOKEN not set. Rate limits will be low (60 req/hr).\n"
    );
  }

  const servers = await searchMCPServers();

  console.log(`\n✅ Found ${servers.length} MCP servers!\n`);

  // Display results
  console.log("Top 10 by stars:");
  servers.slice(0, 10).forEach((s, i) => {
    console.log(
      `${i + 1}. ${s.name} (${s.stars} ⭐) - ${s.repo} [${s.maturity}]`
    );
  });

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(servers, null, 2));
  console.log(`\n📝 Saved to ${OUTPUT_FILE}`);

  console.log(
    "\n💡 Next steps: Add these to lib/data/tools.ts with full metadata"
  );
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
