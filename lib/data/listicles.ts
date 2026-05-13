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
  {
    slug: "best-mcp-servers-claude-code",
    title: "Best MCP Servers for Claude Code",
    seoTitle: "Best MCP Servers for Claude Code in 2025",
    seoDescription:
      "The best MCP (Model Context Protocol) servers for Claude Code. Verified compatibility, setup guides, and real-world workflows.",
    description:
      "MCP servers that work reliably with Claude Code. Hand-picked for compatibility, setup simplicity, and production reliability. Learn which servers integrate seamlessly and what to expect during setup.",
    categorySlugs: ["best-mcp-servers-claude-code"],
    customSection: {
      title: "Why Claude Code with MCP?",
      body: `Claude Code gives you AI-powered code generation and analysis right in your IDE. Adding MCP servers extends Claude Code with superpowers: access to your Git repos, persistent memory, database queries, and external data sources.

The servers listed here are verified to work with Claude Code and are recommended for production use. Each includes setup notes, compatibility info, and real-world use cases.`,
    },
    datePublished: "2025-05-13",
    dateModified: "2025-05-13",
  },
  {
    slug: "best-mcp-servers-cursor",
    title: "Best MCP Servers for Cursor",
    seoTitle: "Best MCP Servers for Cursor in 2025",
    seoDescription:
      "The best MCP (Model Context Protocol) servers for Cursor. Verified compatibility, cost analysis, and setup guides for Cursor users.",
    description:
      "MCP servers that work reliably with Cursor. Hand-picked for compatibility, performance, and cost-effectiveness. Includes setup friction analysis and cost estimates for each server.",
    categorySlugs: ["best-mcp-servers-cursor"],
    customSection: {
      title: "MCP + Cursor: A Powerful Combo",
      body: `Cursor is the AI-first code editor. Adding MCP servers turns it into a connected agent that can access your codebase, Git history, databases, and external tools—all while maintaining full code control.

The servers here are verified for Cursor compatibility and tested on real development workflows. We include cost breakdowns and setup friction estimates so you can plan deployments confidently.`,
    },
    datePublished: "2025-05-13",
    dateModified: "2025-05-13",
  },
  {
    slug: "best-memory-mcp-servers",
    title: "Best Memory MCP Servers",
    seoTitle: "Best Memory MCP Servers for Persistent Context in 2025",
    seoDescription:
      "Compare MCP servers for persistent memory: which ones actually work for long-term context, knowledge graphs, and state management.",
    description:
      "MCP servers that provide persistent memory and context management. Compare approaches, tradeoffs, setup complexity, and production reliability. Learn which memory server fits your use case.",
    categorySlugs: ["best-memory-mcp-servers"],
    customSection: {
      title: "Why Persistent Memory Matters",
      body: `AI agents need to remember decisions, learn from past interactions, and maintain context across sessions. MCP memory servers solve this by providing durable state beyond a single conversation window.

Persistent memory is the highest-signal MCP wedge: it solves real problems for agentic workflows and developer productivity. This guide compares memory approaches, setup complexity, and production readiness.`,
    },
    datePublished: "2025-05-13",
    dateModified: "2025-05-13",
  },
  {
    slug: "mcp-production-guide",
    title: "MCP in Production: Security, Cost & Reliability",
    seoTitle: "MCP in Production: Security, Cost, Reliability Tradeoffs in 2025",
    seoDescription:
      "Production MCP guide: security posture, cost analysis, reliability patterns, and real-world tradeoffs. Learn what actually works at scale.",
    description:
      "Production MCP strategies: auth models, security hardening, cost optimization, reliability patterns, and lessons from real deployments. Not a tutorial—a reality check for production use.",
    categorySlugs: ["best-mcp-servers"],
    customSection: {
      title: "From Demo to Production",
      body: `MCP in a demo is simple. MCP in production has constraints: auth management, cost controls, reliability under load, security posture, incident response.

This guide captures lessons from builders who've deployed MCP servers in production. What works. What breaks. What costs more than you'd expect. Honest tradeoffs.`,
    },
    datePublished: "2025-05-13",
    dateModified: "2025-05-13",
  },
  {
    slug: "mcp-servers-actually-work",
    title: "Which MCP Servers Actually Work as Advertised?",
    seoTitle: "Which MCP Servers Actually Work as Advertised? A Reality Check",
    seoDescription:
      "A reality check on MCP servers. Which ones deliver as promised? What breaks? Setup friction, maintenance burden, and honest reviews.",
    description:
      "Honest assessment of MCP servers. Which ones deliver as promised in production? Which have gotchas? Maintainer interviews and real-world feedback.",
    categorySlugs: ["best-mcp-servers"],
    customSection: {
      title: "Beyond the Docs",
      body: `MCP server repos look great. But what happens when you actually run them at scale? What breaks? What's the real setup friction? What takes you by surprise?

This guide collects lived experience from builders. Interviews with maintainers. Honest assessments of setup, reliability, and production readiness.`,
    },
    datePublished: "2025-05-13",
    dateModified: "2025-05-13",
  },
  {
    slug: "agentic-ai-jobs-guide",
    title: "What 'Agentic AI' Means in Job Posts",
    seoTitle: "What 'Agentic AI' Means in Job Posts: A Career Guide",
    seoDescription:
      "Decode 'agentic AI' job posts. What skills do they want? How do you prove MCP knowledge? Resume templates and portfolio project ideas.",
    description:
      "Agentic AI is becoming a job market signal. But what does it actually mean? Required skills, proof-of-work projects, resume strategies, and interview prep.",
    categorySlugs: ["best-ai-coding-agents"],
    customSection: {
      title: "Reskilling for Agentic AI",
      body: `'Agentic AI' is exploding in job postings. But candidates don't know what to build or how to prove skills. This guide translates job language into concrete learning paths and proof projects.`,
    },
    datePublished: "2025-05-13",
    dateModified: "2025-05-13",
  },
];

export function getListicleBySlug(slug: string): Listicle | undefined {
  return listicles.find((l) => l.slug === slug);
}
