import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") || "demo-candidate-id";
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      candidateProfile: {
        include: {
          experiences: true,
          projects: true,
          skills: true,
          educations: true,
          links: true,
          resumes: true,
          boosts: true,
        },
      },
      employerProfile: {
        include: {
          saved: true,
          savedLists: true,
        },
      },
      payments: true,
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    gdprCompliant: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    candidateProfile: user.candidateProfile || null,
    employerProfile: user.employerProfile || null,
    payments: user.payments,
    auditLogs: user.auditLogs,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  return new NextResponse(jsonString, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="bexo-data-export-${userId}.json"`,
    },
  });
}
