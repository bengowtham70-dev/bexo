# Phase 08 — Boost Monetization & Payments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement $10/24h Featured boost with real-time candidate preview, server-side Stripe Checkout session creation, cryptographic webhook verification as the sole source of truth, idempotent database activation, 24h automatic expiry cron, anti-monopoly rate caps, and transparent placement terms per PRD §14–16, 22, 27, 31.

**Architecture:** Candidate selects category and views preview in `/dashboard/boost` → server initiates Stripe Checkout Session with candidate metadata → Stripe fires `checkout.session.completed` webhook → server cryptographically validates `stripe-signature` → server idempotently creates `Payment` and activates `Boost` (24h validity window) → scheduled expiry worker transitions expired boosts to `EXPIRED` → Talent board displays active boosted profiles in the Featured Shelf with Lime `#C8FF3D` badge ordered by start time.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Prisma, `stripe@^14.0.0`, `@types/stripe`, Zod, `skills-bexo-critical/stripe-integration`, `pricing-pages`, `saas-metrics`, `design-system-bexo`.

## Global Constraints
- Brand: BEXO, headline "Back Yourself. Get Seen."
- Lime `#C8FF3D` reserved exclusively for boost CTAs and "Featured" pills.
- Paid visibility is **never** presented as an endorsement, qualification, or skill ranking (PRD §14).
- Webhook signature verification is the **only** mechanism that activates a boost (never client success redirects).
- Boost duration: exactly 24 hours ($10.00 / 1000 cents USD).
- Anti-monopoly guardrails: Candidate cannot have overlapping active boosts in the same category.
- Copy transparency rule: "You pay BEXO for visibility — never pay an employer to get a job." (PRD §21, FTC).
- Zero placeholders: All file paths, types, interfaces, test scripts, and commands are fully specified.

---

## File Structure

```
.env.example                                      # Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
package.json                                      # Add stripe dependency
src/lib/payments.ts                               # Stripe client wrapper, checkout session builder, refund helper
src/lib/boost.ts                                  # Boost activation, anti-monopoly validation, rotation helpers
src/lib/cron/boost-expiry.ts                      # Scheduled expiry job (marks endAt <= now as EXPIRED)
src/lib/validators/boost.ts                       # Zod validation schema for boost checkout inputs
src/lib/analytics/boost.ts                        # Boost view/impression telemetry logger
src/app/api/me/boost/checkout/route.ts            # POST /api/me/boost/checkout -> initiates Stripe Checkout
src/app/api/me/boosts/route.ts                    # GET /api/me/boosts -> returns candidate's active & historical boosts
src/app/api/webhooks/payment/route.ts             # POST /api/webhooks/payment -> Stripe signature verification & activation
src/components/boost/boost-preview-card.tsx       # Live Featured shelf preview card component
src/components/boost/boost-history-table.tsx      # Table of past and current boosts with remaining time
src/app/(candidate)/dashboard/boost/page.tsx      # Candidate boost purchase & preview dashboard page
tests/phase08/checkout.test.ts                    # Tests for server-side checkout creation and validation
tests/phase08/webhook.test.ts                     # Tests for webhook signature verification & idempotent activation
tests/phase08/expiry.test.ts                      # Tests for 24h boost expiry, anti-monopoly caps, and shelf rotation
tests/phase08/boost-ui.test.ts                    # Tests for boost UI components and pages
```

---

### Task 01: Stripe Core Client & Server-Side Boost Checkout (`POST /api/me/boost/checkout`)

**Files:**
- Modify: `package.json`, `.env.example`
- Create: `src/lib/payments.ts`, `src/lib/validators/boost.ts`, `src/app/api/me/boost/checkout/route.ts`
- Test: `tests/phase08/checkout.test.ts`

- [x] **Step 1: Write failing test** `tests/phase08/checkout.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement dependencies, validator, Stripe service, and checkout API**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 02: Webhook Handler with Signature Verification & Idempotent Boost Activation (`POST /api/webhooks/payment`)

**Files:**
- Create: `src/app/api/webhooks/payment/route.ts`
- Modify: `src/lib/boost.ts`
- Test: `tests/phase08/webhook.test.ts`

- [x] **Step 1: Write failing test** `tests/phase08/webhook.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement `activateBoostFromPayment` in `src/lib/boost.ts` and create `src/app/api/webhooks/payment/route.ts`**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 03: Boost Expiry Routine, Candidate Boosts Listing API & Featured Shelf Rotation

**Files:**
- Create: `src/lib/cron/boost-expiry.ts`, `src/app/api/me/boosts/route.ts`, `src/lib/analytics/boost.ts`
- Modify: `src/app/api/talent/route.ts`
- Test: `tests/phase08/expiry.test.ts`

- [x] **Step 1: Write failing test** `tests/phase08/expiry.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement expiry cron, candidate boosts endpoint, analytics helper, and enhance talent search query**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**

---

### Task 04: Candidate Boost Dashboard UI with Live Preview & Transparent Terms

**Files:**
- Create: `src/components/boost/boost-preview-card.tsx`, `src/components/boost/boost-history-table.tsx`, `src/app/(candidate)/dashboard/boost/page.tsx`
- Test: `tests/phase08/boost-ui.test.ts`

- [x] **Step 1: Write failing test** `tests/phase08/boost-ui.test.ts`
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement Boost UI Components and Dashboard Page**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit changes**
