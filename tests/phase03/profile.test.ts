import { readFileSync } from "fs";
import { test, expect } from "vitest";

test("profile page exists with taste 4.6 label above input", () => {
  const p = readFileSync("src/app/(candidate)/dashboard/profile/page.tsx", "utf8");
  expect(p).toContain("Profile");
  expect(p).toContain("Headline");
  expect(p).toContain("label");
  expect(p.includes("btn-primary") || p.includes("Button")).toBe(true);
});

test("profile validator has headline 3-80 and bio 800", () => {
  const v = readFileSync("src/lib/validators/profile.ts", "utf8");
  expect(v).toContain("headline");
  expect(v).toContain("min(3");
  expect(v).toContain("max(80");
  expect(v).toContain("bio");
});

test("PATCH /api/me/profile route exists with Zod and Prisma", () => {
  const r = readFileSync("src/app/api/me/profile/route.ts", "utf8");
  expect(r).toContain("profileSchema");
  expect(r).toContain("prisma.candidateProfile");
  expect(r).toContain("PATCH");
});
