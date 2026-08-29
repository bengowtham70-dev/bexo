import Link from "next/link";
import { HomeBoard } from "@/components/home/home-board";
import { MarketTicker } from "@/components/home/market-ticker";
import { Logo } from "@/components/brand/logo";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      {/* Top Navbar */}
      <Navbar maxWidth="max-w-[1100px]" activePath="/talent" />

      {/* Main Container */}
      <main className="flex-1 max-w-[860px] mx-auto px-6 w-full pb-16">
        {/* Status Line */}
        <div className="flex justify-center mt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-warm)] border border-[var(--color-border)] text-xs text-[var(--color-muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span className="font-bold text-[var(--color-ink)]">Active hiring board</span>
            <span>•</span>
            <span>Live candidate directory</span>
            <span>•</span>
            <Link href="/#explore" className="font-semibold text-[var(--color-ink)] hover:underline">
              Explore board ↓
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-center pt-5 pb-2">
          <p className="mono text-xs tracking-wider uppercase text-[var(--color-muted)] font-semibold mb-2">
            Back Yourself. Get Seen.
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-ink)]">
            Have the skill? <span className="inline-block bg-[var(--color-lime)] text-[var(--color-ink)] px-2.5 py-0.5 rounded-md font-black border border-[var(--color-lime-dark)]/40 shadow-xs">Take the top spot.</span> Get hired.
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-muted)] max-w-[640px] mx-auto mt-2.5 leading-relaxed font-medium">
            Skip the application black hole. Back your craft, claim the spotlight on the leaderboard, and let top founders find your work directly.
          </p>

          {/* Quick Actions — Raised Explore Talent */}
          <div className="flex items-center justify-center gap-2.5 mt-4 flex-wrap">
            <Link
              href="#explore"
              className="px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 transition-opacity shadow-2xs"
            >
              Explore Talent ↓
            </Link>
            <Link
              href="/signup?role=EMPLOYER"
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-semibold hover:border-[var(--color-ink)] transition-colors"
            >
              Post a Role →
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-semibold hover:border-[var(--color-ink)] transition-colors"
            >
              Claim Your Spotlight
            </Link>
          </div>

          {/* Paying Users & Pricing Rate Indicator */}
          <div className="flex justify-center mt-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-warm)] border border-[var(--color-border)] text-xs text-[var(--color-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-lime-dark)] animate-pulse" />
              <span className="font-bold text-[var(--color-ink)]">1,000+ Builders & Engineers Listed</span>
              <span>•</span>
              <span className="font-medium">Spotlight from $1</span>
            </div>
          </div>

          {/* Real-Time Market Ticker */}
          <div className="mt-4">
            <MarketTicker />
          </div>
        </section>

        {/* Live Leaderboard / Talent Board */}
        <section className="mt-4">
          <HomeBoard />
        </section>

        {/* Trust & Safety Callout — PRD §21 */}
        <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-warm)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-[var(--color-ink)]">
                Trust & Candidate Protection: You pay BEXO for visibility — never pay an employer to get a job.
              </p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                BEXO strictly enforces 4-Signal employer verification and bans pay-to-work schemes.
              </p>
            </div>
            <Link
              href="/safety"
              className="text-xs font-semibold text-[var(--color-ink)] hover:underline flex-shrink-0"
            >
              Safety Rules →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 bg-[var(--color-bg)] text-center text-xs text-[var(--color-muted)]">
        <div className="max-w-[860px] mx-auto px-6">
          <div className="flex justify-center mb-2">
            <Logo href="/" size="sm" />
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            Where AI startups and top builders connect directly.
          </p>
          <div className="flex justify-center flex-wrap gap-4 mt-4">
            <Link href="/talent" className="hover:underline">Explore Talent</Link>
            <Link href="/how-it-works" className="hover:underline">How BEXO Works</Link>
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
