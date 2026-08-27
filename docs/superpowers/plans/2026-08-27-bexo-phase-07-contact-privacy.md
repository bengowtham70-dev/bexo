# Phase 07 â€” Contact & Privacy & Safety Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consent-aware contact via relay (default), privacy toggles, block, export/delete per PRD Â§12,20,31.

**Architecture:** Contact form â†’ `Conversation` + `Message` + email relay via `Resend` + rate limits + privacy enforcement at API layer + GDPR data controls.

**Tech Stack:** `notification-system`, `rate-limiting`, `gdpr-data-handling` (internet), `background-jobs`, `email-systems` (internet)

## Global Constraints
- Lime #C8FF3D only for boost, visibility is not qualification, publish preview required, webhook is truth, PII never in analytics

---

### Task 01: Contact Form + Relay + Rate Limits

**Files:**
- Create: `src/app/api/employer/contact/route.ts`, `src/lib/email-relay.ts`, `src/components/talent/contact-form.tsx`
- Test: `tests/phase07/contact.test.ts`

- [ ] **Step 1: Test**
```ts
test("contact creates message and relay, private email hidden", async () => {
  const r = await fetch("/api/employer/contact",{method:"POST", headers:{cookie:employerCookie}, body:JSON.stringify({candidateId:"1", message:"Hi Rahul, RAG role at Acme"})});
  expect(r.status).toBe(201);
  const profile = await fetch("/api/talent/rahul").then(x=>x.json());
  expect(profile.email).toBeUndefined();
});
test("blocked employer cannot contact", async () => {
  await fetch("/api/me/block",{method:"POST", headers:{cookie:candidateCookie}, body:JSON.stringify({employerId:"1"})});
  const r = await fetch("/api/employer/contact",{method:"POST", headers:{cookie:employerCookie}, body:JSON.stringify({candidateId:"1", message:"hi"})});
  expect(r.status).toBe(403);
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `email-relay.ts` via `email-systems/SKILL.md:1` (from `skills-bexo-critical`) + `Resend` + `rate-limiting` 5/min + `Conversation` creation + notification to candidate â€” email hidden unless `candidate.contactSettings.publicEmail=true`
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: contact Â§12"`

### Task 02: Privacy Controls + GDPR Export/Delete

**Files:**
- Create: `src/app/api/me/privacy/route.ts`, `src/app/api/me/export/route.ts`, `src/app/api/me/route.ts` (DELETE)
- Test: `tests/phase07/privacy.test.ts`

- [ ] **Step 1: Test**
```ts
test("export returns data, delete removes profile", async () => {
  expect((await fetch("/api/me/export",{headers:{cookie:candidateCookie}})).status).toBe(200);
  expect((await fetch("/api/me",{method:"DELETE", headers:{cookie:candidateCookie}})).status).toBe(204);
  expect((await fetch("/p/rahul")).status).toBe(404);
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `gdpr-data-handling/SKILL.md:1` (from `skills-bexo-critical` â€” was missing locally per `MISSING_SKILLS_ANALYSIS.md:5`) â€” toggles: `publicProfile, hideFromSearch, hideEmail, hidePhone, hideEmployer, hideSalary`, `blockEmployer`, `deleteAccount` + SLA unenlist, export ZIP
- [ ] **Step 4: Pass** PASS + public check
- [ ] **Step 5: Commit** `git commit -m "feat: privacy Â§20"`

Skills: `gdpr-data-handling`, `email-systems` downloaded to `skills-bexo-critical/` â€” now present.


