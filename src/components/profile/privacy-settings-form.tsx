"use client";

import { useEffect, useState } from "react";

export function PrivacySettingsForm() {
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE" | "HIDDEN">("PUBLIC");
  const [hideFromSearch, setHideFromSearch] = useState<boolean>(false);
  const [hideEmail, setHideEmail] = useState<boolean>(true);
  const [hidePhone, setHidePhone] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrivacy() {
      try {
        const res = await fetch("/api/me/privacy");
        if (res.ok) {
          const data = await res.json();
          if (data.privacy) {
            setVisibility(data.privacy.visibility || "PUBLIC");
            setHideFromSearch(!!data.privacy.hideFromSearch);
            setHideEmail(data.privacy.hideEmail !== false);
            setHidePhone(data.privacy.hidePhone !== false);
          }
        }
      } catch (err) {
        console.error("Failed to load privacy settings:", err);
      }
    }
    loadPrivacy();
  }, []);

  const handleSavePrivacy = async () => {
    setSaving(true);
    setSavedStatus(null);
    try {
      const res = await fetch("/api/me/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibility,
          hideFromSearch,
          hideEmail,
          hidePhone,
        }),
      });
      if (res.ok) {
        setSavedStatus("Privacy preferences saved successfully.");
        setTimeout(() => setSavedStatus(null), 3000);
      } else {
        setSavedStatus("Failed to save privacy settings.");
      }
    } catch (err) {
      setSavedStatus("Error updating privacy settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    window.location.href = "/api/me/export";
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") {
      setDeleteError('Please type "DELETE MY ACCOUNT" exactly to confirm.');
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/me/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: deleteConfirmText }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const err = await res.json();
        setDeleteError(err.error || "Failed to delete account.");
      }
    } catch (err) {
      setDeleteError("Network error during account deletion.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid gap-8 max-w-[800px]">
      {/* Visibility & Indexing Controls */}
      <div className="border border-[var(--color-border)] rounded-xl p-6 bg-[var(--color-surface)] shadow-sm">
        <h2 className="text-base font-semibold text-[var(--color-ink)]">Profile Visibility & Discovery</h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Control how your profile appears to recruiters and search engines.
        </p>

        {savedStatus && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-success)]">
            {savedStatus}
          </div>
        )}

        <div className="mt-6 grid gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2 text-[var(--color-muted)]">Profile Visibility</label>
            <div className="grid sm:grid-cols-3 gap-3">
              <label className={`p-3.5 rounded-lg border cursor-pointer flex flex-col justify-between transition-colors ${
                visibility === "PUBLIC" ? "border-[var(--color-ink)] bg-[var(--color-bg)]" : "border-[var(--color-border)]"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Public</span>
                  <input
                    type="radio"
                    name="visibility"
                    value="PUBLIC"
                    checked={visibility === "PUBLIC"}
                    onChange={() => setVisibility("PUBLIC")}
                    className="accent-[var(--color-ink)]"
                  />
                </div>
                <span className="text-[10px] text-[var(--color-muted)] mt-1">Listed in talent directory and search</span>
              </label>

              <label className={`p-3.5 rounded-lg border cursor-pointer flex flex-col justify-between transition-colors ${
                visibility === "PRIVATE" ? "border-[var(--color-ink)] bg-[var(--color-bg)]" : "border-[var(--color-border)]"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Private Link</span>
                  <input
                    type="radio"
                    name="visibility"
                    value="PRIVATE"
                    checked={visibility === "PRIVATE"}
                    onChange={() => setVisibility("PRIVATE")}
                    className="accent-[var(--color-ink)]"
                  />
                </div>
                <span className="text-[10px] text-[var(--color-muted)] mt-1">Accessible only to people with your direct URL</span>
              </label>

              <label className={`p-3.5 rounded-lg border cursor-pointer flex flex-col justify-between transition-colors ${
                visibility === "HIDDEN" ? "border-[var(--color-ink)] bg-[var(--color-bg)]" : "border-[var(--color-border)]"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Hidden</span>
                  <input
                    type="radio"
                    name="visibility"
                    value="HIDDEN"
                    checked={visibility === "HIDDEN"}
                    onChange={() => setVisibility("HIDDEN")}
                    className="accent-[var(--color-ink)]"
                  />
                </div>
                <span className="text-[10px] text-[var(--color-muted)] mt-1">Completely unlisted; no recruiter contact</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] grid gap-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] cursor-pointer">
              <div>
                <span className="text-xs font-semibold block">Hide from Public Search Directory</span>
                <span className="text-[10px] mono text-[var(--color-muted)]">
                  Omits profile from /talent board and adds noindex SEO tag
                </span>
              </div>
              <input
                type="checkbox"
                checked={hideFromSearch}
                onChange={(e) => setHideFromSearch(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-ink)]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] cursor-pointer">
              <div>
                <span className="text-xs font-semibold block">Hide Personal Email Address</span>
                <span className="text-[10px] mono text-[var(--color-muted)]">
                  Masks your email; recruiters must use BEXO secure contact relay
                </span>
              </div>
              <input
                type="checkbox"
                checked={hideEmail}
                onChange={(e) => setHideEmail(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-ink)]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] cursor-pointer">
              <div>
                <span className="text-xs font-semibold block">Hide Phone Number</span>
                <span className="text-[10px] mono text-[var(--color-muted)]">
                  Never display phone number on public profiles
                </span>
              </div>
              <input
                type="checkbox"
                checked={hidePhone}
                onChange={(e) => setHidePhone(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-ink)]"
              />
            </label>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSavePrivacy}
              className="px-5 py-2.5 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Privacy Preferences"}
            </button>
          </div>
        </div>
      </div>

      {/* GDPR Data Portability */}
      <div className="border border-[var(--color-border)] rounded-xl p-6 bg-[var(--color-surface)] shadow-sm">
        <h2 className="text-base font-semibold text-[var(--color-ink)]">GDPR Data Portability</h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Download a complete archive of your personal information, profile history, resumes, boosts, and transactions.
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs font-semibold hover:border-[var(--color-ink)] transition-colors"
          >
            Export All Data (JSON) ↓
          </button>
        </div>
      </div>

      {/* GDPR Right to be Forgotten */}
      <div className="border border-[var(--color-error)]/30 rounded-xl p-6 bg-[var(--color-surface)] shadow-sm">
        <h2 className="text-base font-semibold text-[var(--color-error)]">Permanent Account Deletion (GDPR)</h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Permanently erase your account, profile, uploaded resumes, boost history, and all stored data. This action is irreversible.
        </p>

        {deleteError && (
          <div className="mt-3 p-2.5 rounded bg-[var(--color-error)]/10 text-[var(--color-error)] text-xs font-mono">
            {deleteError}
          </div>
        )}

        <div className="mt-4">
          <label className="block text-xs font-semibold mb-1 text-[var(--color-muted)]">
            Type <span className="font-mono text-[var(--color-error)]">DELETE MY ACCOUNT</span> to confirm:
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5 max-w-[450px]">
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="flex-1 h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-mono text-[var(--color-error)] focus:outline-none focus:border-[var(--color-error)]"
            />
            <button
              type="button"
              disabled={deleting || deleteConfirmText !== "DELETE MY ACCOUNT"}
              onClick={handleDeleteAccount}
              className="px-4 py-2 rounded-md bg-[var(--color-error)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40"
            >
              {deleting ? "Deleting..." : "Erase All Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
