/**
 * PartnerStack Partner API client.
 * Reads the user's affiliate program data (partnerships, rewards, payouts, transactions).
 *
 * Auth: Bearer token from Settings → API in the partner dashboard.
 * Base URL: https://api.partnerstack.com/api/v2/
 *
 * Docs: https://docs.partnerstack.com/reference/partner-api-authentication
 */

const BASE_URL = "https://api.partnerstack.com/api/v2";

export interface PartnerStackPartnership {
  key: string;
  company_name: string;
  status: string;
  created_at: number;
  [key: string]: unknown;
}

export interface PartnerStackReward {
  key: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
  [key: string]: unknown;
}

export interface PartnerStackPayout {
  key: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
  [key: string]: unknown;
}

function getApiKey(): string | null {
  return process.env.PARTNERSTACK_API_KEY || null;
}

export function isPartnerStackConfigured(): boolean {
  return Boolean(getApiKey());
}

async function partnerstackFetch<T>(path: string): Promise<T[]> {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`PartnerStack ${path} failed (${res.status}):`, body.slice(0, 300));
    return [];
  }

  const json = (await res.json()) as { data?: T[] } | T[];
  // PartnerStack returns { data: [...] } for list endpoints
  return Array.isArray(json) ? json : (json.data ?? []);
}

export async function listPartnerships(): Promise<PartnerStackPartnership[]> {
  return partnerstackFetch<PartnerStackPartnership>("/partnerships");
}

export async function listRewards(): Promise<PartnerStackReward[]> {
  return partnerstackFetch<PartnerStackReward>("/rewards");
}

export async function listPayouts(): Promise<PartnerStackPayout[]> {
  return partnerstackFetch<PartnerStackPayout>("/payouts");
}

export interface PartnerStackSummary {
  configured: boolean;
  partnerships: {
    total: number;
    active: number;
    companies: { name: string; status: string }[];
  };
  rewards: {
    total_count: number;
    total_amount: number;
    currency: string;
    paid: number;
    pending: number;
  };
  payouts: {
    total_count: number;
    total_amount: number;
    currency: string;
  };
}

/**
 * Aggregated summary for the dashboard.
 * Never throws — returns a zeroed structure when not configured.
 */
export async function getPartnerStackSummary(): Promise<PartnerStackSummary> {
  const configured = isPartnerStackConfigured();
  if (!configured) {
    return {
      configured: false,
      partnerships: { total: 0, active: 0, companies: [] },
      rewards: { total_count: 0, total_amount: 0, currency: "USD", paid: 0, pending: 0 },
      payouts: { total_count: 0, total_amount: 0, currency: "USD" },
    };
  }

  const [partnerships, rewards, payouts] = await Promise.all([
    listPartnerships(),
    listRewards(),
    listPayouts(),
  ]);

  const active = partnerships.filter((p) => p.status === "active").length;

  const rewardTotal = rewards.reduce((sum, r) => sum + (r.amount || 0), 0);
  const rewardPaid = rewards
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + (r.amount || 0), 0);
  const rewardPending = rewards
    .filter((r) => r.status !== "paid")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const payoutTotal = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  return {
    configured: true,
    partnerships: {
      total: partnerships.length,
      active,
      companies: partnerships.map((p) => ({
        name: p.company_name || p.key || "Unknown",
        status: p.status || "unknown",
      })),
    },
    rewards: {
      total_count: rewards.length,
      total_amount: rewardTotal,
      currency: rewards[0]?.currency || "USD",
      paid: rewardPaid,
      pending: rewardPending,
    },
    payouts: {
      total_count: payouts.length,
      total_amount: payoutTotal,
      currency: payouts[0]?.currency || "USD",
    },
  };
}
