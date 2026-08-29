import { readFileSync, existsSync } from "fs";
import { describe, test, expect } from "vitest";

describe("Phase 05 - Homepage Polish & Trust Copy", () => {
  test("homepage exists and contains hero headline and CTAs", () => {
    expect(existsSync("src/app/page.tsx")).toBe(true);
    const code = readFileSync("src/app/page.tsx", "utf8");
    expect(code).toContain("Back Yourself");
    expect(code).toContain("Get Seen");
    expect(code).toContain("/signup");
    expect(code).toContain("/talent");
  });

  test("homepage contains mandatory FTC trust statement per PRD §21", () => {
    const code = readFileSync("src/app/page.tsx", "utf8");
    expect(code).toContain("You pay BEXO for visibility — never pay an employer to get a job.");
  });

  test("homepage includes How BEXO Works 3-step sections", () => {
    const code = readFileSync("src/app/page.tsx", "utf8");
    expect(code).toContain("How BEXO Works");
  });
});
