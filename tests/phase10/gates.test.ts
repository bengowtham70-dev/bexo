import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { canPublish, filterPublicProfile } from "@/lib/privacy";
import { buildQuery } from "@/lib/search";
import { isFreeProvider, normalizeDomain, domainMatches } from "@/lib/verify-email";
import { isSuspiciousMessage } from "@/lib/email-relay";
import { isBoostActive } from "@/lib/boost";
import { reportCreateSchema } from "@/lib/validators/report";
import { sanitizeProperties, BEXO_EVENTS } from "@/lib/analytics/events";

describe("Phase 10 — Master Launch Gates Verification Suite (PRD §42)", () => {
  test("Gate 1: Profile Validation & Publishing Gate", () => {
    const invalidProfile = {
      headline: "",
      location: "",
      bio: "short",
    };
    expect(canPublish(invalidProfile)).not.toBeNull();

    const validProfile = {
      headline: "Senior Systems Engineer",
      location: "San Francisco, CA",
      bio: "Experienced full-stack engineer building high performance web applications.",
    };
    expect(canPublish(validProfile)).toBeNull();
  });

  test("Gate 2: Discovery & Search Query Engine", () => {
    const query = buildQuery({
      q: "React",
      category: "frontend",
      remote: "true",
      skills: "TypeScript, React",
    });
    expect(query.visibility).toBe("PUBLIC");
    expect(query.hideFromSearch).toBe(false);
  });

  test("Gate 3: Employer 4-Signal Verification", () => {
    expect(isFreeProvider("recruiter@gmail.com")).toBe(true);
    expect(isFreeProvider("recruiter@stripe.com")).toBe(false);
    expect(normalizeDomain("https://www.stripe.com/jobs")).toBe("stripe.com");
    expect(domainMatches("recruiter@stripe.com", "stripe.com")).toBe(true);
  });

  test("Gate 4: Anti-Phishing Contact Relay Gate", () => {
    const scamText = "Hello candidate, message me on Telegram @recruiter123 for crypto deposit";
    expect(isSuspiciousMessage(scamText)).toBe(true);

    const legitText = "Hello candidate, we reviewed your Rust project and would love to chat.";
    expect(isSuspiciousMessage(legitText)).toBe(false);
  });

  test("Gate 5: Boost Monetization & Active Status Gate", () => {
    const now = new Date();
    const activeBoost = {
      startAt: new Date(now.getTime() - 3600 * 1000),
      endAt: new Date(now.getTime() + 3600 * 1000),
      status: "ACTIVE",
    };
    expect(isBoostActive(activeBoost)).toBe(true);

    const expiredBoost = {
      startAt: new Date(now.getTime() - 48 * 3600 * 1000),
      endAt: new Date(now.getTime() - 24 * 3600 * 1000),
      status: "ACTIVE",
    };
    expect(isBoostActive(expiredBoost)).toBe(false);
  });

  test("Gate 6: Privacy Masking & GDPR Protection Gate", () => {
    const candidateData = {
      name: "Alex Developer",
      email: "alex@secret.com",
      phone: "+15550001111",
      hideEmail: true,
      hidePhone: true,
    };
    const publicView = filterPublicProfile(candidateData as any);
    expect(publicView.email).toBeUndefined();
    expect(publicView.phone).toBeUndefined();
  });

  test("Gate 7: Trust & Safety Reporting Gate", () => {
    const report = {
      targetType: "CANDIDATE",
      targetId: "cand-123",
      reason: "PAY_TO_WORK",
      details: "Employer asked for deposit",
    };
    expect(reportCreateSchema.safeParse(report).success).toBe(true);
  });

  test("Gate 8: Analytics Event Taxonomy & PII Sanitization Gate", () => {
    expect(BEXO_EVENTS.length).toBe(10);
    const sanitized = sanitizeProperties({ email: "secret@test.com", category: "backend" });
    expect(sanitized.email).toBeUndefined();
    expect(sanitized.category).toBe("backend");
  });

  test("Gate 9: Release Documentation Gate", () => {
    expect(existsSync("docs/RELEASE_GATES.md")).toBe(true);
    const doc = readFileSync("docs/RELEASE_GATES.md", "utf8");
    expect(doc).toContain("BEXO Release Verification Gates");
  });
});
