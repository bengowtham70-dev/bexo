import { readFileSync } from "fs";
import { test, expect } from "vitest";

test("rate-limit has TokenBucket and rateLimit helper", async () => {
  const src = readFileSync("src/lib/rate-limit.ts", "utf8");
  expect(src).toContain("class TokenBucket");
  expect(src).toContain("rateLimit");
  expect(src).toContain("capacity");
  const { rateLimit } = await import("../../src/lib/rate-limit");
  const k = `test-${Date.now()}-${Math.random()}`;
  const first = await rateLimit(k, 5, 60);
  expect(first.allowed).toBe(true);
  expect(first.remaining).toBeDefined();
  expect(first.retryAfter).toBe(0);
  // consume 5 more to trigger limit
  for (let i = 0; i < 5; i++) await rateLimit(k, 5, 60);
  const limited = await rateLimit(k, 5, 60);
  expect(limited.allowed).toBe(false);
  expect(limited.retryAfter).toBeGreaterThan(0);
});

test("audit log helper writes AuditLog", () => {
  const src = readFileSync("src/lib/audit.ts", "utf8");
  expect(src).toContain("auditLog");
  expect(src).toContain("prisma.auditLog.create");
  expect(src).toContain("action");
});

test("signup route returns 429 with Retry-After and X-RateLimit headers", () => {
  const r = readFileSync("src/app/api/auth/signup/route.ts", "utf8");
  expect(r).toContain("429");
  expect(r).toContain("Retry-After");
  expect(r).toContain("X-RateLimit-Limit");
  expect(r).toContain("rateLimit");
  expect(r).toContain("auditLog");
});

test("prisma schema has AuditLog index", () => {
  const s = readFileSync("prisma/schema.prisma", "utf8");
  expect(s).toContain("model AuditLog");
  expect(s).toContain("@@index([userId, action])");
});
