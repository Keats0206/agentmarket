import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/langchain-vs-llamaindex",
        destination: "/compare/langchain-vs-llamaindex",
        permanent: true,
      },
      {
        source: "/best-ai-agent-frameworks",
        destination: "/best/best-ai-agent-frameworks",
        permanent: true,
      },
      {
        source: "/best-mcp-servers-for-2025",
        destination: "/best/best-mcp-servers-for-2025",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
