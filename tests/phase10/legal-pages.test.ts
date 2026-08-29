import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 10 - Legal Compliance & Policy Pages", () => {
  test("privacy policy page exists and details GDPR rights and contact masking", () => {
    expect(existsSync("src/app/privacy/page.tsx")).toBe(true);
    const code = readFileSync("src/app/privacy/page.tsx", "utf8");
    expect(code).toContain("Privacy Policy");
    expect(code).toContain("GDPR");
    expect(code).toContain("Right to be Forgotten");
    expect(code).toContain("Contact Masking");
  });

  test("terms of service page exists and includes PRD §21 FTC compliance clause", () => {
    expect(existsSync("src/app/terms/page.tsx")).toBe(true);
    const code = readFileSync("src/app/terms/page.tsx", "utf8");
    expect(code).toContain("Terms of Service");
    expect(code).toContain("You pay BEXO for visibility — never pay an employer to get a job.");
    expect(code).toContain("24-Hour Boost");
  });
});
