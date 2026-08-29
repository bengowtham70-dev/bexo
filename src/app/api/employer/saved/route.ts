import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { filterPublicProfile } from "@/lib/privacy";

const saveCandidateSchema = z.object({
  candidateId: z.string().min(1),
  notesPrivate: z.string().max(2000).optional(),
});

const updateNotesSchema = z.object({
  candidateId: z.string().min(1),
  notesPrivate: z.string().max(2000),
});

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") || "demo-employer-id";
}

async function getEmployerProfile(userId: string) {
  let profile = await prisma.employerProfile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.employerProfile.create({
      data: {
        userId,
        company: "Default Company",
        verificationStatus: "PENDING",
      },
    });
  }
  return profile;
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const employer = await getEmployerProfile(userId);

  const saved = await prisma.employerSaved.findMany({
    where: { employerId: employer.id },
    orderBy: { createdAt: "desc" },
  });

  const candidateIds = saved.map((s) => s.candidateId);

  const candidates = await prisma.candidateProfile.findMany({
    where: { id: { in: candidateIds } },
    include: {
      experiences: true,
      skills: true,
      projects: true,
      user: { select: { name: true, image: true, email: true } },
    },
  });

  const candidatesMap = new Map(candidates.map((c) => [c.id, c]));

  const result = saved.map((s) => {
    const candidate = candidatesMap.get(s.candidateId);
    return {
      id: s.id,
      candidateId: s.candidateId,
      notesPrivate: s.notesPrivate,
      savedAt: s.createdAt,
      candidateProfile: candidate ? filterPublicProfile(candidate) : null,
    };
  });

  return NextResponse.json({ saved: result, count: result.length });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const employer = await getEmployerProfile(userId);

  const body = await req.json();
  const parsed = saveCandidateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { candidateId, notesPrivate } = parsed.data;

  // Check if candidate exists
  const candidate = await prisma.candidateProfile.findUnique({
    where: { id: candidateId },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
  }

  const savedRecord = await prisma.employerSaved.upsert({
    where: {
      employerId_candidateId: {
        employerId: employer.id,
        candidateId,
      },
    },
    update: {
      ...(notesPrivate !== undefined ? { notesPrivate } : {}),
    },
    create: {
      employerId: employer.id,
      candidateId,
      notesPrivate: notesPrivate || null,
    },
  });

  return NextResponse.json({
    success: true,
    saved: savedRecord,
  });
}

export async function PATCH(req: NextRequest) {
  const userId = getUserId(req);
  const employer = await getEmployerProfile(userId);

  const body = await req.json();
  const parsed = updateNotesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { candidateId, notesPrivate } = parsed.data;

  const existing = await prisma.employerSaved.findUnique({
    where: {
      employerId_candidateId: {
        employerId: employer.id,
        candidateId,
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Saved candidate record not found" }, { status: 404 });
  }

  const updated = await prisma.employerSaved.update({
    where: { id: existing.id },
    data: { notesPrivate },
  });

  return NextResponse.json({
    success: true,
    saved: updated,
  });
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  const employer = await getEmployerProfile(userId);

  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");

  if (!candidateId) {
    return NextResponse.json({ error: "candidateId query param is required" }, { status: 400 });
  }

  await prisma.employerSaved.deleteMany({
    where: {
      employerId: employer.id,
      candidateId,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Candidate removed from saved shortlist",
  });
}
