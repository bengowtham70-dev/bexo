import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { recordAudit } from "@/lib/audit";
import { z } from "zod";

const updateUserStatusSchema = z.object({
  suspended: z.boolean(),
  reason: z.string().max(500).optional(),
});

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

  const targetUserId = params.id;
  const body = await req.json().catch(() => ({}));
  const parsed = updateUserStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { suspended, reason } = parsed.data;

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { candidateProfile: true, employerProfile: true },
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (targetUser.candidateProfile) {
    await prisma.candidateProfile.update({
      where: { id: targetUser.candidateProfile.id },
      data: {
        visibility: suspended ? "HIDDEN" : "PUBLIC",
      },
    });

    if (suspended) {
      // Expire any active boosts
      await prisma.boost.updateMany({
        where: { candidateId: targetUser.candidateProfile.id, status: "ACTIVE" },
        data: { status: "CANCELLED" },
      });
    }
  }

  if (targetUser.employerProfile && suspended) {
    await prisma.employerProfile.update({
      where: { id: targetUser.employerProfile.id },
      data: {
        verificationStatus: "REJECTED",
      },
    });
  }

  await recordAudit({
    userId: adminId,
    action: suspended ? "USER_SUSPENDED" : "USER_REINSTATED",
    meta: {
      targetUserId,
      reason,
    },
  });

  return NextResponse.json({
    success: true,
    message: suspended ? "User suspended and hidden from platform" : "User reinstated to public standing",
  });
}
