# Phase 09 â€” Trust, Safety, Moderation & Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Report â†’ queue â†’ human review â†’ warn/hide/suspend + admin ops for users/boosts/payments per PRD Â§21,26,27.

**Architecture:** Report button on every profile/conversation â†’ `Report` table â†’ admin queue â†’ RBAC actions â†’ `AuditLog` â†’ appeal.

**Tech Stack:** `admin-panel`, `tables-advanced`, `dashboard-design`, `saas-console-design`, `security-compliance`, `loom-logging-observability`

## Global Constraints
- Lime #C8FF3D only for boost, visibility is not qualification, publish preview required, webhook is truth, PII never in analytics

---

### Task 01: Reporting + Moderation Queue

**Files:**
- Create: `src/app/api/reports/route.ts`, `src/app/(admin)/admin/reports/page.tsx`, `src/components/report/report-button.tsx`
- Test: `tests/phase09/report.test.ts`

- [ ] **Step 1: Test**
```ts
test("report creates queue item", async () => {
  const r = await fetch("/api/reports",{method:"POST", headers:{cookie:candidateCookie}, body:JSON.stringify({targetType:"PROFILE", targetId:"1", reason:"FAKE_CREDENTIALS"})});
  expect(r.status).toBe(201);
  expect((await fetch("/api/admin/reports",{headers:{cookie:adminCookie}}).then(x=>x.json())).length).toBe(1);
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `Report{reporterId, targetType, targetId, reason, status}` + `admin-panel/SKILL.md:1` queue UI + reasons: impersonation, fake credentials, stolen resume, scam, harassment per Â§21
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: reports Â§21"`

### Task 02: Admin Actions + Audit Log

**Files:**
- Create: `src/app/api/admin/users/[id]/route.ts`, `src/lib/audit.ts`, `src/app/(admin)/admin/users/page.tsx`, `src/app/(admin)/admin/boosts/page.tsx`
- Test: `tests/phase09/admin.test.ts`

- [ ] **Step 1: Test**
```ts
test("admin can suspend user and audit logged", async () => {
  const r = await fetch("/api/admin/users/1",{method:"PATCH", headers:{cookie:adminCookie}, body:JSON.stringify({status:"SUSPENDED"})});
  expect(r.status).toBe(200);
  expect(await prisma.auditLog.findFirst({where:{action:"USER_SUSPEND"}})).toBeDefined();
});
```
- [ ] **Step 2: Fail** 403
- [ ] **Step 3: Implement** RBAC `ADMIN` only + actions warn/hide/suspend/remove + pause suspicious boosts + `AuditLog{actorId, action, target, metadata}` + `suspend` hides profile within SLA
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: admin Â§21"`

### Task 03: Safety Copy + Anti-Scam

**Files:**
- Modify: `src/app/(public)/how-it-works/page.tsx`, `src/app/(public)/safety/page.tsx`
- Test: `tests/phase09/safety.test.ts`

- [ ] **Step 1: Test**
```ts
test("safety page FTC warning", async () => {
  const html = await fetch("/safety").then(r=>r.text());
  expect(html).toContain("never pay an employer to get a job");
});
```
- [ ] **Step 2: Fail** missing copy
- [ ] **Step 3: Implement** copy per Â§39, Â§21: â€œYou pay BEXO for visibility â€” never pay an employerâ€ + boost explanation â€œplacement, not qualificationsâ€
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: safety copy Â§21"`

Skills: All present locally (`admin-panel`, `security-compliance`) â€” no download needed. Deep check: every profile has report action, private email never in API payload.

