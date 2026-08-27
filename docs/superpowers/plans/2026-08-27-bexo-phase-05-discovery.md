# Phase 05 â€” Public Profiles + Discovery & Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Public talent board, category pages, search/filters, SEO controls per PRD Â§6,7,13,18,29.

**Architecture:** Public routes `/talent`, `/talent/[category]`, `/p/[slug]` + Postgres FTS GIN index + filters (role, skills, location, remote, availability) + `noindex` when candidate opts out.

**Tech Stack:** `postgres`, `database-optimization`, `hybrid-search-implementation` (V2), `nextjs-seo-indexing` (from `skills-bexo-critical/`), `infinite-scroll`, `supabase-postgres-best-practices`

## Global Constraints
- Lime #C8FF3D only for boost, visibility is not qualification, publish preview required, webhook is truth, PII never in analytics

---

### Task 01: Public Profile Rendering + SEO

**Files:**
- Create: `src/app/(public)/p/[slug]/page.tsx`, `src/lib/seo.ts`, `src/components/talent/featured-badge.tsx`
- Test: `tests/phase05/public.test.ts`

**Interfaces:**
- Produces: `GET /p/[slug]` â†’ 200 public, 404 if not published, `X-Robots-Tag: noindex` when `hideFromSearch=true`

- [ ] **Step 1: Test**
```ts
test("public profile respects hideFromSearch", async () => {
  const r = await fetch("/p/a-slug");
  expect(r.headers.get("x-robots-tag")).toContain("noindex");
});
test("featured badge", async () => {
  const html = await fetch("/p/featured-slug").then(r=>r.text());
  expect(html).toContain("Featured");
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `page.tsx` respects `privacy.hideFromSearch` + `nextjs-seo-indexing/SKILL.md:1` (from `internet-skills/opencode-skills-collection/bundled-skills/nextjs-seo-indexing`) + `featured-badge.tsx` shows Lime #C8FF3D badge only when `Boost.active` (PRD Â§14 no "best")
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: public profile Â§8"`

### Task 02: Talent Browse + Filters + FTS

**Files:**
- Create: `src/app/api/talent/route.ts`, `src/lib/search.ts`, `src/app/(public)/talent/page.tsx`, `src/app/(public)/talent/[category]/page.tsx`
- Test: `tests/phase05/search.test.ts`

- [ ] **Step 1: Test**
```ts
test("search by skill", async () => {
  const r = await fetch("/api/talent?skills=Python&location=Bangalore");
  expect((await r.json()).length).toBeGreaterThan(0);
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `search.ts` Postgres `tsvector` + `pg_trgm` GIN (`database-optimization/SKILL.md:1`) + filters: role, skills, location, remote, experience, availability, employmentType + category board â€” uses `supabase-postgres-best-practices` â€” if hybrid needed later, `hybrid-search-implementation` already local
- [ ] **Step 4: Pass** PASS + browse shows featured shelf above organic (ordered by boost startTime rotation per Â§15)
- [ ] **Step 5: Commit** `git commit -m "feat: discovery Â§13"`

### Task 03: Homepage + Category Boards

**Files:**
- Modify: `src/app/(public)/page.tsx` (hero â€œBack Yourself. Get Seen.â€ + featured preview + how-it-works + trust)
- Test: `tests/phase05/home.test.ts`

- [ ] **Step 1: Test**
```ts
test("hero copy", async () => {
  const html = await fetch("/").then(r=>r.text());
  expect(html).toContain("Back Yourself. Get Seen.");
  expect(html).toContain("Explore Talent");
});
```
- [ ] **Step 2: Fail** missing copy
- [ ] **Step 3: Implement** hero, live board preview (featured labeled paid), trust section (Â§7)
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: homepage Â§7"`

Skills: `nextjs-seo-indexing` downloaded to `skills-bexo-critical/` (was missing locally per `MISSING_SKILLS_ANALYSIS.md:5`), now present â€” no further download.

