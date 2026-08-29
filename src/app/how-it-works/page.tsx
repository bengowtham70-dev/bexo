import { Navbar } from "@/components/layout/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How BEXO Works — Direct Talent Marketplace",
  description: "Learn how candidates back themselves with proof of work and how verified employers discover and contact top talent directly.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Top Navbar */}
      <Navbar maxWidth="max-w-[1000px]" activePath="/how-it-works" />

      <main className="max-w-[1000px] mx-auto px-6 py-12">
        <div className="pb-8 border-b border-[var(--color-border)]">
          <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)] font-semibold">
            Marketplace Mechanics
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter mt-2">
            How BEXO Works
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-2 max-w-[650px] leading-relaxed">
            The traditional hiring model is broken: endless job boards, ghosting, and recruiter spam. BEXO reverses the dynamic by turning candidates into discoverable profiles with verified proof of work.
          </p>
        </div>

        {/* 3 Pillars For Candidates */}
        <section className="mt-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-lime)]" />
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
              For Candidates: Back Yourself. Get Seen.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-lime-dark)]">STEP 01</span>
              <h3 className="text-sm font-semibold mt-1">Build Your Verified Profile</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Connect your GitHub, import your resume, and link real project evidence. No inflated buzzwords — just demonstrable engineering ability.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-lime-dark)]">STEP 02</span>
              <h3 className="text-sm font-semibold mt-1">Optional 24h Spotlight Boost</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                When actively hunting for your next role, place yourself on the category Featured shelf for 24 hours. Fixed price, time-boxed, and strictly merit-rotated.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-lime-dark)]">STEP 03</span>
              <h3 className="text-sm font-semibold mt-1">Direct Inbound from Verified Teams</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Receive inbound outreach directly from corporate hiring managers and founders. Your personal email remains protected behind our contact relay.
              </p>
            </div>
          </div>
        </section>

        {/* 3 Pillars For Employers */}
        <section className="mt-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-violet)]" />
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
              For Employers: High Signal, Zero Noise
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-violet)]">STEP 01</span>
              <h3 className="text-sm font-semibold mt-1">Search Verified Talent Directory</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Filter by specific skills, stack, remote preference, and view candidate evidence without wading through thousands of unqualified applicant tracking systems.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-violet)]">STEP 02</span>
              <h3 className="text-sm font-semibold mt-1">Shortlist & Add Private Recruiter Notes</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Organize promising candidates into saved talent lists and annotate candidate profiles with private recruiting evaluations.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="mono text-xs font-bold text-[var(--color-violet)]">STEP 03</span>
              <h3 className="text-sm font-semibold mt-1">Reach Out Directly</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1.5 leading-relaxed">
                Send structured opportunity details straight to the candidate. Our contact relay ensures instant delivery while maintaining anti-phishing hygiene.
              </p>
            </div>
          </div>
        </section>

        {/* Boost Rotation Protocol Transparency */}
        <section className="mt-12 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">
            Boost Rotation Protocol & Anti-Monopoly Guarantees
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
            Unlike pay-to-win directories that allow deep-pocketed sponsors to permanently dominate the top spot, BEXO enforces strict algorithmic fairness:
          </p>

          <ul className="mt-4 space-y-2 text-xs text-[var(--color-muted)]">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[var(--color-ink)]">•</span>
              <span><strong>Strict 24-Hour Expiration:</strong> All boosts expire automatically after exactly 24 hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[var(--color-ink)]">•</span>
              <span><strong>Category Cap & Equal Visibility:</strong> A maximum of 5 candidates can be active in any single category at once.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[var(--color-ink)]">•</span>
              <span><strong>Pure Merit Verification:</strong> Highlighting requires an active, published profile with verified experience and evidence.</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
