"use client";

import { useEffect, useState } from "react";
import { BoardRow } from "./board-row";
import { FilterBar } from "./filter-bar";
import { CategoryChips } from "./category-chips";

export type TalentBoardProps = {
  initialCategory?: string;
  initialQuery?: string;
};

export function TalentBoard({ initialCategory = "", initialQuery = "" }: TalentBoardProps) {
  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>(initialQuery);
  const [skills, setSkills] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [featured, setFeatured] = useState<any[]>([]);
  const [organic, setOrganic] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  }>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasMore: false,
  });

  const fetchTalent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("q", search);
      if (skills) params.set("skills", skills);
      if (location) params.set("location", location);
      if (remoteOnly) params.set("remote", "true");
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/talent?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFeatured(data.featured || []);
        setOrganic(data.organic || []);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Failed to load talent:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalent();
  }, [category, search, skills, location, remoteOnly, page]);

  const handleCategorySelect = (catSlug: string) => {
    setCategory(catSlug);
    setPage(1);
  };

  const handleFilter = (key: string, val: string) => {
    if (key === "skills") setSkills(val);
    if (key === "location") setLocation(val);
    setPage(1);
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const totalCandidates = (featured.length || 0) + (pagination.total || 0);

  return (
    <div className="w-full">
      <CategoryChips activeCategory={category} onSelect={handleCategorySelect} />

      <FilterBar
        searchQuery={search}
        skillsQuery={skills}
        locationQuery={location}
        remoteOnly={remoteOnly}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onRemoteToggle={(r) => {
          setRemoteOnly(r);
          setPage(1);
        }}
      />

      <div className="flex items-center justify-between text-xs font-mono text-[var(--color-muted)] py-2">
        <span>
          Showing {organic.length + featured.length} of {totalCandidates} Candidates
          {featured.length > 0 ? ` • ${featured.length} Featured` : ""}
        </span>
        {loading ? <span className="animate-pulse font-semibold text-[var(--color-ink)]">Refreshing board...</span> : null}
      </div>

      <div className="mt-3 grid gap-2.5">
        {featured.length > 0 ? (
          <div className="grid gap-2.5 mb-2">
            <div className="flex items-center gap-2 pt-1 pb-0.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-lime)]" />
              <span className="mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                Featured Talent
              </span>
            </div>
            {featured.map((p, idx) => (
              <BoardRow
                key={`feat-${p.id}`}
                num={String(idx + 1).padStart(2, "0")}
                name={p.user?.name || p.headline || "Candidate"}
                headline={p.headline || "Professional"}
                slug={p.slug}
                location={p.location}
                skills={p.skills}
                avatarUrl={p.user?.image}
                featured={true}
                boostAmount={p.boostAmount || p.paidAmount}
                boostRank={p.boostRank || idx + 1}
              />
            ))}
          </div>
        ) : null}

        {organic.length > 0 ? (
          <div className="grid gap-2.5">
            {featured.length > 0 ? (
              <div className="flex items-center gap-2 pt-2 pb-0.5 border-t border-[var(--color-border)]">
                <span className="mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  All Candidates
                </span>
              </div>
            ) : null}
            {organic.map((p, idx) => {
              const num = String(featured.length + (page - 1) * pagination.limit + idx + 1).padStart(2, "0");
              return (
                <BoardRow
                  key={`org-${p.id}`}
                  num={num}
                  name={p.user?.name || p.headline || "Candidate"}
                  headline={p.headline || "Professional"}
                  slug={p.slug}
                  location={p.location}
                  skills={p.skills}
                  avatarUrl={p.user?.image}
                  featured={false}
                />
              );
            })}
          </div>
        ) : !loading && featured.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-[var(--color-border)] rounded-lg">
            <p className="text-base font-semibold">No candidates found matching your criteria</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Try adjusting your search terms or clearing active filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("");
                setSearch("");
                setSkills("");
                setLocation("");
                setRemoteOnly(false);
                setPage(1);
              }}
              className="mt-4 px-4 py-2 rounded-md bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : null}
      </div>

      {pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--color-border)]">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-md border border-[var(--color-border)] text-xs font-semibold disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="mono text-xs text-[var(--color-muted)]">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={!pagination.hasMore || loading}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-md border border-[var(--color-border)] text-xs font-semibold disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}
