import { readFileSync, existsSync } from "fs";
import { describe, test, expect } from "vitest";

describe("Phase 08 - Webhook & Idempotent Boost Activation", () => {
  test("webhook route exists and verifies Stripe signature", () => {
    expect(existsSync("src/app/api/webhooks/payment/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/webhooks/payment/route.ts", "utf8");
    expect(code).toContain("stripe-signature");
    expect(code).toContain("constructEvent");
    expect(code).toContain("STRIPE_WEBHOOK_SECRET");
  });

  test("webhook handles checkout.session.completed and charge.refunded events", () => {
    const code = readFileSync("src/app/api/webhooks/payment/route.ts", "utf8");
    expect(code).toContain("checkout.session.completed");
    expect(code).toContain("charge.refunded");
    expect(code).toContain("activateBoostFromPayment");
    expect(code).toContain("handlePaymentRefund");
  });

  test("boost.ts exports activateBoostFromPayment and handlePaymentRefund", async () => {
    const { activateBoostFromPayment, handlePaymentRefund } = await import("@/lib/boost");
    expect(typeof activateBoostFromPayment).toBe("function");
    expect(typeof handlePaymentRefund).toBe("function");
  });
});
