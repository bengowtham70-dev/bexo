import { describe, test, expect } from "vitest";
import { filterPublicProfile, canViewResume } from "@/lib/privacy";
import { readFileSync, existsSync } from "fs";

describe("Phase 07 - Candidate Privacy Controls & Settings API", () => {
  test("filterPublicProfile strips email and phone when hideEmail/hidePhone are true", () => {
    const raw = {
      id: "cand-1",
      headline: "AI Engineer",
      email: "rahul@secret.com",
      phone: "+1234567890",
      hideEmail: true,
      hidePhone: true,
      hideFromSearch: false,
    };
    const filtered = filterPublicProfile(raw);
    expect(filtered.email).toBeUndefined();
    expect(filtered.phone).toBeUndefined();
    expect(filtered.headline).toBe("AI Engineer");
  });

  test("filterPublicProfile marks noIndex when hideFromSearch is true", () => {
    const raw = {
      id: "cand-2",
      headline: "Designer",
      hideFromSearch: true,
    };
    const filtered = filterPublicProfile(raw);
    expect(filtered.noIndex).toBe(true);
  });

  test("canViewResume respects public and owner access permissions", () => {
    const pubProfile: any = { userId: "user-1", visibility: "PUBLIC" };
    const privProfile: any = { userId: "user-1", visibility: "PRIVATE" };

    expect(canViewResume(null, pubProfile)).toBe(true);
    expect(canViewResume("other-user", pubProfile)).toBe(true);
    expect(canViewResume("user-1", privProfile)).toBe(true);
    expect(canViewResume("other-user", privProfile)).toBe(false);
    expect(canViewResume(null, privProfile)).toBe(false);
  });

  test("GET and PATCH /api/me/privacy endpoints exist and update privacy state", () => {
    expect(existsSync("src/app/api/me/privacy/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/me/privacy/route.ts", "utf8");
    expect(code).toContain("export async function GET");
    expect(code).toContain("export async function PATCH");
    expect(code).toContain("hideFromSearch");
    expect(code).toContain("hideEmail");
    expect(code).toContain("hidePhone");
    expect(code).toContain("visibility");
  });
});
