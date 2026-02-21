# UI Design System Charter (Apps SDK UI–First)

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Governance rules for the aStudio UI design system
- Non-scope: Implementation details for individual components or app features
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or monthly (whichever is sooner)

## Purpose

This charter defines the governance and non-negotiable rules for the aStudio UI design system. It establishes Apps SDK UI as the canonical foundation for all embedded ChatGPT surfaces and as the baseline contract for web UI and desktop shells (Tauri).

## Scope

In scope:

- Web UI built with React/Vite/Tailwind and `@design-studio/ui`.
- Tauri desktop shells that host the web UI.
- Embedded ChatGPT Apps SDK widgets under `packages/widgets`.
- Design tokens, component APIs, interaction patterns, and QA gates.

Out of scope:

- Non-UI backend services (except UI-related APIs or contracts).
- One-off marketing sites or experiments that do not ship to production.
- Third-party integrations not used in the UI layer.

## Supported Surfaces

- Web (React/Vite/Tailwind)
- Tauri desktop shells
- Embedded ChatGPT Apps SDK widgets

## Foundation Rule (Non-Negotiable)

Apps SDK UI (`@openai/apps-sdk-ui`) is the canonical foundation for all ChatGPT-embedded surfaces and the baseline for web UI foundations. Custom tokens or components must either:

1. Alias or extend Apps SDK UI foundations, or
2. Use Radix primitives strictly as a fallback when Apps SDK UI lacks required coverage, while still adhering to Apps SDK UI tokens, accessibility, and interaction conventions.

## Token Tiering Rule (Brand → Alias → Mapped)

All color tokens MUST follow a three-tier hierarchy to prevent drift and hard-coded usage:

1) **Brand (roots)** — raw palette values (source of truth) live in DTCG and generated foundations.  
   - Canonical source: `packages/tokens/src/tokens/index.dtcg.json`  
   - Generated output: `packages/tokens/src/foundations.css`

2) **Alias (trunk)** — semantic intent (Primary/Success/Error) maps brand values by mode.  
   - Canonical map: `packages/tokens/src/alias-map.ts`

3) **Mapped (canopy)** — concrete usage slots (text/action/icon/border) wired into theme + utilities.  
   - Canonical mapping: `packages/ui/src/styles/theme.css` (`@theme inline` variables)

**Enforcement:** No raw hex values are allowed outside the Brand tier. UI code must consume mapped semantic tokens only. Any change must preserve the Brand → Alias → Mapped chain.  

## Collection Rules (from transcript guidance)

Full rule sets live in dedicated files:

- **Brand collection:** `docs/design-system/collections/brand-collection-rules.md`
- **Alias collection:** `docs/design-system/collections/alias-collection-rules.md`
- **Mapped collection:** `docs/design-system/collections/mapped-collection-rules.md`
- **Responsive collection:** `docs/design-system/collections/responsive-collection-rules.md`

### Mode Cleanup Rules
- Consolidate split light/dark or desktop/mobile collections into **single collections with modes**.
Evidence: docs/transcripts/rYzstFEY0t8.cleaned.md

## Responsive Collection Rule (Typography + Spacing)

Responsive tokens define **type scale, line-height, and paragraph spacing** across breakpoints. This collection is orthogonal to Brand → Alias → Mapped and applies to **type/space/size** tokens.

**Required responsive needs:**
- Hero and headings (h1–h6)
- Paragraph sizes (lg/md/sm/caption)
- Line height per size
- Paragraph spacing per size

**Accessibility constraint:** base paragraph size (`paragraph.md`) MUST be 16px equivalent.  

**Sources of truth:**
- DTCG type tokens: `packages/tokens/src/tokens/index.dtcg.json` (`type.*`)
- Generated outputs: `packages/tokens/src/foundations.css` and `packages/ui/src/styles/theme.css`

**Enforcement:** UI components must use responsive type/space tokens; no raw px values for responsive typography or spacing.  


## Radix Fallback Policy

Radix primitives may be used only when Apps SDK UI lacks the required component. All Radix-based components must:

- Live under `packages/ui/src/components/**/fallback/**`.
- Consume semantic tokens aligned to Apps SDK UI foundations.
- Match Apps SDK UI interaction behavior (focus, disabled, loading, density).
- Include a migration trigger and rationale documented in component headers.

## Governance and Ownership

- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or monthly (whichever is sooner)
- Contribution model: RFC required for new tokens, components, or breaking changes.

## Training resources

- Transcript index (token architecture + setup workflows): `docs/transcripts/README.md`

## RFC Process (Required)

Any proposal that adds or changes tokens, components, or UX patterns must include:

- Design review and accessibility signoff.
- Impact analysis on web + Tauri + widgets.
- Migration plan for breaking changes.
 - RFC file created using `docs/workflows/RFC_TEMPLATE.md`.

## Component Lifecycle

Proposal → Alpha → Beta → Stable → Deprecated → Removed

Each transition requires:

- Documented criteria and testing evidence.
- Compatibility notes for web + Tauri + widgets.
- Release notes for breaking changes.

## Release Rules

- Semantic versioning across UI packages and token outputs.
- Any breaking change must include a migration guide and release notes.
- apps-sdk-ui upgrades must include drift tests and an alignment stamp.

## Required Evidence for PRs

PRs that change the design system must include evidence of:

- Standards compliance (WCAG 2.2 AA, Apps SDK UI alignment).
- Tests or automation results (lint, a11y, visual regression, drift checks).
- Updated docs (coverage matrix, component docs, or token outputs).

## Accessibility and Inclusive Design

- WCAG 2.2 AA baseline for web and widgets.
- Keyboard-only and screen-reader support for all interactive components.

## Security and Privacy

- No direct `window.openai` access outside the runtime abstraction.
- Tokens and UI state must not leak secrets or user data.
- Widget state must remain within host token budget.
