import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { activateBoostFromPayment, handlePaymentRefund } from "@/lib/boost";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const isValid = verifyRazorpayWebhookSignature({ body, signature });
  if (!isValid) {
    console.error("Razorpay webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(body);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const notes = payment.notes || {};
        const candidateProfileId = notes.candidateProfileId;
        const userId = notes.userId;
        const categoryId = notes.categoryId || "ai";
        const providerPaymentId = payment.id;
        const amount = Math.round((Number(notes.amountUsd) || (payment.amount / 100)) * 100);

        if (candidateProfileId && userId) {
          await activateBoostFromPayment({
            candidateProfileId,
            userId,
            categoryId,
            providerPaymentId,
            amount,
          });
        }
        break;
      }
      case "refund.processed": {
        const refund = event.payload.refund.entity;
        const paymentId = refund.payment_id;
        if (paymentId) {
          await handlePaymentRefund(paymentId);
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
