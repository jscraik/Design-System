# Agent-Facing Design System Audit For Professional UI (March 2026)

Last updated: 2026-03-23

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Agent-facing design-system gaps that affect professional UI output quality
- Non-scope: One-off component bug fixes or visual redesign mockups
- Owner: TBD (confirm)
- Review cadence: Monthly while agent-facing guidance is still changing

## Contents

- [Doc requirements](#doc-requirements)
- [Executive summary](#executive-summary)
- [Audit lenses used](#audit-lenses-used)
- [Evidence snapshot](#evidence-snapshot)
- [Priority findings](#priority-findings)
- [Recommended roadmap](#recommended-roadmap)
- [Validation runbook](#validation-runbook)

## Executive summary

The design system has solid raw ingredients for professional UI output, including a token stack, semantic theme slots, Apps SDK integration, accessibility contracts, motion utilities, and a dedicated `design-system-guidance` package. The main gap is not a lack of primitives. The main gap is that the repo does not yet enforce the professional composition rules that agents need in order to reliably turn those primitives into polished product UI.

As of March 2026, the highest-risk issue is that core design-system integrity checks are failing while broader policy checks still pass. That leaves both humans and agents with a false sense of safety. The next biggest gap is that the agent-facing guidance layer is still mostly limited to token hygiene, while high-signal professional UI rules such as semantic slot discipline, state completeness, focus behavior, layout quality, motion restraint, and component-preference routing are not yet encoded strongly enough to steer generation.

## Audit lenses used

This audit used the relevant frontend skills as review lenses:

- `design-system`
- `baseline-ui`
- `frontend-ui-design`
- `fixing-accessibility`
- `react-ui-patterns`
- `ui-ux-creative-coding`
- `ui-visual-regression`
- `shadcn-ui`
- `better-icons`
- `test-browser`

Generation-only frontend skills such as favicon, OG image, video, Stitch, and image-generation workflows were intentionally not used because they do not improve evidence quality for a design-system audit.

## Evidence snapshot

- `pnpm validate:tokens` failed with `SCHEMA_REFERENCE_INVALID` and `TOKEN_ALIAS_MISSING`.
- `pnpm ds:matrix:check` failed because the coverage matrix outputs are stale.
- `pnpm design-system-guidance:check:ci` passed, but it only validated the guidance package itself rather than the full monorepo.
- `pnpm test:policy` passed, which confirms the repo currently allows policy-green states while design-system integrity is still broken.
- Non-story, non-test source currently contains `1546` matches for `foundation-*`, which indicates widespread low-level token usage in product code.
- Non-story, non-test source currently contains `53` likely raw color literals, `582` arbitrary layout or typography utilities, and `189` outline-suppression patterns.

## Priority findings

### 1. Root validation is misaligned with real design-system integrity

The repo's strongest design-system truth checks are currently broken, but the broader policy surface still reports green. `packages/tokens/scripts/validate-tokens.ts` expects a pinned local schema reference, while `packages/tokens/src/tokens/index.dtcg.json` points at the remote DTCG 2025.10 schema URL. The same validation run also reports that `type.fontDisplay` resolves to a missing `type.web.fontDisplay` path because `packages/tokens/src/alias-map.ts` generates `type.web.${key}` for typography aliases that do not actually exist in the source tree.

Why this matters for agents: if the design system cannot prove its own token truth, agent outputs will inherit silent drift and reviewers will have to catch issues manually.

### 2. The guidance layer is still too thin for "professional March 2026 UI"

`packages/design-system-guidance/src/core.ts` currently enforces only a small set of checks: deprecated icon imports, raw hex colors, raw pixel values, and a minimal docs presence contract. That is helpful hygiene, but it does not encode the things that make an agent-produced interface feel professional.

Missing guidance categories include:

- semantic slot usage instead of direct `foundation-*` styling
- page-shell and surface composition rules
- state completeness for loading, empty, error, permission, and success paths
- icon-only button labeling and keyboard expectations
- `h-screen` to `dvh` guidance
- arbitrary tracking and type-rhythm restrictions
- motion ceilings and reduced-motion parity
- component-source precedence for Apps SDK, local primitives, and fallbacks

### 3. Semantic token architecture is being bypassed in app surfaces

`packages/ui/src/styles/theme.css` says mapped slots should only reference semantic alias variables, but the same file also re-exposes many foundation tokens for backward compatibility. That keeps a low-level escape hatch permanently available to agents and application code.

The bypass is already visible in product surfaces:

- `platforms/web/apps/web/src/pages/HarnessPage.tsx`
- `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`

Both pages style directly against `foundation-*` tokens instead of routing through semantic surface and content roles. This makes the repo easier to "make look tokenized" than to make feel coherent.

### 4. Product components still contain raw brand literals and arbitrary typography

`packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx` and `packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx` still encode brand palettes as raw hex values and use many arbitrary text, leading, and tracking utilities. `AppsPanel.tsx` also contains dead contrast logic where both branches resolve to `text-foreground`, which means the code suggests adaptive behavior that it does not actually perform.

Why this matters for agents: generated UI tends to copy the examples it sees. If the system's own components rely on local literals and arbitrary utility escapes, agents will reproduce the same patterns.

### 5. Focus guidance is internally contradictory

`packages/tokens/src/enhanced.css` applies a bare global `:focus-visible` rule and removes the default outline, while `packages/tokens/src/enhanced/focus.ts` explicitly warns against using bare global `:focus-visible` because it can create double-ring conflicts and recommends scoped strategies such as `.ds-focusable`.

This contradiction makes it harder for agents to know which focus pattern is canonical and increases the risk of inconsistent accessibility behavior.

### 6. Apps SDK-first strategy is not yet operationalized enough for agent choice

The charter and coverage docs establish Apps SDK UI as the canonical surface, but the repo does not yet expose a concise, agent-oriented "component routing contract" that answers questions such as:

- When should an agent prefer an Apps SDK primitive?
- When is a local wrapper acceptable?
- When is a Radix fallback acceptable?
- What product states must every chosen primitive support?

Without that routing layer, agents still have to infer intent from scattered docs and existing implementation examples.

### 7. Motion, layout taste, and state quality exist as primitives but not as guardrails

The repo already has enhanced motion tokens, patterns, and accessibility contracts. What is missing is a clear, enforceable standard for restrained professional motion, spacing rhythm, hierarchy, and page-level composition. This is the gap between "a system with tokens" and "a system that consistently produces polished software."

## Recommended roadmap

### P0. Repair trust in the system's own contracts

- Fix the token validation mismatch between the expected pinned schema and the current remote schema reference.
- Fix the missing `fontDisplay` alias mapping in `packages/tokens/src/alias-map.ts`.
- Regenerate and re-check the design-system coverage matrix.
- Make token validation and matrix freshness part of the same root policy path that contributors already trust.

### P1. Expand guidance from hygiene rules to professional UI rules

- Extend `design-system-guidance` with checks for semantic-slot discipline, state completeness, focus behavior, accessibility labeling, arbitrary typography escapes, and viewport-safe layout rules.
- Add a repo-level configuration that runs these checks against product code, not just the guidance package.
- Add a short, agent-friendly "professional UI contract" document that defines non-negotiable output standards.

### P1.5. Add an agent-native composition layer

- Introduce page-shell, section, panel, and data-view primitives that encode hierarchy and spacing taste directly.
- Introduce semantic surface roles such as `canvas`, `panel`, `elevated`, `muted`, `accent`, and `danger`.
- Introduce typography presets for display, title, section label, metadata, and dense data rows so agents do not need to invent utility mixes.

### P2. Reduce semantic bypasses in product code

- Migrate exemplar app surfaces away from direct `foundation-*` usage and onto mapped semantic roles.
- Replace hard-coded app brand colors with a branded-but-safe token strategy or a documented exception path.
- Narrow or remove backward-compatibility foundation re-exports once migration coverage is acceptable.

### P3. Add review loops for professional finish

- Pair policy checks with visual regression rules that flag hierarchy collapse, spacing drift, and focus-ring regressions on exemplar surfaces.
- Add a design review rubric for "professional by default" output quality that agents and reviewers can use consistently.
- Add a small set of gold-standard reference screens that agents should emulate structurally, not copy literally.

## Validation runbook

Run these commands when landing design-system improvements from this audit:

```bash
pnpm validate:tokens
pnpm ds:matrix:generate
pnpm ds:matrix:check
pnpm design-system-guidance:check:ci
pnpm test:policy
```

When the guidance layer expands beyond package-local checks, add a repo-level command that validates representative app surfaces against the same contracts.
