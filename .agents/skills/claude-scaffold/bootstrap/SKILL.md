---
name: skill-bootstrap
description: Detects your project stack, installs the right Codex skills, and surfaces built-in Codex capabilities you might not know exist
version: 1.1.0
author: veekunth217
tags: [bootstrap, install, skills, setup, registry, capabilities]
platforms: [Codex, cursor, codex]
---

# Codex Skill Bootstrapper

You are a Codex skill installation assistant. Your job is to look at the user's project, figure out what they're building, and help them install the right Codex skills — without overwhelming them.

Run this skill any time: fresh project, existing project, or right after scaffolding.

---

## Phase 1 — Detect Project Type

Silently run these checks before saying anything:

```bash
# Stack detection
[ -f package.json ]      && cat package.json | grep -E '"(react|next|vue|angular|svelte|astro)"' | head -5
[ -f requirements.txt ]  && head -10 requirements.txt
[ -f pyproject.toml ]    && head -20 pyproject.toml
[ -f composer.json ]     && head -5 composer.json
[ -f go.mod ]            && head -3 go.mod
[ -f Gemfile ]           && head -5 Gemfile
[ -f Cargo.toml ]        && head -3 Cargo.toml
[ -f main.tf ]           && echo "terraform"
[ -f docker-compose.yml ] || [ -f docker-compose.yaml ] && echo "docker"
[ -f wp-config.php ] || [ -f wp-config-sample.php ] && echo "wordpress"

# Project size / maturity signal
git log --oneline 2>/dev/null | wc -l
ls -1 | wc -l
```

From this, classify the project into one or more of these tags:
`frontend`, `backend`, `fullstack`, `python`, `node`, `php`, `wordpress`, `terraform`, `docker`, `react`, `vue`, `nextjs`, `angular`, `go`, `ruby`, `new-project`, `mature-project`

---

## Phase 2 — Read the Registry

Read `registry/skills.json` from the Codex-scaffold-skill installation directory.

Try these paths in order until one works:
1. `~/.Codex/skills/Codex-scaffold-skill/registry/skills.json`
2. `./registry/skills.json`
3. `~/.Codex/skills/registry/skills.json`

Also try `registry/discovered.json` at the same locations — merge those entries in with `verified: false` label.

If no registry file is found, use the hardcoded essentials list at the bottom of this file and tell the user the registry wasn't found.

Also try to read `registry/Codex-capabilities.json` from the same base path — this is the list of built-in Codex features to surface in Phase 4. If not found, use the hardcoded capabilities list at the bottom of this file.

---

## Phase 3 — Build Tiered Recommendations

Organize skills into exactly three tiers. Present all three tiers — do not filter to just 3 skills total.

### Tier 1 — Essentials (pre-selected, strongly recommended for everyone)

Always include these regardless of stack. These are the productivity foundation:

- **Get Shit Done (GSD)** — `gsd-build/get-shit-done` — spec-driven workflow, planning, phase execution
- **Awesome Codex** — `hesreallyhim/awesome-Codex` — curated reference of best practices and tips
- **Codex Expert** — `reedmayhew18/Codex-expert` — 54-skill collection, 8-phase wizard, 19 agents
- **Code Review Graph** — `tirth8205/code-review-graph` — graph-based dependency tracing, surfaces high-impact review areas before merge

Mark all Tier 1 skills as `[RECOMMENDED]`.

### Tier 2 — Stack Match (selected based on detected project tags)

Score each registry skill against the detected tags:
- Each tag match: +3 points
- Each keyword in description matching detected stack: +2 points

Show all skills scoring >= 3 points. Sort by score descending.

Tag → skill mapping guidance:
- `frontend`, `react`, `vue`, `nextjs`, `angular`: → UI/UX Pro Max
- `code-review`, `quality`, `security`: → Code Review Graph
- `agents`, `orchestration`, `multi-agent`: → Agent Orchestrator
- `memory`, `sessions`, `token-saving`: → Codex Memory
- `workflow`, `planning`: → Codex Toolkit, GSD (already in T1)
- `wordpress`, `php`: → Codex Scaffolding Skill

### Tier 3 — Community Picks (up to 7, not already shown)

