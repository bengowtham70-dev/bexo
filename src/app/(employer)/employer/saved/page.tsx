"use client";

import { useEffect, useState, useMemo } from "react";
import { SavedCandidateCard } from "@/components/employer/saved-candidate-card";
import Link from "next/link";
import { Download, Search, Sparkles, Filter, BookmarkCheck } from "lucide-react";
import { DEMO_PROFILES } from "@/lib/constants/demo-profiles";

export default function EmployerSavedPage() {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employer/saved");
      let apiSaved = [];
      if (res.ok) {
        const data = await res.json();
        apiSaved = data.saved || [];
      }

      // Check localStorage for quick bookmarks from homeboard
      let localSavedIds: string[] = [];
      try {
        const stored = localStorage.getItem("bexo_saved_candidates");
        if (stored) {
          localSavedIds = JSON.parse(stored);
        }
      } catch {}

      // Merge API saved with local saved candidates
      const mergedMap = new Map<string, any>();
      apiSaved.forEach((item: any) => mergedMap.set(item.candidateId, item));

      localSavedIds.forEach((id) => {
        if (!mergedMap.has(id)) {
          const demo = Object.values(DEMO_PROFILES).find((p) => p.id === id);
          if (demo) {
            mergedMap.set(id, {
              id: `local_${demo.id}`,
              candidateId: demo.id,
              notesPrivate: "Saved from live candidate directory",
              candidateProfile: {
                user: { name: demo.name },
                headline: demo.headline,
                slug: demo.slug,
                location: demo.location,
                skills: demo.skills.map((s) => ({ id: s, name: s })),
              },
            });
          }
        }
      });

      setSaved(Array.from(mergedMap.values()));
    } catch (err) {
      console.error("Failed to load saved candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (candidateId: string) => {
    try {
      await fetch(`/api/employer/saved?candidateId=${candidateId}`, {
        method: "DELETE",
      });
      // Also remove from localStorage
      try {
        const stored = localStorage.getItem("bexo_saved_candidates");
        if (stored) {
          const list: string[] = JSON.parse(stored);
          const next = list.filter((id) => id !== candidateId);
          localStorage.setItem("bexo_saved_candidates", JSON.stringify(next));
        }
      } catch {}
      setSaved((prev) => prev.filter((s) => s.candidateId !== candidateId));
    } catch (err) {
      console.error("Failed to remove candidate:", err);
    }
  };

  const handleExportCSV = () => {
    if (saved.length === 0) return;
    const headers = ["Name", "Headline", "Location", "Profile URL", "Private Notes"];
    const rows = saved.map((s) => [
      `"${s.candidateProfile?.user?.name || "Candidate"}"`,
      `"${s.candidateProfile?.headline || ""}"`,
      `"${s.candidateProfile?.location || ""}"`,
      `"https://bexo.run/p/${s.candidateProfile?.slug || ""}"`,
      `"${(s.notesPrivate || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bexo_candidate_shortlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSaved = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return saved;
    return saved.filter((s) => {
      const name = s.candidateProfile?.user?.name?.toLowerCase() || "";
      const headline = s.candidateProfile?.headline?.toLowerCase() || "";
      const loc = s.candidateProfile?.location?.toLowerCase() || "";
      return name.includes(q) || headline.includes(q) || loc.includes(q);
    });
  }, [saved, searchQuery]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-[var(--color-ink)]" />
            <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] font-semibold">
              Pipeline Management
            </p>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter mt-1">
            Saved Candidates Shortlist
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Track potential hires, manage private interview notes, and organize direct candidate outreach.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold hover:border-[var(--color-ink)] transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <Link
            href="/talent"
            className="px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity inline-block text-center shadow-2xs"
          >
            Discover More Talent →
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="mono text-xs text-[var(--color-muted)] font-semibold">
            Total Shortlisted: {saved.length} {loading && "• Loading..."}
          </div>

          {saved.length > 0 && (
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortlisted talent..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)]"
              />
            </div>
          )}
        </div>

        {filteredSaved.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredSaved.map((item) => (
              <SavedCandidateCard
                key={item.id}
                savedId={item.id}
                candidateId={item.candidateId}
                name={item.candidateProfile?.user?.name || item.candidateProfile?.headline || "Candidate"}
                headline={item.candidateProfile?.headline || "Professional"}
                slug={item.candidateProfile?.slug}
                location={item.candidateProfile?.location}
                skills={item.candidateProfile?.skills}
                initialNotes={item.notesPrivate}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-16 px-4 border border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]">
            <p className="text-base font-semibold text-[var(--color-ink)]">
              {searchQuery ? "No matching shortlisted candidates found" : "No candidates saved in your shortlist yet"}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Browse the talent directory to discover top builders and save them to your pipeline with 1 click.
            </p>
            <Link
              href="/talent"
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold inline-block shadow-2xs"
            >
              Browse Candidates →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
