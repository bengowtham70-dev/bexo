import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const eduSchema = z.object({
  institution: z.string().min(1).max(80),
  degree: z.string().max(80).optional(),
  field: z.string().max(80).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const parsed = eduSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "profile not found" }, { status: 404 });
  const edu = await prisma.education.create({
    data: {
      candidateProfileId: profile.id,
      institution: parsed.data.institution,
      degree: parsed.data.degree,
      field: parsed.data.field,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    },
  });
  return NextResponse.json(edu, { status: 201 });
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json([], { status: 200 });
  const list = await prisma.education.findMany({ where: { candidateProfileId: profile.id } });
  return NextResponse.json(list);
}
