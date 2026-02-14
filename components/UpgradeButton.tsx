"use client";

import { useState } from "react";

interface UpgradeButtonProps {
  toolId: string;
  tier: "featured" | "premium" | "category";
  label?: string;
  className?: string;
}

export default function UpgradeButton({ toolId, tier, label, className }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const tierLabels = {
    category: "Get Category Highlight — $99/mo",
    featured: "Get Featured — $249/mo",
    premium: "Get Premium — $499/mo",
  };

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId, tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        className ||
        "rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      }
    >
      {loading ? "Redirecting..." : label || tierLabels[tier]}
    </button>
  );
}
