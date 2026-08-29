import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 06 - Employer UI Components & Dashboard Pages", () => {
  test("verification-badge component renders 4-signal status indicators", () => {
    expect(existsSync("src/components/employer/verification-badge.tsx")).toBe(true);
    const code = readFileSync("src/components/employer/verification-badge.tsx", "utf8");
    expect(code).toContain("VerificationBadge");
    expect(code).toContain("signals");
    expect(code).toContain("VERIFIED");
    expect(code).toContain("PENDING");
  });

  test("saved-candidate-card component supports private recruiter notes", () => {
    expect(existsSync("src/components/employer/saved-candidate-card.tsx")).toBe(true);
    const code = readFileSync("src/components/employer/saved-candidate-card.tsx", "utf8");
    expect(code).toContain("SavedCandidateCard");
    expect(code).toContain("notesPrivate");
    expect(code).toContain("/api/employer/saved");
  });

  test("employer dashboard, verify, and saved pages exist and embed components", () => {
    expect(existsSync("src/app/(employer)/employer/dashboard/page.tsx")).toBe(true);
    expect(existsSync("src/app/(employer)/employer/verify/page.tsx")).toBe(true);
    expect(existsSync("src/app/(employer)/employer/saved/page.tsx")).toBe(true);

    const dashCode = readFileSync("src/app/(employer)/employer/dashboard/page.tsx", "utf8");
    const verifyCode = readFileSync("src/app/(employer)/employer/verify/page.tsx", "utf8");
    const savedCode = readFileSync("src/app/(employer)/employer/saved/page.tsx", "utf8");

    expect(dashCode).toContain("Employer Dashboard");
    expect(verifyCode).toContain("Verification");
    expect(savedCode).toContain("Saved");
  });
});
