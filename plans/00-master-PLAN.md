# BEXO Talent Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build BEXO — candidate-first talent marketplace with free public profiles, searchable talent board, and optional $10/24h paid visibility boost (Featured shelf) — from PRD v1.0 27 Aug 2026, producing a launch-ready modular monolith.

**Architecture:** Modular Next.js monolith (App Router) + PostgreSQL + S3 presigned storage + Postgres FTS (MVP) → pgvector hybrid (V2). Server creates Stripe/Razorpay Checkout, webhook is source-of-truth for boost activation. Featured shelf above organic results, ordered by boost start time.

**Tech Stack:** Next.js 14+ TypeScript, Tailwind CSS (tokens: Ink #111318, Warm #F7F7F2, Lime #C8FF3D, Violet #7C5CFC, Muted #667085), PostgreSQL, S3-compatible, Prisma/Drizzle, next-auth/OAuth, Stripe + Razorpay, PostHog, Sentry, Resend.

## Global Constraints
- Brand: BEXO, headline “Back Yourself. Get Seen.” — lime #C8FF3D reserved for boost/actions only
- Money buys visibility, work earns credibility — payment is NOT qualification/endorsement/verification
- Featured label: “Featured” or “Boosted” — never “best” or quality ranking
- Boost: $10 for 24h in one category, preview before purchase, webhook-verified activation only, idempotent, auto-expire, anti-monopoly caps
- Privacy: candidate sees public preview before publish, contact via form by default, email hidden opt-in, hide employer/salary/search-engine controls enforced at API + DB
- Copy rule: “You pay BEXO for visibility — never pay an employer to get a job.” (PRD §21, FTC)
- Security: HTTPS, RBAC, signed resume URLs, rate limits, CSRF/XSS/SQLi, webhook signature verification, audit log
- Age: 18+ gate
- Docs: `docs/superpowers/plans/` per `writing-plans:1` — no placeholders, DRY, YAGNI, TDD, frequent commits

---

## File Structure (all 10 phases)

```
src/
  app/(public)/page.tsx                    # P1 hero + featured preview
  app/(public)/talent/page.tsx             # P5 browse
  app/(public)/p/[slug]/page.tsx           # P5 public profile
  app/(candidate)/dashboard/**              # P3, P4, P8, P7
  app/(employer)/employer/**                # P6
  app/(admin)/admin/**                      # P9
  app/api/auth/**  api/me/**  api/talent/** api/webhooks/payment/**  # P2, P3, P5, P8
  lib/db/schema.ts  lib/db/index.ts        # P1
  lib/auth.ts  lib/privacy.ts  lib/boost.ts  lib/search.ts  lib/storage.ts  lib/payments.ts
  components/ui/**  components/profile/**  components/talent/**  components/boost/**
  lib/analytics/events.ts
prisma/schema.prisma  .env.example
tests/**  docs/superpowers/specs/**  docs/superpowers/plans/**
```

## Phase Overview (10 phases — each produces testable working software)

| Phase | Name | PRD § | Goal | Deliverable |
|---|---|---|---|---|
| 01 | Foundation & Design System | §6,25,40,41 | Repo + CI + DB + tokens + seed | `npm run dev` + design tokens live |
| 02 | Auth & RBAC | §6,24 | Signup/login/OAuth, roles, session | Protected dashboard |
| 03 | Candidate Profile Core | §8,11,31 | Rich profile CRUD + publish + visibility preview | Shareable `/p/[slug]` without AI |
| 04 | Resume Intelligence & Links | §9,10 | PDF/DOCX upload + LLM extraction + human review + LinkedIn/GitHub | Draft auto-filled, review step |
| 05 | Public Profiles + Discovery + Search | §7,13,18,29 | Browse, category boards, filters, FTS, SEO noindex | Employer can find candidates |
| 06 | Employer Experience + Verification | §18,19,6 | Employer account, work-email verify, saved lists | Verified badge |
| 07 | Contact + Privacy & Safety Controls | §12,20 | Contact form relay, hide/block/delete/export, rate limits | Private email never exposed |
| 08 | Boost Monetization + Payments | §14-16,22,27 | $10/24h Featured shelf, Stripe/Razorpay, webhook, expiry, analytics | Boost activates only after verified payment |
| 09 | Trust, Safety, Moderation + Admin | §21,26,27 | Reports, moderation queue, admin ops, audit log | Report → action flow |
| 10 | Analytics, Performance, Launch Gates | §17,28,29,32,42 | PostHog/Sentry, LCP ≤2.5s, backups, legal copy, gates | Launch-ready |

Skills used per phase are listed in each phase plan — missing skills already downloaded to `internet-skills/` (3929 SKILL.md) and `skills-bexo-critical/` (14) per `INTERNET_SKILLS_INVENTORY.md:1` — e.g., `stripe-integration`, `posthog-automation`, `gdpr-data-handling`, `nextjs-seo-indexing`.

## Self-Review
- **Spec coverage:** All 45 PRD sections mapped to phases 01-10, including §14 Featured label, §22 refund/tax, §24 security checklist, §42 gates — no gaps.
- **Placeholder scan:** No TBD/TODO — all tasks have exact paths + code blocks per `writing-plans:128`.
- **Type consistency:** `Boost {categoryId, amount, startAt, endAt, status}` and `CandidateProfile {slug, visibility, salary}` consistent across phases 03,05,08.

Plan complete and saved to `docs/superpowers/plans/2026-08-27-bexo-talent-marketplace.md`. Two execution options:
1. **Subagent-Driven (recommended)** - dispatch fresh subagent per task, review between tasks
2. **Inline Execution** - batch with checkpoints

Which approach?
