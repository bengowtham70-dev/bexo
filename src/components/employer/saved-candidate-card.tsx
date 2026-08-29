"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Lock, Check } from "lucide-react";

export type SavedCandidateCardProps = {
  savedId: string;
  candidateId: string;
  name: string;
  headline: string;
  slug?: string;
  location?: string;
  skills?: { name: string }[];
  initialNotes?: string | null;
  onRemove: (candidateId: string) => void;
};

export function SavedCandidateCard({
  candidateId,
  name,
  headline,
  slug,
  location,
  skills = [],
  initialNotes,
  onRemove,
}: SavedCandidateCardProps) {
  const [notes, setNotes] = useState<string>(initialNotes || "");
  const [savingNotes, setSavingNotes] = useState<boolean>(false);
  const [notesSaved, setNotesSaved] = useState<boolean>(false);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    try {
      const res = await fetch("/api/employer/saved", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, notesPrivate: notes }),
      });
      if (res.ok) {
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)] shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[var(--color-border)] flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase text-[var(--color-muted)]">
              {name.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[var(--color-ink)] truncate">{name}</h3>
              <p className="text-xs text-[var(--color-muted)] truncate">{headline}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(candidateId)}
            className="text-xs text-[var(--color-error)] hover:underline font-mono"
          >
            Remove
          </button>
        </div>

        {location && (
          <div className="mono text-[11px] text-[var(--color-muted)] mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[var(--color-muted)]" />
            <span>{location}</span>
          </div>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {skills.slice(0, 4).map((s, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-muted)]"
              >
                {s.name}
              </span>
            ))}
          </div>
        )}

        {/* Private Recruiter Notes */}
        <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-muted)] mb-1.5">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[var(--color-muted)]" />
              <span>Private Notes (Visible only to you)</span>
            </span>
            {notesSaved && (
              <span className="text-[var(--color-success)] font-semibold flex items-center gap-0.5">
                <Check className="w-3 h-3" />
                <span>Saved!</span>
              </span>
            )}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add candidate notes, interview progress, target salary, etc..."
            rows={2}
            className="w-full p-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] resize-none"
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              disabled={savingNotes}
              onClick={handleSaveNotes}
              className="px-2.5 py-1 rounded bg-[var(--color-ink)] text-[var(--color-bg)] text-[10px] font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {savingNotes ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
        {slug ? (
          <Link
            href={`/p/${slug}`}
            className="mono text-xs font-semibold text-[var(--color-ink)] hover:underline inline-flex items-center gap-1"
          >
            View Full Profile →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
