import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Hot 100 AI tool listings and subscriptions.",
};

async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in Server Components
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getUserData(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { account: null, tools: [], subscriptions: [], submissions: [] };
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Get account
  const { data: account } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", userId)
    .single();

  // Get tools owned by this user
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("account_id", userId)
    .order("created_at", { ascending: false });

  // Get subscriptions
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("account_id", userId)
    .order("created_at", { ascending: false });

  // Get submissions
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("account_id", userId)
    .order("created_at", { ascending: false });

  return {
    account,
    tools: tools || [],
    subscriptions: subscriptions || [],
    submissions: submissions || [],
  };
}

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { account, tools, subscriptions, submissions } = await getUserData(user.id);

  const activeSubscriptions = subscriptions.filter(
    (s: Record<string, unknown>) => s.status === "active"
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <Link
          href="/submit"
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Submit New Tool
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-2xl font-serif font-semibold text-foreground">{tools.length}</div>
          <div className="text-xs text-muted mt-1">My Listings</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-2xl font-serif font-semibold text-foreground">{activeSubscriptions.length}</div>
          <div className="text-xs text-muted mt-1">Active Subscriptions</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-2xl font-serif font-semibold text-foreground">{submissions.length}</div>
          <div className="text-xs text-muted mt-1">Submissions</div>
        </div>
      </div>

      {/* My Listings */}
      <section className="mb-8">
        <h2 className="font-serif text-lg font-medium text-foreground mb-4">My Listings</h2>
        {tools.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted">No listings yet.</p>
            <Link href="/submit" className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
              Submit your first tool
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tools.map((tool: Record<string, unknown>) => (
              <div
                key={tool.id as string}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-sm font-semibold font-serif text-foreground">
                    {(tool.name as string).charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{tool.name as string}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        tool.status === "published"
                          ? "bg-emerald-100/70 text-emerald-700"
                          : tool.status === "pending_review"
                          ? "bg-amber-100/70 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {tool.status as string}
                      </span>
                      {tool.sponsored_tier ? (
                        <span className="rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent">
                          {tool.sponsored_tier as string}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tool.status === "published" && !tool.sponsored_tier && (
                    <Link
                      href={`/submit?upgrade=${tool.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-card-hover transition-colors"
                    >
                      Upgrade
                    </Link>
                  )}
                  {tool.status === "published" && (
                    <Link
                      href={`/tool/${tool.slug}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Manage Billing */}
      {account?.stripe_customer_id && (
        <section className="mb-8">
          <h2 className="font-serif text-lg font-medium text-foreground mb-4">Billing</h2>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted mb-4">
              Manage your payment methods, view invoices, or cancel subscriptions.
            </p>
            <BillingPortalButton customerId={account.stripe_customer_id} />
          </div>
        </section>
      )}

      {/* Submissions History */}
      {submissions.length > 0 && (
        <section>
          <h2 className="font-serif text-lg font-medium text-foreground mb-4">Submission History</h2>
          <div className="space-y-2">
            {submissions.map((sub: Record<string, unknown>) => (
              <div
                key={sub.id as string}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="text-sm text-foreground">
                  {(sub.payload as Record<string, string>)?.name || "Untitled"}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  sub.status === "approved"
                    ? "bg-emerald-100/70 text-emerald-700"
                    : sub.status === "rejected"
                    ? "bg-red-100/70 text-red-700"
                    : "bg-amber-100/70 text-amber-700"
                }`}>
                  {sub.status as string}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Client component for billing portal redirect
function BillingPortalButton({ customerId }: { customerId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { stripe } = await import("@/lib/stripe");
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${siteUrl}/dashboard`,
        });
        const { redirect } = await import("next/navigation");
        redirect(session.url);
      }}
    >
      <button
        type="submit"
        className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
      >
        Manage Billing
      </button>
    </form>
  );
}
