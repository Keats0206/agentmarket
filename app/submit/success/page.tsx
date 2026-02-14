import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submission Successful",
  description: "Your tool has been submitted to Hot 100 AI.",
};

export default function SubmitSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="font-serif text-3xl font-medium text-foreground">You&apos;re all set!</h1>
      <p className="mt-4 text-sm text-muted leading-relaxed max-w-md mx-auto">
        Your tool submission has been received. We&apos;ll review it and get back to you within 48 hours.
        If you selected a paid tier, your subscription is now active.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Back to Home
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
