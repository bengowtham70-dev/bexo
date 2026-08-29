import { readFileSync, existsSync } from "fs";
import { describe, test, expect } from "vitest";

describe("Phase 05 - Rich Public Profile SSR & SEO", () => {
  test("public profile page exists and renders full candidate sections", () => {
    expect(existsSync("src/app/(public)/p/[slug]/page.tsx")).toBe(true);
    const code = readFileSync("src/app/(public)/p/[slug]/page.tsx", "utf8");
    expect(code).toContain("generateMetadata");
    expect(code).toContain("filterPublicProfile");
    expect(code).toContain("experiences");
    expect(code).toContain("projects");
    expect(code).toContain("skills");
    expect(code).toContain("educations");
  });

  test("public profile embeds Schema.org Person JSON-LD script for SEO", () => {
    const code = readFileSync("src/app/(public)/p/[slug]/page.tsx", "utf8");
    expect(code).toContain("application/ld+json");
    expect(code).toContain("Person");
  });

  test("public profile handles hideFromSearch robots tag properly", () => {
    const code = readFileSync("src/app/(public)/p/[slug]/page.tsx", "utf8");
    expect(code).toContain("hideFromSearch");
    expect(code).toContain("noIndex");
  });
});
