import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Sponsor a Listing",
  description:
    "Get your AI tool or MCP server in front of high-intent developers. Simple monthly tiers for featured placement on Hot 100 AI.",
};

const TIERS = [
  {
    id: "category",
    name: "Category Highlight",
    price: "$99",
    period: "/mo",
    tagline: "Stand out inside a single category",
    features: [
      "Listed at top of one category page",
      "Sponsored badge on your listing",
      "Priority placement in search results",
      "Verified trust signal",
      "Dedicated tool detail page",
      "Cancel anytime",
    ],
    cta: "Get Category Highlight",
    highlighted: false,
  },
  {
    id: "featured",
    name: "Featured",
    price: "$249",
    period: "/mo",
    tagline: "Homepage visibility for your tool",
    features: [
      "Everything in Category Highlight",
      "Featured slot on the homepage",
      "Featured badge on your listing",
      "Included in curated lists",
      "Email newsletter mention (when live)",
      "Cancel anytime",
    ],
    cta: "Get Featured",
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$499",
    period: "/mo",
    tagline: "Maximum reach across the whole site",
    features: [
      "Everything in Featured",
      "Top placement across ALL categories",
      "Premium badge + bold treatment",
      "Pinned in relevant comparisons",
      "Guaranteed impressions in your niche",
      "Dedicated support channel",
    ],
    cta: "Go Premium",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Put your tool in front of builders
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Hot 100 AI is where developers go to find MCP servers and AI tools that
          actually work. Sponsor a listing and get in front of high-intent traffic.
        </p>
      </div>

      {/* Stats strip */}
      <div className="mx-auto mt-10 flex max-w-2xl items-center justify-around rounded-2xl border border-border bg-card px-6 py-5">
        <div className="text-center">
          <div className="text-2xl font-serif font-semibold text-foreground">276+</div>
          <div className="text-xs text-muted">Tools Indexed</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="text-center">
          <div className="text-2xl font-serif font-semibold text-foreground">Dev</div>
          <div className="text-xs text-muted">Audience</div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="text-center">
          <div className="text-2xl font-serif font-semibold text-foreground">Daily</div>
          <div className="text-xs text-muted">Refreshed</div>
        </div>
      </div>

      {/* Tiers */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative flex flex-col rounded-3xl border p-8 ${
              tier.highlighted
                ? "border-accent bg-card shadow-lg ring-1 ring-accent/20"
                : "border-border bg-card"
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
                Most Popular
              </div>
            )}
            <h2 className="text-lg font-semibold text-foreground">{tier.name}</h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-serif text-4xl font-semibold text-foreground">
                {tier.price}
              </span>
              <span className="text-sm text-muted">{tier.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{tier.tagline}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <svg className="mt-0.5 shrink-0 text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/submit"
              className={`mt-8 rounded-xl px-5 py-3 text-center text-sm font-medium transition-opacity hover:opacity-85 ${
                tier.highlighted
                  ? "bg-foreground text-background"
                  : "border border-border text-foreground hover:bg-card-hover"
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Affiliate callout */}
      <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-border bg-card p-8 text-center">
        <h2 className="font-serif text-xl font-medium text-foreground">
          Prefer performance-based? Become an affiliate
        </h2>
        <p className="mt-3 text-sm text-muted">
          If you&apos;d rather pay per click than a flat monthly fee, affiliate
          listings put your tool behind a tracked link and you only pay for the
          traffic you actually receive. <span className="text-foreground">Coming soon</span>.
        </p>
        <Link
          href="/submit"
          className="mt-6 inline-block rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Submit Your Tool — Free
        </Link>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-12 max-w-3xl space-y-4">
        <h2 className="font-serif text-xl font-medium text-foreground">FAQ</h2>
        {[
          {
            q: "How fast does my listing go live?",
            a: "Sponsored listings activate as soon as your first payment clears — typically within minutes. Free submissions go through a short review.",
          },
          {
            q: "Can I cancel anytime?",
            a: "Yes. Subscriptions are month-to-month. Cancel from the billing portal and your sponsored placement is removed at the end of the current period.",
          },
          {
            q: "What's the difference between tiers?",
            a: "Category Highlight puts you top of one category. Featured adds homepage visibility. Premium spreads you across the entire site and comparisons.",
          },
        ].map((item) => (
          <div key={item.q} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">{item.q}</h3>
            <p className="mt-2 text-sm text-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
