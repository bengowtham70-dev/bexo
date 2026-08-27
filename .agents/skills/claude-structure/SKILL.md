---
name: Codex-structure
description: Codex project scaffolding with rules, commands, skills, agents, and hooks. Use when setting up a new project structure for Codex, applying structured AGENTS.md conventions, or deploying projects via the bundled deploy skill.
---

# Codex Structure

Ready-to-use Codex project scaffold with rules, commands, skills, agents, and hooks.

## Workflow

1. Use the `template/` folder as the canonical project scaffold.
2. Apply `.Codex/rules/` conventions (api-conventions, code-style, testing).
3. Reference `template/.Codex/skills/deploy/SKILL.md` for the deploy workflow.

## Key Rules

- Follow the rules defined in the template's `.Codex/rules/` directory.
- Keep Codex.local.md for local, uncommitted overrides.
- Use the bundled deploy skill for staging/production deploys and CI/CD.

## Reference

- `template/` — the full project scaffold
- `template/.Codex/skills/deploy/SKILL.md` — deploy workflow
- `docs/` — additional documentation