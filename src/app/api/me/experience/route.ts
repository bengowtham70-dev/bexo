import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const expSchema = z.object({
  company: z.string().min(1).max(80),
  title: z.string().min(1).max(80),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().max(500).optional(),
});

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const parsed = expSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "profile not found" }, { status: 404 });
  const exp = await prisma.experience.create({
    data: {
      candidateProfileId: profile.id,
      company: parsed.data.company,
      title: parsed.data.title,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      description: parsed.data.description,
    },
  });
  return NextResponse.json(exp, { status: 201 });
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json([], { status: 200 });
  const list = await prisma.experience.findMany({ where: { candidateProfileId: profile.id }, orderBy: { createdAt: "asc" } });
  return NextResponse.json(list);
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
