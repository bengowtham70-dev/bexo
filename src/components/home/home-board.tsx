"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Zap,
  MapPin,
  Layers,
  SlidersHorizontal,
  X,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from "lucide-react";
import { TALENT_CATEGORIES } from "@/lib/constants/categories";
import { DEMO_PROFILES, DemoProfileData } from "@/lib/constants/demo-profiles";

export type HomeCandidate = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  slug: string;
  location: string;
  category: string;
  skills: string[];
  featured: boolean;
  paidAmount: number;
  avatarUrl?: string | null;
  experienceYears?: number;
};

// Quick selection suggestions for skills & locations
const POPULAR_SKILLS = [
  "PyTorch",
  "CUDA",
  "vLLM",
  "React",
  "Next.js",
  "TypeScript",
  "Go",
  "Python",
  "Rust",
  "Design Systems",
  "Figma",
  "Kubernetes",
  "FastAPI",
  "LangGraph",
  "GraphQL",
];

const POPULAR_LOCATIONS = [
  "Remote",
  "San Francisco",
  "London",
  "Bangalore",
  "New York",
  "Singapore",
  "Seattle",
  "Berlin",
  "Austin",
  "Toronto",
  "Munich",
  "Tokyo",
];

// Initial leaderboard dataset derived from DEMO_PROFILES, sorted strictly by paidAmount descending
const ALL_DEMO_CANDIDATES: HomeCandidate[] = Object.values(DEMO_PROFILES)
  .map((p) => ({
    id: p.id,
    name: p.name,
    headline: p.headline,
    bio: p.bio,
    slug: p.slug,
    location: p.location,
    category: p.category,
    skills: p.skills.map((s) => s.name),
    featured: p.featured,
    paidAmount: p.paidAmount || 0,
    experienceYears: p.yearsOfExp,
  }))
  .sort((a, b) => {
    // 1. Primary: Paid amount descending (highest payer atop leaderboard)
    if (b.paidAmount !== a.paidAmount) {
      return b.paidAmount - a.paidAmount;
    }
    // 2. Secondary: Experience years descending
    return (b.experienceYears || 0) - (a.experienceYears || 0);
  });

