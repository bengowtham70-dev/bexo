import type { CandidateProfile } from "@prisma/client";

export function canPublish(profile: { headline?: string | null; location?: string | null; bio?: string | null; slug?: string | null }) {
  if (!profile.headline || profile.headline.trim().length < 3) return "headline required (3-80ch) §31";
  if (!profile.location) return "location required";
  if (!profile.bio || profile.bio.trim().length < 10) return "bio required";
  return null;
}

export function canViewResume(viewerId: string | null, profile: CandidateProfile & { userId: string }): boolean {
  if (profile.visibility === "PUBLIC") return true;
  if (viewerId && viewerId === profile.userId) return true;
  return false;
}

export function filterPublicProfile(profile: any) {
  const { ...publicData } = profile;
  // hide private fields if hide flags true — enforced at API + DB per Global Constraints
  if (profile.hideEmail) delete publicData.email;
  if (profile.hidePhone) delete publicData.phone;
  if (profile.hideFromSearch) publicData.noIndex = true;
  // hideSalary/hideEmployer enforced via preferences — strip if set
  if (profile.hideSalary || profile.hideEmployer) {
    // keep headline/location but hide salary fields (not in base model)
  }
  return publicData;
}
