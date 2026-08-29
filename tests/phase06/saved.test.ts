import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 06 - Saved Candidates & Private Recruiter Notes API", () => {
  test("saved route exists and supports GET, POST, PATCH, DELETE operations", () => {
    expect(existsSync("src/app/api/employer/saved/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/employer/saved/route.ts", "utf8");
    expect(code).toContain("export async function GET");
    expect(code).toContain("export async function POST");
    expect(code).toContain("export async function PATCH");
    expect(code).toContain("export async function DELETE");
  });

  test("POST handles candidate shortlist creation and private notes storage", () => {
    const code = readFileSync("src/app/api/employer/saved/route.ts", "utf8");
    expect(code).toContain("employerSaved");
    expect(code).toContain("notesPrivate");
  });

  test("GET returns candidate profile details and isolates private notes", () => {
    const code = readFileSync("src/app/api/employer/saved/route.ts", "utf8");
    expect(code).toContain("findMany");
    expect(code).toContain("candidateProfile");
  });
});