export function HomeBoard() {
  const [query, setQuery] = useState<string>("");
  const [skillQuery, setSkillQuery] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bexo_saved_candidates");
      if (stored) {
        setSavedIds(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, []);

  const toggleSaveCandidate = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("bexo_saved_candidates", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query.trim()) count++;
    if (skillQuery.trim()) count++;
    if (locationQuery.trim()) count++;
    if (activeCategory) count++;
    return count;
  }, [query, skillQuery, locationQuery, activeCategory]);

  const handleClearFilters = () => {
    setQuery("");
    setSkillQuery("");
    setLocationQuery("");
    setActiveCategory("");
  };

  const filteredCandidates = useMemo(() => {
    const qLower = query.trim().toLowerCase();
    const skillLower = skillQuery.trim().toLowerCase();
    const locLower = locationQuery.trim().toLowerCase();

    return ALL_DEMO_CANDIDATES.filter((candidate) => {
      // 1. Category filter
      if (activeCategory && candidate.category !== activeCategory) {
        return false;
      }

      // 2. Main Search (Name, Headline, Bio, Keywords)
      if (qLower) {
        const matchesName = candidate.name.toLowerCase().includes(qLower);
        const matchesHeadline = candidate.headline.toLowerCase().includes(qLower);
        const matchesBio = candidate.bio.toLowerCase().includes(qLower);
        if (!matchesName && !matchesHeadline && !matchesBio) {
          return false;
        }
      }

      // 3. Search Skill filter
      if (skillLower) {
        const matchesSkill = candidate.skills.some((s) =>
          s.toLowerCase().includes(skillLower)
        );
        if (!matchesSkill) return false;
      }

      // 4. Location filter
      if (locLower) {
        if (!candidate.location.toLowerCase().includes(locLower)) {
          return false;
        }
      }

      return true;
    });
  }, [query, skillQuery, locationQuery, activeCategory]);

  return (
    <div id="explore" className="w-full scroll-mt-20">
      {/* ── Modern Enhanced Search & Filter Bar ── */}
      <div className="border border-[var(--color-border)] rounded-2xl p-2 sm:p-2.5 bg-[var(--color-surface)] shadow-xs">
        <div className="flex items-center gap-2">
          {/* Primary Search Input */}
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-[var(--color-muted)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search talent by role, company, or keyword (e.g. AI Engineer, PyTorch, Go)..."
              className="w-full h-11 sm:h-12 pl-10 sm:pl-11 pr-9 sm:pr-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs sm:text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)] focus:ring-1 focus:ring-[var(--color-ink)] transition-all font-normal"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-colors"
                aria-label="Clear keyword search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Trigger Button for Full Slide-Up Filters */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={`h-11 sm:h-12 px-4 sm:px-5 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeFilterCount > 0
                ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] shadow-2xs"
                : "bg-[var(--color-bg)] text-[var(--color-ink)] border-[var(--color-border)] hover:border-[var(--color-ink)]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--color-lime)] text-[var(--color-ink)] text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Badges Bar (Visible only when filters are active) */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 mt-2 border-t border-[var(--color-border)]">
            <span className="mono text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-semibold">
              Active:
            </span>

            {query && (
              <span className="inline-flex items-center gap-1 mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-warm)] border border-[var(--color-border)] text-[var(--color-ink)]">
                <Search className="w-2.5 h-2.5 text-[var(--color-muted)]" />
                <span>&ldquo;{query}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="hover:text-[var(--color-error)] ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {skillQuery && (
              <span className="inline-flex items-center gap-1 mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-warm)] border border-[var(--color-border)] text-[var(--color-ink)]">
                <Zap className="w-2.5 h-2.5 text-[var(--color-muted)]" />
                <span>Skill: {skillQuery}</span>
                <button
                  type="button"
                  onClick={() => setSkillQuery("")}
                  className="hover:text-[var(--color-error)] ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {locationQuery && (
              <span className="inline-flex items-center gap-1 mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-warm)] border border-[var(--color-border)] text-[var(--color-ink)]">
                <MapPin className="w-2.5 h-2.5 text-[var(--color-muted)]" />
                <span>Loc: {locationQuery}</span>
                <button
                  type="button"
                  onClick={() => setLocationQuery("")}
                  className="hover:text-[var(--color-error)] ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            {activeCategory && (
              <span className="inline-flex items-center gap-1 mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-warm)] border border-[var(--color-border)] text-[var(--color-ink)]">
                <Layers className="w-2.5 h-2.5 text-[var(--color-muted)]" />
                <span>
                  {TALENT_CATEGORIES.find((c) => c.slug === activeCategory)?.label ||
                    activeCategory}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveCategory("")}
                  className="hover:text-[var(--color-error)] ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleClearFilters}
              className="mono text-[9px] text-[var(--color-muted)] hover:text-[var(--color-ink)] underline ml-auto"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* ── Slide-Up Bottom Drawer / Modal for Search & Options ── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fadeIn">
          {/* Backdrop Click */}
          <div
            className="absolute inset-0"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full max-w-2xl bg-[var(--color-surface)] border-t sm:border border-[var(--color-border)] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-slideUp">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[var(--color-ink)]" />
                <h3 className="text-base font-bold text-[var(--color-ink)]">
                  Filter & Explore Candidates
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Controls Stack */}
            <div className="py-4 space-y-4">
              {/* 1. Keyword Search */}
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink)] mb-1.5">
                  <Search className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                  <span>Keyword / Name / Bio Search</span>
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Senior AI Engineer, Rahul, LLM..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)]"
                />
              </div>

              {/* 2-Column Grid for Skills & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 2. Search Skills */}
                <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink)] mb-1.5">
                    <Zap className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    <span>Search by Skill</span>
                  </label>
                  <input
                    type="text"
                    value={skillQuery}
                    onChange={(e) => setSkillQuery(e.target.value)}
                    placeholder="Type skill (e.g. PyTorch, React)..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)] mb-2"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {POPULAR_SKILLS.map((skill) => {
                      const isSelected =
                        skillQuery.toLowerCase() === skill.toLowerCase();
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() =>
                            setSkillQuery(isSelected ? "" : skill)
                          }
                          className={`mono text-[10px] px-2.5 py-0.5 rounded-full transition-all border ${
                            isSelected
                              ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-semibold shadow-2xs"
                              : "bg-[var(--color-bg)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Search Location */}
                <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink)] mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    <span>Search by Location</span>
                  </label>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Type location (e.g. Remote, SF)..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)] mb-2"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {POPULAR_LOCATIONS.map((loc) => {
                      const isSelected =
                        locationQuery.toLowerCase() === loc.toLowerCase();
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() =>
                            setLocationQuery(isSelected ? "" : loc)
                          }
                          className={`mono text-[10px] px-2.5 py-0.5 rounded-full transition-all border ${
                            isSelected
                              ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-semibold shadow-2xs"
                              : "bg-[var(--color-bg)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                          }`}
                        >
                          {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Disciplines Selection */}
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink)] mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                  <span>Disciplines</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TALENT_CATEGORIES.map((c) => {
                    const isActive =
                      activeCategory === c.slug || (!activeCategory && c.slug === "");
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveCategory(c.slug)}
                        className={`px-3 py-1 rounded-full text-[11px] transition-all border ${
                          isActive
                            ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-bold shadow-2xs"
                            : "bg-[var(--color-bg)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] font-medium"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)] underline"
              >
                Reset All Filters
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                Apply & View ({filteredCandidates.length}) Results →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <div className="border border-dashed border-[var(--color-border)] rounded-xl p-8 text-center bg-[var(--color-warm)]/30 mt-4">
          <p className="text-sm font-bold text-[var(--color-ink)]">
            No talent matching your filters
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Try adjusting your search keyword, skill, or location criteria.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── Candidate Cards Stack Ordered by Highest Paid Amount ── */}
      <div className="space-y-3 mt-4">
        {filteredCandidates.map((c, index) => {
          const rankNum = String(index + 1).padStart(2, "0");
          const isTop1 = index === 0;
          const isTop2 = index === 1;
          const isTop3 = index === 2;

          let cardStyle = "border-[var(--color-border)] bg-[var(--color-surface)]";
          let rankColor = "text-[var(--color-muted)]";

          if (isTop1) {
            cardStyle = "border-[#f0921e] bg-[#fdf4e7]/70 shadow-sm";
            rankColor = "text-[#f0921e] font-extrabold";
          } else if (isTop2) {
            cardStyle = "border-[#a39e97] bg-[#f7f6f4]/80";
            rankColor = "text-[#8f8a83] font-extrabold";
          } else if (isTop3) {
            cardStyle = "border-[#c67e4e] bg-[#fbf2ea]/70";
            rankColor = "text-[#b8703f] font-extrabold";
          } else if (c.paidAmount > 0) {
            cardStyle = "border-[var(--color-lime)]/40 bg-[var(--color-surface)] shadow-2xs";
          }

          const initials = c.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          const isExpanded = expandedId === c.id;

          return (
            <div
              key={c.id}
              className={`relative rounded-xl border p-4 sm:p-5 transition-shadow hover:shadow-sm ${cardStyle}`}
            >
              {/* #01 Paid Spotlight Header Banner */}
              {isTop1 && (
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-[#f0921e]/30 text-xs font-extrabold text-[#a86008]">
                  <Sparkles className="w-4 h-4 text-[#f0921e]" />
                  <span className="text-xs sm:text-sm font-bold">
                    #1 Paid Spotlight — ${c.paidAmount} Bid Leader
                  </span>
                  <span className="ml-auto mono text-[11px] text-[var(--color-muted)] font-medium hidden sm:inline">
                    1,000+ Paying Talent Community
                  </span>
                </div>
              )}

              {/* #02 & #03 Badges */}
              {isTop2 && c.paidAmount > 0 && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#a39e97]/30 text-xs font-bold text-[#6b6660]">
                  <Sparkles className="w-3.5 h-3.5 text-[#8f8a83]" />
                  <span>#2 Paid Spotlight — ${c.paidAmount} Active Boost</span>
                </div>
              )}

              {isTop3 && c.paidAmount > 0 && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#c67e4e]/30 text-xs font-bold text-[#9e5a2b]">
                  <Sparkles className="w-3.5 h-3.5 text-[#b8703f]" />
                  <span>#3 Paid Spotlight — ${c.paidAmount} Active Boost</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left Side: Rank, Avatar, Title, Bio, Tags */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                  {/* Rank Number */}
                  <span className={`mono text-lg sm:text-xl font-bold pt-0.5 w-7 text-right flex-shrink-0 ${rankColor}`}>
                    #{rankNum}
                  </span>

                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center font-bold text-xs sm:text-sm text-[var(--color-ink)] flex-shrink-0 shadow-2xs">
                    {initials}
                  </div>

                  {/* Main Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-[var(--color-ink)]">
                        {c.name}
                      </h3>
                      <span className="text-xs text-[var(--color-muted)] font-normal">
                        — {c.headline}
                      </span>
                    </div>

                    {/* Bio Snippet */}
                    <p
                      className={`text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {c.bio}
                    </p>

                    {c.bio.length > 120 && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : c.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--color-ink)] underline mt-1 font-medium hover:opacity-80"
                      >
                        <span>{isExpanded ? "Show less" : "Read more"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    )}

                    {/* Meta Tags with Real Vector MapPin & Skill Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-3">
                      <span className="inline-flex items-center gap-1 mono text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--color-warm)] border border-[var(--color-border)] text-[var(--color-ink)] font-medium">
                        <MapPin className="w-3 h-3 text-[var(--color-muted)]" />
                        <span>{c.location}</span>
                      </span>
                      {c.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)]"
                        >
                          {skill}
                        </span>
                      ))}
                      {c.skills.length > 4 && (
                        <span className="mono text-[10px] text-[var(--color-muted)]">
                          +{c.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Status Badge (Featured / Paid vs Verified) & Action Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]/60 flex-shrink-0">
                  {/* Paid Spotlight vs Organic Verified Badge */}
                  {c.paidAmount > 0 ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-lime)] border border-[var(--color-lime-dark)]/30 text-[var(--color-ink)] shadow-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-lime-ink)] animate-pulse" />
                      <span className="mono text-xs font-black uppercase tracking-wider">
                        ${c.paidAmount} Spotlight
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-warm)] border border-[var(--color-border)] text-[var(--color-muted)]">
                      <span className="mono text-[10px] font-semibold uppercase tracking-wider">
                        Public Profile
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => toggleSaveCandidate(c.id, e)}
                      className={`p-1 rounded-md border transition-all ${
                        savedIds.has(c.id)
                          ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] shadow-2xs"
                          : "bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                      }`}
                      title={savedIds.has(c.id) ? "Saved to shortlist" : "Bookmark candidate"}
                      aria-label={savedIds.has(c.id) ? "Remove candidate from shortlist" : "Save candidate to shortlist"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${savedIds.has(c.id) ? "fill-current" : ""}`} />
                    </button>

                    <Link
                      href={`/p/${c.slug}`}
                      className="px-3 py-1 rounded-md bg-[var(--color-ink)] text-[var(--color-bg)] text-[11px] font-medium hover:opacity-90 transition-opacity whitespace-nowrap shadow-2xs"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Spot / Claim Placement Card */}
      <div className="mt-8 border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 bg-[var(--color-warm)]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-sm font-bold text-[var(--color-ink)]">
            Want to get ranked atop the leaderboard?
          </h4>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Build your verified profile with GitHub, LinkedIn, or resume. Claim your spotlight in front of top recruiters and founders.
          </p>
        </div>
        <Link
          href="/signup"
          className="px-5 py-2.5 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Claim Your Spot →
        </Link>
      </div>
    </div>
  );
}
