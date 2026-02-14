"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Agent<span className="text-accent">Index</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/category/best-ai-coding-agents" className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground">
            Browse Tools
          </Link>
          <Link href="/mcp-servers" className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground">
            MCP Servers
          </Link>
          <Link href="/compare/langchain-vs-llamaindex" className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground">
            Compare
          </Link>
          <Link href="/search" className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground">
            Search
          </Link>
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground sm:block"
          >
            Dashboard
          </Link>
          <Link
            href="/submit"
            className="hidden rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 sm:block"
          >
            Submit Tool
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted transition-colors hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Link href="/category/best-ai-coding-agents" className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Browse Tools
            </Link>
            <Link href="/mcp-servers" className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
              MCP Servers
            </Link>
            <Link href="/compare/langchain-vs-llamaindex" className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Compare
            </Link>
            <Link href="/search" className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Search
            </Link>
            <Link href="/dashboard" className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
            <Link href="/submit" className="mt-2 rounded-lg bg-foreground px-3 py-2.5 text-sm font-medium text-background text-center" onClick={() => setMobileOpen(false)}>
              Submit Tool
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
