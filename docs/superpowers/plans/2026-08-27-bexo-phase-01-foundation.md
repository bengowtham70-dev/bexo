# Phase 01 — Foundation & Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold modular Next.js monolith with PostgreSQL, S3, CI/CD, and BEXO design tokens so every later phase builds on a running, tested base.

**Architecture:** Next.js App Router + TypeScript strict + Tailwind with CSS variables via `@theme inline` + Prisma + S3 presigned URLs + env management + seed/demo data.

**Tech Stack:** Next.js 14, Tailwind v4, shadcn/ui, Prisma, PostgreSQL, S3-compatible, `tailwind-theme-builder`, `project-scaffolding`, `shadcn`

## Global Constraints
- Tokens verbatim: Ink #111318, Warm #F7F7F2, Lime #C8FF3D (actions/featured only), Violet #7C5CFC, Muted #667085, Success #21C77A, Warning #FFB020, Error #FF4D5E
- No payment color as quality indicator
- HTTPS/TLS everywhere, secrets outside source, no placeholders

---

### Task 01: Scaffold Repo + CI

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.env.example`, `.github/workflows/ci.yml`
- Test: `tests/phase01/scaffold.test.ts`

**Interfaces:**
- Consumes: none
- Produces: `npm run dev` boots, `npm run build` passes

- [ ] **Step 1: Write failing test**
```ts
// tests/phase01/scaffold.test.ts
import { existsSync } from "fs";
test("package.json has next + typescript", () => {
  const pkg = JSON.parse(require("fs").readFileSync("package.json","utf8"));
  expect(pkg.dependencies.next).toBeDefined();
  expect(pkg.devDependencies.typescript).toBeDefined();
});
```
- [ ] **Step 2: Run to verify fail** Run: `npm test tests/phase01/scaffold.test.ts -v` Expected: FAIL no package.json
- [ ] **Step 3: Implement** Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir` + add `ci.yml` (checkout@v4, node 20, `npm ci && npm run build && npm test`)
- [ ] **Step 4: Run pass** Run: `npm test` Expected: PASS
- [ ] **Step 5: Commit** `git add . && git commit -m "feat: scaffold phase01"`

### Task 02: DB + Prisma Schema (Core Model §26)

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/db/index.ts`, `src/lib/db/seed.ts`
- Test: `tests/phase01/db.test.ts`

**Interfaces:**
- Consumes: Task01
- Produces: `prisma.user`, `prisma.candidateProfile`, `prisma.boost` models

- [ ] **Step 1: Test**
```ts
test("prisma can create user", async () => {
  const u = await prisma.user.create({data:{email:"a@a.com", role:"CANDIDATE"}});
  expect(u.id).toBeDefined();
});
```
- [ ] **Step 2: Fail** `npx vitest run tests/phase01/db.test.ts` FAIL no schema
- [ ] **Step 3: Implement** `prisma/schema.prisma` with models: User, CandidateProfile(slug unique, visibility enum), Experience, Project, Skill, Education, ExternalLink, Resume, Boost(categoryId, amount, currency, startAt, endAt, status), Payment(providerPaymentId unique), EmployerProfile(verificationStatus)
- [ ] **Step 4: Pass** `npx prisma migrate dev --name init && npm test` PASS
- [ ] **Step 5: Commit** `git add prisma/ src/lib/db && git commit -m "feat: db schema §26"`

### Task 03: Design Tokens + Tailwind Theme

**Files:**
- Modify: `src/app/globals.css`, `tailwind.config.ts`
- Create: `src/components/ui/button.tsx`
- Test: `tests/phase01/tokens.test.ts`

**Interfaces:**
- Consumes: Task01
- Produces: `—color-lime: #C8FF3D` CSS variable

- [ ] **Step 1: Test**
```ts
test("globals has lime token", () => {
  const css = require("fs").readFileSync("src/app/globals.css","utf8");
  expect(css).toContain("#C8FF3D");
});
```
- [ ] **Step 2: Fail** FAIL missing token
- [ ] **Step 3: Implement** `globals.css` `@theme inline { --color-lime:#C8FF3D; --color-ink:#111318; --color-violet:#7C5CFC }` using `tailwind-theme-builder/SKILL.md:1` + shadcn button variant `boost: bg-[var(--color-lime)]`
- [ ] **Step 4: Pass** `npm test` PASS + visual `npm run dev` shows lime CTA
- [ ] **Step 5: Commit** `git commit -m "feat: tokens §40"`

**Self-Review:** Covers PRD §25 stack, §40 palette, §41 checklist (repo, CI, migrations, seed) — all tasks have exact paths + code blocks, no placeholders.
