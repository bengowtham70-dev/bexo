import { readFileSync } from "fs";
import { test, expect } from "vitest";

test("canPublish checks required fields §31", async () => {
  const { canPublish } = await import("../../src/lib/privacy");
  expect(canPublish({ headline: "", location: "BLR", bio: "hello" })).toMatch(/headline/);
  expect(canPublish({ headline: "AI Eng", location: undefined as any, bio: "hello world bio" })).toMatch(/location/);
  expect(canPublish({ headline: "AI Eng", location: "BLR", bio: "short" })).toMatch(/bio/);
  expect(canPublish({ headline: "AI Eng", location: "BLR", bio: "This is a valid bio with enough length" })).toBeNull();
});

test("publish route checks canPublish and generates slug, sets PUBLIC", () => {
  const r = readFileSync("src/app/api/me/publish/route.ts", "utf8");
  expect(r).toContain("canPublish");
  expect(r).toContain("slugify");
  expect(r).toContain('visibility: "PUBLIC"');
  expect(r).toContain("400");
});

test("privacy filter hides email/phone and respects hideFromSearch", () => {
  const p = readFileSync("src/lib/privacy.ts", "utf8");
  expect(p).toContain("hideEmail");
  expect(p).toContain("hidePhone");
  expect(p).toContain("hideFromSearch");
});

test("public profile page respects visibility and noindex", () => {
  const page = readFileSync("src/app/(public)/p/[slug]/page.tsx", "utf8");
  expect(page).toContain("visibility !== \"PUBLIC\"");
  expect(page).toContain("hideFromSearch");
  expect(page).toContain("robots");
  expect(page).toContain("filterPublicProfile");
});
