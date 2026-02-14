"use client";

import { useState } from "react";

const CATEGORIES = [
  { value: "agent", label: "AI Agent" },
  { value: "mcp-server", label: "MCP Server" },
  { value: "framework", label: "Framework" },
  { value: "infra", label: "Infrastructure" },
  { value: "platform", label: "Platform" },
];

export default function SubmitForm() {
  const [form, setForm] = useState({
    name: "",
    websiteUrl: "",
    category: "agent",
    shortDescription: "",
    email: "",
    githubUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-700">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-lg font-medium text-foreground">Submission received!</h3>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll review your tool and get back to you within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form id="submit-form" onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-muted mb-1.5">
            Tool Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. MyAgent"
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>
        <div>
          <label htmlFor="websiteUrl" className="block text-xs font-medium text-muted mb-1.5">
            Website URL *
          </label>
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            value={form.websiteUrl}
            onChange={handleChange}
            required
            placeholder="https://myagent.dev"
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-muted mb-1.5">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">
            Contact Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@company.com"
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>
      </div>

      <div>
        <label htmlFor="shortDescription" className="block text-xs font-medium text-muted mb-1.5">
          Short Description *
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          required
          rows={3}
          placeholder="A one-liner describing what your tool does..."
          className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10 resize-none"
        />
      </div>

      <div>
        <label htmlFor="githubUrl" className="block text-xs font-medium text-muted mb-1.5">
          GitHub URL <span className="text-muted/60">(optional)</span>
        </label>
        <input
          id="githubUrl"
          name="githubUrl"
          type="url"
          value={form.githubUrl}
          onChange={handleChange}
          placeholder="https://github.com/org/repo"
          className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit for Review — Free"}
      </button>

      <p className="text-center text-[10px] text-muted">
        Free basic listing. Want Featured or Premium placement? Submit first, then upgrade.
      </p>
    </form>
  );
}
