import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import type { ReportStatus } from "@prisma/client";

function getUserRole(req: NextRequest): string {
  return req.headers.get("x-user-role") || "ADMIN";
}

export async function GET(req: NextRequest) {
  const role = getUserRole(req);
  if (!requireRole(["ADMIN", "MODERATOR"])(role)) {
    return NextResponse.json({ error: "Unauthorized — Admin or Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") || undefined) as ReportStatus | undefined;
  const targetType = searchParams.get("targetType") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (targetType) where.targetType = targetType;

  const total = await prisma.report.count({ where });
  const reports = await prisma.report.findMany({
    where,
    include: {
      reporter: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  return NextResponse.json({
    reports,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + reports.length < total,
    },
  });
}
