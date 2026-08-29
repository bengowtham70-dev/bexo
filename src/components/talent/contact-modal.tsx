"use client";

import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";

export type ContactModalProps = {
  candidateId: string;
  candidateName: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ContactModal({
  candidateId,
  candidateName,
  isOpen,
  onClose,
}: ContactModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/employer/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          subject,
          message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          type: "success",
          text: "Message securely relayed to candidate. You will be notified when they respond.",
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setFeedback({
          type: "error",
          text: data.error || "Failed to deliver contact message.",
        });
      }
    } catch (err) {
      setFeedback({ type: "error", text: "Network error sending message." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl max-w-[550px] w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-ink)]">
              Contact {candidateName}
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              Masked BEXO email relay protects candidate personal contact info.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs font-mono ${
              feedback.type === "success"
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)]"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--color-muted)]">
              Subject / Role Opportunity *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Senior AI Engineer Opportunity at Acme"
              className="w-full h-9 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--color-muted)]">
              Message *
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce your team, describe the role, compensation range, and why they might be a strong fit..."
              className="w-full p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] resize-none"
            />
          </div>

          <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-muted)] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[var(--color-ink)]">BEXO Safety Note:</span> External payment requests, advance-fee training, or unsolicited off-platform messenger recruitment are strictly banned under PRD §21.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-[var(--color-border)] text-xs font-semibold hover:border-[var(--color-ink)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-md bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Relaying..." : "Send Secure Message →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
