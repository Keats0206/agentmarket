import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search AI Agents & Tools",
  description:
    "Search and compare AI agents, MCP servers, frameworks, and developer tools. Find the right tool for your AI stack.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
