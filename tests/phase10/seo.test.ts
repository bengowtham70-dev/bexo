import { describe, test, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Phase 10 - Performance, SEO, Sitemap & Monitoring", () => {
  test("sitemap.ts exists and enforces candidate privacy filters", () => {
    expect(existsSync("src/app/sitemap.ts")).toBe(true);
    const code = readFileSync("src/app/sitemap.ts", "utf8");
    expect(code).toContain("export default async function sitemap");
    expect(code).toContain("visibility: \"PUBLIC\"");
    expect(code).toContain("hideFromSearch: false");
  });

  test("robots.ts exists and points to /sitemap.xml", () => {
    expect(existsSync("src/app/robots.ts")).toBe(true);
    const code = readFileSync("src/app/robots.ts", "utf8");
    expect(code).toContain("export default function robots");
    expect(code).toContain("sitemap.xml");
  });

  test("sentry.ts error monitoring helper exists", () => {
    expect(existsSync("src/lib/monitoring/sentry.ts")).toBe(true);
    const code = readFileSync("src/lib/monitoring/sentry.ts", "utf8");
    expect(code).toContain("captureError");
  });

  test("GET /api/health endpoint exists", () => {
    expect(existsSync("src/app/api/health/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/health/route.ts", "utf8");
    expect(code).toContain("export async function GET");
    expect(code).toContain("status: \"ok\"");
  });
});
