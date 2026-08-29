"use client";
import { useState } from "react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [storageKey, setStorageKey] = useState<string>("");
  const [resumeId, setResumeId] = useState<string>("");
  const [draft, setDraft] = useState<any>(null);

  async function handleUpload() {
    if (!file) return;
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/me/resume", { method: "POST", body: fd, headers: { "x-user-id": "test-candidate-id" } });
    const data = await res.json();
    if (!res.ok) {
      setStatus(`Error: ${data.error || res.statusText}`);
      return;
    }
    setStorageKey(data.storageKey);
    setResumeId(data.id);
    setStatus(`Uploaded: ${data.storageKey}`);
  }

  async function handleParse() {
    if (!resumeId) return;
    setStatus("Parsing...");
    const res = await fetch("/api/me/resume/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-id": "test-candidate-id" },
      body: JSON.stringify({ resumeId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(`Parse error: ${data.error || res.statusText}`);
      return;
    }
    setDraft(data.draft);
    setStatus(`Parsed — review draft below. ${data.warnings?.[0] || ""}`);
  }

  return (
    <div className="mx-auto max-w-[640px] p-6 space-y-6">
      <div className="rounded-[14px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-[var(--color-ink)]">Import Resume</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Upload PDF or DOCX (max 5MB). Heuristic draft — please review and correct. AI must not invent employers/dates/degrees.</p>
        <div className="mt-4 border-2 border-dashed border-[var(--color-border-strong)] rounded-[10px] p-6 text-center bg-[var(--color-warm)]">
          <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mx-auto" />
          {file && <p className="mt-2 text-sm text-[var(--color-muted-strong)]">{file.name} — {(file.size / 1024).toFixed(1)} KB</p>}
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={handleUpload} disabled={!file} className="rounded-[10px] bg-[var(--color-lime)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-lime-hover)] disabled:opacity-50">Upload</button>
          <button onClick={handleParse} disabled={!resumeId} className="rounded-[10px] border border-[var(--color-border-strong)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--color-ink)] disabled:opacity-50">Parse</button>
        </div>
        {status && <p className="mt-3 text-sm text-[var(--color-muted)]">{status}</p>}
        {storageKey && <p className="text-xs text-[var(--color-muted)] break-all">storageKey: {storageKey}</p>}
      </div>

      {draft && (
        <div className="rounded-[14px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Review Draft</h2>
          <p className="text-xs text-[var(--color-muted)]">Editable draft — please review and correct before saving. Heuristic, not LLM.</p>
          <pre className="mt-3 overflow-auto rounded-[10px] bg-[var(--color-warm)] p-4 text-xs">{JSON.stringify(draft, null, 2)}</pre>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Save will merge to your profile (Phase 03). If profile setup not complete, stays in resume draft.</p>
        </div>
      )}
    </div>
  );
}
