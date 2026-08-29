import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { boostCheckoutSchema } from "@/lib/validators/boost";
import { validateBoostEligibility } from "@/lib/boost";
import { getRazorpay } from "@/lib/razorpay";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`razorpay_order:${userId}`, 10, 60);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
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
  const amountUsd = parsed.data.amountUsd || 10;
  // Convert USD to cents / standard unit (amount in cents for tracking)
  const amountCents = Math.round(amountUsd * 100);

  // If currency is INR, multiply USD approx rate ~85 or use direct INR
  const isINR = parsed.data.currency === "INR";
  const razorpayAmount = isINR ? Math.round(amountUsd * 85 * 100) : amountCents; // in paise or cents
  const razorpayCurrency = isINR ? "INR" : "USD";

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: razorpayAmount,
      currency: razorpayCurrency,
      receipt: `bexo_${profile.id.slice(-8)}_${Date.now().toString().slice(-6)}`,
      notes: {
        candidateProfileId: profile.id,
        userId,
        categoryId: parsed.data.categoryId,
        amountUsd: String(amountUsd),
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "",
        amount: razorpayAmount,
        currency: razorpayCurrency,
        amountUsd,
        candidateProfileId: profile.id,
        categoryId: parsed.data.categoryId,
        userName: user?.name || profile.headline || "Candidate",
        userEmail: user?.email || "",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay payment order" },
      { status: 500 }
    );
  }
}
