import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reportCreateSchema } from "@/lib/validators/report";
import { recordAudit } from "@/lib/audit";

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") || "demo-reporter-id";
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);

  const body = await req.json().catch(() => ({}));
  const parsed = reportCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { targetType, targetId, reason, details } = parsed.data;

  // Rate limiting: Max 5 reports per hour per user
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentReports = await prisma.report.count({
    where: {
      reporterId: userId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentReports >= 5) {
    return NextResponse.json(
      { error: "Too many reports submitted. Please wait before submitting additional reports." },
      { status: 429 }
    );
  }

  // Ensure reporter user exists in db or create fallback for dev/demo
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        email: `${userId}@bexo.run`,
      },
    });
  }

  const report = await prisma.report.create({
    data: {
      reporterId: user.id,
      targetType,
      targetId,
      reason,
      details: details || null,
      status: "PENDING",
    },
  });

  await recordAudit({
    userId,
    action: "REPORT_SUBMITTED",
    meta: {
      reportId: report.id,
      targetType,
      targetId,
      reason,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Report submitted to BEXO Trust & Safety team.",
      report,
    },
    { status: 201 }
  );
}
