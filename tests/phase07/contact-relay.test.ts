import { describe, test, expect } from "vitest";
import { isSuspiciousMessage } from "@/lib/email-relay";
import { readFileSync, existsSync } from "fs";

describe("Phase 07 - Anti-Phishing Contact Relay & Spam Gate", () => {
  test("isSuspiciousMessage detects scam and phishing keywords", () => {
    expect(isSuspiciousMessage("Reach out to our recruiter on telegram @scamjob")).toBe(true);
    expect(isSuspiciousMessage("Please deposit crypto into our wallet for equipment")).toBe(true);
    expect(isSuspiciousMessage("Pay an upfront fee to complete your background check")).toBe(true);
    expect(isSuspiciousMessage("Send money via Western Union or wire transfer")).toBe(true);
    expect(isSuspiciousMessage("Whatsapp me directly at +123456789")).toBe(true);
  });

  test("isSuspiciousMessage approves legitimate professional outreach", () => {
    expect(
      isSuspiciousMessage(
        "Hi Rahul, loved your open source LLM project. We are looking for a Senior AI Engineer at Acme Corp. Would love to chat!"
      )
    ).toBe(false);
  });

  test("POST /api/employer/contact route exists and implements relay with spam protection", () => {
    expect(existsSync("src/app/api/employer/contact/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/employer/contact/route.ts", "utf8");
    expect(code).toContain("isSuspiciousMessage");
    expect(code).toContain("sendContactRelay");
    expect(code).toContain("candidateId");
    expect(code).toContain("subject");
    expect(code).toContain("message");
  });
});
