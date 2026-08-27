# Phase 03 — Candidate Profile Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Candidate can create, edit, preview and publish a rich profile (`§8,11,31`) with visibility controls and shareable slug, without AI yet.

**Architecture:** Candidate dashboard (App Router) + Prisma CandidateProfile + Experience/Project/Skill/Education tables + slug generation + public preview + `privacy.ts` enforcement.

**Tech Stack:** `forms`, `rich-text-editor`, `shadcn-ui-patterns`, `db-schema-designer`, `project-scaffolding`

## Global Constraints
- Must review before publish, no invented facts yet, mobile + desktop render, public URL `/p/[slug]`

---

### Task 01: Profile Editor CRUD

**Files:**
- Create: `src/app/(candidate)/dashboard/profile/page.tsx`, `src/lib/validators/profile.ts`, `src/app/api/me/profile/route.ts`
- Test: `tests/phase03/profile.test.ts`

**Interfaces:**
- Consumes: Phase02 session
- Produces: `PATCH /api/me/profile` → 200

- [ ] **Step 1: Test**
```ts
test("patch profile", async () => {
  const res = await fetch("/api/me/profile",{method:"PATCH", headers:{cookie:candidateCookie}, body:JSON.stringify({headline:"AI Engineer", location:"Bangalore"})});
  expect(res.status).toBe(200);
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `profile` route with Zod `headline, location, bio, availability, workPref, salary` + Prisma upsert, using `forms/SKILL.md:1` + `shadcn-ui-patterns`
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: profile crud §8"`

### Task 02: Sections (Experience, Projects, Skills, Education)

**Files:**
- Create: `src/app/api/me/experience/route.ts`, `src/app/api/me/projects/route.ts`, `src/components/profile/section-list.tsx`
- Test: `tests/phase03/sections.test.ts`

- [ ] **Step 1: Test**
```ts
test("add experience", async () => {
  const r = await fetch("/api/me/experience",{method:"POST", headers:{cookie:candidateCookie}, body:JSON.stringify({company:"Acme", title:"AI Eng", startDate:"2022-01-01"})});
  expect(r.status).toBe(201);
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** Prisma create for Experience/Project/Skill/Education + reorder API
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: sections §8"`

### Task 03: Publish + Visibility Preview

**Files:**
- Create: `src/app/api/me/publish/route.ts`, `src/lib/privacy.ts`, `src/app/(public)/p/[slug]/page.tsx`
- Test: `tests/phase03/publish.test.ts`

- [ ] **Step 1: Test**
```ts
test("cannot publish without headline", async () => {
  const r = await fetch("/api/me/publish",{method:"POST", headers:{cookie:candidateCookie}});
  expect(r.status).toBe(400);
});
test("publish creates slug", async () => {
  await fetch("/api/me/profile",{method:"PATCH", headers:{cookie:candidateCookie}, body:JSON.stringify({headline:"AI Eng", location:"BLR", bio:"..."} )});
  const r = await fetch("/api/me/publish",{method:"POST", headers:{cookie:candidateCookie}});
  expect((await r.json()).slug).toBeDefined();
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `publish` checks required fields (§31: min fields, preview), generates slug, `privacy.ts` fields `visibility, hideEmail, hideSalary, hideEmployer`, `/p/[slug]` respects them
- [ ] **Step 4: Pass** PASS + open `/p/slug` shows public data only
- [ ] **Step 5: Commit** `git commit -m "feat: publish §31"`

Skills: `forms`, `shadcn` (local) — present. Deep check: no placeholders, exact paths.
