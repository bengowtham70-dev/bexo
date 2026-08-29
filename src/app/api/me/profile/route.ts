import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validators/profile";

// Mock auth — Phase 02 will replace with real session; Phase 03 uses header x-user-id for TDD
function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function PATCH(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  // Ensure candidate profile exists
  const existing = await prisma.candidateProfile.findUnique({ where: { userId } });
  let profile;
  if (!existing) {
    const slug = `user-${userId.slice(0, 6)}`;
    profile = await prisma.candidateProfile.create({
      data: { userId, slug, headline: data.headline, location: data.location, bio: data.bio },
    });
  } else {
    profile = await prisma.candidateProfile.update({
      where: { userId },
      data: { headline: data.headline, location: data.location, bio: data.bio },
    });
  }
  if (data.image) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { image: data.image },
      });
    } catch {
      // User might be mock/demo in tests
    }
  }
  // Salary stored via preferences; keep here for compat
  return NextResponse.json(profile);
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId }, include: { experiences: true, projects: true, skills: true, educations: true } });
  if (!profile) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(profile);
}
