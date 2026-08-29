import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { preferencesSchema } from "@/lib/validators/preferences";

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function PATCH(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const parsed = preferencesSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "profile not found" }, { status: 404 });
  
  const updateData: { hidePhone?: boolean } = {};
  if (parsed.data.hidePhone !== undefined) updateData.hidePhone = parsed.data.hidePhone;

  const updated = await prisma.candidateProfile.update({
    where: { userId },
    data: updateData,
  });
  return NextResponse.json({ ...updated, prefs: parsed.data });
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(profile);
}
