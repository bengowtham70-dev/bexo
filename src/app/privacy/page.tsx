import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — BEXO",
  description: "BEXO candidate and employer privacy policy, GDPR rights, data export, right to be forgotten, and contact masking relay.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Top Navbar */}
      <Navbar maxWidth="max-w-[900px]" />

      <main className="max-w-[900px] mx-auto px-6 py-12 space-y-8">
        <div className="border-b border-[var(--color-border)] pb-6">
          <p className="mono text-xs tracking-widest uppercase text-[var(--color-muted)] font-semibold">
            Data Privacy & GDPR Standards
          </p>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Privacy Policy</h1>
          <p className="text-xs text-[var(--color-muted)] mt-1 font-mono">Effective: August 27, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">1. Candidate PII Protection & Contact Masking</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            BEXO is engineered with privacy-by-design. Your personal email address and phone number are never made public or displayed to third parties by default. All employer outreach is mediated through our secure <strong>Contact Masking</strong> relay, which scans for spam and malicious links before forwarding verified communications to your inbox.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">2. Information We Collect</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            We collect the information you voluntarily provide to construct your professional profile, including your name, headline, location, biographical summary, work history, projects, skills, education, and resume files. For employers, we verify corporate email addresses and corporate presence.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">3. GDPR & CCPA Compliance</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            We strictly uphold your statutory rights under the General Data Protection Regulation (<strong>GDPR</strong>) and California Consumer Privacy Act (CCPA):
          </p>
          <ul className="list-disc pl-5 text-xs text-[var(--color-muted)] space-y-2">
            <li>
              <strong>Right to Access & Data Portability:</strong> You can download a complete, structured JSON archive of all profile data, resumes, boosts, and activity history at any time from your Privacy Settings dashboard.
            </li>
            <li>
              <strong>Right to be Forgotten:</strong> You can permanently erase your entire account and all associated data with immediate, cascading deletion.
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> You can toggle profile visibility to Private or Hidden and opt-out of search engine indexing with one click.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">4. Cookies and Telemetry</h2>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            We use strictly essential session tokens for authentication and anonymized product telemetry to maintain uptime and performance. We do not sell user data to advertising brokers.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-[var(--color-border)]">
          <h2 className="text-sm font-semibold">Contact Our Data Protection Officer</h2>
          <p className="text-xs text-[var(--color-muted)]">
            For privacy inquiries or compliance requests, contact <a href="mailto:privacy@bexo.run" className="underline font-mono">privacy@bexo.run</a>.
          </p>
        </section>
      </main>
    </div>
  );
}
