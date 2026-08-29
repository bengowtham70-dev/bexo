import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { boostCheckoutSchema } from "@/lib/validators/boost";
import { validateBoostEligibility } from "@/lib/boost";
import { createBoostCheckoutSession } from "@/lib/payments";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`boost_checkout:${userId}`, 10, 60);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many checkout requests. Please try again later." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = boostCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const profile = await prisma.candidateProfile.findUnique({ where: { userId } });
  if (!profile) {
    return NextResponse.json({ error: "Candidate profile not found. Please create a profile first." }, { status: 404 });
  }

  const eligibility = await validateBoostEligibility(profile.id, parsed.data.categoryId);
  if (!eligibility.allowed) {
    return NextResponse.json({ error: eligibility.error }, { status: 409 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const origin = req.nextUrl.origin || "http://localhost:3000";

  try {
    const checkout = await createBoostCheckoutSession({
      candidateProfileId: profile.id,
      userId,
      userEmail: user?.email || "",
      categoryId: parsed.data.categoryId,
      origin,
      amountUsd: parsed.data.amountUsd,
    });

    return NextResponse.json(checkout, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create payment checkout session" }, { status: 500 });
  }
}