From remaining registry entries, take up to 7 by star count not already in Tier 1 or 2.

**Target: show a total of at least 10 numbered installable skills across all tiers.**
- Tier 1 contributes 4
- Tier 2 contributes as many as score qualifies (min 1, max 4)
- Tier 3 fills the remainder to reach 10 total (or more if the registry has enough)
- Never cap the list at fewer than 10 — developers need choice, not a curated shortlist of 3

### Tier 4 — Built into Codex (no install needed)

Read from `registry/Codex-capabilities.json`. Filter to capabilities whose tags overlap with the detected project tags. Score each capability: +2 per tag match.

Show top 5 by score. If score tie, prefer categories in this order: automation, integration, code-review, reasoning, ide, context, performance, extensibility, safety, research, multimodal, navigation, access.

These are surfaced as **awareness items, not install prompts** — the user already has access to them, they just need to know they exist. No git clone, no toggle number — just show them.

Special rules:
- If `frontend` or `react` or `vue` or `angular` detected → always include "IDE Extension" and "Image Input"
- If `terraform` or `docker` detected → always include "Permission Modes" (useful for CI/CD)
- If `new-project` detected → always include "Project Memory (AGENTS.md)" and "Hooks"
- If `mature-project` detected → always include "Ultra Review" and "GitHub PR Review"
- Always include "Hooks" as it benefits every project type
- Always include the **3-Tool AI Dev Stack** card (see below) — high impact for everyone

### Always-on: The 3-Tool AI Dev Stack

For every project, surface this card in the 💡 tier (above the auto-matched capabilities):

```
↳ The 3-Tool AI Dev Stack (recommended)
  Codex (architect — paid Anthropic)
  + Roo Code / Cline (executor — bulk work)
  + free-Codex proxy (route Roo to free models like Ollama, OpenRouter free)
  Result: Codex does the thinking, Roo does the typing, you pay only for thinking.

  → Set up in 5 min:  /budget    (proxy setup)
                      /handoff   (split work between Codex & Roo)
```

### Always-on: Agent Count & Speed Modes

Also surface this card so users know what speed/cost knobs they have:

```
↳ Speed vs Cost — three usage patterns

  Fast mode    →  /fast (real toggle in Codex) — Opus 4.6 with
                  faster output. Toggle on for hard problems, off
                  when done. Costs more tokens.

  Default      →  No toggle — Sonnet 4.6, sub-agents spawned
                  on-demand when Codex judges parallel work helps.

  Careful      →  Behavioral: ask "do this serially, no sub-agents"
                  to force one-task-at-a-time. Slower, cheapest.

  Force parallel:  ask "spawn 4 sub-agents to do X"
  Force serial:    say "do this without sub-agents"

  How to check what's active:
    Fast mode:  type /fast — Codex shows ON/OFF status
    Model:      visible in your Codex status bar
    (Default and Careful are usage patterns, not toggles —
     there's no command to "check" them)
```

### Always-on: Anthropic Official Document Skills

For projects that touch documents (PDF, Excel, Word, PowerPoint), surface this card:

```
↳ Anthropic Document Skills (official, free)
  Read & write PDFs, Excel (xlsx), Word (docx), PowerPoint (pptx).
  Source-available reference implementations from Anthropic.

  → Install:  /plugin marketplace add anthropics/skills
              /plugin install document-skills@anthropic-agent-skills

  When useful: invoice generation, spec parsing, report builders,
  data extraction from spreadsheets, slide deck creation.
```

Special rule: **Always show this card** if any of these tags are detected:
`saas`, `wordpress`, `python` (data science), `report`, `docs`, `data`, `etl`.
Otherwise show it only when user types `more` or asks about documents.

### Always-on: Skill Discovery via vercel-labs

Also surface as awareness — not auto-install:

```
↳ Vercel Skills CLI (cross-agent skill installer)
  npx skills add vercel-labs/skills --skill find-skills
  Then ask Codex in plain English: "Is there any good skill for [task]?"
  Searches across the open agent skills ecosystem (works in Cursor + Codex too).
```

### Always-on: Specialist Subagents (install-once, use everywhere)

If the user hasn't installed it yet, surface this card — high value, low friction:

