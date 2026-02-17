import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#E5E0DA]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold">
                Agent<span className="text-[#D4956F]">Index</span>
              </span>
            </Link>
            <p className="mt-3 text-xs text-[#9A948D] leading-5">
              The canonical index of AI agents, MCP servers, and agentic tools.
            </p>
          </div>

          {/* Best of / Listicles */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9A948D]">Best of</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/best/best-ai-agent-frameworks" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Best AI Agent Frameworks</Link></li>
              <li><Link href="/best/best-mcp-servers-for-2025" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Best MCP Servers 2025</Link></li>
              <li><Link href="/best/best-vector-databases" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Best Vector Databases</Link></li>
              <li><Link href="/best/best-ai-coding-agents" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Best AI Coding Agents</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9A948D]">Categories</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/category/best-ai-coding-agents" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Coding Agents</Link></li>
              <li><Link href="/category/best-multi-agent-frameworks" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Multi-Agent Frameworks</Link></li>
              <li><Link href="/category/best-llm-frameworks" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">LLM Frameworks</Link></li>
              <li><Link href="/category/best-vector-databases" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Vector Databases</Link></li>
            </ul>
          </div>

          {/* MCP */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9A948D]">MCP Servers</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/mcp-servers/developer-tools" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Developer Tools</Link></li>
              <li><Link href="/mcp-servers/communication" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Communication</Link></li>
              <li><Link href="/mcp-servers/productivity" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Productivity</Link></li>
              <li><Link href="/mcp-servers/web-automation" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Web & Automation</Link></li>
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9A948D]">Compare</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/compare/langchain-vs-llamaindex" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">LangChain vs LlamaIndex</Link></li>
              <li><Link href="/compare/crewai-vs-autogen" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">CrewAI vs AutoGen</Link></li>
              <li><Link href="/compare/pinecone-vs-weaviate" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">Pinecone vs Weaviate</Link></li>
              <li><Link href="/compare/langchain-vs-crewai" className="text-sm text-[#B0AAA3] hover:text-white transition-colors">LangChain vs CrewAI</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#2A2A2A] pt-8 sm:flex-row">
          <p className="text-xs text-[#7A746D]">
            &copy; {new Date().getFullYear()} Hot 100 AI. Built for developers, by developers.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/submit" className="text-xs text-[#9A948D] hover:text-white transition-colors">Submit a Tool</Link>
            <span className="text-[#333]">|</span>
            <a href="mailto:hello@hot100ai.dev" className="text-xs text-[#9A948D] hover:text-white transition-colors">Contact</a>
            <span className="text-[#333]">|</span>
            <Link href="/search" className="text-xs text-[#9A948D] hover:text-white transition-colors">Search</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
