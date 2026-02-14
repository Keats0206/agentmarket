"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ size = "lg", defaultValue = "" }: { size?: "sm" | "lg"; defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  const isLg = size === "lg";

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <svg
          className={`absolute left-4 text-muted ${isLg ? "top-4" : "top-2.5"}`}
          width={isLg ? "20" : "16"}
          height={isLg ? "20" : "16"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isLg ? 'Search tools... "MCP server for Slack", "code review agent"' : "Search tools..."}
          className={`w-full rounded-2xl border border-border bg-white text-foreground placeholder:text-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10 ${
            isLg ? "py-3.5 pl-12 pr-28 text-base" : "py-2 pl-10 pr-4 text-sm"
          }`}
        />
        {isLg && (
          <button
            type="submit"
            className="absolute right-2 top-2 rounded-xl bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
