import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canPublish } from "@/lib/privacy";

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

function slugify(headline: string) {
  const base = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base}-${rand}`;
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId }, include: { experiences: true } });
  if (!profile) return NextResponse.json({ error: "profile not found" }, { status: 404 });
  const err = canPublish(profile);
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  const slug = profile.slug || slugify(profile.headline || "profile");
  const updated = await prisma.candidateProfile.update({
    where: { userId },
    data: { slug, visibility: "PUBLIC" },
  });
  return NextResponse.json({ slug: updated.slug });
}
