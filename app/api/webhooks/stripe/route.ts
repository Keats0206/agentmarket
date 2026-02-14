import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body
export const dynamic = "force-dynamic";

async function getSupabaseAdmin() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        // Unhandled event type — that's OK
        break;
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const toolId = session.metadata?.tool_id;
  const tier = session.metadata?.tier;
  if (!toolId || !tier) return;

  const supabase = await getSupabaseAdmin();

  // Retrieve subscription from Stripe
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : (session.subscription as Stripe.Subscription)?.id;

  if (!subscriptionId) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub: any = await stripe.subscriptions.retrieve(subscriptionId);

  // Upsert account (use customer email)
  const email = session.customer_details?.email || session.customer_email || "";
  let accountId: string | null = null;

  if (email) {
    const { data: existingAccount } = await supabase
      .from("accounts")
      .select("id")
      .eq("email", email)
      .single();

    if (existingAccount) {
      accountId = existingAccount.id;
      // Update stripe_customer_id if needed
      await supabase
        .from("accounts")
        .update({ stripe_customer_id: session.customer as string })
        .eq("id", accountId);
    } else {
      const { data: newAccount } = await supabase
        .from("accounts")
        .insert({ email, stripe_customer_id: session.customer as string })
        .select("id")
        .single();
      accountId = newAccount?.id ?? null;
    }
  }

  // Create subscription record
  if (accountId) {
    const periodEnd = sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null;

    await supabase.from("subscriptions").upsert(
      {
        account_id: accountId,
        tool_id: toolId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: sub.items?.data?.[0]?.price?.id ?? "",
        tier,
        status: "active",
        current_period_end: periodEnd,
      },
      { onConflict: "stripe_subscription_id" }
    );
  }

  // Update tool featured / sponsored_tier
  const updateData: Record<string, unknown> = {};
  if (tier === "featured" || tier === "premium") {
    updateData.featured = true;
  }
  updateData.sponsored_tier = tier;
  if (accountId) {
    updateData.account_id = accountId;
  }

  await supabase.from("tools").update(updateData).eq("id", toolId);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const supabase = await getSupabaseAdmin();
  const stripeSubId = subscription.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any;

  const status = sub.status === "active" ? "active" : 
                 sub.status === "past_due" ? "past_due" : "canceled";

  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  await supabase
    .from("subscriptions")
    .update({ status, current_period_end: periodEnd })
    .eq("stripe_subscription_id", stripeSubId);

  // If cancelled/past_due, downgrade the tool
  if (status !== "active") {
    const { data: subRecord } = await supabase
      .from("subscriptions")
      .select("tool_id")
      .eq("stripe_subscription_id", stripeSubId)
      .single();

    if (subRecord) {
      await supabase
        .from("tools")
        .update({ featured: false, sponsored_tier: null })
        .eq("id", subRecord.tool_id);
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = await getSupabaseAdmin();
  const stripeSubId = subscription.id;

  // Get tool_id before updating
  const { data: subRecord } = await supabase
    .from("subscriptions")
    .select("tool_id")
    .eq("stripe_subscription_id", stripeSubId)
    .single();

  // Mark subscription as canceled
  await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", stripeSubId);

  // Remove premium benefits from tool
  if (subRecord) {
    // Check if tool has any other active subscriptions
    const { data: otherSubs } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("tool_id", subRecord.tool_id)
      .eq("status", "active")
      .neq("stripe_subscription_id", stripeSubId);

    if (!otherSubs || otherSubs.length === 0) {
      await supabase
        .from("tools")
        .update({ featured: false, sponsored_tier: null })
        .eq("id", subRecord.tool_id);
    }
  }
}
