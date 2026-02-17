import type { Listicle } from "../types";

export const listicles: Listicle[] = [
  {
    slug: "best-ai-agent-frameworks",
    title: "Best AI Agent Frameworks for 2025",
    seoTitle: "Best AI Agent Frameworks for 2025 — LangChain, CrewAI, AutoGen & More",
    seoDescription:
      "Compare the best AI agent frameworks for 2025: LangChain, CrewAI, AutoGen, LangGraph, LlamaIndex, MetaGPT. Build multi-agent systems, RAG apps, and autonomous agents with the right framework.",
    description:
      "Frameworks for building AI agents, multi-agent systems, and LLM-powered applications. From general-purpose chains to role-based agent crews — find the right framework for your use case.",
    categorySlugs: ["best-multi-agent-frameworks", "best-llm-frameworks"],
  },
  {
    slug: "best-mcp-servers-for-2025",
    title: "Best MCP Servers for 2025",
    seoTitle: "Best MCP Servers for 2025 — Top Model Context Protocol Servers",
    seoDescription:
      "The best MCP (Model Context Protocol) servers for 2025. Compare MCP servers for GitHub, Slack, Notion, databases, web search, and more. Hand-picked for developers building AI agents.",
    description:
      "Hand-picked Model Context Protocol servers that extend AI agents with real-world capabilities. From GitHub and Slack to databases and web search — find the right MCP servers for your stack.",
    categorySlugs: ["best-mcp-servers"],
    customSection: {
      title: "What is MCP (Model Context Protocol)?",
      body: `The Model Context Protocol (MCP) is an open standard developed by Anthropic that enables AI assistants to connect with external data sources and tools. Think of it as a USB port for AI — a standardized way for AI agents to interact with the world.

MCP servers expose capabilities (tools, resources, prompts) that AI clients like Claude, Cursor, and Windsurf can use. This allows AI agents to read files, query databases, send messages, browse the web, and much more — all through a secure, standardized protocol.`,
    },
  },
  {
    slug: "best-vector-databases",
    title: "Best Vector Databases for AI",
    seoTitle: "Best Vector Databases for AI in 2025",
    seoDescription:
      "Compare top vector databases: Pinecone, Weaviate, ChromaDB, Qdrant. Find the best vector DB for your RAG, search, and AI applications.",
    description:
      "Vector databases for storing and querying embeddings. Compare managed vs self-hosted, performance, pricing, and ecosystem integrations.",
    categorySlugs: ["best-vector-databases"],
  },
  {
    slug: "best-ai-coding-agents",
    title: "Best AI Coding Agents",
    seoTitle: "Best AI Coding Agents in 2025",
    seoDescription:
      "Compare the best AI coding agents including Aider, Devin, SWE-agent, and more. Find the right AI pair programmer for your development workflow.",
    description:
      "AI coding agents that write, edit, and debug code. From autonomous software engineers to terminal-based pair programmers, find the right coding agent for your workflow.",
    categorySlugs: ["best-ai-coding-agents"],
  },
  {
    slug: "best-autonomous-agents",
    title: "Best Autonomous AI Agents",
    seoTitle: "Best Autonomous AI Agents in 2025",
    seoDescription:
      "Discover the best autonomous AI agents: AutoGPT, BabyAGI, SuperAGI. Compare self-directed agents that accomplish goals without human intervention.",
    description:
      "Self-directed AI agents that break down goals, plan tasks, and execute autonomously. Compare the leading autonomous agent frameworks and platforms.",
    categorySlugs: ["best-autonomous-agents"],
  },
  {
    slug: "best-ai-inference-platforms",
    title: "Best AI Inference Platforms",
    seoTitle: "Best AI Inference Platforms in 2025",
    seoDescription:
      "Compare top AI inference platforms: Groq, Together AI, Fireworks AI, Replicate, Modal. Find the fastest and most cost-effective inference for your AI applications.",
    description:
      "Platforms for running AI model inference at scale. Compare speed, pricing, model support, and features for production deployments.",
    categorySlugs: ["best-ai-inference-platforms"],
  },
];

export function getListicleBySlug(slug: string): Listicle | undefined {
  return listicles.find((l) => l.slug === slug);
}
