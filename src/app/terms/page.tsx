import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — BEXO",
  description: "BEXO talent marketplace terms of service, candidate conditions, employer verification rules, and boost monetization terms.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Top Navbar */}
      <Navbar maxWidth="max-w-[900px]" />

      <main className="max-w-[900px] mx-auto px-6 py-12 space-y-8">
        <div className="border-b border-[var(--color-border)] pb-6">
          <p className="mono text-xs tracking-widest uppercase text-[var(--color-muted)] font-semibold">
            Platform Agreement
          </p>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Terms of Service</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1 font-mono">Effective: August 27, 2026</p>
        </div>

        {/* FTC Mandatory Standard PRD §21 */}
        <div className="p-5 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-surface)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-muted)] font-mono">
            Consumer Transparency Notice (PRD §21)
          </h2>
          <p className="text-base font-bold mt-1 text-[var(--color-ink)]">
            You pay BEXO for visibility — never pay an employer to get a job.
          </p>
          <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
            BEXO provides discovery tools for job seekers. We strictly prohibit any employer or third party from soliciting payment, application processing fees, or equipment advance fees from candidates.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">1. Candidate Eligibility & Accuracy</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            Candidates must be at least 18 years of age to register on BEXO. All experience, project links, credentials, and resume submissions must be accurate, truthful, and representative of your own authentic work. Misrepresentation or fabrication is grounds for immediate account termination.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">2. 24-Hour Boost Terms & Rotation Protocol</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            Candidates may purchase optional <strong>24-Hour Boost</strong> placements to highlight their profile on the category Featured shelf. Boosts are strictly time-boxed to 24 hours from payment confirmation and automatically expire. Boost visibility provides prominent placement only and does not constitute an endorsement, ranking, or guarantee of employment by BEXO.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">3. Employer Conduct & 4-Signal Verification</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            Employers must undergo 4-Signal verification (corporate domain match, corporate presence, valid recruiter identity) prior to contacting candidates. Employers may not harvest candidate data for unsolicited non-employment marketing, spam, or third-party syndication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">4. Account Termination & Moderation</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            BEXO reserves the right to suspend or terminate accounts violating our community standards, safety guidelines, or anti-phishing policies.
          </p>
        </section>
      </main>
    </div>
  );
}
