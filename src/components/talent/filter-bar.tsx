"use client";

import { Check } from "lucide-react";

export type FilterBarProps = {
  searchQuery?: string;
  skillsQuery?: string;
  locationQuery?: string;
  remoteOnly?: boolean;
  onSearch: (q: string) => void;
  onFilter: (key: string, value: string) => void;
  onRemoteToggle?: (remote: boolean) => void;
};

export function FilterBar({
  searchQuery = "",
  skillsQuery = "",
  locationQuery = "",
  remoteOnly = false,
  onSearch,
  onFilter,
  onRemoteToggle,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 py-3 border-y border-[var(--color-border)] my-4">
      {/* Text Keyword Search */}
      <div className="relative flex-1 min-w-[220px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by role, skill, bio, project..."
          className="w-full h-9 px-3.5 pl-9 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)]"
        />
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-[var(--color-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Skills filter */}
      <select
        value={skillsQuery}
        onChange={(e) => onFilter("skills", e.target.value)}
        className="h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
      >
        <option value="">All Skills</option>
        <option value="Python">Python</option>
        <option value="TypeScript">TypeScript</option>
        <option value="React">React</option>
        <option value="Next.js">Next.js</option>
        <option value="PostgreSQL">PostgreSQL</option>
        <option value="RAG">RAG / LLMs</option>
        <option value="AWS">AWS</option>
        <option value="Figma">UI/UX Figma</option>
      </select>

      {/* Location filter */}
      <select
        value={locationQuery}
        onChange={(e) => onFilter("location", e.target.value)}
        className="h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
      >
        <option value="">All Locations</option>
        <option value="Remote">Remote Only</option>
        <option value="Bangalore">Bangalore</option>
        <option value="San Francisco">San Francisco</option>
        <option value="New York">New York</option>
        <option value="London">London</option>
        <option value="Berlin">Berlin</option>
      </select>

      {/* Remote Toggle */}
      {onRemoteToggle && (
        <button
          type="button"
          onClick={() => onRemoteToggle(!remoteOnly)}
          className={`h-9 px-3.5 rounded-md border text-xs font-mono font-semibold transition-colors inline-flex items-center gap-1 ${
            remoteOnly
              ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]"
              : "bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-ink)]"
          }`}
        >
          {remoteOnly && <Check className="w-3.5 h-3.5" />}
          <span>Remote Only</span>
        </button>
      )}
    </div>
  );
}
