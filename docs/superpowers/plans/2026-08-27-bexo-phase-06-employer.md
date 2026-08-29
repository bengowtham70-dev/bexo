# Phase 06 — Employer Experience & Verification Implementation Plan (100% Complete)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a robust, scam-proof 4-signal employer verification engine, secure email challenge token redemption, saved candidate shortlists with private recruiter notes, and employer dashboard pages per PRD §8, 16, 17, 18.

**Architecture:** Next.js App Router + TypeScript + Prisma ORM + Cryptographic SHA-256 token verification (`EmployerVerificationToken`) + Work email domain matching (anti-free-webmail gate) + Shortlist management (`EmployerSaved`) with recruiter-private notes isolation + Reactive employer UI.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind v4 tokens (`Ink #111318`, `Warm #F7F7F2`, `Lime #C8FF3D`, `Success #21C77A`, `Warning #FFB020`, `Error #FF4D5E`), Prisma, Vitest.

## Global Constraints
- Brand: BEXO, headline "Back Yourself. Get Seen."
- Free email providers (Gmail, Yahoo, Outlook, Proton, iCloud, etc.) are strictly prohibited for employer verification (PRD §17).
- Tokens must be hashed with SHA-256 before storage; raw tokens are never persisted in the database.
- Tokens expire in 24 hours and are single-use (`usedAt` timestamp).
- Private recruiter notes (`notesPrivate`) must remain strictly isolated to the employer who authored them and never leaked to candidates or other employers.
- Zero placeholders: All file paths, types, interfaces, test scripts, and commands are fully specified.

---

## File Structure

```
src/lib/verify-email.ts                                # Domain validation, free email check, token generation & SHA-256 hashing
src/app/api/employer/profile/route.ts                  # GET/POST employer profile and 4-signal verification status
src/app/api/employer/verify/route.ts                   # GET token redemption, expiry validation & status promotion
src/app/api/employer/saved/route.ts                    # GET, POST, PATCH (notes), DELETE saved candidate shortlist
src/components/employer/verification-badge.tsx         # 4-signal verification badge & status card
src/components/employer/saved-candidate-card.tsx       # Shortlisted candidate card with private notes editor
src/app/(employer)/employer/dashboard/page.tsx         # Employer overview dashboard
src/app/(employer)/employer/verify/page.tsx            # Verification center & token resend UI
src/app/(employer)/employer/saved/page.tsx             # Saved candidates shortlist page
tests/phase06/verify.test.ts                           # Tests for token generation, hashing, redemption & expiry
tests/phase06/saved.test.ts                            # Tests for shortlist CRUD and private notes isolation
tests/phase06/employer-ui.test.ts                      # Tests for verification badge and employer UI components
```

---

### Task 01: Verification Token Redemption & Verification State Machine (`src/app/api/employer/verify/route.ts`, `src/lib/verify-email.ts`)

- [x] **Step 1: Write failing test** `tests/phase06/verify.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement token redemption route and status promotion**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 02: Saved Candidates Shortlist & Private Notes API (`src/app/api/employer/saved/route.ts`)

- [x] **Step 1: Write failing test** `tests/phase06/saved.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement saved candidates and notes API**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 03: Employer Verification Badge & UI Components (`src/components/employer/*`)

- [x] **Step 1: Write failing test** `tests/phase06/employer-ui.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement employer UI components**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 04: Employer Dashboard Pages (`/employer/dashboard`, `/employer/verify`, `/employer/saved`)

- [x] **Step 1: Add page test assertions to** `tests/phase06/employer-ui.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement employer dashboard pages**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

## Verification Summary
* All 3 test files in `tests/phase06/` passing (10/10 tests).
* Full project test suite passing: **22 test files, 82 tests passed (100% pass rate)**.
