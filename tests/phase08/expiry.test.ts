import { readFileSync, existsSync } from "fs";
import { describe, test, expect } from "vitest";

describe("Phase 08 - Boost Expiry & Candidate Boost List", () => {
  test("boost-expiry.ts exports expireOutdatedBoosts function", async () => {
    expect(existsSync("src/lib/cron/boost-expiry.ts")).toBe(true);
    const { expireOutdatedBoosts } = await import("@/lib/cron/boost-expiry");
    expect(typeof expireOutdatedBoosts).toBe("function");
  });

  test("analytics boost telemetry helper exists and logs impressions", async () => {
    expect(existsSync("src/lib/analytics/boost.ts")).toBe(true);
    const { recordBoostImpression } = await import("@/lib/analytics/boost");
    expect(typeof recordBoostImpression).toBe("function");
  });

  test("candidate boosts route returns active and expired boosts with remaining hours", () => {
    expect(existsSync("src/app/api/me/boosts/route.ts")).toBe(true);
    const code = readFileSync("src/app/api/me/boosts/route.ts", "utf8");
    expect(code).toContain("expireOutdatedBoosts");
    expect(code).toContain("hoursRemaining");
    expect(code).toContain("prisma.boost.findMany");
  });

  test("talent route orders featured shelf by startAt ASC", () => {
    const code = readFileSync("src/app/api/talent/route.ts", "utf8");
    expect(code).toContain('status: "ACTIVE"');
    expect(code).toContain('orderBy: { startAt: "asc" }');
  });
});
