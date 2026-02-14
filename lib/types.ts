export type ToolCategory = "agent" | "mcp-server" | "framework" | "infra" | "platform";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ToolCategory;
  subcategories: string[];
  useCases: string[];
  integrations: string[];
  pricingModel: "Free" | "Open Source" | "Freemium" | "Paid" | "Enterprise";
  pricing?: string;
  githubUrl?: string;
  githubStars?: number;
  websiteUrl: string;
  docsUrl?: string;
  featured: boolean;
  sponsoredTier?: "basic" | "category" | "premium";
  lastUpdated: string;
  pros: string[];
  cons: string[];
  setupComplexity: "Low" | "Medium" | "High";
  maturity: "Early" | "Growing" | "Mature";
}

export interface CategoryPage {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  description: string;
  toolSlugs: string[];
}

export interface ComparisonPage {
  slug: string;
  toolASlug: string;
  toolBSlug: string;
  verdict: string;
  features: { name: string; toolA: string; toolB: string }[];
  seoTitle: string;
  seoDescription: string;
}

export interface MCPPlatform {
  slug: string;
  name: string;
  description: string;
  toolSlugs: string[];
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  agent: "AI Agent",
  "mcp-server": "MCP Server",
  framework: "Framework",
  infra: "Infrastructure",
  platform: "Platform",
};

export const CATEGORY_COLORS: Record<ToolCategory, string> = {
  agent: "bg-violet-100/70 text-violet-700 border-violet-200",
  "mcp-server": "bg-emerald-100/70 text-emerald-700 border-emerald-200",
  framework: "bg-blue-100/70 text-blue-700 border-blue-200",
  infra: "bg-amber-100/70 text-amber-700 border-amber-200",
  platform: "bg-rose-100/70 text-rose-700 border-rose-200",
};
