import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { categories, getCategoryBySlug, getToolBySlug, sortByPremium } from "@/lib/data";
import ToolCard from "@/components/ToolCard";

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.seoTitle,
    description: category.seoDescription,
    openGraph: {
      title: category.seoTitle,
      description: category.seoDescription,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryTools = sortByPremium(
    category.toolSlugs
      .map((slug) => getToolBySlug(slug))
      .filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Categories</span>
        <span>/</span>
        <span className="text-foreground">{category.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">{category.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">{category.description}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted">
          <span>{categoryTools.length} tools</span>
          <span className="text-border">&middot;</span>
          <span>Updated February 2025</span>
        </div>
      </div>

      {/* Sponsored Notice */}
      {categoryTools.some((t) => t.featured) && (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-2.5 text-xs text-accent">
          Tools marked &quot;Featured&quot; are sponsored listings. Rankings are based on editorial assessment.
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {categoryTools.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} rank={i + 1} />
        ))}
      </div>

      {/* Other Categories */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-serif text-xl font-medium text-foreground">Other Categories</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((c) => c.slug !== slug)
            .slice(0, 6)
            .map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group rounded-2xl border border-border bg-card p-4 transition-all hover:bg-card-hover"
              >
                <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-1 text-xs text-muted line-clamp-1">{cat.description}</p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
