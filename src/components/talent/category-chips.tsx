"use client";

import { TALENT_CATEGORIES } from "@/lib/constants/categories";
export { TALENT_CATEGORIES };

export function CategoryChips({
  activeCategory = "",
  onSelect,
}: {
  activeCategory?: string;
  onSelect: (catId: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none snap-x py-2 no-scrollbar">
      {TALENT_CATEGORIES.map((c) => {
        const isActive =
          activeCategory === c.id ||
          activeCategory === c.slug ||
          (!activeCategory && c.id === "all");

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all snap-start border ${
              isActive
                ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] shadow-sm"
                : "bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
