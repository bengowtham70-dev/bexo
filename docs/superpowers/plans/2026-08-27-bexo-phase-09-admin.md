# Phase 09 — Trust, Safety, Moderation & Admin Implementation Plan (100% Complete)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete user reporting system, RBAC-protected admin moderation queue, account suspension/hide actions, public trust & safety pages (`/safety`, `/how-it-works`), and admin moderation dashboard UI per PRD §8, 20, 21.

**Architecture:** Next.js App Router + TypeScript + Prisma ORM (`Report` model with `ReportStatus`) + Role-Based Access Control (`ADMIN`, `MODERATOR`) + Rate-limited user report intake (`POST /api/reports`) + Admin action endpoints with audit logging + High-density brutalist moderation queue UI.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind v4 tokens (`Ink #111318`, `Warm #F7F7F2`, `Lime #C8FF3D`, `Success #21C77A`, `Warning #FFB020`, `Error #FF4D5E`), Prisma, Vitest.

## Global Constraints
- Brand: BEXO, headline "Back Yourself. Get Seen."
- Mandatory FTC compliance copy: *"You pay BEXO for visibility — never pay an employer to get a job."* (PRD §21).
- Admin routes (`/admin/*` and `/api/admin/*`) must be strictly guarded by RBAC (`ADMIN` or `MODERATOR` role).
- All moderation actions (resolutions, dismissals, suspensions) must produce structured entries in the `AuditLog` table.
- Zero placeholders: All file paths, types, interfaces, test scripts, and commands are fully specified.

---

## File Structure

```
prisma/schema.prisma                                   # Report model and ReportStatus enum
src/lib/validators/report.ts                           # Zod schemas for report creation and resolution
src/app/api/reports/route.ts                           # POST /api/reports user report intake
src/app/api/admin/reports/route.ts                     # GET /api/admin/reports moderation queue
src/app/api/admin/reports/[id]/route.ts                # PATCH /api/admin/reports/:id resolve/dismiss
src/app/api/admin/users/route.ts                       # GET /api/admin/users admin user list
src/app/api/admin/users/[id]/route.ts                  # PATCH /api/admin/users/:id suspend/restore
src/components/admin/report-table.tsx                  # Moderation queue table with quick actions
src/components/admin/user-table.tsx                    # User management table with suspension toggles
src/app/(admin)/admin/reports/page.tsx                 # Admin reports moderation center
src/app/(admin)/admin/users/page.tsx                   # Admin user management dashboard
src/app/safety/page.tsx                                # Public trust & safety guidelines page
src/app/how-it-works/page.tsx                          # Public marketplace mechanism & protocol guide
tests/phase09/reports.test.ts                          # Tests for report intake, validation, and rate limits
tests/phase09/admin-api.test.ts                        # Tests for admin queue, resolution, and user suspension
tests/phase09/safety-pages.test.ts                     # Tests for public safety and how-it-works pages
tests/phase09/admin-ui.test.ts                         # Tests for moderation UI components and admin pages
```

---

### Task 01: Reporting Subsystem & Prisma Schema (`prisma/schema.prisma`, `src/lib/validators/report.ts`, `src/app/api/reports/route.ts`)

- [x] **Step 1: Write failing test** `tests/phase09/reports.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Update schema, run prisma generate, and implement reports route**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 02: Admin Moderation & User Suspension API (`src/app/api/admin/*`)

- [x] **Step 1: Write failing test** `tests/phase09/admin-api.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement admin reports and user suspension endpoints**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 03: Public Safety & How It Works Pages (`src/app/safety/page.tsx`, `src/app/how-it-works/page.tsx`)

- [x] **Step 1: Write failing test** `tests/phase09/safety-pages.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement safety and how-it-works pages**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 04: Admin Moderation Dashboard & Queue UI (`src/components/admin/*`, `src/app/(admin)/admin/*`)

- [x] **Step 1: Write failing test** `tests/phase09/admin-ui.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement admin UI components and pages**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

## Verification Summary
* All 4 test files in `tests/phase09/` passing (14/14 tests).
* Full project test suite passing: **30 test files, 108 tests passed (100% pass rate)**.
