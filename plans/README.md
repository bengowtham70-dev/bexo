# BEXO — 10 Phase Plan Index

**PRD:** `BEXO_PRD_Complete_Verified.pdf:1` v1.0 27 Aug 2026 — 45 sections, marketplace $10 boost
**Skills used:** `writing-plans/SKILL.md:1` (header, TDD, no placeholders) + `brainstorming` decomposition. All required skills checked per phase — missing ones already downloaded to `internet-skills/` (3929 SKILL.md) and `skills-bexo-critical/` (14) — see `INTERNET_SKILLS_INVENTORY.md:1` and `MISSING_SKILLS_ANALYSIS.md:1`.
**Deep check:** Every PRD § mapped, placeholders scanned, types consistent across phases (`Boost` schema shared).

## Where are the plans?
- **Canonical per `writing-plans:18`:** `C:\Users\vasan\Music\JOBO\docs\superpowers\plans\2026-08-27-bexo-talent-marketplace.md:1` (master) + `2026-08-27-bexo-phase-0*.md` (10 phases)
- **Your requested folders:** `C:\Users\vasan\Music\JOBO\plans\00-master-PLAN.md` + `plans/phase-01/PLAN.md` … `phase-10/PLAN.md` (copies, same content)

## 10 Phases — Execution Order (each produces working software)

| # | Folder | Plan File | PRD § | Goal | Key Skills | Deliverable |
|---|---|---|---|---|---|---|
| 01 | `plans/phase-01/` | `PLAN.md` | §6,25,40,41 | Foundation + tokens | `project-scaffolding`, `tailwind-theme-builder`, `shadcn` | `npm run dev` + Lime #C8FF3D live |
| 02 | `plans/phase-02/` | `PLAN.md` | §6,24,27 | Auth + RBAC 18+ | `auth-implementation-patterns`, `loom-rate-limiting` | Protected dashboard |
| 03 | `plans/phase-03/` | `PLAN.md` | §8,11,31 | Profile CRUD + publish | `forms`, `shadcn-ui-patterns` | Shareable `/p/[slug]` |
| 04 | `plans/phase-04/` | `PLAN.md` | §9,10 | Resume AI + links | `pdf`, `docx`, `llm-integration`, `api-integrator` | Human-reviewed draft |
| 05 | `plans/phase-05/` | `PLAN.md` | §7,13,29 | Public + discovery + search | `postgres`, `nextjs-seo-indexing` (internet) | Browse with FTS |
| 06 | `plans/phase-06/` | `PLAN.md` | §18,19 | Employer + verify | `mailtrap-sending-emails` (internet) | Verified badge |
| 07 | `plans/phase-07/` | `PLAN.md` | §12,20 | Contact + privacy/GDPR | `gdpr-data-handling`, `email-systems` (internet) | Email hidden, block works |
| 08 | `plans/phase-08/` | `PLAN.md` | §14-16,22 | Boost + payments | `stripe-integration`, `payment-integration` (internet) | Webhook-activated boost |
| 09 | `plans/phase-09/` | `PLAN.md` | §21 | Moderation + admin | `admin-panel`, `security-compliance` | Report → suspend |
| 10 | `plans/phase-10/` | `PLAN.md` | §17,28,42 | Analytics + launch gates | `posthog-automation`, `sentry-automation` (internet) | Launch-ready |

## How to Execute (per `writing-plans:160`)
1. **Subagent-Driven (recommended):** Use `superpowers:subagent-driven-development` — fresh subagent per task, review between tasks
2. **Inline:** Use `superpowers:executing-plans` — batch with checkpoints

All 10 phases saved with exact file paths, interfaces, TDD steps (write fail → implement → pass → commit), no `TBD`/`TODO`.

## Next
Pick approach above and start Phase 01: `plans/phase-01/PLAN.md`
