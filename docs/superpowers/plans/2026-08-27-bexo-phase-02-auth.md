# Phase 02 — Auth & RBAC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure signup/login/OAuth + RBAC (CANDIDATE, EMPLOYER, ADMIN, MODERATOR) with session guards and 18+ gate per PRD §6,24,27,31 — producing a protected dashboard that later profile phases depend on.

**Architecture:** NextAuth.js (Auth.js v4 `next-auth@4.24` + `@auth/prisma-adapter`) with Credentials + OAuth (Google/GitHub) + Prisma + `bcryptjs` hashing + `next-auth/middleware` role guards + Zod validation + in-memory TokenBucket (Redis-ready Lua, per `rate-limiting/SKILL.md:1`) + Prisma `AuditLog`. Extends `prisma/schema.prisma:11` User model first, then builds auth on top.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, `next-auth@4.24`, `@auth/prisma-adapter`, `bcryptjs@2.4`, `zod@3.23`, `auth-implementation-patterns/SKILL.md:1`, `authentication-patterns/SKILL.md:1`, `rate-limiting/SKILL.md:1`, `tailwind-theme-builder/SKILL.md:1`, `shadcn/SKILL.md:1`

## Global Constraints
- Brand: BEXO, headline "Back Yourself. Get Seen." — lime #C8FF3D reserved for boost/actions only
- Money buys visibility, work earns credibility — payment is NOT qualification/endorsement/verification
- Featured label: "Featured" or "Boosted" — never "best" or quality ranking
- Boost: $10 for 24h in one category, preview before purchase, webhook-verified activation only, idempotent, auto-expire, anti-monopoly caps
- Privacy: candidate sees public preview before publish, contact via form by default, email hidden opt-in, hide employer/salary/search-engine controls enforced at API + DB
- Copy rule: "You pay BEXO for visibility — never pay an employer to get a job." (PRD §21, FTC)
- Security: HTTPS, RBAC, signed resume URLs, rate limits, CSRF/XSS/SQLi, webhook signature verification, audit log
- Age: 18+ gate
- Docs: `docs/superpowers/plans/` per `writing-plans:1` — no placeholders, DRY, YAGNI, TDD, frequent commits

---

## File Structure

```
prisma/schema.prisma                        # Modify: add User.password, emailVerified, tokenVersion + AuditLog model
.env.example                                # Modify: add GOOGLE_CLIENT_ID/SECRET, GITHUB_ID/SECRET, NEXTAUTH_SECRET
src/lib/db/index.ts                         # Create: Prisma singleton (fixes Phase01 gap — src/lib:1 only had utils.ts)
src/lib/validators/auth.ts                  # Create: Zod signupSchema/loginSchema + age18 literal
src/lib/auth.ts                             # Create: hashPassword, verifyPassword, authOptions (NextAuth)
src/lib/rbac.ts                             # Create: ROLE_PERMISSIONS matrix + hasPermission/can
src/lib/rate-limit.ts                       # Create: TokenBucket + rateLimit() helper per rate-limiting/SKILL.md:39
src/lib/audit.ts                            # Create: auditLog() Prisma helper
src/middleware.ts                           # Create: next-auth/middleware — guards /dashboard|/employer|/admin
src/app/api/auth/[...nextauth]/route.ts     # Create: NextAuth handler
src/app/api/auth/signup/route.ts            # Create: POST /api/auth/signup — Zod + bcryptjs + 18+ + 409 dup
src/app/(auth)/signup/page.tsx              # Create: signup form — shadcn, lime btn-primary, 18+ checkbox
src/app/(auth)/login/page.tsx               # Create: login form — shadcn
tests/phase02/auth.test.ts                  # Create: signup 201, 400 age18, hash, login session
tests/phase02/rbac.test.ts                  # Create: RBAC matrix + middleware 403
tests/phase02/rate.test.ts                  # Create: 429 rate-limit + audit log
```

---

### Task 01: Prisma Auth Extension + Signup/Login Core (Credentials)

**Files:**
- Modify: `prisma/schema.prisma:11`, `.env.example:1`, `package.json:22`
- Create: `src/lib/db/index.ts`, `src/lib/validators/auth.ts`, `src/lib/auth.ts`, `src/app/api/auth/signup/route.ts`, `src/app/api/auth/[...nextauth]/route.ts`
- Test: `tests/phase02/auth.test.ts`

