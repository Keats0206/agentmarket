import { NextRequest, NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/db/tools";

export const dynamic = "force-dynamic";

/**
 * Affiliate redirect + click tracking.
 * /go/[slug] → logs the click to Supabase, then 302-redirects to the tool's
 * affiliate URL (or website URL as fallback).
 *
 * Every outbound "Visit Website" / affiliate CTA should point here so we can
 * measure which tools actually drive conversion and surface top referrers.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return NextResponse.redirect(new URL("/", req.url), 302);
  }

  const destination = tool.affiliateUrl || tool.websiteUrl;

  // Fire-and-forget click tracking (don't block the redirect on DB latency)
  trackClick(req, slug, destination).catch((err) => {
    console.error("Affiliate click tracking failed:", err);
  });

  return NextResponse.redirect(destination, 302);
}

async function trackClick(
  req: NextRequest,
  toolSlug: string,
  destination: string
) {
  // Skip tracking if Supabase isn't configured (static/local fallback)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const referer = req.headers.get("referer") ?? undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  // Hash the IP so we can dedupe without storing raw PII
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const ipHash = ip ? await hashIp(ip) : null;

  await supabase.from("affiliate_clicks").insert({
    tool_slug: toolSlug,
    destination_url: destination,
    referer,
    user_agent: userAgent,
    ip_hash: ipHash,
  });
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
