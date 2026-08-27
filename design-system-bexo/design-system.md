# BEXO Design System — Attention Market

**Reading this as:** talent marketplace for founders/recruiters scanning fast, with a brutalist-data language, leaning toward Tailwind v4 + Geist + Zinc neutrals + single lime accent. Dials `DESIGN_VARIANCE 6 / MOTION 4 / DENSITY 8` per `design-taste-frontend:43`. References: `https://pozy.ai/` (stark rank), `https://outbids.lol/` (dense chips + live pulse), `https://open-design.ai/` (152 systems, agent-native).

## Overview
Pozy's pay-to-rank brutalism + Outbids' verified data density + warm editorial paper. One lime accent for money only — never for quality. Number is mono, name is ink, money is lime.

## Color System
- ████ Ink `#111318` — text, nav, strong. Never pure black.
- ████ Warm `#F7F7F2` — page bg. Not beige craft (#f5f1ea banned per taste 4.2).
- ████ Surface `#FFFFFF` — cards on warm.
- ████ Border `#E7E5E4` — hairline stone.
- ████ Lime `#C8FF3D` — **only** Featured pill, Boost CTA, #1 highlight. Lime-ink text `#111318` = 15:1.
- ████ Violet `#7C5CFC` — links, selected, focus.
- ████ Muted `#667085` — labels.
- Do: lock one accent (lime) on whole page per `design-taste-frontend:191`. Don't: purple glows (Lila rule).

## Typography
- **Display/Body:** Geist (not Inter), via `next/font`. Mono: Geist Mono for `#01`, `$10`, `52 clicks` per `design-taste-frontend:169`.
- Scale `xs 11px mono` → `4xl 36px` — hero `text-4xl md:text-5xl lg:text-6xl` max 2 lines per taste 4.7.
- No serif by default per taste 4.1 — BEXO is sans display.

## Spacing & Layout
Base 4px, cockpit density `py-16` to `py-24` (taste 7 DENSITY 8). Board `grid 3rem 2.5rem 1fr auto`, hairline `divide-y` not card shadow per taste 4.4. `max-w-[1400px] mx-auto`, `min-h-[100dvh]` not `h-screen`.

## Component Patterns
- **Board Row:** number mono right-aligned + avatar 40 + name + headline + `badge-featured` lime full-pill + `$18` mono + `52 clicks` muted + `Outbid +` ghost.
- **Button:** `btn-primary` lime/ink, `btn-secondary` surface/border. WCAG AA 4.5:1 verified, one line, one intent per page per taste 4.5.
- **Chips:** pill, ink active, surface inactive.
- **Hero:** 2 lines, 20 words, `pt-24` cap, CTA visible without scroll per taste 4.7.

## AI Agent Instructions (paste to AGENTS.md)
Use `design-tokens.json` values only — no raw hex. Geist + Geist Mono only. Lime only for Featured/Boost. Use `board-row`, `badge-featured`, `btn-primary`, `chip` patterns. No glassmorphism, no AI purple, no Inter, no centered hero when variance>4. Verify contrast 4.5:1 and single accent per page before ship.
