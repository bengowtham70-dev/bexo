# BEXO PRD vs Available Skills — Gap Analysis
**Date:** 2026-08-27
**PRD:** `BEXO_PRD_Complete_Verified.pdf:1` (v1.0, 27 Aug 2026)
**Project:** `C:\Users\vasan\Music\JOBO\`
**Local skills scanned:** `.agents` 252 SKILL.md / `.claude` 231 SKILL.md — merged unique 244 names — stored in `C:\Users\vasan\Music\JOBO\.agents\skills` and `C:\Users\vasan\Music\JOBO\.claude\skills` and unified `C:\Users\vasan\Music\JOBO\skills`

## 1. Method
Read entire PRD (45 sections + Appendix). Enumerated every MVP P0/P1 requirement (Sections 6, 25-31, 38, 41-42). Grepped local `SKILL.md` descriptions for keywords: `stripe|razorpay|payment|checkout`, `resume|pdf parsing`, `email|sendgrid`, `search|vector|pgvector`, `moderation|report`, `gdpr|privacy`, `s3|storage`, `posthog|sentry`, `seo`, `next.js|tailwind`. Verified via `C:\Users\vasan\Music\JOBO\.agents\skills\*\SKILL.md:1`.

## 2. Summary Counts
- **Covered (direct skill, ready): 14 domains**
- **Partial (generic skill exists, needs BEXO-specific composition): 9 domains**
- **Missing (no dedicated skill — must build custom or install external): 7 domains**
- **Irrelevant (present but not needed for BEXO): ~140 skills** (e.g., `blender-modeler`, `anime-style`, `threejs*`, `godot-4-desktop-app`, `character-artist`, `comic-book-style`)

## 3. Covered — Use As-Is

| PRD Section | Need | Local Skill(s) | Path |
|---|---|---|---|
| 6,7,8,25 | Next.js + TypeScript modular monolith | `frontend-excellence`, `react-patterns`, `react-best-practices`, `project-scaffolding` | `.agents/skills/frontend-excellence/SKILL.md:1` |
| 6,40 | Tailwind + design tokens (Ink #111318, Lime #C8FF3D, Violet #7C5CFC) | `tailwind-theme-builder`, `tailwind-v4-shadcn`, `design-system-builder`, `design-system-patterns` | `.agents/skills/tailwind-theme-builder/SKILL.md:1` |
| 8,10,11 | Rich profile, forms, links, skills/projects | `forms`, `rich-text-editor`, `shadcn-ui-patterns`, `shadcn` | `.agents/skills/forms/SKILL.md:1` |
| 12 | Contact form, in-app alerts, push, digest email, webhook dispatch | `notification-system`, `websocket-realtime`, `real-time-data` | `.agents/skills/notification-system/SKILL.md:1` |
| 13,18,27 | Talent discovery: filters, browse modes, API design | `api-design-patterns`, `api-design-principles`, `infinite-scroll`, `command-palette` | `.agents/skills/api-design-patterns/SKILL.md:1` |
| 13 (V2 semantic) | Vector/hybrid search, pgvector, quantization | `hybrid-search-implementation`, `similarity-search-patterns`, `vector-index-tuning`, `embedding-strategies`, `rag-implementation` | `.agents/skills/hybrid-search-implementation/SKILL.md:1` |
| 24,19 | Auth, RBAC, OAuth, session, rate limiting | `authentication-patterns`, `auth-implementation-patterns`, `loom-rate-limiting`, `loom-error-handling` | `.agents/skills/authentication-patterns/SKILL.md:1` |
| 26,25 | Postgres data model, indexing, performance | `postgres`, `postgresql-table-design`, `supabase-postgres-best-practices`, `database-optimization`, `db-schema-designer` | `.agents/skills/postgres/SKILL.md:1` |
| 17,28,32 | Analytics events, dashboards, charts, KPI | `analytics`, `bi-dashboard-builder`, `charts`, `data-visualization`, `saas-metrics` | `.agents/skills/analytics/SKILL.md:1` |
| Admin (6,21,27) | Admin CRUD, moderation queue, data tables | `admin-panel`, `tables-advanced`, `dashboard-design`, `saas-console-design` | `.agents/skills/admin-panel/SKILL.md:1` |
| 24 | Observability, tracing, metrics | `monitoring-observability`, `distributed-tracing`, `grafana-dashboards`, `prometheus-configuration`, `slo-implementation`, `loom-logging-observability` | `.agents/skills/monitoring-observability/SKILL.md:1` |
| 25 | AWS/S3 infra, Docker, K8s, CI/CD | `aws`, `docker`, `docker-patterns`, `kubernetes`, `loom-docker`, `loom-kubernetes`, `cicd`, `terraform` | `.agents/skills/aws/SKILL.md:1` |
| 30,38 | Build order, TDD, testing | `tdd-workflows`, `test-driven-development`, `unit-testing`, `testing-strategies`, `verification-before-completion` | `.agents/skills/tdd-workflows/SKILL.md:1` |
| UI | Landing pages, pricing UI, onboarding | `landing-pages`, `pricing-pages`, `onboarding-flow`, `design-taste-frontend` | `.agents/skills/landing-pages/SKILL.md:1` |

## 4. Partial — Generic Skill Exists, BEXO Logic Must Be Composed

These have a base skill but PRD requires specific BEXO business rules that are NOT in the skill.

| PRD Section | Need | Base Skill | Gap to Close |
|---|---|---|---|
| 9 Resume Import | PDF/DOCX upload + AI extraction + human-in-loop review, no fabrication | `pdf` (`pdf/SKILL.md:1`), `docx` (`docx/SKILL.md:1`), `llm-integration`, `prompt-engineering-patterns`, `rag-implementation` | No `resume-parser` skill. `pdf`/`docx` only do file-level extract (`pypdf extract_text`), not structured field mapping (name, companies, dates, skills). Need to compose: `pdf`+`docx` → `llm-integration` with strict JSON schema + `human-in-the-loop` review step (PRD §9). Must add anti-hallucination guard (PRD: "must not invent facts"). |
| 10 External Sources | LinkedIn OAuth/API, GitHub OAuth/repo select, portfolio links | `api-integrator` (`api-integrator/SKILL.md:1` mentions `Stripe, Auth0` + webhook handler), `supabase` | `api-integrator` is generic REST/GraphQL+webhooks. No dedicated `linkedin-import` or `github-oauth` skill. Need to build OAuth flows, respect "no unauthorized scraping" (PRD §10), and repo-picker UI. |
| 14,15,16 Boost | $10/24h featured shelf, transparent rotation, expiry, anti-monopoly caps | `pricing-pages`, `saas-metrics`, `feature-flags`, `background-jobs` (for expiry), `state-management` | No `boost-engine` / `paid-visibility` skill. Must implement: featured shelf ranking, `start_at/end_at`, cron expiry, frequency caps, idempotent webhook activation (PRD §22). `background-jobs` covers queue but not BEXO rules. |
| 18,19 Employer Verification | Work email + domain verification, verification badges | `authentication-patterns`, `verification-before-completion` | No `employer-verification` skill. Need to compose email verification + domain check + manual review for `verification_status`. |
| 21 Moderation/Reporting | Report profile/message → queue → human review → warn/hide/suspend + audit log | `admin-panel`, `security-compliance` | No `content-moderation` skill. Generic admin CRUD exists but not report reason taxonomy, evidence capture, appeal workflow, audit log schema (PRD §21, §26 `Report`, `AuditLog`). |
| 25 File Storage | S3-compatible, signed/private resume URLs, malware scan | `aws` (`aws/SKILL.md:1`), `supabase` (Storage) | `aws` covers infra but not S3 presigned URL pattern + resume visibility (private by default) + scan limits (PRD §41). Need to wire. |
| 25 Search (MVP) | Postgres full-text for talent search (filters: role, skills, location, remote, availability, etc.) | `postgres`, `database-optimization` | `hybrid-search-implementation` is vector-focused; MVP needs plain Postgres FTS + GIN indexes + `tsvector` ranking (PRD §25). Partial — need to implement FTS manually, vector skill is for V2. |
| 24 Security | Signed URLs, encryption at rest, CSRF/XSS/SQLi, webhook signature verification | `security`, `security-compliance` | Templates exist but PRD §24 checklist (CSRF, webhook `stripe-signature` verification as in `api-integrator/SKILL.md` snippet) must be explicitly wired. |
| 12 Messaging V1 | Save/shortlist, block employer, report conversation | `notification-system`, `websocket-realtime` | Real-time skill gives plumbing, but PRD privacy rule "private notes not exposed to candidates" and block/report UX need custom logic. |

## 5. Missing — No Dedicated Skill (Must Build or Fetch External)

| # | PRD Section | Missing Skill | Why Critical | Recommendation |
|---|---|---|---|---|
| M1 | 22 Payments | **Dedicated Stripe/Razorpay skill** with hosted Checkout, server-side session, webhook as source-of-truth, idempotent processing, `provider_payment_id` storage, failed/expired/refunded/disputed handling, refund policy, tax/invoicing | PRD §22 explicitly: `Never grant boost solely on client-side success URL`. `api-integrator` only has a 5-line Stripe webhook snippet — no Checkout Session, no idempotency key, no Razorpay flow, no tax config, no chargeback handling. MVP cannot launch without this. | Install `stripe-payments` / `razorpay` skill from registry, or build: `POST /me/boost/checkout` (server creates session) → `POST /webhooks/payment` (verify signature, idempotent) → activate `Boost`. Add test harness for duplicate webhook (PRD §31). |
| M2 | 22,23 Tax & Invoicing | **Tax calculation skill** (advertising/digital services, jurisdiction-aware GST/VAT, invoice generation) | PRD §22: "Do not assume single tax rate globally". No skill covers tax. | Add `stripe-tax` or `tax-invoicing` skill; configure per launch market (Stripe Tax / Razorpay GST). |
| M3 | 17,22 Transactional Email | **Transactional email provider skill** (Postmark/Sendgrid/Resend) for contact relay, boost receipts, verification, moderation notices | `notification-system` covers channel abstraction + digest, `background-jobs` covers email queue, but no provider-specific skill with email relay (hide candidate email), deliverability, bounce handling. PRD §12: contact via relay, not exposed email. | Add `email-transactional` skill (Resend/Postmark). Wire `background-jobs` email queue → provider. |
| M4 | 17,28 PostHog/Sentry | **PostHog analytics + Sentry error monitoring provider skills** | PRD §25 recommends `PostHog` + `Sentry`. `analytics` skill is Plausible/Fathom/Umami + server-side middleware (good for privacy) but no PostHog SDK, feature flags, or Sentry DSN/source-maps. `monitoring-observability` is generic OTEL. | Add `posthog` and `sentry` skills, or configure via `analytics` + `monitoring-observability` with provider docs. |
| M5 | 20 GDPR/DPDP, DSAR, Data Export/Delete, Hide-from-search, Anonymous mode | **Privacy-compliance skill** (GDPR rights, lawful basis, DSAR workflow, export/delete, `hide from search engines` noindex, block employer) | `security-compliance` covers SOC2/HIPAA/GDPR checklist at high level, not DSAR flow, `DELETE /me` + export, `robots` noindex per profile visibility, `anonymous mode` V2. PRD §23 checklist is launch-blocking. | Add `gdpr-privacy` / `data-deletion` skill; build DSAR endpoints, `CandidateProfile.visibility` enforcement, `X-Robots-Tag`. |
| M6 | 29 SEO | **SEO skill** (indexable public profiles only when opted-in, unique metadata, sitemap, `og:` tags, performance LCP ≤2.5s) | No `seo` skill in local store. PRD §29: SEO is index-controlled. | Add `nextjs-seo` skill (next-seo, sitemap, metadata). Combine with `performance-optimization` for LCP. |
| M7 | 24,41 Malware & Limits | **File scan + upload limits skill** (resume PDF/DOCX size limits, ClamAV/malware scan, signed URL expiry) | PRD §41 checklist: "Resume upload limits and malware scanning". No skill. | Add `file-upload-security` skill (clamAV, S3 presigned URL). |

**Near-missing (consider adding):**
- `rate-limiting` exists (`loom-rate-limiting`) — but needs Contact-form-specific limit (PRD §31: contact form rate limited).
- `accessibility-compliance` skill **does exist** at `C:\Users\vasan\.agents\skills\accessibility-compliance\SKILL.md:1` (seen in earlier `ls` but not in `244` unique due to nesting) — covers WCAG for §29, so not missing, just under-used.
- `legal-docs` (Terms/Privacy) — no skill; PRD §6 marks `/privacy`, `/terms` as "legal review" — needs lawyer, not just skill.

## 6. What to Do Next (Build Order per PRD §38)

1. **Install missing provider skills** (M1-M7) into project before Phase 1 (candidates 1-2 days): `stripe`/`razorpay`, `email-transactional`, `posthog`, `sentry`, `seo`, `privacy-gdpr`. Use skill registry (`find-skills` skill at `C:\Users\vasan\Music\JOBO\.agents\skills\find-skills\SKILL.md:1`).
2. **Compose partials:** wire `pdf`+`docx`+`llm-integration` → resume extraction service with JSON schema + review UI (`C:\Users\vasan\Music\JOBO\.agents\skills\pdf\SKILL.md` + `docx` + `llm-integration`).
3. **Build BEXO-specific engines** not covered by any skill: `BoostEngine` (featured shelf, expiry cron via `background-jobs`), `ModerationQueue`, `EmployerVerification`, `Search` (Postgres FTS GIN index).
4. Keep irrelevant skills out of build context to reduce prompt noise — load only the ~30 relevant skills listed in §§3-4 per task.

## 7. Verification
- Local store re-verified: `.agents/skills` 252 SKILL.md, `.claude/skills` 231 SKILL.md, `.agents` superset, unified `skills/` 252 SKILL.md — all present in `C:\Users\vasan\Music\JOBO\`.
- Grep confirmations: `stripe` only in `api-integrator/SKILL.md` snippet, no dedicated payment skill; `resume` only in `pdf`/`docx` file-level docs; `posthog`/`sentry` not found in any `SKILL.md` description.

---
*Teams should treat M1 (Payments) and M5 (Privacy) as launch gates per PRD §42 — no boost activation or public profile without them.*
