import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { mcpPlatforms, getMCPPlatformBySlug, getToolBySlug } from "@/lib/data";
import ToolCard from "@/components/ToolCard";

export async function generateStaticParams() {
  return mcpPlatforms.map((p) => ({ platform: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform: platformSlug } = await params;
  const platform = getMCPPlatformBySlug(platformSlug);
  if (!platform) return { title: "Platform Not Found" };
  return {
    title: `Best MCP Servers for ${platform.name}`,
    description: platform.description,
  };
}

export default async function MCPPlatformPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform: platformSlug } = await params;
  const platform = getMCPPlatformBySlug(platformSlug);
  if (!platform) notFound();

  const platformTools = platform.toolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/mcp-servers" className="hover:text-foreground transition-colors">MCP Servers</Link>
        <span>/</span>
        <span className="text-foreground">{platform.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          MCP Servers for {platform.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">{platform.description}</p>
        <div className="mt-4 text-xs text-muted">
          {platformTools.length} server{platformTools.length !== 1 ? "s" : ""} indexed
        </div>
      </div>

      {/* Tools */}
      <div className="grid gap-4 sm:grid-cols-2">
        {platformTools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
        ))}
      </div>

      {/* Other Platforms */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-serif text-xl font-medium text-foreground">Other MCP Server Categories</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mcpPlatforms
            .filter((p) => p.slug !== platformSlug)
            .map((p) => (
              <Link
                key={p.slug}
                href={`/mcp-servers/${p.slug}`}
                className="group rounded-2xl border border-border bg-card p-4 transition-all hover:bg-card-hover"
              >
                <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs text-muted line-clamp-1">{p.description}</p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
