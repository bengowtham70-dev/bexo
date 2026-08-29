# Phase 10 — Analytics, Performance, SEO & Launch Gates Implementation Plan (100% Complete)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement privacy-first analytics event taxonomy, dynamic SEO sitemap & robots, legal compliance pages (`/privacy`, `/terms`), health check monitoring, and master release launch gates test suite per PRD §17, 21, 28, 29, 32, 42.

**Architecture:** Next.js App Router + TypeScript + Prisma ORM + Server-side event tracking dispatcher (`src/lib/analytics/*`) + Next.js App Router dynamic `sitemap.ts` & `robots.ts` + Health monitor `GET /api/health` + Comprehensive 9-gate release test suite (`tests/phase10/gates.test.ts`).

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind v4 tokens (`Ink #111318`, `Warm #F7F7F2`, `Lime #C8FF3D`, `Success #21C77A`, `Warning #FFB020`, `Error #FF4D5E`), Prisma, Vitest.

## Global Constraints
- Brand: BEXO, headline "Back Yourself. Get Seen."
- PII-Free Analytics: Candidate raw email and phone must never be sent to analytics services.
- SEO Indexing Rule: Candidate profiles are only included in `sitemap.ts` if `visibility === "PUBLIC"` and `hideFromSearch === false`.
- Mandatory FTC compliance copy: *"You pay BEXO for visibility — never pay an employer to get a job."* (PRD §21).
- Zero placeholders: All file paths, types, interfaces, test scripts, and commands are fully specified.

---

## File Structure

```
src/lib/analytics/events.ts                            # Event taxonomy definitions & PII sanitization
src/lib/analytics/posthog.ts                           # Server & client PostHog analytics dispatcher
src/app/api/analytics/route.ts                         # POST /api/analytics client event ingest endpoint
src/app/sitemap.ts                                     # Dynamic Next.js sitemap respecting candidate privacy
src/app/robots.ts                                      # Standard crawler robots.txt rules
src/lib/monitoring/sentry.ts                           # Sentry error capture & breadcrumb helper
src/app/api/health/route.ts                            # GET /api/health system uptime & DB check
src/app/privacy/page.tsx                               # GDPR & CCPA compliant privacy policy page
src/app/terms/page.tsx                                 # Terms of service page with anti-scam clauses
docs/RELEASE_GATES.md                                  # 10-point release gates verification documentation
tests/phase10/analytics.test.ts                        # Tests for event taxonomy, validation, and PII safety
tests/phase10/seo.test.ts                              # Tests for sitemap privacy filters and robots config
tests/phase10/legal-pages.test.ts                      # Tests for privacy policy, terms of service, and health API
tests/phase10/gates.test.ts                            # Master 9-gate end-to-end launch verification suite
```

---

### Task 01: Event Taxonomy & Analytics Ingest (`src/lib/analytics/*`, `src/app/api/analytics/route.ts`)

- [x] **Step 1: Write failing test** `tests/phase10/analytics.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement event taxonomy, posthog wrapper, and analytics ingest endpoint**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 02: Performance, SEO, Sitemap & Health Check (`src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/api/health/route.ts`, `src/lib/monitoring/sentry.ts`)

- [x] **Step 1: Write failing test** `tests/phase10/seo.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement sitemap, robots, sentry helper, and health check route**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 03: Legal Compliance & Policy Pages (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`)

- [x] **Step 1: Write failing test** `tests/phase10/legal-pages.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement privacy policy and terms of service pages**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 04: Master Release Launch Gates & Verification Suite (`docs/RELEASE_GATES.md`, `tests/phase10/gates.test.ts`)

- [x] **Step 1: Write failing test** `tests/phase10/gates.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement RELEASE_GATES.md documentation and master gates test suite**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

## Verification Summary
* All 4 test files in `tests/phase10/` passing (19/19 tests).
* Full project test suite passing: **34 test files, 127 tests passed across all 10 phases (100% pass rate)**.
