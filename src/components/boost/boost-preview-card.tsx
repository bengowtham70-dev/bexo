import React from "react";

interface BoostPreviewCardProps {
  name: string;
  headline: string;
  location: string;
  category: string;
  amount?: number;
}

export function BoostPreviewCard({ name, headline, location, category, amount = 10 }: BoostPreviewCardProps) {
  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)] shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-semibold">
          Live Spotlight Preview • {category.toUpperCase()}
        </span>
        <div className="badge-featured flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-lime)] border border-[var(--color-lime-dark)]/30 text-[var(--color-ink)] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[var(--color-lime-ink)] animate-pulse" />
          <span className="mono text-[11px] font-black uppercase tracking-wider">
            ${amount} Spotlight
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center font-bold text-sm text-[var(--color-ink)] shadow-2xs">
          {name ? name.slice(0, 2).toUpperCase() : "ME"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-[var(--color-ink)] truncate">{name || "Your Full Name"}</div>
          <div className="text-xs text-[var(--color-muted)] truncate">{headline || "Your Professional Headline — e.g. Senior AI Engineer"}</div>
          <div className="text-[11px] text-[var(--color-muted)] mt-0.5">{location || "San Francisco, CA or Remote"}</div>
        </div>
      </div>
    </div>
  );
}
