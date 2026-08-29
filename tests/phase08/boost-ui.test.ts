import { readFileSync, existsSync } from "fs";
import { describe, test, expect } from "vitest";

describe("Phase 08 - Boost UI Components & Pages", () => {
  test("dashboard boost page exists", () => {
    expect(existsSync("src/app/(candidate)/dashboard/boost/page.tsx")).toBe(true);
  });

  test("boost page enforces FTC trust rule & no quality claims", () => {
    const pageContent = readFileSync("src/app/(candidate)/dashboard/boost/page.tsx", "utf8");
    expect(pageContent).toContain("never pay an employer to get a job");
    expect(pageContent).toContain("Featured");
  });

  test("boost preview card exists and uses token styling", () => {
    expect(existsSync("src/components/boost/boost-preview-card.tsx")).toBe(true);
    const cardContent = readFileSync("src/components/boost/boost-preview-card.tsx", "utf8");
    expect(cardContent).toContain("badge-featured");
  });

  test("boost history table exists", () => {
    expect(existsSync("src/components/boost/boost-history-table.tsx")).toBe(true);
    const tableContent = readFileSync("src/components/boost/boost-history-table.tsx", "utf8");
    expect(tableContent).toContain("hoursRemaining");
  });
});