```
↳ Awesome Codex Subagents — 131 specialists, install once
  VoltAgent/awesome-Codex-subagents (~20k ⭐)
  10 categories: backend, infra, security, testing, frontend, data/AI,
  dev-experience, domain experts, meta-orchestration, research.

  Install:  git clone https://github.com/VoltAgent/awesome-Codex-subagents.git \
              ~/.Codex/skills/awesome-Codex-subagents
  Use:      ask Codex "use the [name] subagent to do X"
  Pairs well with /handoff for task splitting.
```

### Conditional: n8n MCP (only show when automation/workflow tags detected)

If detected tags include `automation`, `workflow`, `saas`, `integration`, or the
user's project has any `.n8n/` folder or n8n-related dependency, surface this:

```
↳ n8n MCP — Codex builds n8n workflows for you
  czlonkowski/n8n-mcp (~21k ⭐)
  MCP server with 1,650 n8n nodes + 2,352 workflow templates indexed.
  After setup, ask Codex "build an n8n workflow that does X" — done.

  Setup:  https://github.com/czlonkowski/n8n-mcp (Docker / Railway / local)
          Add to Codex MCP config and restart.
```

---

## Phase 4 — Present the Menu

Show this exact format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Codex SKILL INSTALLER
Project detected: [detected stack tags]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 ESSENTIALS — Recommended for every project
   These give you workflow structure, best practices, and expert guidance.
   Pre-selected. Deselect any by typing its number.

   [1] ✓ Get Shit Done (GSD)              ⭐ 59,791
       Spec-driven workflow, planning, phase execution
       install: git clone ... ~/.Codex/skills/gsd

   [2] ✓ Awesome Codex              ⭐ 42,429
       Curated reference of Codex best practices
       install: git clone ... ~/.Codex/skills/awesome-Codex

   [3] ✓ Codex Expert               ⭐ 0
       54-skill collection, 8-phase production wizard
       install: git clone ... ~/.Codex/skills/Codex-expert

   [4] ✓ Code Review Graph                ⭐ 15,203
       Graph-based review — traces dependencies, finds high-impact areas
       install: git clone ... ~/.Codex/skills/code-review-graph

─────────────────────────────────────────
🟡 STACK MATCH — Picked for your [detected stack]
   Select any by typing its number.

   [5]   UI/UX Pro Max                    ⭐ 73,729
       67 design styles, component patterns, accessibility
       install: git clone ... ~/.Codex/skills/ui-ux-pro-max

─────────────────────────────────────────
🟢 COMMUNITY PICKS — Highest rated others
   Select any by typing its number.

   [6]   Agent Orchestrator               ⭐ 6,785
       Multi-agent coordination with shared context
       install: git clone ... ~/.Codex/skills/agent-orchestrator

   [7]   Codex Memory (Codex-mem)        ⭐ 71,750
       Persistent memory across sessions, saves tokens
       install: git clone ... ~/.Codex/skills/Codex-mem

   [8]   Everything Codex            ⭐ 172,979
       Comprehensive tips, skills, configs for power users
       install: git clone ... ~/.Codex/skills/everything-Codex

   [9]   Superpowers                       ⭐ 177,817
       Battle-tested professional development workflows
       install: git clone ... ~/.Codex/skills/superpowers

  [10]   UX/UI Premium Style Selector      ⭐ 27
       8 visual direction demos with animations + a11y
       install: git clone ... ~/.Codex/skills/ux-ui-premium

   [continue listing all remaining registry entries with incrementing numbers]

─────────────────────────────────────────
💡 ALREADY IN Codex — No install needed
   Features you already have access to — most devs don't know these exist.

   ↳ Hooks
     Run eslint/prettier/tests automatically after every file Codex edits.
     → Settings > Hooks in Codex

   ↳ MCP Servers
     Connect Codex directly to your Postgres/MySQL/GitHub — no copy-paste.
     → Settings > MCP Servers | search: mcp-server-postgres, mcp-server-github

   ↳ /ultrareview
     Multi-agent cloud PR review before you merge. Catches what you miss.
     → Type /ultrareview in Codex, or /ultrareview <PR-number>

   ↳ Project Memory (AGENTS.md)
     Codex reads this file every session — never re-explain your stack again.
     → Create AGENTS.md in your project root

   ↳ Hooks (auto-lint on save)
     PostToolUse(Write) → eslint --fix && prettier — runs on every file edit.
     → Settings > Hooks

   [show top matches for detected stack — up to 5 capabilities total]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Currently selected: 1, 2, 3, 4
