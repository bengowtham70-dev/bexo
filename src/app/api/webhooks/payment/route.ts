import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payments";
import { activateBoostFromPayment, handlePaymentRefund } from "@/lib/boost";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    const stripe = await getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const candidateProfileId = session.metadata?.candidateProfileId || (session.client_reference_id as string);
        const userId = session.metadata?.userId as string;
        const categoryId = session.metadata?.categoryId || "engineering";
        const providerPaymentId = (session.payment_intent as string) || session.id;
        const amount = session.amount_total || 1000;

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
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;
        if (paymentIntentId) {
          await handlePaymentRefund(paymentIntentId);
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook event" }, { status: 500 });
  }
}