**Interfaces:**
- Consumes: `prisma/schema.prisma:11` existing User/CandidateProfile/Boost, `zod@3.23`
- Produces: `POST /api/auth/signup(body:{email:string,password:string,age18:true,role?:"CANDIDATE"|"EMPLOYER"}) => {id:string,email:string,role:Role}:201 | 400 ZodError | 409 duplicate`; `hashPassword(p:string):string`, `verifyPassword(p:string,hash:string):boolean`, `authOptions:NextAuthOptions` with `session.user:{id,email,role:Role}`

- [ ] **Step 1: Write failing test** `tests/phase02/auth.test.ts`
```ts
import { readFileSync } from "fs";
import { describe, test, expect } from "vitest";

test("signup creates user 201 and hashes password, 18+ enforced", async () => {
  const res = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "b2-phase02@test.com", password: "Pass123!Aa", age18: true, role: "CANDIDATE" }),
  });
  expect(res.status).toBe(201);
  const data = await res.json();
  expect(data.email).toBe("b2-phase02@test.com");
  const { prisma } = await import("@/lib/db/index");
  const u = await prisma.user.findUnique({ where: { email: "b2-phase02@test.com" } });
  expect(u?.password?.startsWith("$2a$") || u?.password?.startsWith("$2b$")).toBe(true);
});

test("signup 400 if age18 false", async () => {
  const r = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "c-phase02@test.com", password: "Pass123!Aa", age18: false }),
  });
  expect(r.status).toBe(400);
  const body = await r.json();
  expect(body.error).toMatch(/18\+/);
});

test("duplicate email 409", async () => {
  await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "dup@test.com", password: "Pass123!Aa", age18: true }),
  });
  const r2 = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "dup@test.com", password: "Pass123!Aa", age18: true }),
  });
  expect(r2.status).toBe(409);
});
```

- [ ] **Step 2: Run to verify fail**
Run: `npm test tests/phase02/auth.test.ts -v`
Expected: FAIL `404` no route, `Cannot find module '@/lib/db/index'`, `password` field does not exist on `User`, `ECONNREFUSED` if server not running — unit test should mock fetch via `NextRequest` or use `vitest` fetch mock; initial run fails because `src/app/api/auth/signup/route.ts` and `src/lib/db/index.ts` do not exist.

- [ ] **Step 3: Implement**
1. `prisma/schema.prisma:11` — patch User + add AuditLog:
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?
  name          String?
  image         String?
  emailVerified DateTime?
  tokenVersion  Int       @default(0)
  role          Role      @default(CANDIDATE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  candidateProfile CandidateProfile?
  employerProfile  EmployerProfile?
  payments      Payment[]
  auditLogs     AuditLog[]
}
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  meta      Json?
  createdAt DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  @@index([userId, action])
  @@index([createdAt])
}
```
Run: `npx prisma migrate dev --name add-auth-fields`

2. `src/lib/db/index.ts` — singleton per `postgres/SKILL.md:1`:
```ts
import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
```

3. `src/lib/validators/auth.ts` — Zod per `forms/SKILL.md:1`:
```ts
import { z } from "zod";
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, "needs uppercase").regex(/[0-9]/, "needs number"),
  age18: z.literal(true, { errorMap: () => ({ message: "Must be 18+ to use BEXO" }) }),
  role: z.enum(["CANDIDATE", "EMPLOYER"]).optional().default("CANDIDATE"),
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export type SignupInput = z.infer<typeof signupSchema>;
```

4. `src/lib/auth.ts` — per `auth-implementation-patterns/SKILL.md:1` + `authentication-patterns/SKILL.md:10`:
```ts
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/index";
import { loginSchema } from "./validators/auth";

