# Atlassian-Style Structure Review (aStudio)

**Owner:** Jamie Scott Craik (@jscraik)  
**Last updated:** 2026-01-24  
**Scope:** Evaluate the proposed Atlassian-style design system structure and workflow against the current aStudio repo.  
**Constraint:** Do not overwrite or replace existing token sources.  

## Summary

Most of the proposed structure already exists in aStudio (pnpm workspace, tokens package, UI package, Storybook surface, Tailwind v4 CSS-first entry points). The safest improvements are **documentation and taxonomy alignment** rather than architectural changes. No token source changes are required.

## Assumptions

- `packages/tokens/src/tokens/index.dtcg.json` remains the canonical source.
- Tailwind v4 remains CSS-first, with apps importing `tailwindcss` and tokens CSS.
- Any improvements should be additive and doc-only unless explicitly required.

## Mapping: Proposed Ideas vs Current State

| Proposal | Current State | Assessment | Safe Improvement (No Token Changes) |
| --- | --- | --- | --- |
| Workspace layout with shared tokens + UI | `packages/` + `platforms/` already used | **Already present** | Document equivalence (apps/web + widgets + storybook as “apps/”). |
| Tailwind v4 token layering (`@theme` + runtime vars) | `packages/ui/src/styles/theme.css` has `@custom-variant` + `@theme inline` | **Present (partial)** | Add a short doc explaining token layer mapping and where theme values live. |
| Theme switching via `[data-theme]` | `@custom-variant dark` and data-theme usage already present | **Present** | Add a usage note to guides to standardize data-theme behavior. |
| App CSS entry: `@source` and token imports | `platforms/web/apps/web/src/styles/main.css` + widgets use `@source` | **Present** | Add doc snippet to show @source usage for workspace packages. |
| UI package rules (Radix + token-only utilities) | Guidelines exist in `docs/guides/DESIGN_GUIDELINES.md` | **Present (partial)** | Add “token-only utilities” rule and example in guide. |
| Storybook as DS hub with taxonomy | Storybook exists under `platforms/web/apps/storybook` | **Present (partial)** | Document sidebar taxonomy: Foundations / Components / Patterns. |
| Argos visual testing | Wired in tooling docs | **Present** | Add a short checklist for capturing interactive states. |
| Tauri alignment | Desktop support documented; tokens shared | **Present** | Document optional desktop density + font overrides (tokens only). |

## Recommended Improvements (No Token Overwrite)

### P0 — Documentation alignment (safe, immediate)
1) Add a short “Token API mapping” doc explaining:
   - `@theme inline` token names and utility families
   - runtime theme values in CSS variables
2) Add “Storybook taxonomy” guidance in `docs/guides/` to align nav structure.
3) Add “theme switching” guidance to `docs/guides/DESIGN_GUIDELINES.md`.

### P1 — Workflow clarity (safe, low risk)
1) Add a single diagram showing: tokens → UI components → apps.
2) Add a tiny “how to add new token” checklist (link to existing token docs).

### P2 — Optional enhancements (only if needed)
1) Add a “density” theme token (compact/comfortable) via CSS variables only.
2) Add platform-specific font tokens (macOS/Windows) via `:root` overrides.

## Evidence (Current Files)

- Token source of truth: `packages/tokens/src/tokens/index.dtcg.json`
- Token CSS outputs: `packages/tokens/src/tokens.css`, `packages/tokens/src/foundations.css`
- Tailwind theme layer: `packages/ui/src/styles/theme.css`
- App CSS entry points: `platforms/web/apps/web/src/styles/main.css`, `packages/widgets/src/styles/widget.css`
- Storybook surface: `platforms/web/apps/storybook/`
- UI guidelines: `docs/guides/DESIGN_GUIDELINES.md`

## Suggested Next Action (If You Want Implementation)

If you want me to implement the P0 doc updates, I can do that without touching token sources.
