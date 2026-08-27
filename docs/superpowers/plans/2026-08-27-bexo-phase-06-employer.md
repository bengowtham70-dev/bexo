# Phase 06 â€” Employer Experience & Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Employer can register, verify work email, browse talent, save lists per PRD Â§6,18,19,27.

**Architecture:** Employer dashboard + `EmployerProfile` + email verification token + domain check + saved candidates + private notes (not exposed).

**Tech Stack:** `authentication-patterns`, `verification-before-completion`, `admin-panel`, `tables-advanced`, `mailtrap-sending-emails` (internet)

## Global Constraints
- Lime #C8FF3D only for boost, visibility is not qualification, publish preview required, webhook is truth, PII never in analytics

---

### Task 01: Employer Account + Email Verification

**Files:**
- Create: `src/app/(employer)/employer/page.tsx`, `src/app/api/employer/profile/route.ts`, `src/lib/verify-email.ts`
- Test: `tests/phase06/employer.test.ts`

- [ ] **Step 1: Test**
```ts
test("employer signup needs work email verify", async () => {
  const r = await fetch("/api/employer/profile",{method:"POST", headers:{cookie:employerCookie}, body:JSON.stringify({company:"Acme", website:"https://acme.ai", workEmail:"a@acme.ai"})});
  expect((await r.json()).verificationStatus).toBe("PENDING");
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `verify-email.ts` token + `mailtrap-sending-emails/SKILL.md:1` (from `skills-bexo-critical`) + domain check `acme.ai` vs website + `verificationStatus` enum â€” local `authentication-patterns` covers base
- [ ] **Step 4: Pass** PASS + badge shows `Email verified`
- [ ] **Step 5: Commit** `git commit -m "feat: employer verify Â§19"`

### Task 02: Talent Search for Employer + Save

**Files:**
- Create: `src/app/(employer)/employer/talent/page.tsx`, `src/app/api/employer/saved/route.ts`
- Test: `tests/phase06/saved.test.ts`

- [ ] **Step 1: Test**
```ts
test("save candidate", async () => {
  const r = await fetch("/api/employer/saved",{method:"POST", headers:{cookie:employerCookie}, body:JSON.stringify({candidateId:"1"})});
  expect(r.status).toBe(201);
  expect(await fetch("/api/employer/saved",{headers:{cookie:employerCookie}}).then(x=>x.json())).toContainEqual(expect.objectContaining({candidateId:"1"}));
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `EmployerSaved` table + private notes field (never exposed to candidate API) + `tables-advanced/SKILL.md:1` list UI
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: saved Â§18"`

Skills: `mailtrap-sending-emails` was missing locally (now in `skills-bexo-critical/` from `internet-skills/opencode-skills-collection/bundled-skills/mailtrap-sending-emails`), no new download needed.

