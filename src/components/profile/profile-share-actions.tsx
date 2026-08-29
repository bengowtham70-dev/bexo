"use client";

import { useState } from "react";
import { Share2, Copy, Check, Twitter, Linkedin, Bookmark } from "lucide-react";

interface ProfileShareActionsProps {
  slug: string;
  name: string;
  headline: string;
  candidateId?: string;
}

export function ProfileShareActions({
  slug,
  name,
  headline,
  candidateId,
}: ProfileShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/p/${slug}` : `https://bexo.run/p/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleShareX = () => {
    const text = `Check out ${name} (${headline}) on @bexo_app — verified builder directory:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!candidateId) return;
    setSaved((prev) => {
      const next = !prev;
      try {
        const stored = localStorage.getItem("bexo_saved_candidates");
        const list: string[] = stored ? JSON.parse(stored) : [];
        if (next) {
          if (!list.includes(candidateId)) list.push(candidateId);
        } else {
          const idx = list.indexOf(candidateId);
          if (idx !== -1) list.splice(idx, 1);
        }
        localStorage.setItem("bexo_saved_candidates", JSON.stringify(list));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* 1-Click Shortlist */}
      {candidateId && (
        <button
          type="button"
          onClick={handleToggleBookmark}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all shadow-2xs ${
            saved
              ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]"
              : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-ink)]"
          }`}
          title={saved ? "Candidate saved to shortlist" : "Save to Recruiter Shortlist"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
          <span>{saved ? "Shortlisted" : "Shortlist"}</span>
        </button>
      )}

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors shadow-2xs"
        title="Copy direct profile link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
            <span className="text-[var(--color-success)]">Link Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Share to X */}
      <button
        type="button"
        onClick={handleShareX}
        className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors shadow-2xs"
        title="Share on X"
        aria-label="Share on X"
      >
        <Twitter className="w-3.5 h-3.5" />
      </button>

      {/* Share to LinkedIn */}
      <button
        type="button"
        onClick={handleShareLinkedIn}
        className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors shadow-2xs"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
