"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-700">
            <path d="M22 2L2 8.67l9.58 3.75L15.33 22 22 2z" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Check your email</h1>
        <p className="mt-3 text-sm text-muted">
          We sent a magic link to <span className="font-medium text-foreground">{email}</span>.
          Click the link in the email to sign in.
        </p>
        <Link href="/" className="mt-8 inline-block text-sm text-accent hover:text-accent-hover transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-medium text-foreground">Sign in to AgentIndex</h1>
        <p className="mt-2 text-sm text-muted">
          Manage your tool listings and subscriptions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        No account needed. We&apos;ll create one automatically.
      </p>
    </div>
  );
}
