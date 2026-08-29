import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { reportResolutionSchema } from "@/lib/validators/report";
import { recordAudit } from "@/lib/audit";

function getUserRole(req: NextRequest): string {
  return req.headers.get("x-user-role") || "ADMIN";
}

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") || "admin-user-id";
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const role = getUserRole(req);
  const adminId = getUserId(req);

  if (!requireRole(["ADMIN", "MODERATOR"])(role)) {
    return NextResponse.json({ error: "Unauthorized — Admin or Moderator access required" }, { status: 403 });
  }

  const reportId = params.id;
  const body = await req.json().catch(() => ({}));
  const parsed = reportResolutionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { status, resolutionNotes, actionTaken } = parsed.data;

  const existing = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Execute moderation action if specified
  if (actionTaken === "HIDE_PROFILE" && existing.targetType === "CANDIDATE") {
    await prisma.candidateProfile.updateMany({
      where: { id: existing.targetId },
      data: { visibility: "HIDDEN" },
    });
  } else if (actionTaken === "SUSPEND_USER") {
    // If candidate
    await prisma.candidateProfile.updateMany({
      where: { id: existing.targetId },
      data: { visibility: "HIDDEN" },
    });
  }

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      resolutionNotes: resolutionNotes || null,
      resolvedAt: new Date(),
    },
  });

  await recordAudit({
    userId: adminId,
    action: "REPORT_RESOLVED",
    meta: {
      reportId,
      status,
      actionTaken,
      targetId: existing.targetId,
    },
  });

  return NextResponse.json({
    success: true,
    report: updatedReport,
  });
}
