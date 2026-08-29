import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updatePrivacySchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE", "HIDDEN"]).optional(),
  hideFromSearch: z.boolean().optional(),
  hideEmail: z.boolean().optional(),
  hidePhone: z.boolean().optional(),
});

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      visibility: true,
      hideFromSearch: true,
      hideEmail: true,
      hidePhone: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
  }

  return NextResponse.json({ privacy: profile });
}

export async function PATCH(req: NextRequest) {
  const userId = getUserId(req);

  const body = await req.json();
  const parsed = updatePrivacySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
  }

  const updated = await prisma.candidateProfile.update({
    where: { userId },
    data: {
      ...(parsed.data.visibility !== undefined ? { visibility: parsed.data.visibility } : {}),
      ...(parsed.data.hideFromSearch !== undefined ? { hideFromSearch: parsed.data.hideFromSearch } : {}),
      ...(parsed.data.hideEmail !== undefined ? { hideEmail: parsed.data.hideEmail } : {}),
      ...(parsed.data.hidePhone !== undefined ? { hidePhone: parsed.data.hidePhone } : {}),
    },
    select: {
      id: true,
      visibility: true,
      hideFromSearch: true,
      hideEmail: true,
      hidePhone: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    privacy: updated,
  });
}
