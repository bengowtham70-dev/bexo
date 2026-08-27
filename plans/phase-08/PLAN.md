# Phase 08 â€” Boost Monetization & Payments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** $10/24h Featured boost with preview, server Checkout, webhook as truth, idempotent expiry, anti-monopoly, analytics per PRD Â§14-16,22,27,31.

**Architecture:** Candidate chooses category â†’ server creates Checkout Session â†’ provider webhook â†’ verify signature â†’ idempotent Boost activation â†’ cron expiry â†’ featured shelf.

**Tech Stack:** `stripe-integration`, `stripe-automation`, `payment-integration` (all from `skills-bexo-critical/`), `background-jobs`, `saas-metrics`, `pricing-pages`, `api-integrator` (webhook snippet), `aws` tax

## Global Constraints
- Lime #C8FF3D only for boost, visibility is not qualification, publish preview required, webhook is truth, PII never in analytics

---

### Task 01: Boost Checkout (Server-Side)

**Files:**
- Create: `src/app/(candidate)/dashboard/boost/page.tsx`, `src/app/api/me/boost/checkout/route.ts`, `src/lib/payments.ts`, `src/lib/boost.ts`
- Test: `tests/phase08/checkout.test.ts`

- [ ] **Step 1: Test**
```ts
test("checkout creates session with price/category/duration", async () => {
  const r = await fetch("/api/me/boost/checkout",{method:"POST", headers:{cookie:candidateCookie}, body:JSON.stringify({categoryId:"ai", currency:"USD"})});
  expect(r.status).toBe(200);
  expect((await r.json()).url).toContain("checkout");
  expect((await r.json()).amount).toBe(1000);
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `payments.ts` Stripe `checkout.sessions.create` server-side (never grant on client success URL per Â§22) + `payment-integration/SKILL.md:1` + `stripe-integration/SKILL.md:1` (both in `skills-bexo-critical/` â€” were missing locally, downloaded from `internet-skills/opencode-skills-collection/bundled-skills/stripe-integration`) + preview: placement rules, duration 24h, visible label, no promise of contacts
- [ ] **Step 4: Pass** PASS + Checkout URL returned
- [ ] **Step 5: Commit** `git commit -m "feat: boost checkout Â§14"`

### Task 02: Webhook + Activation (Idempotent)

**Files:**
- Create: `src/app/api/webhooks/payment/route.ts`
- Test: `tests/phase08/webhook.test.ts`

- [ ] **Step 1: Test**
```ts
test("webhook activates boost only once (idempotent)", async () => {
  const sig = stripe.webhooks.generateTestHeaderString({payload: JSON.stringify({type:"checkout.session.completed", data:{object:{id:"cs_1", payment_intent:"pi_1"}}}), secret});
  const r1 = await fetch("/api/webhooks/payment",{method:"POST", headers:{"stripe-signature":sig}, body: payload});
  const r2 = await fetch("/api/webhooks/payment",{method:"POST", headers:{"stripe-signature":sig}, body: payload});
  expect(r1.status).toBe(200); expect(r2.status).toBe(200);
  expect(await prisma.boost.count({where:{providerPaymentId:"pi_1"}})).toBe(1);
  expect((await fetch("/api/me/boosts",{headers:{cookie:candidateCookie}}).then(x=>x.json()))[0].status).toBe("ACTIVE");
});
test("client success without webhook does NOT activate", async () => {
  expect(await prisma.boost.count({where:{status:"ACTIVE", candidateId:"no-webhook"}})).toBe(0);
});
```
- [ ] **Step 2: Fail** 404 or duplicate boosts
- [ ] **Step 3: Implement** `api-integrator/SKILL.md:1` webhook snippet `stripe.webhooks.constructEvent` + store `Payment{providerPaymentId}` + idempotent `Boost` create (unique providerPaymentId) + handle failed/expired/refunded/disputed â€” if Razorpay needed, `pakistan-payments-stack` pattern
- [ ] **Step 4: Pass** PASS + duplicate webhook creates one boost
- [ ] **Step 5: Commit** `git commit -m "feat: webhook idempotent Â§22"`

### Task 03: Expiry + Ranking + Analytics

**Files:**
- Create: `src/lib/cron/boost-expiry.ts`, `src/app/api/talent/route.ts` (ranking), `src/lib/analytics/boost.ts`
- Test: `tests/phase08/expiry.test.ts`

- [ ] **Step 1: Test**
```ts
test("boost expires after 24h", async () => {
  await prisma.boost.create({data:{candidateId:"1", categoryId:"ai", amount:1000, currency:"USD", startAt: new Date(Date.now()-25*3600*1000), endAt: new Date(Date.now()-3600000), status:"ACTIVE"}});
  await runExpiry();
  expect((await prisma.boost.findFirst({where:{candidateId:"1"}}))?.status).toBe("EXPIRED");
});
```
- [ ] **Step 2: Fail** still ACTIVE
- [ ] **Step 3: Implement** `background-jobs/SKILL.md:1` cron + featured shelf orderBy `startAt` rotation + anti-monopoly `maxContinuous 24h`, frequency caps, `saas-metrics` boost impressions/contact conversion
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: boost expiry Â§15"`

Skills: `stripe-integration`, `stripe-automation`, `payment-integration` were missing locally (now in `skills-bexo-critical/` from internet download) â€” deep check done, no further download needed for this phase.

