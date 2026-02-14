import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set — Stripe features disabled.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  typescript: true,
});

// Price IDs from environment
export const PRICES = {
  featured: process.env.STRIPE_PRICE_FEATURED || "",
  premium: process.env.STRIPE_PRICE_PREMIUM || "",
  category: process.env.STRIPE_PRICE_CATEGORY || "",
} as const;

export type PriceTier = keyof typeof PRICES;
