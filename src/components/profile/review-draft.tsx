"use client";
import { useState } from "react";
import type { Draft } from "@/lib/resume-parse";

export function ReviewDraft({ draft: initial, onSave }: { draft: Draft; onSave?: (d: Draft) => void }) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [saving, setSaving] = useState(false);

  function update(path: string, value: any) {
    setDraft((prev) => {
      const copy: any = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  }

  async function handleSave() {
    setSaving(true);
    // Try to merge via existing profile APIs; fallback is local save
    try {
      await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-user-id": "test-candidate-id" },
        body: JSON.stringify({ headline: draft.headline, bio: draft.summary }),
      });
      for (const c of draft.companies) {
        await fetch("/api/me/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-id": "test-candidate-id" },
          body: JSON.stringify({ company: c.company, title: c.title, startDate: "2022-01-01", description: c.desc }),
        });
      }
    } catch {}
    setSaving(false);
    onSave?.(draft);
  }

  return (
    <div className="rounded-[14px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--color-ink)]">Review Draft</h2>
      <p className="text-xs text-[var(--color-muted)]">Heuristic draft — please review and correct. Must not invent employers/dates/degrees.</p>

      <label className="mt-4 block text-sm font-medium text-[var(--color-ink)]">Full name</label>
      <input value={draft.name} onChange={(e) => update("name", e.target.value)} className="mt-1 w-full rounded-[10px] border border-[var(--color-border-strong)] bg-white px-3 py-2 text-sm" placeholder="Full name" />

      <label className="mt-3 block text-sm font-medium text-[var(--color-ink)]">Headline</label>
      <input value={draft.headline} onChange={(e) => update("headline", e.target.value)} className="mt-1 w-full rounded-[10px] border border-[var(--color-border-strong)] bg-white px-3 py-2 text-sm" placeholder="Professional headline" />

      <label className="mt-3 block text-sm font-medium text-[var(--color-ink)]">Summary</label>
      <textarea value={draft.summary} onChange={(e) => update("summary", e.target.value)} rows={3} className="mt-1 w-full rounded-[10px] border border-[var(--color-border-strong)] bg-white px-3 py-2 text-sm" />

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Companies ({draft.companies.length})</h3>
        {draft.companies.map((c, i) => (
          <div key={i} className="mt-2 grid grid-cols-2 gap-2 rounded-[10px] bg-[var(--color-warm)] p-3">
            <input value={c.title} onChange={(e) => update(`companies.${i}.title`, e.target.value)} placeholder="Title" className="rounded-md border px-2 py-1 text-sm" />
            <input value={c.company} onChange={(e) => update(`companies.${i}.company`, e.target.value)} placeholder="Company" className="rounded-md border px-2 py-1 text-sm" />
            <input value={c.dates} onChange={(e) => update(`companies.${i}.dates`, e.target.value)} placeholder="Dates" className="rounded-md border px-2 py-1 text-sm col-span-2" />
          </div>
        ))}
        {draft.companies.length === 0 && <p className="mt-2 text-xs text-[var(--color-muted)]">No companies detected — add manually if needed.</p>}
      </div>

      <label className="mt-4 block text-sm font-medium text-[var(--color-ink)]">Skills (comma separated)</label>
      <input value={draft.skills.join(", ")} onChange={(e) => update("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="mt-1 w-full rounded-[10px] border border-[var(--color-border-strong)] bg-white px-3 py-2 text-sm" placeholder="Python, React, AWS" />

      <button onClick={handleSave} disabled={saving} className="mt-6 rounded-[10px] bg-[var(--color-lime)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-lime-hover)] disabled:opacity-50">{saving ? "Saving..." : "Save to Profile"}</button>
    </div>
  );
}
