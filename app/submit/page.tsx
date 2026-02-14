import Link from "next/link";
import type { Metadata } from "next";
import SubmitForm from "@/components/SubmitForm";
import UpgradeButton from "@/components/UpgradeButton";

export const metadata: Metadata = {
  title: "Submit Your Tool",
  description: "Get your AI tool, MCP server, or agent framework listed on AgentIndex. Free basic listing, sponsored options available.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Submit Tool</span>
      </nav>

      <h1 className="font-serif text-3xl font-medium text-foreground">Submit Your Tool</h1>
      <p className="mt-3 text-sm text-muted leading-relaxed">
        Get your AI agent, MCP server, or developer tool listed on AgentIndex.
        We review every submission manually to maintain quality.
      </p>

      {/* Pricing Tiers */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">Basic Listing</h3>
          <div className="mt-2 font-serif text-2xl font-medium text-foreground">Free</div>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Tool profile page
            </li>
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Category inclusion
            </li>
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Search indexing
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-foreground bg-card p-6 relative">
          <div className="absolute -top-2.5 right-4 rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold text-background uppercase">
            Popular
          </div>
          <h3 className="text-sm font-semibold text-foreground">Featured</h3>
          <div className="mt-2 font-serif text-2xl font-medium text-foreground">$249<span className="text-sm text-muted font-normal font-sans">/mo</span></div>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Everything in Basic
            </li>
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              &quot;Featured&quot; badge
            </li>
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Top of category pages
            </li>
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Homepage placement
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">Premium</h3>
          <div className="mt-2 font-serif text-2xl font-medium text-foreground">$499<span className="text-sm text-muted font-normal font-sans">/mo</span></div>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Everything in Featured
            </li>
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Comparison page inclusion
            </li>
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Priority in search
            </li>
            <li className="flex items-start gap-2 text-xs text-muted">
              <svg className="mt-0.5 shrink-0 text-emerald-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              Custom editorial review
            </li>
          </ul>
        </div>
      </div>

      {/* Submit Form */}
      <div className="mt-12">
        <h2 className="font-serif text-xl font-medium text-foreground mb-6">Submit Your Tool</h2>
        <SubmitForm />
      </div>

      {/* Upgrade CTA */}
      <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: "var(--section-warm-bg)", borderColor: "var(--section-warm-border)", borderWidth: 1, borderStyle: "solid" }}>
        <h2 className="font-serif text-xl font-medium text-foreground">Want more visibility?</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--section-warm-muted)" }}>
          Already listed? Upgrade your listing to get in front of more developers.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <UpgradeButton toolId="" tier="featured" label="Get Featured — $249/mo" />
          <UpgradeButton
            toolId=""
            tier="premium"
            label="Get Premium — $499/mo"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
          />
        </div>
        <p className="mt-4 text-[10px] text-muted">
          Or email <a href="mailto:sponsors@agentindex.dev" className="text-accent hover:text-accent-hover">sponsors@agentindex.dev</a> for custom packages
        </p>
      </div>
    </div>
  );
}
