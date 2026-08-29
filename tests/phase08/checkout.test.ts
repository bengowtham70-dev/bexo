import { readFileSync, existsSync } from "fs";
import { describe, test, expect } from "vitest";
import { boostCheckoutSchema, AVAILABLE_CATEGORIES } from "@/lib/validators/boost";

describe("Phase 08 - Boost Checkout", () => {
  test("boostCheckoutSchema validates category and currency", () => {
    const valid = boostCheckoutSchema.safeParse({ categoryId: "ai", currency: "USD" });
    expect(valid.success).toBe(true);

    const invalid = boostCheckoutSchema.safeParse({ categoryId: "", currency: "XYZ" });
    expect(invalid.success).toBe(false);
  });

  test("AVAILABLE_CATEGORIES has standard options", () => {
    expect(AVAILABLE_CATEGORIES.length).toBeGreaterThanOrEqual(5);
    expect(AVAILABLE_CATEGORIES.some((c) => c.id === "ai")).toBe(true);
    expect(AVAILABLE_CATEGORIES.some((c) => c.id === "engineering")).toBe(true);
  });

  test("payments.ts exports getStripe and defines $10 price (1000 cents)", async () => {
    const { BOOST_PRICE_CENTS, getStripe } = await import("@/lib/payments");
    expect(BOOST_PRICE_CENTS).toBe(1000);
    expect(typeof getStripe).toBe("function");
  });

  test("boost checkout route checks eligibility and creates Stripe session", () => {
    expect(existsSync("src/app/api/me/boost/checkout/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/me/boost/checkout/route.ts", "utf8");
    expect(code).toContain("boostCheckoutSchema");
    expect(code).toContain("validateBoostEligibility");
    expect(code).toContain("createBoostCheckoutSession");
    expect(code).toContain("rateLimit");
  });
});
