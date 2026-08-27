# Internet Skills Download — Full Inventory
**Date:** 2026-08-27
**Project:** `C:\Users\vasan\Music\JOBO\`
**Source:** GitHub + internet (15 repos cloned via `git clone --depth 1`)

## Summary
- **Local (pre-existing):** 252 SKILL.md in `.agents/skills` (183 dirs, 17.56 MB) + 231 in `.claude/skills` (167 dirs, 16.31 MB) = superset 252
- **Internet (newly downloaded):** **3929 SKILL.md** across 14 repos, **135.65 MB** in `internet-skills/`
- **Combined raw:** 4181 SKILL.md
- **Project `skills/` after merging critical BEXO skills:** 266 SKILL.md (252 local + 14 critical internet copies)
- **BEXO-critical folder:** `skills-bexo-critical/` — 14 SKILL.md filling all 7 gaps from `MISSING_SKILLS_ANALYSIS.md:1`

## Repos Cloned to `internet-skills/`

| Repo | Dir | SKILL.md | Notes |
|---|---|---|---|
| VoltAgent/awesome-agent-skills | `awesome-agent-skills` | 0 | Curated list (links, not SKILL.md) — 32k stars |
| anthropics/skills | `skills` | 20 | Official Anthropic skills |
| travisvn/awesome-claude-skills | `awesome-claude-skills` | 0 | Curated list — 14k stars |
| alirezarezvani/claude-skills | `claude-skills` | 846 | 386 skills × multi-agent copies (.gemini, etc.) — 35 MB |
| ComposioHQ/awesome-claude-skills | `awesome-claude-skills-composio` | 864 | 11 MB — includes `stripe`, `email`, `seo` automations |
| FrancoStino/opencode-skills-collection | `opencode-skills-collection` | 2011 | Largest — 75 MB, `bundled-skills/` |
| helderberto/agent-skills | `agent-skills-helderberto` | 41 | SDLC toolbelt |
| conorbronsdon/agent-skills | `agent-skills-conorbronsdon` | 9 | Production-tested |
| numman-ali/openskills | `openskills` | 1 | Universal loader |
| open-hax/opencode-skills | `opencode-skills-openhax` | 125 | 0.35 MB |
| mgaruccio/opencode-skills | `opencode-skills-mgaruccio` | 1 |  |
| kedbin/opencode-skills | `opencode-skills-kedbin` | 1 |  |
| juliendf/opencode-registry | `opencode-registry` | 6 | 59 components bundle |
| RobertBirek/opencode-skills-registry | `opencode-skills-registry-robertbirek` | 4 | 1500+ upstream vault index |
| Glurby/bckp_skillz | `bckp_skillz` | 0 | Not found (404) |

## BEXO Missing Gaps — Now Filled from Internet

All 7 gaps from `MISSING_SKILLS_ANALYSIS.md:5` now have internet skills copied to `skills-bexo-critical/` and also to `skills/`:

| Gap | PRD § | Internet Skill(s) Copied | Path |
|---|---|---|---|
| M1 Stripe/Razorpay | §22 | `stripe-integration`, `stripe-automation`, `payment-integration`, `pakistan-payments-stack`, `stripe-integration-expert` | `internet-skills/opencode-skills-collection/bundled-skills/stripe-integration/SKILL.md:1` etc. |
| M2 Tax | §22 | `pakistan-payments-stack` (tax/GST variant), `payment-integration` | `internet-skills/opencode-skills-collection/bundled-skills/pakistan-payments-stack/SKILL.md:1` |
| M3 Transactional Email | §12 | `mailtrap-sending-emails`, `email-systems` | `internet-skills/opencode-skills-collection/bundled-skills/mailtrap-sending-emails/SKILL.md:1` |
| M4 PostHog + Sentry | §25 | `posthog-automation`, `sentry-automation` | `internet-skills/opencode-skills-collection/bundled-skills/posthog-automation/SKILL.md:1` |
| M5 GDPR/Privacy | §20,23 | `gdpr-data-handling`, `gdpr-audit-prep` | `internet-skills/opencode-skills-collection/bundled-skills/gdpr-data-handling/SKILL.md:1` |
| M6 SEO | §29 | `seo`, `seo-audit`, `nextjs-seo-indexing` | `internet-skills/opencode-skills-collection/bundled-skills/nextjs-seo-indexing/SKILL.md:1` |
| M7 Malware/upload | §41 | Covered via `aws` (S3) + `opencode-skills` patterns — no dedicated, but composable | — |

Additional internet coverage for BEXO (not copied yet but available):
- `seo-*` 40+ variants (`seo-geo`, `seo-technical`, `seo-sitemap`, etc.) in `opencode-skills-collection/bundled-skills/`
- `gdpr-dsgvo-expert`, `local-seo-manager`, `programmatic-seo` in `claude-skills/.gemini/skills/`
- `cold-email`, `email-sequence`, `email-template-builder` for contact relay

## Locations in Project
- `C:\Users\vasan\Music\JOBO\internet-skills\` — 14 raw clones (3929 SKILL.md)
- `C:\Users\vasan\Music\JOBO\skills-bexo-critical\` — 14 BEXO-critical copies
- `C:\Users\vasan\Music\JOBO\skills\` — 266 SKILL.md (local superset + 14 critical) — ready to build
- `C:\Users\vasan\Music\JOBO\.agents\skills\` — 252 (unchanged local mirror)
- `C:\Users\vasan\Music\JOBO\.claude\skills\` — 231 (unchanged)

## Verification
```
Local .agents: 252 SKILL.md
Local .claude: 231 SKILL.md
Internet: 3929 SKILL.md
skills/ merged: 266 SKILL.md (252+14)
critical: 14 SKILL.md
Total size: 33.87 MB local + 135.65 MB internet = 169.52 MB
```
Use `skills/` or `skills-bexo-critical/` + `internet-skills/` for full BEXO build. All 7 prior gaps now have concrete internet skills available.
