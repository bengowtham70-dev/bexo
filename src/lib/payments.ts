import type Stripe from "stripe";

let stripeClient: Stripe | null = null;

export async function getStripe(): Promise<Stripe> {
  if (!stripeClient) {
    const StripeClass = (await import("stripe")).default;
    stripeClient = new StripeClass(process.env.STRIPE_SECRET_KEY || "sk_test_mock_dummy_key_for_build", {
      apiVersion: "2023-10-16" as any,
      typescript: true,
    });
  }
  return stripeClient;
}

export const BOOST_PRICE_CENTS = 1000; // $10.00 USD

export async function createBoostCheckoutSession({
  candidateProfileId,
  userId,
  userEmail,
  categoryId,
  origin,
  amountUsd,
}: {
  candidateProfileId: string;
  userId: string;
  userEmail: string;
  categoryId: string;
  origin: string;
  amountUsd?: number;
}) {
  const stripe = await getStripe();
  const unitAmount = amountUsd ? Math.round(amountUsd * 100) : BOOST_PRICE_CENTS;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `BEXO 24h Spotlight Placement (${categoryId.toUpperCase()})`,
            description: "24-hour top visibility on the talent board. Boost placement is not an endorsement or qualification.",
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: userEmail,
    client_reference_id: candidateProfileId,
    metadata: {
      candidateProfileId,
      userId,
      categoryId,
      boostType: "24h_featured",
    },
    success_url: `${origin}/dashboard/boost?session_id={CHECKOUT_SESSION_ID}&status=success`,
    cancel_url: `${origin}/dashboard/boost?status=cancelled`,
  });

  return {
    url: session.url || "",
    sessionId: session.id,
    amount: unitAmount,
  };
}
