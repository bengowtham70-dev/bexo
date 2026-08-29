import { PrivacySettingsForm } from "@/components/profile/privacy-settings-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Safety Settings — BEXO",
  description: "Manage candidate visibility, search indexing, contact masking, and GDPR data portability.",
};

export default function CandidatePrivacyPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-10">
      <div className="pb-6 border-b border-[var(--color-border)]">
        <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">
          Candidate Preferences
        </p>
        <h1 className="text-3xl font-bold tracking-tighter mt-1">
          Privacy & Safety Controls
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Configure profile search visibility, mask personal contact information, and download or erase your data.
        </p>
      </div>

      <div className="mt-8">
        <PrivacySettingsForm />
      </div>
    </div>
  );
}
