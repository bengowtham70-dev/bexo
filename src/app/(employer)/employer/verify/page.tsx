"use client";

import { useState } from "react";
import { VerificationBadge } from "@/components/employer/verification-badge";

export default function EmployerVerifyPage() {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [signals, setSignals] = useState<{
    emailVerified?: boolean;
    domainVerified?: boolean;
    linkedin?: boolean;
    verifiedEmployer?: boolean;
  }>({
    emailVerified: false,
    domainVerified: false,
    linkedin: false,
    verifiedEmployer: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/employer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          website,
          workEmail,
          linkedinUrl,
          role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback("Verification token issued! Please check your work email for the challenge link.");
        if (data.domainVerified !== undefined) {
          setSignals((prev) => ({
            ...prev,
            domainVerified: data.domainVerified,
            linkedin: !!linkedinUrl,
          }));
        }
      } else {
        setFeedback(data.error || "Failed to submit verification request");
      }
    } catch (err) {
      setFeedback("Network error during verification submission");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-10">
      <div className="pb-6 border-b border-[var(--color-border)]">
        <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">
          Security & Compliance
        </p>
        <h1 className="text-3xl font-bold tracking-tighter mt-1">
          Employer Verification Center
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Complete the 4-signal verification protocol to unlock direct candidate messaging and contact reveal.
        </p>
      </div>

      <div className="mt-6">
        <VerificationBadge
          status={signals.verifiedEmployer ? "VERIFIED" : "PENDING"}
          signals={signals}
        />
      </div>

      <div className="mt-8 border border-[var(--color-border)] rounded-xl p-6 bg-[var(--color-surface)] shadow-sm">
        <h2 className="text-base font-semibold text-[var(--color-ink)]">Submit Corporate Credentials</h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Free email domains (Gmail, Yahoo, etc.) are strictly disallowed per PRD §17.
        </p>

        {feedback && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-mono">
            {feedback}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--color-muted)]">Company Name *</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--color-muted)]">Company Website *</label>
            <input
              type="url"
              required
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://acme.com"
              className="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--color-muted)]">Work Email Address *</label>
            <input
              type="email"
              required
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              placeholder="recruiter@acme.com"
              className="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--color-muted)]">Recruiter LinkedIn URL</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-[var(--color-muted)]">Your Role at Company</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Technical Recruiter / Talent Lead"
              className="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Request Email Verification Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
