import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, websiteUrl, category, shortDescription, email, githubUrl } = body;

    // Validate required fields
    if (!name || !websiteUrl || !category || !shortDescription || !email) {
      return NextResponse.json(
        { error: "name, websiteUrl, category, shortDescription, and email are required" },
        { status: 400 }
      );
    }

    // If Supabase is configured, save to DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      // Find or create account by email
      let accountId: string | null = null;
      const { data: existing } = await supabase
        .from("accounts")
        .select("id")
        .eq("email", email)
        .single();

      if (existing) {
        accountId = existing.id;
      } else {
        const { data: newAccount } = await supabase
          .from("accounts")
          .insert({ email })
          .select("id")
          .single();
        accountId = newAccount?.id ?? null;
      }

      // Create submission
      await supabase.from("submissions").insert({
        account_id: accountId,
        payload: { name, websiteUrl, category, shortDescription, email, githubUrl },
        status: "pending",
      });

      // Also create a draft tool
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      await supabase.from("tools").insert({
        slug: `${slug}-${Date.now()}`, // ensure unique
        name,
        short_description: shortDescription,
        description: shortDescription,
        category,
        website_url: websiteUrl,
        github_url: githubUrl || null,
        pricing_model: "Free",
        account_id: accountId,
        status: "pending_review",
        subcategories: [],
        use_cases: [],
        integrations: [],
        pros: [],
        cons: [],
        setup_complexity: "Medium",
        maturity: "Early",
      });
    }

    return NextResponse.json({ success: true, message: "Submission received! We'll review it within 48 hours." });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
