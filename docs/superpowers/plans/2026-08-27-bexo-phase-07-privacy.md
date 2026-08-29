# Phase 07 — Contact, Privacy & Safety Controls Implementation Plan (100% Complete)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build granular candidate privacy controls, an anti-phishing email contact relay protecting candidate PII, GDPR data export & right to be forgotten, and candidate privacy settings UI per PRD §18, 19, 21, 29.

**Architecture:** Next.js App Router + TypeScript + Prisma ORM + Regex-based anti-scam / phishing keyword filter + Masked email relay dispatch + GDPR data serializer (`GET /api/me/export`) + Cascading hard deletion (`POST /api/me/delete`) + Reactive privacy dashboard.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind v4 tokens (`Ink #111318`, `Warm #F7F7F2`, `Lime #C8FF3D`, `Success #21C77A`, `Warning #FFB020`, `Error #FF4D5E`), Prisma, Vitest.

## Global Constraints
- Brand: BEXO, headline "Back Yourself. Get Seen."
- Candidate raw email and phone must never be exposed publicly or to recruiters without explicit candidate reply (PRD §19).
- Anti-phishing gate must intercept suspicious keywords ("telegram @", "crypto deposit", "pay upfront", "whatsapp contact", etc.).
- Rate limiting on recruiter outreach: 10/day for unverified employers, 50/day for verified employers.
- GDPR export must include complete profile, history, resumes, boosts, and payments as structured JSON.
- GDPR deletion must be permanent and require explicit confirmation (`DELETE MY ACCOUNT`).
- Zero placeholders: All file paths, types, interfaces, test scripts, and commands are fully specified.

---

## File Structure

```
src/lib/privacy.ts                                     # Privacy validation, visibility checks & public profile filter
src/lib/email-relay.ts                                 # Anti-phishing keyword detector & email relay dispatcher
src/app/api/me/privacy/route.ts                        # GET and PATCH candidate privacy settings
src/app/api/employer/contact/route.ts                  # POST recruiter-to-candidate masked contact relay
src/app/api/me/export/route.ts                         # GET GDPR complete data export JSON
src/app/api/me/delete/route.ts                         # POST GDPR account permanent deletion
src/components/profile/privacy-settings-form.tsx       # Interactive privacy toggles form
src/components/talent/contact-modal.tsx                # Recruiter contact dialog modal
src/app/(candidate)/dashboard/privacy/page.tsx         # Candidate privacy settings page
tests/phase07/privacy.test.ts                          # Tests for privacy settings updates and filtering
tests/phase07/contact-relay.test.ts                    # Tests for spam gate, rate limit, and email masking
tests/phase07/gdpr.test.ts                             # Tests for GDPR JSON export and account hard delete
tests/phase07/privacy-ui.test.ts                       # Tests for privacy form and recruiter contact modal
```

---

### Task 01: Granular Privacy Settings API (`src/lib/privacy.ts`, `src/app/api/me/privacy/route.ts`)

- [x] **Step 1: Write failing test** `tests/phase07/privacy.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement privacy settings route and filter helpers**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 02: Anti-Phishing Contact Relay API (`src/lib/email-relay.ts`, `src/app/api/employer/contact/route.ts`)

- [x] **Step 1: Write failing test** `tests/phase07/contact-relay.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement email relay and anti-phishing gate**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 03: GDPR Data Export & Account Deletion (`src/app/api/me/export/route.ts`, `src/app/api/me/delete/route.ts`)

- [x] **Step 1: Write failing test** `tests/phase07/gdpr.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement GDPR export and hard delete endpoints**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 04: Candidate Privacy UI & Recruiter Contact Modal (`src/components/*`, `src/app/(candidate)/dashboard/privacy/page.tsx`)

- [x] **Step 1: Write failing test** `tests/phase07/privacy-ui.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement UI components and privacy page**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

## Verification Summary
* All 4 test files in `tests/phase07/` passing (12/12 tests).
* Full project test suite passing: **26 test files, 94 tests passed (100% pass rate)**.
