import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const projSchema = z.object({
  name: z.string().min(3).max(80),
  description: z.string().max(500).optional(),
  stack: z.string().max(120).optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
});

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const parsed = projSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "profile not found" }, { status: 404 });
  const proj = await prisma.project.create({
    data: {
      candidateProfileId: profile.id,
      name: parsed.data.name,
      description: parsed.data.description,
      stack: parsed.data.stack,
      liveUrl: parsed.data.liveUrl || null,
      githubUrl: parsed.data.githubUrl || null,
    },
  });
  return NextResponse.json(proj, { status: 201 });
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json([], { status: 200 });
  const list = await prisma.project.findMany({ where: { candidateProfileId: profile.id } });
  return NextResponse.json(list);
}
