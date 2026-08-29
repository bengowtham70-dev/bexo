import type { CandidateProfile, Visibility } from "@prisma/client";

export function canPublish(profile: {
  headline?: string | null;
  location?: string | null;
  bio?: string | null;
  slug?: string | null;
}) {
  if (!profile.headline || profile.headline.trim().length < 3) return "headline required (3-80ch) §31";
  if (!profile.location) return "location required";
  if (!profile.bio || profile.bio.trim().length < 10) return "bio required";
  return null;
}

export function canViewResume(
  viewerId: string | null,
  profile: { userId: string; visibility: Visibility | string }
): boolean {
  if (profile.visibility === "PUBLIC") return true;
  if (viewerId && viewerId === profile.userId) return true;
  return false;
}

export function filterPublicProfile(profile: any) {
  if (!profile) return null;
  const { ...publicData } = profile;

  // Mask private fields if hide flags true — enforced at API + DB per PRD §18
  if (profile.hideEmail) {
    delete publicData.email;
    if (publicData.user) {
      delete publicData.user.email;
    }
  }
  if (profile.hidePhone) {
    delete publicData.phone;
  }
  if (profile.hideFromSearch) {
    publicData.noIndex = true;
  }

  return publicData;
}
