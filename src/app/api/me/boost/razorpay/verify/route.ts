import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { activateBoostFromPayment } from "@/lib/boost";
import { auditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    candidateProfileId,
    categoryId,
    amountUsd,
  } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !candidateProfileId) {
    return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
  }

  // Verify HMAC-SHA256 signature
  const isValid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const amountCents = Math.round((Number(amountUsd) || 10) * 100);

  try {
    const boost = await activateBoostFromPayment({
      candidateProfileId,
      userId,
      categoryId: categoryId || "ai",
      providerPaymentId: razorpay_payment_id,
      amount: amountCents,
    });

    await auditLog({
      userId,
      action: "boost:activated:razorpay",
      meta: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amountCents,
        categoryId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        boostId: boost.id,
        status: boost.status,
        message: "Spotlight boost successfully activated!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to activate boost from Razorpay:", error);
    return NextResponse.json(
      { error: error.message || "Failed to activate boost after payment" },
      { status: 500 }
    );
  }
}
