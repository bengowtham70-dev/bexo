import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Navbar } from "@/components/layout/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Top Navbar */}
      <Navbar maxWidth="max-w-[1100px]" activePath="/about" />

      {/* Main Content */}
      <main className="flex-1 max-w-[680px] mx-auto px-6 py-12 w-full">
        <div className="space-y-8">
          <div>
            <span className="mono text-xs tracking-wider uppercase text-[var(--color-muted)] font-semibold">
              The Mission
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-[var(--color-ink)]">
              About BEXO
            </h1>
            <p className="text-base text-[var(--color-muted)] mt-3 leading-relaxed">
              BEXO is a merit-driven hiring board and talent marketplace designed for AI startups, modern tech companies, and top builders who want direct connection without agency middlemen.
            </p>
          </div>

          <div className="border-t border-[var(--color-border)] pt-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-ink)]">Why We Built BEXO</h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Traditional job boards are flooded with keyword-stuffed resumes, ghost jobs, and opaque recruiter black boxes that charge 20–30% placement fees.
            </p>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              BEXO flips the model: candidates own their presence with verified proof of work (GitHub repositories, live product links, and audited experience), while companies discover and connect with candidates directly.
            </p>
          </div>

          <div className="border-t border-[var(--color-border)] pt-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-ink)]">How the Board Works</h2>
            <div className="grid gap-3">
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="text-sm font-semibold text-[var(--color-ink)]">1. Verified Proof of Work</h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  Every profile is constructed with strict evidence validation. Zero AI hallucination, real repository stats, and verifiable career milestones.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="text-sm font-semibold text-[var(--color-ink)]">2. Transparent Ranking & Fair Rotation</h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  Talent can claim featured spotlight placement atop their discipline shelf. To prevent permanent monopolies, featured spots rotate dynamically over 24-hour cycles.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="text-sm font-semibold text-[var(--color-ink)]">3. 4-Signal Employer Verification</h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  To protect candidates from phishing and spam, employers are verified through corporate domain match, manual review, company registration, and transparent intent logs.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="text-sm font-semibold text-[var(--color-ink)]">4. Direct Recruiter Outreach</h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  Employers contact talent directly through masked privacy relays. No hidden recruiter cuts from candidate compensation.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-6 space-y-4">
            <h2 className="text-xl font-bold text-[var(--color-ink)]">Trust & Anti-Scam Policy</h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              We operate under a strict candidate-first protection policy:
            </p>
            <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-warm)]">
              <p className="text-xs font-semibold text-[var(--color-ink)]">
                “You pay BEXO for visibility — never pay an employer to get a job.”
              </p>
              <p className="text-[11px] text-[var(--color-muted)] mt-1">
                Any employer requesting application fees, payment for equipment, or unverified deposits is banned immediately with permanent domain blacklisting.
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-8 flex items-center justify-between">
            <Link
              href="/"
              className="text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              ← Back to Leaderboard
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-md bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Join BEXO Today →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-line)] py-8 bg-[var(--color-bg)] text-center text-xs text-[var(--color-muted)]">
        <div className="max-w-[860px] mx-auto px-6">
          <div className="flex justify-center mb-2">
            <Logo href="/" size="sm" />
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            The merit-driven talent and hiring board for AI startups and builders.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/talent" className="hover:underline">Explore Talent</Link>
            <Link href="/how-it-works" className="hover:underline">How it works</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/safety" className="hover:underline">Safety</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
