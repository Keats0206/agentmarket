import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICES, PriceTier } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolId, tier, email } = body as {
      toolId: string;
      tier: PriceTier;
      email?: string;
    };

    if (!toolId || !tier) {
      return NextResponse.json({ error: "toolId and tier are required" }, { status: 400 });
    }

    const priceId = PRICES[tier];
    if (!priceId) {
      return NextResponse.json({ error: `No price configured for tier: ${tier}` }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(email ? { customer_email: email } : {}),
      client_reference_id: toolId,
      subscription_data: {
        metadata: { tool_id: toolId, tier },
      },
      metadata: { tool_id: toolId, tier },
      success_url: `${siteUrl}/submit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/submit`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
