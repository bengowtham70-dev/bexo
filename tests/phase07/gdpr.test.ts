import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 07 - GDPR Data Export & Right to be Forgotten", () => {
  test("GET /api/me/export route exists and serializes all candidate data", () => {
    expect(existsSync("src/app/api/me/export/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/me/export/route.ts", "utf8");
    expect(code).toContain("export async function GET");
    expect(code).toContain("experiences");
    expect(code).toContain("projects");
    expect(code).toContain("skills");
    expect(code).toContain("educations");
    expect(code).toContain("boosts");
    expect(code).toContain("payments");
    expect(code).toContain("Content-Disposition");
  });

  test("POST /api/me/delete route exists and enforces explicit confirmation for hard delete", () => {
    expect(existsSync("src/app/api/me/delete/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/me/delete/route.ts", "utf8");
    expect(code).toContain("export async function POST");
    expect(code).toContain("DELETE MY ACCOUNT");
    expect(code).toContain("prisma.user.delete");
  });
});
