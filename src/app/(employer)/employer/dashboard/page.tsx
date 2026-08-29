import Link from "next/link";
import { VerificationBadge } from "@/components/employer/verification-badge";

export default function EmployerDashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">
            Recruiter Portal
          </p>
          <h1 className="text-3xl font-bold tracking-tighter mt-1">
            Employer Dashboard
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Discover top candidates, manage shortlists, and verify your corporate identity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/talent"
            className="px-4 py-2 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90"
          >
            Search Talent Board →
          </Link>
        </div>
      </div>

      {/* Verification status card */}
      <div className="mt-6">
        <VerificationBadge
          status="PENDING"
          signals={{
            domainVerified: true,
            emailVerified: false,
            linkedin: false,
            verifiedEmployer: false,
          }}
        />
      </div>

      {/* Quick Metrics */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="mono text-xs text-[var(--color-muted)]">Saved Shortlist</p>
          <p className="text-2xl font-bold mt-2">Active Candidates</p>
          <Link href="/employer/saved" className="mono text-xs text-[var(--color-ink)] hover:underline mt-2 inline-block">
            View Shortlist →
          </Link>
        </div>

        <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="mono text-xs text-[var(--color-muted)]">Candidate Discovery</p>
          <p className="text-2xl font-bold mt-2">6 Disciplines</p>
          <Link href="/talent" className="mono text-xs text-[var(--color-ink)] hover:underline mt-2 inline-block">
            Browse Talent →
          </Link>
        </div>

        <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="mono text-xs text-[var(--color-muted)]">Trust Protocol</p>
          <p className="text-2xl font-bold mt-2">4 Signals</p>
          <Link href="/employer/verify" className="mono text-xs text-[var(--color-ink)] hover:underline mt-2 inline-block">
            Verification Center →
          </Link>
        </div>
      </div>
    </div>
  );
}
