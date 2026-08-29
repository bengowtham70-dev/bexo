import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "not found" }, { status: 404 });
  await prisma.candidateProfile.update({ where: { userId }, data: { visibility: "HIDDEN" } });
  return NextResponse.json({ ok: true }, { status: 204 });
}
