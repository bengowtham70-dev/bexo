import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 07 - Privacy UI Components & Contact Modal", () => {
  test("privacy-settings-form component exists and provides privacy & GDPR controls", () => {
    expect(existsSync("src/components/profile/privacy-settings-form.tsx")).toBe(true);
    const code = readFileSync("src/components/profile/privacy-settings-form.tsx", "utf8");
    expect(code).toContain("PrivacySettingsForm");
    expect(code).toContain("hideFromSearch");
    expect(code).toContain("hideEmail");
    expect(code).toContain("hidePhone");
    expect(code).toContain("/api/me/export");
    expect(code).toContain("/api/me/delete");
  });

  test("contact-modal component protects candidate privacy and enforces safety copy", () => {
    expect(existsSync("src/components/talent/contact-modal.tsx")).toBe(true);
    const code = readFileSync("src/components/talent/contact-modal.tsx", "utf8");
    expect(code).toContain("ContactModal");
    expect(code).toContain("/api/employer/contact");
    expect(code).toContain("candidateId");
    expect(code).toContain("subject");
    expect(code).toContain("message");
  });

  test("candidate privacy dashboard page exists and embeds settings form", () => {
    expect(existsSync("src/app/(candidate)/dashboard/privacy/page.tsx")).toBe(true);
    const code = readFileSync("src/app/(candidate)/dashboard/privacy/page.tsx", "utf8");
    expect(code).toContain("PrivacySettingsForm");
    expect(code).toContain("Privacy & Safety");
  });
});