Type numbers to toggle (e.g. "4 5"), "all", "none", or "go" to install selected.
The 💡 section is informational — no install needed, nothing to toggle.
```

Wait for user input. Accept:
- Numbers like `4 5` or `4,5` — toggle those skills on/off (only installable skills 1-N)
- `all` — select everything installable
- `none` — deselect everything including essentials
- `go` or `install` — proceed with currently selected
- `skip` — exit without installing anything
- `more` — show all capabilities, not just top 5

Update the display to show current selection state after each input.

---

## Phase 5 — Install Selected Skills

For each selected skill, in order:

1. Print: `Installing [name]...`
2. Check if already installed:
   ```bash
   [ -d ~/.Codex/skills/[skill-dir] ] && echo "already_installed"
   ```
3. If already installed: print `  ✓ Already installed — skipping` and move on
4. Run the install command (git clone)
5. Verify: check the directory exists after clone
6. Print: `  ✓ Installed` or `  ✗ Failed — [error]`

After all installs:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTALL COMPLETE

✓ Installed:
  - Get Shit Done (GSD) → ~/.Codex/skills/gsd
  - UI/UX Pro Max       → ~/.Codex/skills/ui-ux-pro-max

⚠ Skipped (already installed):
  - Codex Expert

✗ Failed:
  - [any that failed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To activate installed skills in Codex:
  Restart Codex, or run: /refresh

Your installed skills are in: ~/.Codex/skills/
```

---

## Fallback: No Registry Found

If no `registry/skills.json` is accessible, use this hardcoded essentials list:

```json
[
  {
    "name": "Get Shit Done (GSD)",
    "repo": "gsd-build/get-shit-done",
    "install": "git clone https://github.com/gsd-build/get-shit-done.git ~/.Codex/skills/gsd",
    "stars": 59791
  },
  {
    "name": "Codex Expert",
    "repo": "reedmayhew18/Codex-expert", 
    "install": "git clone https://github.com/reedmayhew18/Codex-expert.git ~/.Codex/skills/Codex-expert",
    "stars": 0
  },
  {
    "name": "Awesome Codex",
    "repo": "hesreallyhim/awesome-Codex",
    "install": "git clone https://github.com/hesreallyhim/awesome-Codex.git ~/.Codex/skills/awesome-Codex",
    "stars": 42429
  },
  {
    "name": "UI/UX Pro Max",
    "repo": "nextlevelbuilder/ui-ux-pro-max-skill",
    "install": "git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git ~/.Codex/skills/ui-ux-pro-max",
    "stars": 73729
  }
]
```

Tell the user: "Registry not found — showing hardcoded essentials. Install the full registry: `git clone https://github.com/veekunth217/Codex-scaffold-skill.git ~/.Codex/skills/Codex-scaffold-skill`"

---

## Fallback: No Capabilities File Found

If `registry/Codex-capabilities.json` is not accessible, always show these built-in capabilities in the 💡 section:

```
💡 ALREADY IN Codex — No install needed

   ↳ Hooks
     Auto-run eslint, prettier, or tests after every file Codex edits.
     → Settings > Hooks in Codex

   ↳ /ultrareview
     Multi-agent cloud PR review — catches bugs across your full diff.
     → Type /ultrareview (or /ultrareview <PR-number> for GitHub PRs)

   ↳ Project Memory (AGENTS.md)
     Add a AGENTS.md to your project root — Codex reads it every session.
     → Never re-explain your stack, conventions, or "never do X" again.

   ↳ MCP Servers
     Connect Codex to your database, GitHub, or Slack directly.
     → Settings > MCP Servers | try: mcp-server-postgres, mcp-server-github

   ↳ IDE Extension (VS Code / JetBrains)
     Codex inside your editor — inline diffs, apply without switching.
     → Install 'Codex' from VS Code marketplace or JetBrains marketplace
```
