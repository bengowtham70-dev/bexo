import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 09 - Admin Moderation Queue & User Suspension API", () => {
  test("GET /api/admin/reports route exists and lists moderation reports", () => {
    expect(existsSync("src/app/api/admin/reports/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/admin/reports/route.ts", "utf8");
    expect(code).toContain("export async function GET");
    expect(code).toContain("prisma.report.findMany");
    expect(code).toContain("status");
  });

  test("PATCH /api/admin/reports/[id] route exists and handles report resolution", () => {
    expect(existsSync("src/app/api/admin/reports/[id]/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/admin/reports/[id]/route.ts", "utf8");
    expect(code).toContain("export async function PATCH");
    expect(code).toContain("reportResolutionSchema");
    expect(code).toContain("prisma.report.update");
    expect(code).toContain("recordAudit");
  });

  test("GET /api/admin/users route exists and lists users with profiles", () => {
    expect(existsSync("src/app/api/admin/users/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/admin/users/route.ts", "utf8");
    expect(code).toContain("export async function GET");
    expect(code).toContain("prisma.user.findMany");
  });

  test("PATCH /api/admin/users/[id] route exists and handles user suspension/reinstate", () => {
    expect(existsSync("src/app/api/admin/users/[id]/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/admin/users/[id]/route.ts", "utf8");
    expect(code).toContain("export async function PATCH");
    expect(code).toContain("candidateProfile.update");
    expect(code).toContain("HIDDEN");
    expect(code).toContain("recordAudit");
  });
});
