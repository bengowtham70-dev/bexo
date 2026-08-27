import { readFileSync } from "fs";
import { describe, test, expect } from "vitest";

test("prisma schema has password and AuditLog", () => {
  const s = readFileSync("prisma/schema.prisma", "utf8");
  expect(s).toContain("password");
  expect(s).toContain("model AuditLog");
  expect(s).toContain("tokenVersion");
});

test("signup route exists with rate limit and audit", () => {
  const r = readFileSync("src/app/api/auth/signup/route.ts", "utf8");
  expect(r).toContain("signupSchema");
  expect(r).toContain("rateLimit");
  expect(r).toContain("auditLog");
  expect(r).toContain("409");
});

test("auth.ts has hashPassword/verifyPassword and authOptions", () => {
  const a = readFileSync("src/lib/auth.ts", "utf8");
  expect(a).toContain("hashPassword");
  expect(a).toContain("verifyPassword");
  expect(a).toContain("bcrypt");
  expect(a).toContain("authOptions");
});

test("auth.ts has OAuth Google and GitHub providers", () => {
  const a = readFileSync("src/lib/auth.ts", "utf8");
  expect(a).toContain("GoogleProvider");
  expect(a).toContain("GithubProvider");
  expect(a).toContain("GOOGLE_CLIENT_ID");
  expect(a).toContain("GITHUB_ID");
});

test("validators enforce 18+ literal", async () => {
  const v = readFileSync("src/lib/validators/auth.ts", "utf8");
  expect(v).toContain("literal(true");
  expect(v).toContain("Must be 18+");
  const mod = await import("../../src/lib/validators/auth");
  expect(mod.signupSchema.safeParse({ email: "a@a.com", password: "Pass123!Aa", age18: false }).success).toBe(false);
  expect(mod.signupSchema.safeParse({ email: "a@a.com", password: "Pass123!Aa", age18: true }).success).toBe(true);
});

test("hashPassword produces bcrypt hash and verify works", async () => {
  const { hashPassword, verifyPassword } = await import("../../src/lib/auth");
  const hash = hashPassword("Pass123!Aa");
  expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);
  expect(verifyPassword("Pass123!Aa", hash)).toBe(true);
  expect(verifyPassword("wrong", hash)).toBe(false);
});

test("env example has OAuth vars", () => {
  const env = readFileSync(".env.example", "utf8");
  expect(env).toContain("GOOGLE_CLIENT_ID");
  expect(env).toContain("GITHUB_ID");
});

test("db singleton exists", () => {
  const db = readFileSync("src/lib/db/index.ts", "utf8");
  expect(db).toContain("PrismaClient");
  expect(db).toContain("globalThis");
});
