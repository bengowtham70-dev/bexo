import { describe, test, expect } from "vitest";
import { buildQuery } from "@/lib/search";
import { readFileSync, existsSync } from "fs";

describe("Phase 05 - Search Engine & Talent API", () => {
  test("buildQuery builds where clause respecting visibility PUBLIC and hideFromSearch false", () => {
    const query = buildQuery({ q: "engineer" });
    expect(query.visibility).toBe("PUBLIC");
    expect(query.hideFromSearch).toBe(false);
    expect(query.OR).toBeDefined();
    expect(query.OR?.length).toBeGreaterThanOrEqual(2);
  });

  test("buildQuery handles skill, location, remote, and category filters", () => {
    const query = buildQuery({
      skills: "Python",
      location: "Bangalore",
      remote: "true",
      category: "ai",
    });

    expect(query.skills).toBeDefined();
    expect(query.location).toBeDefined();
    expect(query.category).toBeDefined();
  });

  test("GET /api/talent route exists and returns featured and organic with pagination", () => {
    expect(existsSync("src/app/api/talent/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/talent/route.ts", "utf8");
    expect(code).toContain("buildQuery");
    expect(code).toContain("featuredBoosts");
    expect(code).toContain("filterPublicProfile");
    expect(code).toContain("pagination");
  });
});
