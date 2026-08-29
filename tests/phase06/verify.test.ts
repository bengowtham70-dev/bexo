import { describe, test, expect } from "vitest";
import { isFreeProvider, domainMatches, createToken, hashToken } from "@/lib/verify-email";
import { readFileSync, existsSync } from "fs";

describe("Phase 06 - Employer Verification Engine & Token Redemption", () => {
  test("isFreeProvider identifies free webmail providers", () => {
    expect(isFreeProvider("gmail.com")).toBe(true);
    expect(isFreeProvider("yahoo.com")).toBe(true);
    expect(isFreeProvider("hotmail.com")).toBe(true);
    expect(isFreeProvider("outlook.com")).toBe(true);
    expect(isFreeProvider("protonmail.com")).toBe(true);
    expect(isFreeProvider("stripe.com")).toBe(false);
    expect(isFreeProvider("google.com")).toBe(false);
  });

  test("domainMatches validates work email against corporate website domain", () => {
    expect(domainMatches("recruiter@stripe.com", "https://stripe.com")).toBe(true);
    expect(domainMatches("recruiter@stripe.com", "stripe.com")).toBe(true);
    expect(domainMatches("recruiter@uk.stripe.com", "stripe.com")).toBe(true);
    expect(domainMatches("recruiter@stripe.com", "https://evil.com")).toBe(false);
  });

  test("createToken produces 64-char sha256 hash and 24-hour expiration", () => {
    const { raw, hash, expiresAt } = createToken();
    expect(raw).toHaveLength(64);
    expect(hash).toHaveLength(64);
    expect(hashToken(raw)).toBe(hash);
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now() + 23 * 60 * 60 * 1000);
  });

  test("GET /api/employer/verify route exists and handles token verification", () => {
    expect(existsSync("src/app/api/employer/verify/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/employer/verify/route.ts", "utf8");
    expect(code).toContain("hashToken");
    expect(code).toContain("usedAt");
    expect(code).toContain("emailVerified");
    expect(code).toContain("VERIFIED");
  });
});
