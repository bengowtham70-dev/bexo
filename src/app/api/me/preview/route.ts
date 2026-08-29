import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { filterPublicProfile } from "@/lib/privacy";

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: { experiences: true, projects: true, skills: true, educations: true },
  });
  if (!profile) return NextResponse.json({ error: "not found" }, { status: 404 });
  const priv = filterPublicProfile(profile);
  const html = `<div><h1>${priv.headline || ""}</h1><p>${priv.bio || ""}</p></div>`;
  return NextResponse.json({ html, public: priv });
}
