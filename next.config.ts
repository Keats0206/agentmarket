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
    ];
  },
};

export default nextConfig;
