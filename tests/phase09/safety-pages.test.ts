import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 09 - Public Safety & How-It-Works Pages", () => {
  test("safety page exists and enforces PRD §21 FTC candidate protection copy", () => {
    expect(existsSync("src/app/safety/page.tsx")).toBe(true);
    const code = readFileSync("src/app/safety/page.tsx", "utf8");
    expect(code).toContain("You pay BEXO for visibility — never pay an employer to get a job.");
    expect(code).toContain("Trust & Safety");
    expect(code).toContain("Scam Prevention");
  });

  test("how-it-works page exists and explains 3-step candidate and employer flows", () => {
    expect(existsSync("src/app/how-it-works/page.tsx")).toBe(true);
    const code = readFileSync("src/app/how-it-works/page.tsx", "utf8");
    expect(code).toContain("How BEXO Works");
    expect(code).toContain("For Candidates");
    expect(code).toContain("For Employers");
    expect(code).toContain("Boost Rotation");
  });
});
