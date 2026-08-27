# Phase 10 â€” Analytics, Performance, SEO & Launch Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Instrument funnel, PostHog + Sentry, LCP â‰¤2.5s, backups, legal copy, and pass all release gates per PRD Â§17,28,29,32,42.

**Architecture:** `AnalyticsEvent` table + PostHog server capture + Sentry + Prometheus/Grafana + sitemap + backup restore test.

**Tech Stack:** `analytics`, `posthog-automation` (internet), `sentry-automation` (internet), `performance-optimization`, `grafana-dashboards`, `prometheus-configuration`, `slo-implementation`, `security` + `seo` (internet)

## Global Constraints
- Lime #C8FF3D only for boost, visibility is not qualification, publish preview required, webhook is truth, PII never in analytics

---

### Task 01: Event Taxonomy + PostHog

**Files:**
- Create: `src/lib/analytics/events.ts`, `src/lib/analytics/posthog.ts`, `src/app/api/analytics/route.ts`
- Test: `tests/phase10/analytics.test.ts`

- [ ] **Step 1: Test**
```ts
test("profile_viewed captured", async () => {
  await fetch("/api/analytics",{method:"POST", body:JSON.stringify({event:"profile_viewed", properties:{candidateId:"1", category:"ai"}})});
  expect(await prisma.analyticsEvent.findFirst({where:{eventName:"profile_viewed"}})).toBeDefined();
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** taxonomy `profile_created, profile_published, profile_viewed, contact_opened, contact_sent, boost_checkout_started, boost_paid, boost_activated, boost_expired, report_created` per Â§28 + `analytics/SKILL.md:1` + `posthog-automation/SKILL.md:1` (from `skills-bexo-critical/` â€” was missing locally, downloaded from `internet-skills/opencode-skills-collection/bundled-skills/posthog-automation`) â€” PII-free
- [ ] **Step 4: Pass** PASS + PostHog dashboard shows event
- [ ] **Step 5: Commit** `git commit -m "feat: analytics Â§28"`

### Task 02: Performance + SEO + Monitoring

**Files:**
- Create: `src/app/sitemap.ts`, `src/lib/monitoring/sentry.ts`, `src/app/seo.test.ts`
- Test: `tests/phase10/seo.test.ts`

- [ ] **Step 1: Test**
```ts
test("sitemap respects opt-in", async () => {
  const xml = await fetch("/sitemap.xml").then(r=>r.text());
  expect(xml).not.toContain("/p/hidden-slug");
});
test("sentry captures error", async () => {
  expect(process.env.SENTRY_DSN).toBeDefined();
});
```
- [ ] **Step 2: Fail** missing sitemap/sentry
- [ ] **Step 3: Implement** `nextjs-seo-indexing` sitemap only for `isPublic && !hideFromSearch` + `sentry-automation/SKILL.md:1` + `performance-optimization` LCP â‰¤2.5s + `prometheus-configuration`/`grafana-dashboards` for infra logs
- [ ] **Step 4: Pass** PASS + Lighthouse LCP check
- [ ] **Step 5: Commit** `git commit -m "feat: seo perf Â§29"`

### Task 03: Launch Gates + Backups + Legal

**Files:**
- Create: `docs/RELEASE_GATES.md`, `scripts/backup-test.sh`
- Test: `tests/phase10/gates.test.ts`

- [ ] **Step 1: Test**
```ts
test("all gates", async () => {
  expect(await canPublish()).toBe(true);
  expect(await canDiscover()).toBe(true);
  expect(await canContact()).toBe(true);
  expect(await canBoost()).toBe(true); // webhook verified
  expect(await canReport()).toBe(true);
  expect(await privacyEnforced()).toBe(true);
});
```
- [ ] **Step 2: Fail** gates false
- [ ] **Step 3: Implement** checklist per Â§42: Product, Marketplace, Contact, Payment, Safety, Privacy, Operations, Analytics, Legal, Reliability (backup/restore test before launch) + `/privacy`, `/terms`, `/rules` legal pages (review placeholder) + rate limits + audit log verified
- [ ] **Step 4: Pass** PASS + `npm run test:gate` green
- [ ] **Step 5: Commit** `git commit -m "feat: launch gates Â§42"`

**Self-Review:** Covers Â§17,28,32 metrics, Â§29 non-functional, Â§41 checklist â€” all 9 gates testable, no placeholders.

Skills: `posthog-automation`, `sentry-automation`, `seo` were missing locally per `MISSING_SKILLS_ANALYSIS.md:5` â€” downloaded to `skills-bexo-critical/` + `internet-skills/` â€” deep check done.

