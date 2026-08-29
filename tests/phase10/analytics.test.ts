import { describe, test, expect } from "vitest";
import { BEXO_EVENTS, sanitizeProperties, analyticsEventSchema } from "@/lib/analytics/events";
import { readFileSync, existsSync } from "fs";

describe("Phase 10 - Analytics Event Taxonomy & PII Sanitization", () => {
  test("BEXO_EVENTS contains all PRD §28 lifecycle event names", () => {
    expect(BEXO_EVENTS).toContain("profile_created");
    expect(BEXO_EVENTS).toContain("profile_published");
    expect(BEXO_EVENTS).toContain("profile_viewed");
    expect(BEXO_EVENTS).toContain("contact_opened");
    expect(BEXO_EVENTS).toContain("contact_sent");
    expect(BEXO_EVENTS).toContain("boost_checkout_started");
    expect(BEXO_EVENTS).toContain("boost_paid");
    expect(BEXO_EVENTS).toContain("boost_activated");
    expect(BEXO_EVENTS).toContain("boost_expired");
    expect(BEXO_EVENTS).toContain("report_created");
  });

  test("sanitizeProperties strips candidate PII (email, phone, password)", () => {
    const rawProps = {
      candidateId: "cand-123",
      category: "ai",
      email: "candidate@secret.com",
      phone: "+15551234567",
      password: "supersecretpassword",
      token: "secret-token",
    };

    const sanitized = sanitizeProperties(rawProps);
    expect(sanitized.candidateId).toBe("cand-123");
    expect(sanitized.category).toBe("ai");
    expect(sanitized).not.toHaveProperty("email");
    expect(sanitized).not.toHaveProperty("phone");
    expect(sanitized).not.toHaveProperty("password");
    expect(sanitized).not.toHaveProperty("token");
  });

  test("analyticsEventSchema validates correct events", () => {
    const valid = {
      event: "profile_viewed",
      properties: { candidateId: "cand-1", category: "frontend" },
    };
    expect(analyticsEventSchema.safeParse(valid).success).toBe(true);

    const invalidEvent = {
      event: "fake_untracked_event",
      properties: {},
    };
    expect(analyticsEventSchema.safeParse(invalidEvent).success).toBe(false);
  });

  test("POST /api/analytics ingest route exists", () => {
    expect(existsSync("src/app/api/analytics/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/analytics/route.ts", "utf8");
    expect(code).toContain("analyticsEventSchema");
    expect(code).toContain("trackEvent");
  });
});
