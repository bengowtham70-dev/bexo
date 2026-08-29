# Phase 05 — Public Profiles, Discovery & Search Implementation Plan (100% Complete)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance public talent discovery board, category-specific boards, multi-parameter search/filters, rich SSR public candidate profiles (`/p/[slug]`) with SEO structured data & index controls, and a brutalist launch homepage per PRD §6, 7, 13, 18, 29, 31.

**Architecture:** Next.js App Router + TypeScript + Prisma query builder supporting full text filtering (`q`, `skills`, `location`, `remote`, `availability`, `category`) + Featured Shelf rotation ordered by `startAt: "asc"` + dynamic client-side `TalentBoard` with URL state synchronization + SSR `/p/[slug]` with OpenGraph & Schema.org `Person` JSON-LD + strict privacy enforcement (`filterPublicProfile` and `hideFromSearch` `noindex`).

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind v4 tokens (`Ink #111318`, `Warm #F7F7F2`, `Lime #C8FF3D` for boost/featured, `DENSITY 8`), Prisma, Vitest.

## Global Constraints
- Brand: BEXO, headline "Back Yourself. Get Seen."
- Lime `#C8FF3D` reserved strictly for boost CTAs and "Featured" pills (never for organic candidates).
- Paid visibility is **never** presented as an endorsement, qualification, or skill ranking (PRD §14).
- Featured shelf sits above organic results and is ordered by boost `startAt: "asc"`.
- Privacy enforcement at DB + API layer: `visibility: "PUBLIC"` and `hideFromSearch: false` strictly enforced for public board.
- When `hideFromSearch: true`, `/p/[slug]` returns `X-Robots-Tag: noindex, nofollow`.
- Zero placeholders: All file paths, types, interfaces, test scripts, and commands are fully specified.

---

## File Structure

```
src/lib/search.ts                                 # Multi-field query builder & filter parser
src/app/api/talent/route.ts                       # GET /api/talent -> returns featured shelf & paginated organic results
src/components/talent/board-row.tsx               # Candidate row component with density 8 styling & Featured pill
src/components/talent/filter-bar.tsx              # Interactive filter controls (keywords, skills, location, remote)
src/components/talent/category-chips.tsx          # Horizontal snap-x category chips
src/components/talent/talent-board.tsx            # Client-side reactive board managing search & pagination state
src/app/(public)/talent/page.tsx                  # Public talent discovery page
src/app/(public)/talent/[category]/page.tsx       # Category-specific talent board page
src/app/(public)/p/[slug]/page.tsx                # Rich public candidate profile SSR with JSON-LD & OG tags
src/app/page.tsx                                  # Homepage with hero, live preview, how-it-works & trust section
tests/phase05/search.test.ts                      # Tests for search query builder, talent API, and privacy guards
tests/phase05/talent-ui.test.ts                   # Tests for board row, filter bar, category chips, and board UI
tests/phase05/profile-seo.test.ts                 # Tests for profile SSR, metadata generation, and noindex rules
tests/phase05/home.test.ts                        # Tests for homepage copy, trust assertions, and navigation
```

---

### Task 01: Enhanced Search Engine & Discovery API (`src/lib/search.ts`, `src/app/api/talent/route.ts`)

- [x] **Step 1: Write failing test** `tests/phase05/search.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement query builder and API endpoint**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 02: Interactive Discovery Board & Category Pages (`src/components/talent/*`, `src/app/(public)/talent/*`)

- [x] **Step 1: Write failing test** `tests/phase05/talent-ui.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement Board UI components and pages**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 03: Rich Public Profile SSR & SEO Architecture (`src/app/(public)/p/[slug]/page.tsx`)

- [x] **Step 1: Write failing test** `tests/phase05/profile-seo.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement Rich Public Profile SSR and SEO utilities**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 04: Production Homepage Polish & Trust Sections (`src/app/page.tsx`)

- [x] **Step 1: Write failing test** `tests/phase05/home.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement polished Homepage**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

## Verification Summary
* All 4 test files in `tests/phase05/` passing (13/13).
* Full project test suite passing: **19 test files, 72 tests passed (100% pass rate)**.
