import { Check, Circle, ShieldCheck, Mail, Globe, Building, Linkedin } from "lucide-react";

export type VerificationSignals = {
  emailVerified?: boolean;
  domainVerified?: boolean;
  linkedin?: boolean;
  verifiedEmployer?: boolean;
};

export type VerificationBadgeProps = {
  status: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  signals?: VerificationSignals;
  compact?: boolean;
};

export function VerificationBadge({
  status,
  signals,
  compact = false,
}: VerificationBadgeProps) {
  const getStatusPill = () => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            Verified Employer
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--color-warning)]/15 text-[var(--color-warning)] border border-[var(--color-warning)]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]" />
            Verification Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--color-error)]/15 text-[var(--color-error)] border border-[var(--color-error)]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)]" />
            Verification Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--color-border)] text-[var(--color-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)]" />
            Unverified
          </span>
        );
    }
  };

  if (compact) {
    return getStatusPill();
  }

  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 bg-[var(--color-surface)] shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Employer Trust & Verification</h3>
          <p className="mono text-xs text-[var(--color-muted)] mt-0.5">4-Signal Trust Verification Protocol</p>
        </div>
        {getStatusPill()}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        {/* Signal 1: Work Email Domain */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            signals?.domainVerified ? "bg-[var(--color-success)] text-white" : "bg-[var(--color-border)] text-[var(--color-muted)]"
          }`}>
            {signals?.domainVerified ? <Check className="w-3 h-3" /> : <Circle className="w-2.5 h-2.5" />}
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold">Corporate Email Domain</div>
            <div className="text-[10px] mono text-[var(--color-muted)]">
              {signals?.domainVerified ? "Matches corporate website" : "Non-free domain required"}
            </div>
          </div>
        </div>

        {/* Signal 2: Email Token Challenge */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            signals?.emailVerified ? "bg-[var(--color-success)] text-white" : "bg-[var(--color-border)] text-[var(--color-muted)]"
          }`}>
            {signals?.emailVerified ? <Check className="w-3 h-3" /> : <Circle className="w-2.5 h-2.5" />}
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold">Work Email Token Challenge</div>
            <div className="text-[10px] mono text-[var(--color-muted)]">
              {signals?.emailVerified ? "SHA-256 token redeemed" : "Email challenge unconfirmed"}
            </div>
          </div>
        </div>

        {/* Signal 3: Corporate Registration */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            status === "VERIFIED" ? "bg-[var(--color-success)] text-white" : "bg-[var(--color-border)] text-[var(--color-muted)]"
          }`}>
            {status === "VERIFIED" ? <Check className="w-3 h-3" /> : <Circle className="w-2.5 h-2.5" />}
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold">Corporate Entity Verified</div>
            <div className="text-[10px] mono text-[var(--color-muted)]">Active company verification</div>
          </div>
        </div>

        {/* Signal 4: Recruiter Identity (LinkedIn) */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            signals?.linkedin ? "bg-[var(--color-success)] text-white" : "bg-[var(--color-border)] text-[var(--color-muted)]"
          }`}>
            {signals?.linkedin ? <Check className="w-3 h-3" /> : <Circle className="w-2.5 h-2.5" />}
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold">Recruiter Identity Profile</div>
            <div className="text-[10px] mono text-[var(--color-muted)]">
              {signals?.linkedin ? "LinkedIn profile connected" : "Link recruiter profile"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
