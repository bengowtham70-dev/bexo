# BEXO Release Verification Gates (PRD §42)

This document establishes the mandatory production release checklist and quality gates for the **BEXO Talent Marketplace**. Every gate must be automated and passing in CI before deploying to production.

---

## 1. Product Gate: Candidate Profile Integrity
- [x] Candidate profiles enforce minimum required fields (`headline`, `location`, `bio` length ≥ 10 chars).
- [x] Slugs are validated for URL safety and uniqueness.
- [x] Work experience, education, skills, projects, and external links support full CRUD.
- [x] Resume parsing handles PDF and DOCX uploads under 5MB without AI fabrication.

## 2. Marketplace Gate: Search & Discovery Engine
- [x] Multi-field full text search across headline, bio, location, skills, and projects.
- [x] Featured shelf highlights active boosted profiles with `Lime #C8FF3D` badges above organic results.
- [x] Remote filter and category-chip navigation synchronize dynamically with URL parameters.
- [x] Pagination guarantees consistent, deterministic candidate ordering.

## 3. Employer Gate: 4-Signal Verification
- [x] Domain verification rejects free webmail providers (`gmail.com`, `yahoo.com`, `outlook.com`).
- [x] Single-use SHA-256 tokens expire after 24 hours.
- [x] Verified employer status unlocks candidate shortlists and private recruiter notes.
- [x] Rate limits enforce 10 messages/day for unverified employers and 50 messages/day for verified employers.

## 4. Contact & Security Gate: Anti-Phishing Email Relay
- [x] Candidate raw email and phone are completely hidden by default.
- [x] Anti-phishing regex interceptor blocks advance-fee scams, telegram handles, and crypto payment demands.
- [x] Contact relay masks sender and recipient headers while tracking outbound delivery.

## 5. Monetization Gate: Boost Monetization & Stripe Payments
- [x] Boost checkout generates Stripe sessions at $10.00 USD.
- [x] Anti-monopoly rules cap category boost capacity at 5 candidates simultaneously.
- [x] Webhook processing idempotently activates 24-hour boost windows with provider payment IDs.
- [x] Automated expiry cron transitions outdated boosts from `ACTIVE` to `EXPIRED`.

## 6. Privacy & Compliance Gate: GDPR & Right to be Forgotten
- [x] Granular privacy controls toggle profile visibility (`PUBLIC`, `PRIVATE`, `HIDDEN`).
- [x] GDPR data export endpoint (`GET /api/me/export`) delivers a structured JSON archive of all candidate data.
- [x] GDPR deletion endpoint (`POST /api/me/delete`) permanently cascades erasure of account and profile data.

## 7. Trust & Safety Gate: Reporting & Moderation
- [x] User reporting endpoint (`POST /api/reports`) validates PRD §20 categories with a 5 reports/hour rate limit.
- [x] Admin moderation queue (`/admin/reports`) allows resolving, dismissing, and suspending abusive users.
- [x] Public trust pages (`/safety`, `/how-it-works`) enforce the mandatory FTC compliance clause:
  > *"You pay BEXO for visibility — never pay an employer to get a job."*

## 8. Analytics & Observability Gate: Privacy-First Telemetry
- [x] Standardized 10-event lifecycle taxonomy (`profile_created`, `profile_viewed`, `contact_sent`, `boost_activated`, etc.).
- [x] Automatic PII sanitization strips emails, phone numbers, and credentials before external dispatch.
- [x] System health monitor endpoint (`GET /api/health`) provides database latency and uptime telemetry.

## 9. Performance & SEO Gate: Core Web Vitals & Indexing
- [x] Dynamic sitemap (`src/app/sitemap.ts`) includes static routes and public candidate profiles while strictly excluding hidden or search-masked accounts.
- [x] Standard robots.txt rules direct crawlers and safeguard administrative and private dashboard routes.
- [x] Sub-second SSR page rendering across all public directory and candidate routes.

---

## 10. Automated Release Gate Verification Command

Run the complete verification suite with:
```bash
npx vitest run tests/phase10/gates.test.ts
```
Expected result: **All 9 release gates passed.**