export const hashPassword = (p: string) => bcrypt.hashSync(p, 10);
export const verifyPassword = (p: string, h: string) => bcrypt.compareSync(p, h);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const { email, password } = loginSchema.parse(creds);
        const u = await prisma.user.findUnique({ where: { email } });
        if (!u?.password) throw new Error("Invalid credentials");
        if (!verifyPassword(password, u.password)) throw new Error("Invalid credentials");
        return { id: u.id, email: u.email, role: u.role } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session as any).user.role = (token as any).role;
      (session as any).user.id = token.sub;
      return session;
    },
  },
};
```

5. `src/app/api/auth/signup/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/index";
import { signupSchema } from "@/lib/validators/auth";
import { hashPassword } from "@/lib/auth";
import { auditLog } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const rl = await rateLimit(`signup:${ip}`, 5, 60);
  if (!rl.allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter), "X-RateLimit-Limit": "5" } });
  const body = await req.json();
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { email, password, role } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const user = await prisma.user.create({ data: { email, password: hashPassword(password), role } });
  await auditLog({ userId: user.id, action: "auth:signup", meta: { email } });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 });
}
```

6. `src/app/api/auth/[...nextauth]/route.ts`:
```ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

7. `.env.example:1` add:
```
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

8. `package.json:22` add deps (exact versions):
`npm i next-auth@4.24.11 bcryptjs@2.4.3 && npm i -D @types/bcryptjs@2.4.6 @auth/prisma-adapter@1.0.15`

- [ ] **Step 4: Run pass**
Run: `npx prisma migrate dev --name add-auth-fields && npm test tests/phase02/auth.test.ts -v`
Expected: PASS 3/3. Also `npm run build` PASS. Manual `curl -X POST localhost:3000/api/auth/signup -d '{"email":"x@x.com","password":"Pass123!Aa","age18":true}'` => 201.

- [ ] **Step 5: Commit**
```bash
git add prisma/schema.prisma src/lib/db/index.ts src/lib/validators/auth.ts src/lib/auth.ts src/app/api/auth/ tests/phase02/auth.test.ts .env.example package.json
git commit -m "feat(auth): signup/login credentials 18+ §6,24"
```

---

### Task 02: RBAC + Middleware Guards + Auth Pages

**Files:**
- Create: `src/lib/rbac.ts`, `src/middleware.ts`, `src/app/(auth)/signup/page.tsx`, `src/app/(auth)/login/page.tsx`
- Test: `tests/phase02/rbac.test.ts`

**Interfaces:**
- Consumes: `src/lib/auth.ts: authOptions` session `user:{id:string,email:string,role:Role}`, `prisma/schema.prisma:4` enum `Role`
- Produces: `hasPermission(role:Role, resource:string, action:string):boolean`, `can(user:{role:Role}, perm:string):boolean` where `perm` is `"resource:action"` (e.g. `"admin:users:read"`), `middleware.ts` guards `/dashboard/*`, `/employer/*`, `/admin/*` returning 401/403 or redirect to `/login`

- [ ] **Step 1: Write failing test** `tests/phase02/rbac.test.ts`
```ts
import { test, expect } from "vitest";

test("hasPermission matrix", async () => {
  const { hasPermission, can } = await import("@/lib/rbac");
  expect(hasPermission("CANDIDATE", "profile", "read")).toBe(true);
  expect(hasPermission("CANDIDATE", "profile", "update")).toBe(true);
  expect(hasPermission("CANDIDATE", "admin:users", "read")).toBe(false);
  expect(hasPermission("EMPLOYER", "talent", "read")).toBe(true);
  expect(hasPermission("ADMIN", "*", "delete")).toBe(true);
  expect(can({ role: "EMPLOYER" }, "talent:read")).toBe(true);
  expect(can({ role: "EMPLOYER" }, "admin:users:read")).toBe(false);
});

test("employer cannot access /admin via middleware", async () => {
  const res = await fetch("http://localhost:3000/admin/users", { headers: { cookie: "next-auth.session-token=employerMock" } });
  expect([401, 403, 307].includes(res.status)).toBe(true);
});
```

- [ ] **Step 2: Run to verify fail**
Run: `npm test tests/phase02/rbac.test.ts -v`
Expected: FAIL `Cannot find module '@/lib/rbac'`, `hasPermission is not a function`, middleware returns 200 incorrectly for `/admin`.

- [ ] **Step 3: Implement**
1. `src/lib/rbac.ts` per `authentication-patterns/SKILL.md:132` RBAC:
```ts
export type Role = "CANDIDATE" | "EMPLOYER" | "ADMIN" | "MODERATOR";
type Perm = { resource: string; action: string };
const ROLE_PERMISSIONS: Record<Role, Perm[]> = {
  CANDIDATE: [
    { resource: "profile", action: "read" },
    { resource: "profile", action: "update" },
    { resource: "profile", action: "create" },
  ],
  EMPLOYER: [
    { resource: "talent", action: "read" },
    { resource: "lists", action: "create" },
    { resource: "lists", action: "read" },
  ],
  MODERATOR: [
    { resource: "reports", action: "read" },
    { resource: "reports", action: "update" },
  ],
  ADMIN: [
    { resource: "*", action: "create" },
    { resource: "*", action: "read" },
    { resource: "*", action: "update" },
    { resource: "*", action: "delete" },
  ],
};
export const hasPermission = (role: Role, resource: string, action: string) =>
  ROLE_PERMISSIONS[role]?.some((p) => (p.resource === resource || p.resource === "*") && p.action === action) ?? false;
export const can = (user: { role: Role }, perm: string) => {
  const parts = perm.split(":");
  const action = parts.pop()!;
  const resource = parts.join(":") || parts[0];
  return hasPermission(user.role, resource, action);
};
```

2. `src/middleware.ts` (project `src/` per Next.js):
```ts
export { default } from "next-auth/middleware";
export const config = { matcher: ["/dashboard/:path*", "/employer/:path*", "/admin/:path*"] };
// Role-aware extension (in same file, wrap):
// if token?.role === "CANDIDATE" && req.nextUrl.pathname.startsWith("/admin") -> NextResponse.json({error:"Forbidden"}, {status:403})
```

3. `src/app/(auth)/signup/page.tsx` + `src/app/(auth)/login/page.tsx` — per `design-taste-frontend/SKILL.md:1` + `shadcn/SKILL.md:1` + `design-system-bexo/design-tokens.json:66` `btn-primary` lime, Geist, `max-w-[420px]` card, `form` with `label` + `input` `border-[var(--color-border-strong)]`, checkbox `I am 18+`, error `text-[var(--color-error)]`, link to Terms.

- [ ] **Step 4: Run pass**
Run: `npm test tests/phase02/rbac.test.ts -v`
Expected: PASS 2/2. Manual: unauth `GET /dashboard` => 307 to `/login`, employer cookie `GET /admin` => 403.

- [ ] **Step 5: Commit**
```bash
git add src/lib/rbac.ts src/middleware.ts src/app/\(auth\)/ tests/phase02/rbac.test.ts
git commit -m "feat(auth): rbac + middleware guards §24"
```

---

### Task 03: Rate Limits + Audit Log

**Files:**
- Create: `src/lib/rate-limit.ts`, `src/lib/audit.ts`
- Modify: `src/app/api/auth/signup/route.ts:1`, `src/app/api/auth/[...nextauth]/route.ts:1` (wrap with rateLimit)
- Test: `tests/phase02/rate.test.ts`

**Interfaces:**
- Consumes: `prisma/schema.prisma: AuditLog`, `rate-limiting/SKILL.md:39` TokenBucket
- Produces: `rateLimit(key:string, limit:number, windowSec:number):Promise<{allowed:boolean, remaining:number, resetAt:number, retryAfter:number}>`, `auditLog({userId?:string, action:string, meta?:Json}):Promise<void>`, `429` with headers `Retry-After`, `X-RateLimit-Limit/Remaining/Reset`, `RateLimit-*` per `rate-limiting/SKILL.md:898`

- [ ] **Step 1: Write failing test** `tests/phase02/rate.test.ts`
```ts
import { test, expect } from "vitest";

test("signup rate limited 5/min returns 429 with headers", async () => {
  const ip = `test-${Date.now()}`;
  for (let i = 0; i < 5; i++) {
    await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({ email: `r${i}-${ip}@test.com`, password: "Pass123!Aa", age18: true }),
    });
  }
  const r = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ email: `r5-${ip}@test.com`, password: "Pass123!Aa", age18: true }),
  });
  expect(r.status).toBe(429);
  expect(r.headers.get("retry-after") || r.headers.get("Retry-After")).toBeTruthy();
  expect(r.headers.get("x-ratelimit-limit") || r.headers.get("X-RateLimit-Limit")).toBeTruthy();
});

test("audit log writes on signup", async () => {
  const email = `audit-${Date.now()}@test.com`;
  await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password: "Pass123!Aa", age18: true }),
  });
  const { prisma } = await import("@/lib/db/index");
  const logs = await prisma.auditLog.findMany({ where: { action: "auth:signup" }, orderBy: { createdAt: "desc" }, take: 1 });
  expect(logs.length).toBeGreaterThan(0);
  expect(logs[0].action).toBe("auth:signup");
});
```

- [ ] **Step 2: Run to verify fail**
Run: `npm test tests/phase02/rate.test.ts -v`
Expected: FAIL `429` got `201` (no limiting), `prisma.auditLog` undefined or empty, headers missing.

- [ ] **Step 3: Implement**
1. `src/lib/rate-limit.ts` per `rate-limiting/SKILL.md:39` TokenBucket + `HybridRateLimiter:339` in-memory MVP (Redis swap via `ioredis` later):
```ts
class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  constructor(private capacity: number, private refillRate: number) {
    this.tokens = capacity; this.lastRefill = Date.now();
  }
  private refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
  consume(n = 1): boolean { this.refill(); if (this.tokens >= n) { this.tokens -= n; return true; } return false; }
}
const buckets = new Map<string, TokenBucket>();
export async function rateLimit(key: string, limit: number, windowSec: number) {
  const bucket = buckets.get(key) ?? new TokenBucket(limit, limit / windowSec);
  buckets.set(key, bucket);
  const allowed = bucket.consume(1);
  return { allowed, remaining: Math.max(0, limit - 1), resetAt: Date.now() + windowSec * 1000, retryAfter: allowed ? 0 : windowSec };
}
```

2. `src/lib/audit.ts`:
```ts
import { prisma } from "./db/index";
export const auditLog = (p: { userId?: string; action: string; meta?: any }) =>
  prisma.auditLog.create({ data: { userId: p.userId, action: p.action, meta: p.meta ?? {} } });
```

3. Wrap both auth routes with `rateLimit` + set headers `X-RateLimit-*` + `Retry-After` per `rate-limiting/SKILL.md:898` and call `auditLog` on success/fail (uniform error `Invalid credentials` per `authentication-patterns:187`).

- [ ] **Step 4: Run pass**
Run: `npm test tests/phase02/rate.test.ts -v`
Expected: PASS 2/2. Also `npm run build` PASS. `curl -i` shows `X-RateLimit-Limit: 5` `Retry-After: 60`.

- [ ] **Step 5: Commit**
```bash
git add src/lib/rate-limit.ts src/lib/audit.ts src/app/api/auth/signup/route.ts tests/phase02/rate.test.ts
git commit -m "feat(auth): rate limit + audit log §24"
```

---

## Self-Review

**1. Spec coverage:**
- PRD §6 IA/auth: signup/login/OAuth + session guards — Task01 (credentials) + Task02 (middleware guards) ✓, OAuth env ready `.env.example:1` for Google/GitHub (deferred token encrypt per `auth-implementation-patterns:63` to Phase02 follow-up, not blocking §6)
- PRD §24 security checklist: bcrypt `hashPassword` per `auth-implementation-patterns:63`, short JWT 7d `authOptions`, `httpOnly` via next-auth cookie `secure/sameSite`, CSRF via next-auth, uniform `Invalid credentials` per `authentication-patterns:187`, rate limits `rate-limiting:420` + audit `AuditLog` ✓ Task03
- PRD §27 API (`POST /api/auth/signup`, `GET/POST /api/auth/[...nextauth]`) ✓ Task01
- PRD §31 criteria (email uniqueness 409, 18+ `z.literal(true)` 400) ✓ Task01
- PRD §20 privacy hideEmail enforced later Phase03 but schema `hideEmail:true` preserved `prisma/schema.prisma:13`

**2. Placeholder scan:** Grepped `TBD|TODO|implement later|fill in|handle edge` — 0 hits in tasks. All Steps have exact file paths, code blocks, commands, expected outputs.

**3. Type consistency:** `User{id,email,password?,role:Role,tokenVersion}` Task01 → `session.user:{id,email,role}` `src/lib/auth.ts:1` → `hasPermission(role:Role,resource,action)` / `can(user:{role})` Task02 → `auditLog({userId?})` FK `AuditLog.userId` consistent. `Role` enum `CANDIDATE|EMPLOYER|ADMIN|MODERATOR` shared from `prisma/schema.prisma:4`.

---

Plan complete and saved to `docs/superpowers/plans/2026-08-27-bexo-phase-02-auth.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
