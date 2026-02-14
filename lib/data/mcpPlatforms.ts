import type { MCPPlatform } from "../types";

// ─── MCP Platforms ──────────────────────────────────────────────────────────
export const mcpPlatforms: MCPPlatform[] = [
  {
    slug: "developer-tools",
    name: "Developer Tools",
    description: "MCP servers for development workflows — GitHub, databases, filesystems, and more.",
    toolSlugs: ["mcp-github", "mcp-postgres", "mcp-filesystem", "mcp-sqlite", "mcp-sentry", "mcp-linear"],
  },
  {
    slug: "communication",
    name: "Communication & Collaboration",
    description: "MCP servers for team communication — Slack, email, and messaging platforms.",
    toolSlugs: ["mcp-slack"],
  },
  {
    slug: "productivity",
    name: "Productivity & Docs",
    description: "MCP servers for productivity tools — Notion, Google Drive, and document management.",
    toolSlugs: ["mcp-notion", "mcp-google-drive"],
  },
  {
    slug: "web-automation",
    name: "Web & Automation",
    description: "MCP servers for web browsing, search, and browser automation.",
    toolSlugs: ["mcp-brave-search", "mcp-puppeteer", "mcp-fetch"],
  },
  {
    slug: "data-memory",
    name: "Data & Memory",
    description: "MCP servers for persistent memory, knowledge graphs, and data management.",
    toolSlugs: ["mcp-memory", "mcp-postgres", "mcp-sqlite"],
  },
  {
    slug: "location-maps",
    name: "Location & Maps",
    description: "MCP servers for geocoding, place search, and location-based services.",
    toolSlugs: ["mcp-google-maps"],
  },
];
