import { readFileSync } from "fs";
import { test, expect } from "vitest";

test("rbac file has hasPermission and can with correct matrix", async () => {
  const src = readFileSync("src/lib/rbac.ts", "utf8");
  expect(src).toContain("hasPermission");
  expect(src).toContain("ROLE_PERMISSIONS");
  expect(src).toContain("ADMIN");
  const { hasPermission, can } = await import("../../src/lib/rbac");
  expect(hasPermission("CANDIDATE", "profile", "read")).toBe(true);
  expect(hasPermission("CANDIDATE", "profile", "update")).toBe(true);
  expect(hasPermission("CANDIDATE", "admin:users", "read")).toBe(false);
  expect(hasPermission("EMPLOYER", "talent", "read")).toBe(true);
  expect(hasPermission("ADMIN", "*", "delete")).toBe(true);
  expect(can({ role: "EMPLOYER" }, "talent:read")).toBe(true);
  expect(can({ role: "EMPLOYER" }, "admin:users:read")).toBe(false);
});

test("middleware guards dashboard/employer/admin", () => {
  const m = readFileSync("src/middleware.ts", "utf8");
  expect(m).toContain("withAuth");
  expect(m).toContain("/dashboard");
  expect(m).toContain("/employer");
  expect(m).toContain("/admin");
  expect(m).toContain("403");
  expect(m).toContain("ADMIN");
});

test("signup page has lime primary, 18+ checkbox, and FTC copy", () => {
  const p = readFileSync("src/app/(auth)/signup/page.tsx", "utf8");
  expect(p).toContain("btn-primary");
  expect(p).toContain("age18");
  expect(p).toContain("You pay BEXO for visibility");
  expect(p).toContain("use client");
  expect(p).toContain('signIn("google"');
});

test("login page exists with credential form", () => {
  const p = readFileSync("src/app/(auth)/login/page.tsx", "utf8");
  expect(p).toContain("Log in to BEXO");
  expect(p).toContain('signIn("credentials"');
  expect(p).toContain("use client");
});
