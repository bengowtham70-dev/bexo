# AGENTS.md — BEXO

This file is read by every coding agent (Claude Code, Cursor, OpenCode) before any edit. Follow it strictly. No vibe-coded output.

## 1. Design — No Slop (use taste + every UI skill)

**Reading this as:** talent marketplace for founders/recruiters scanning fast, brutalist-data language, leaning toward Tailwind v4 + Geist + Zinc + single lime accent. Dials `DESIGN_VARIANCE 6 / MOTION 4 / DENSITY 8` per `design-taste-frontend/SKILL.md:1`.

**Required skills for any UI work — in order:**
1. `design-taste-frontend` — anti-slop, brief inference, dials, pre-flight checks (eyebrow restraint, hero 20-word cap, etc.)
2. `design-system-builder` — tokens are sole source of truth — use `design-system-bexo/design-tokens.json:1` + `design-system.css:1` — never raw hex, never Inter, never AI purple.
3. `ui-ux-designer` — user flows, a11y, component docs
4. `tailwind-theme-builder` + `tailwind-v4-shadcn` — `@theme inline` CSS vars
5. `shadcn-ui-patterns` / `shadcn` — own the code, never ship default state
6. `visual-design-foundations` + `interaction-design` + `responsive-design` — hierarchy, motion, breakpoints

**Logo:** `public/logo.svg:1` — BEXO wordmark (open-design.ai vibe: geometric sans, lime dot for money). Generated via `open-design.ai` workflow: brief → DESIGN.md → `design-tokens.json` → `public/logo.svg`. No custom SVG logos without skill.

**Ban:** Inter default, AI purple glows, beige craft `#f5f1ea`, glassmorphism on dashboards, centered hero when variance>4, mixed radius, wrapped CTA, duplicate intent.

## 2. Planning — Skill for Everything

- Any multi-step work → `writing-plans/SKILL.md:1` (header `For agentic workers: REQUIRED SUB-SKILL: subagent-driven-development`, Global Constraints, exact paths, TDD steps, no placeholders).
- Before plan → `brainstorming/SKILL.md:1` if scope unclear.
- If skill missing locally → **download from internet**: check `internet-skills/` (3929 SKILL.md) or `opencode-skills-collection/bundled-skills/` (2011) — e.g., `stripe-integration`, `nextjs-seo-indexing`, `gdpr-data-handling` already in `skills-bexo-critical/` per `INTERNET_SKILLS_INVENTORY.md:1`. Copy to `skills/` and reference.

## 3. Verification — Deep Check Both Spec + Code (no shortcuts)

**Before any completion claim → `verification-before-completion/SKILL.md:1` Iron Law:**

1. IDENTIFY what proves it (test, build, lint, checklist)
2. RUN full command fresh
3. READ output + exit code
4. VERIFY — only then claim

**For plans:** `writing-plans:144` self-review (spec coverage, placeholder scan, type consistency) + `VERIFICATION_REPORT.md:1`

**For code:** `systematic-debugging/SKILL.md:1` 4 phases if bug, `tdd-workflows`, `unit-testing`, `performance-optimization` — `npm test`, `npm run build`, Lighthouse LCP ≤2.5s, WCAG AA 4.5:1.

**Internal (spec) + external (code) both must pass.** No “should work”.

## 4. Execution

Plans live at `docs/superpowers/plans/2026-08-27-bexo-*.md:1` (canonical) mirrored to `plans/phase-0*/PLAN.md:1`. Next: `plans/phase-01/PLAN.md` (Foundation). Use `subagent-driven-development` per task — fresh subagent, review between tasks.

## 5. Files to Read First
- `design-system-bexo/design-tokens.json` + `design-system.css` + `design-system.md` + `design-system-preview.html`
- `public/logo.svg`
- `docs/superpowers/plans/2026-08-27-bexo-talent-marketplace.md`
- `BEXO_PRD_Complete_Verified.pdf`

Do it correctly — skill for everything.
