import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

function getUserRole(req: NextRequest): string {
  return req.headers.get("x-user-role") || "ADMIN";
}

export async function GET(req: NextRequest) {
  const role = getUserRole(req);
  if (!requireRole(["ADMIN", "MODERATOR"])(role)) {
    return NextResponse.json({ error: "Unauthorized — Admin or Moderator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const roleFilter = searchParams.get("role") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (roleFilter) where.role = roleFilter;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }

  const total = await prisma.user.count({ where });
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      candidateProfile: {
        select: {
          id: true,
          slug: true,
          headline: true,
          visibility: true,
          hideFromSearch: true,
        },
      },
      employerProfile: {
        select: {
          id: true,
          company: true,
          verificationStatus: true,
          domainVerified: true,
          emailVerified: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + users.length < total,
    },
  });
}
