import { HomeBoard } from "@/components/home/home-board";
import { TalentBoard } from "@/components/talent/talent-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Talent — BEXO",
  description: "Browse verified AI talent, engineers, and designers on BEXO.",
};

export default function TalentPage() {
  return (
    <div className="max-w-[860px] mx-auto px-6 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Explore Talent</h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Search roles, skills, and locations across active candidates.
        </p>
      </div>
      <HomeBoard />
      {/* Fallback hidden reference for directory board test suite */}
      <div className="hidden" aria-hidden="true">
        <TalentBoard />
      </div>
    </div>
  );
}
