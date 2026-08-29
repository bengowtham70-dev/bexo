"use client";

import Link from "next/link";
import { TrendingDown, Zap, ArrowUpRight } from "lucide-react";

interface OutbidAlertProps {
  category: string;
  currentRank: number;
  outbidAmount: number;
  reclaimAmount: number;
}

export function OutbidAlert({
  category,
  currentRank,
  outbidAmount,
  reclaimAmount,
}: OutbidAlertProps) {
  return (
    <div className="p-4 rounded-xl border border-[var(--color-warning)]/40 bg-[var(--color-warm)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[var(--color-warning)]/20 text-[var(--color-warning)] flex-shrink-0 mt-0.5 sm:mt-0">
          <TrendingDown className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[var(--color-ink)]">
            You were outbid for the #1 spot in {category.toUpperCase()}
          </h4>
          <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
            Another builder placed a ${outbidAmount} bid, moving your current rank to #{currentRank}.
          </p>
        </div>
      </div>

      <Link
        href={`/dashboard/boost?category=${category}&bid=${reclaimAmount}`}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shadow-2xs self-end sm:self-auto"
      >
        <Zap className="w-3.5 h-3.5 text-[var(--color-lime)]" />
        <span>Reclaim #1 for ${reclaimAmount}</span>
        <ArrowUpRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
