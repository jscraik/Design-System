# Professional UI Contract

Last updated: 2026-03-23
Owner: Jamie Scott Craik (@jscraik)
Review cadence: Every release or monthly (whichever is sooner)

## Table of Contents

- [Purpose](#purpose)
- [Protected Surfaces](#protected-surfaces)
- [Hierarchy Grammar](#hierarchy-grammar)
- [Surface Roles](#surface-roles)
- [State Model](#state-model)
- [State Presentation Matrix](#state-presentation-matrix)
- [Focus Contract](#focus-contract)
- [Motion Contract](#motion-contract)
- [Viewport And Input Defaults](#viewport-and-input-defaults)
- [Executable Detection](#executable-detection)
- [Enforcement Inputs](#enforcement-inputs)

## Purpose

This document is the normative contract for agent-produced professional UI in this repository.

It exists to reduce invention at the component call-site. Agents and developers should be able to answer:

- which surfaces are under the strictest rules
- which hierarchy and state patterns are required
- which defaults are acceptable for focus, motion, and layout
- which source of truth to consult before creating a new abstraction

## Protected Surfaces

Day 1 protected surfaces are:

- `packages/ui/src/app/settings/**/*.{ts,tsx,js,jsx,css}`
- `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`

Protected surfaces must:

- use semantic and mapped tokens instead of `foundation-*` variables
- avoid literal hex colors and arbitrary `px` values except where explicitly ledgered
- avoid `h-screen` and other viewport shortcuts that ignore dynamic viewport units
- follow the state, focus, and motion rules in this contract

Non-protected reusable UI and showcase surfaces may start as warnings, but they should still move toward this contract.

## Hierarchy Grammar

Use one clear reading order per surface:

1. page or panel title
2. short orienting support copy when needed
3. grouped sections with consistent spacing rhythm
4. rows, controls, or data views inside those sections
5. low-emphasis metadata and destructive affordances last

Hierarchy defaults:

- One primary title per page or panel.
- Section titles should introduce a meaningful chunk of settings or content, not a single row.
- Support copy should explain consequence or context, not restate the label.
- Dense settings rows should prefer title plus optional helper copy over free-form mixed typography.
- Metadata belongs in muted secondary styles, not in the same emphasis tier as the primary action.
- CTA emphasis should be singular. A surface may have one obvious primary action; all others should step down.

Typography and spacing choices should come from semantic presets or existing primitives first. Protected surfaces must not depend on arbitrary `tracking-[...]`, `text-[...]`, or one-off spacing values when the design system already has a matching role.

## Surface Roles

Surface roles should be assigned intentionally:

- `shell`: owns viewport, safe-area, and major section layout
- `section`: owns grouping, section heading, and section spacing
- `row`: owns label, helper copy, and trailing affordance composition
- `state`: owns loading, empty, error, permission, and busy chrome
- `accent`: owns emphasis, never the overall layout vocabulary

Token discipline:

- Brand values live in DTCG and generated foundations.
- Alias values express semantic intent.
- Mapped theme slots are the only values product surfaces should consume directly.
- Direct `foundation-*` usage is reserved for token/theme internals and explicit compatibility layers.

## State Model

Every async exemplar surface must define:

- `ready`
- `loading`
- `error`
- one neutral no-data state: `empty` or `first-run`

Add the following only when relevant:

- `permission-denied`
- `busy`
- `partial-failure`
- `confirm-destructive`

State quality rules:

- Loading must preserve context when possible.
- Empty states should explain what the user can do next.
- Error states should separate cause from recovery.
- Busy states should preserve layout stability and make the in-flight target obvious.

## State Presentation Matrix

Choose the lightest presentation that matches the severity:

- Inline error: local validation or one-row/action failure.
- Banner or alert: page-level recoverable issue that still permits progress.
- Blocking dialog: destructive confirmation or hard interruption.
- Toast: transient non-blocking confirmation only.

Do not use a toast for a blocking error, and do not use a blocking dialog for ordinary validation or recoverable fetch failure.

## Focus Contract

Scoped opt-in focus selectors are canonical.

Rules:

- Shared CSS must not apply a bare global `:focus-visible` ring to every element.
- Focus affordances should come from a scoped class or data attribute pattern.
- Unscoped elements should keep safe native behavior instead of receiving design-system-imposed rings.
- Keyboard focus must be visually distinct with one ring, not stacked or doubled.

## Motion Contract

Professional product surfaces should feel responsive, not decorative.

Rules:

- Animate compositor-friendly properties only.
- Small feedback caps at `160ms`.
- Enter and replace transitions cap at `220ms`.
- Expand and collapse transitions cap at `280ms`.
- Dense and productivity-oriented surfaces do not get decorative looping motion.
- Reduced motion must fall back to opacity-only or no motion.

## Viewport And Input Defaults

Layout defaults:

- Protected surfaces must not use `h-screen`.
- Use `100dvh`-safe shells for full-height panels and pages.
- Sticky and fixed UI must respect safe-area insets.

Input defaults:

- Minimum touch target is `44x44`.
- Hover-only affordances must have a touch or click path.
- Icon-only controls must expose accessible names.

## Executable Detection

`design-system-guidance` turns the contract into source checks for representative product surfaces.

Current executable rules cover:

- semantic-slot discipline through foundation-token, raw-color, and raw-pixel checks
- scoped focus behavior through global `:focus-visible` checks
- viewport-safe layout through `h-screen` checks
- typography discipline through arbitrary tracking checks
- accessibility labeling through empty-label and hidden-focusable checks
- motion restraint through long-duration and infinite-animation checks

State completeness is enforced through the state model in this document, protected settings exemplars, and the `pnpm test:exemplar-evaluation` browser gate. Do not treat a passing source scan as permission to skip loading, empty, error, and busy states on async surfaces.

## Enforcement Inputs

The contract is enforced through:

- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/ENFORCEMENT_EXEMPTIONS.json`
- `docs/design-system/COVERAGE_MATRIX.json`
- repo-level design-system-guidance config
- `pnpm validate:tokens`
- `pnpm ds:matrix:check`
- `pnpm design-system-guidance:check:ci`
- `pnpm test:policy`

If this contract and a local surface disagree, the protected-surface rules in this document win unless a time-bounded exemption is present in the enforcement ledger.
