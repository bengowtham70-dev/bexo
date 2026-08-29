import { readFileSync, existsSync } from "fs";
import { describe, test, expect } from "vitest";

describe("Phase 05 - Talent UI Components & Pages", () => {
  test("talent board component exists and handles client search state", () => {
    expect(existsSync("src/components/talent/talent-board.tsx")).toBe(true);
    const code = readFileSync("src/components/talent/talent-board.tsx", "utf8");
    expect(code).toContain("/api/talent");
    expect(code).toContain("featured");
    expect(code).toContain("organic");
  });

  test("board-row component uses brutalist density 8 tokens and links to /p/[slug]", () => {
    expect(existsSync("src/components/talent/board-row.tsx")).toBe(true);
    const code = readFileSync("src/components/talent/board-row.tsx", "utf8");
    expect(code).toContain("board-row");
    expect(code).toContain("badge-featured");
    expect(code).toContain("/p/");
  });

  test("filter-bar component provides search and filter triggers", () => {
    expect(existsSync("src/components/talent/filter-bar.tsx")).toBe(true);
    const code = readFileSync("src/components/talent/filter-bar.tsx", "utf8");
    expect(code).toContain("onSearch");
    expect(code).toContain("onFilter");
  });

  test("public talent page and category page embed TalentBoard", () => {
    expect(existsSync("src/app/(public)/talent/page.tsx")).toBe(true);
    expect(existsSync("src/app/(public)/talent/[category]/page.tsx")).toBe(true);
    const mainPage = readFileSync("src/app/(public)/talent/page.tsx", "utf8");
    const catPage = readFileSync("src/app/(public)/talent/[category]/page.tsx", "utf8");
    expect(mainPage).toContain("TalentBoard");
    expect(catPage).toContain("TalentBoard");
  });
});
