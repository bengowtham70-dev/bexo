import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { expireOutdatedBoosts } from "@/lib/cron/boost-expiry";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Lazy trigger expiry cleanup on read
  try {
    await expireOutdatedBoosts();
  } catch (e) {
    // Non-blocking
  }

  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const boosts = await prisma.boost.findMany({
    where: { candidateId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date().getTime();
  const formatted = boosts.map((b) => {
    const end = new Date(b.endAt).getTime();
    const remainingMs = Math.max(0, end - now);
    const hoursRemaining = b.status === "ACTIVE" ? Math.ceil(remainingMs / (1000 * 60 * 60)) : 0;

    return {
      id: b.id,
      categoryId: b.categoryId,
      amount: b.amount,
      currency: b.currency,
      startAt: b.startAt,
      endAt: b.endAt,
      status: b.status,
      hoursRemaining,
    };
  });

  return NextResponse.json({ boosts: formatted }, { status: 200 });
}
