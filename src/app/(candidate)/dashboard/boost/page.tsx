"use client";

import { useState, useEffect, useMemo } from "react";
import { AVAILABLE_CATEGORIES } from "@/lib/validators/boost";
import { BoostPreviewCard } from "@/components/boost/boost-preview-card";
import { BoostHistoryTable, BoostItem } from "@/components/boost/boost-history-table";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { DEMO_PROFILES } from "@/lib/constants/demo-profiles";

const PRESET_BIDS = [1, 5, 15, 25, 50, 100, 250, 500, 600, 1000];

export default function BoostDashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ai");
  const [customBid, setCustomBid] = useState<number>(25);
  const [loading, setLoading] = useState(false);
  const [boosts, setBoosts] = useState<BoostItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me/preview")
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .catch(() => {});

    fetch("/api/me/boosts")
      .then((r) => r.json())
      .then((d) => {
        if (d.boosts) setBoosts(d.boosts);
      })
      .catch(() => {});
  }, []);

  // Real-time rank estimation based on active bids
  const rankEstimate = useMemo(() => {
    const activeCategoryBids = Object.values(DEMO_PROFILES)
      .filter((p) => p.paidAmount > 0)
      .map((p) => p.paidAmount)
      .sort((a, b) => b - a);

    let rank = 1;
    for (const b of activeCategoryBids) {
      if (customBid < b) {
        rank++;
      }
    }
    const outranksCount = activeCategoryBids.filter((b) => b < customBid).length + 5; // +5 organic
    return {
      estimatedRank: rank,
      outranksCount,
      isTop1: rank === 1,
      isTop3: rank <= 3,
    };
  }, [customBid, selectedCategory]);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/me/boost/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory,
          currency: "USD",
          amountUsd: Number(customBid),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Spotlight Bidding & Visibility Boost</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Back yourself with custom 24-hour spotlight placement starting from just $1. The higher your bid, the higher you rank on the live talent leaderboard.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 rounded text-xs text-[var(--color-error)]">
          {error}
        </div>
      )}

      {/* Category selection & Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5 border border-[var(--color-border)] p-5 rounded-xl bg-[var(--color-surface)] shadow-xs">
          {/* 1. Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2">
              1. Select Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2.5 text-left border rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? "border-[var(--color-ink)] bg-[var(--color-warm)] ring-1 ring-[var(--color-ink)]"
                      : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-muted)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Custom Bid Amount & Slider */}
          <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                2. Custom Spotlight Bid
              </label>
              <div className="flex items-center gap-1 font-mono font-black text-lg text-[var(--color-ink)]">
                <span>$</span>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={customBid}
                  onChange={(e) => setCustomBid(Math.max(1, Number(e.target.value)))}
                  className="w-24 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-right font-mono text-base font-black focus:outline-none focus:border-[var(--color-ink)]"
                />
                <span className="text-xs font-normal text-[var(--color-muted)]">USD</span>
              </div>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min="1"
              max="1000"
              step="1"
              value={customBid}
              onChange={(e) => setCustomBid(Number(e.target.value))}
              className="w-full accent-[var(--color-ink)] cursor-pointer"
            />

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-[var(--color-muted)] mono uppercase">Presets:</span>
              {PRESET_BIDS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCustomBid(p)}
                  className={`mono text-[11px] px-2 py-0.5 rounded border transition-all ${
                    customBid === p
                      ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-bold shadow-2xs"
                      : "bg-[var(--color-bg)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-ink)]"
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Real-Time Rank Estimator Card */}
          <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-warm)]/70 space-y-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--color-ink)]" />
              <span className="text-xs font-bold text-[var(--color-ink)]">
                Estimated Live Position:
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--color-lime)] border border-[var(--color-lime-dark)]/30 text-[var(--color-ink)] font-mono font-black text-xs">
                #{rankEstimate.estimatedRank} Spotlight
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-muted)]">
              {rankEstimate.isTop1
                ? "👑 Your bid places you at #1 atop the leaderboard!"
                : `A $${customBid} bid places you at #${rankEstimate.estimatedRank}, outranking ${rankEstimate.outranksCount} active builders in this channel.`}
            </p>
          </div>

          {/* 4. Checkout Button */}
          <div className="pt-3 border-t border-[var(--color-border)] space-y-3">
            <div className="flex justify-between text-xs text-[var(--color-muted)]">
              <span>Placement Duration:</span>
              <span className="font-semibold font-mono text-[var(--color-ink)]">24 Hours Active</span>
            </div>
            <Button
              variant="boost"
              className="w-full py-5 text-sm font-semibold"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Redirecting to Stripe..." : `Claim #${rankEstimate.estimatedRank} Spotlight for $${customBid}`}
            </Button>
          </div>
        </div>

        {/* Live Shelf Preview Column */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
            Live Preview on Leaderboard
          </label>
          <BoostPreviewCard
            name={profile?.user?.name || "Your Full Name"}
            headline={profile?.headline || "Your headline will appear here"}
            location={profile?.location || "San Francisco, CA or Remote"}
            category={selectedCategory}
            amount={customBid}
          />
          <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[11px] text-[var(--color-muted)] space-y-2">
            <p className="font-semibold text-[var(--color-ink)]">Placement Terms & Transparency (§14, §21)</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Featured shelf placement boosts your card visibility above organic talent results.</li>
              <li>Boost placement determines candidate order on the active leaderboard.</li>
              <li>Spotlight placement is an active visibility boost and not an endorsement.</li>
              <li>Anyone can bid any amount down to the last dollar ($1).</li>
              <li>
                <strong>FTC Safety Rule:</strong> You pay BEXO for visibility — never pay an employer to get a job.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Boost history */}
      <div className="space-y-3 pt-6 border-t border-[var(--color-border)]">
        <h2 className="text-base font-semibold">Your Boost History</h2>
        <BoostHistoryTable boosts={boosts} />
      </div>
    </div>
  );
}
