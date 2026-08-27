import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const skillSchema = z.object({ name: z.string().min(1).max(40), evidenceRefs: z.string().url().optional().or(z.literal("")) });

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "profile not found" }, { status: 404 });
  const skill = await prisma.candidateSkill.create({ data: { candidateProfileId: profile.id, name: parsed.data.name, evidenceRefs: parsed.data.evidenceRefs || null } });
  return NextResponse.json(skill, { status: 201 });
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json([], { status: 200 });
  const list = await prisma.candidateSkill.findMany({ where: { candidateProfileId: profile.id } });
  return NextResponse.json(list);
}
