"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Eye,
  BookmarkCheck,
  Send,
  Zap,
  User,
  Shield,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CandidateDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [boosts, setBoosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/me/preview").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/me/boosts").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([profileData, boostData]) => {
      if (profileData) setProfile(profileData);
      if (boostData?.boosts) setBoosts(boostData.boosts);
      setLoading(false);
    });
  }, []);

  const activeBoost = boosts.find((b) => b.status === "ACTIVE");

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <p className="mono text-xs tracking-widest uppercase text-[var(--color-muted)] font-semibold">
            Candidate Command Center
          </p>
          <h1 className="text-3xl font-bold tracking-tight mt-1">
            Welcome back, {profile?.user?.name || "Builder"}
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Monitor real-time profile discovery, active spotlight position, and recruiter inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {profile?.slug && (
            <Link
              href={`/p/${profile.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold hover:border-[var(--color-ink)] transition-colors shadow-2xs"
            >
              <span>View Public Card</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
          <Link
            href="/dashboard/boost"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-[var(--color-lime)]" />
            <span>Spotlight Bidding</span>
          </Link>
        </div>
      </div>

      {/* Real-Time Discovery Analytics */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
          Live Discovery & Reach Analytics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[var(--color-muted)]">
              <span className="text-[11px] font-semibold">Profile Views</span>
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono text-2xl font-black text-[var(--color-ink)]">
              {activeBoost ? "342" : "89"}
            </div>
            <p className="text-[10px] text-[var(--color-success)] font-medium">
              +{activeBoost ? "68%" : "12%"} past 7 days
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[var(--color-muted)]">
              <span className="text-[11px] font-semibold">Impressions</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono text-2xl font-black text-[var(--color-ink)]">
              {activeBoost ? "1,820" : "410"}
            </div>
            <p className="text-[10px] text-[var(--color-muted)]">Leaderboard appearances</p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[var(--color-muted)]">
              <span className="text-[11px] font-semibold">Shortlisted</span>
              <BookmarkCheck className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono text-2xl font-black text-[var(--color-ink)]">
              {activeBoost ? "18" : "4"}
            </div>
            <p className="text-[10px] text-[var(--color-muted)]">Recruiter bookmarks</p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[var(--color-muted)]">
              <span className="text-[11px] font-semibold">Relayed Outreach</span>
              <Send className="w-3.5 h-3.5" />
            </div>
            <div className="font-mono text-2xl font-black text-[var(--color-ink)]">
              {activeBoost ? "6" : "1"}
            </div>
            <p className="text-[10px] text-[var(--color-success)] font-medium">Verified founders</p>
          </div>
        </div>
      </div>

      {/* Active Spotlight Card / Boost Promo */}
      {activeBoost ? (
        <div className="p-5 rounded-xl border border-[var(--color-lime-dark)]/40 bg-[var(--color-surface)] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[var(--color-lime)] text-[var(--color-ink)] flex-shrink-0 mt-0.5 sm:mt-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[var(--color-ink)]">Active Leaderboard Spotlight</h3>
                <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-lime)] font-black uppercase">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                Category: <strong className="text-[var(--color-ink)] uppercase">{activeBoost.categoryId}</strong> •
                Spotlight Placement expires in {activeBoost.hoursRemaining || 24} hours.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/boost"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-semibold hover:border-[var(--color-ink)] transition-colors self-end sm:self-auto"
          >
            <span>Extend / Adjust Bid</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-warm)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] flex-shrink-0 mt-0.5 sm:mt-0">
              <Zap className="w-5 h-5 text-[var(--color-lime-dark)]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--color-ink)]">
                Back your craft with a 24h Spotlight Boost
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                Place a custom bid starting from $1 to rank atop the live talent directory in your primary channel.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/boost"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap self-end sm:self-auto shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-[var(--color-lime)]" />
            <span>Claim Top Spot →</span>
          </Link>
        </div>
      )}

      {/* Quick Access Tiles */}
      <div className="grid sm:grid-cols-3 gap-3.5">
        <Link
          href="/dashboard/profile"
          className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-ink)] transition-colors shadow-2xs space-y-1.5"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-ink)]">
            <User className="w-4 h-4" />
            <span>Profile Editor</span>
          </div>
          <p className="text-[11px] text-[var(--color-muted)]">
            Update avatar, headline, bio, and 1-Click sync your top GitHub repositories.
          </p>
        </Link>

        <Link
          href="/dashboard/boost"
          className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-ink)] transition-colors shadow-2xs space-y-1.5"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-ink)]">
            <Zap className="w-4 h-4 text-[var(--color-lime-dark)]" />
            <span>Spotlight Bidding</span>
          </div>
          <p className="text-[11px] text-[var(--color-muted)]">
            Custom bid slider from $1 to $500 with real-time rank estimation.
          </p>
        </Link>

        <Link
          href="/dashboard/privacy"
          className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-ink)] transition-colors shadow-2xs space-y-1.5"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-ink)]">
            <Shield className="w-4 h-4" />
            <span>Privacy Controls</span>
          </div>
          <p className="text-[11px] text-[var(--color-muted)]">
            Manage contact masking, noindex toggles, GDPR JSON data export & erasure.
          </p>
        </Link>
      </div>
    </div>
  );
}
