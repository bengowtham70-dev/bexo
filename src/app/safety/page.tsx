import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust & Safety Guidelines — BEXO",
  description: "Candidate safety policies, anti-scam measures, employer verification, and reporting guidelines.",
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Top Navbar */}
      <Navbar maxWidth="max-w-[1000px]" />

      <main className="max-w-[1000px] mx-auto px-6 py-12">
        <div className="pb-8 border-b border-[var(--color-border)]">
          <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] font-semibold">
            Candidate Protection Protocol
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter mt-2">
            Trust & Safety at BEXO
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-2 max-w-[650px] leading-relaxed">
            BEXO is built candidate-first. We enforce strict anti-scam rules, mandatory employer domain verification, and aggressive spam filters to keep hiring safe.
          </p>
        </div>

        {/* Primary FTC Transparency Callout — PRD §21 */}
        <div className="mt-8 p-6 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-lime)]" />
            <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Core Consumer Protection Standard
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-2 text-[var(--color-ink)]">
            You pay BEXO for visibility — never pay an employer to get a job.
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
            Under FTC and international consumer protection standards, legitimate employers never require job seekers to pay application fees, purchase equipment upfront via wire/crypto, or pay for training materials. BEXO strictly bans any company attempting to solicit funds from candidates.
          </p>
        </div>

        {/* Scam Prevention & Red Flags */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
            Scam Prevention & Red Flags
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-error)]">RED FLAG 01</span>
              <h3 className="text-sm font-semibold mt-1">Off-Platform Messenger Demands</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Recruiters who immediately ask you to move to Telegram, WhatsApp, or Signal without a verifiable corporate email address or video interview.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-error)]">RED FLAG 02</span>
              <h3 className="text-sm font-semibold mt-1">Check Cashing & Equipment Deposits</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Offers that involve sending you a check for home office gear and asking you to wire money back or purchase cryptocurrency.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-error)]">RED FLAG 03</span>
              <h3 className="text-sm font-semibold mt-1">Unsolicited Job Offers Without Interviews</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Guaranteed high-paying remote roles offered without technical assessments or live conversations with the hiring team.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-error)]">RED FLAG 04</span>
              <h3 className="text-sm font-semibold mt-1">Free Webmail Hiring Addresses</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Companies claiming to represent major brands while emailing from Gmail, Yahoo, or Outlook addresses. BEXO strictly requires corporate email domain verification.
              </p>
            </div>
          </div>
        </section>

        {/* 4-Signal Employer Verification */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
            How BEXO Verifies Employers
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Every employer on BEXO undergoes our 4-Signal Trust Verification Protocol before gaining contact privileges:
          </p>

          <div className="grid sm:grid-cols-4 gap-3 mt-4">
            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-success)]">01. Domain</span>
              <p className="text-xs font-medium mt-1">Corporate Domain Match</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-1">No free webmail providers allowed.</p>
            </div>

            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-success)]">02. Token</span>
              <p className="text-xs font-medium mt-1">Email Challenge</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-1">SHA-256 token verification.</p>
            </div>

            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-success)]">03. Identity</span>
              <p className="text-xs font-medium mt-1">Corporate Presence</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-1">Active business entity verification.</p>
            </div>

            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-success)]">04. Recruiter</span>
              <p className="text-xs font-medium mt-1">LinkedIn Profile</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-1">Verified recruiter identity.</p>
            </div>
          </div>
        </section>

        {/* Reporting & Enforcement */}
        <section className="mt-12 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">How to Report a Suspicious User or Message</h2>
          <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
            If you receive suspicious outreach or encounter an abusive profile, click the <strong>Report</strong> button on the candidate profile or contact message. Our Trust & Safety team reviews reports within 24 hours. Accounts found violating our terms are permanently suspended.
          </p>
          <div className="mt-4">
            <a
              href="mailto:safety@bexo.run?subject=Safety Report"
              className="px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold inline-block hover:opacity-90"
            >
              Contact Trust & Safety Team →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
