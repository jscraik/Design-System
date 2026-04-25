# Professional Finish Review

Last updated: 2026-04-25
Owner: Jamie Scott Craik (@jscraik)
Review cadence: Every release or when exemplar surfaces change

## Table of Contents

- [Purpose](#purpose)
- [Canonical Focus Pattern](#canonical-focus-pattern)
- [Review Rubric](#review-rubric)
- [Gold-standard Reference Set](#gold-standard-reference-set)
- [Visual QA Protocol](#visual-qa-protocol)
- [Failure Handling](#failure-handling)

## Purpose

This document defines the professional-finish review loop for agent-authored UI.

Pixel drift is necessary evidence, but it is not enough. Reviewers and agents must also check hierarchy, spacing rhythm, focus visibility, state quality, and restrained motion against the same small set of canonical examples.

## Canonical Focus Pattern

Scoped opt-in focus is canonical.

Use one of these patterns when a surface needs the shared design-system focus ring:

- `.ds-focusable:focus-visible`
- `[data-ds-focusable]:focus-visible`
- `.ds-focusable.input-focus-ring:focus-visible`
- `[data-ds-focusable].input-focus-ring:focus-visible`

Do not add a bare global `:focus-visible` rule to shared CSS. Component-owned controls may use their local `focus-visible:ring-*` utilities when those utilities produce a single visible ring and do not conflict with the scoped design-system ring.

Mouse-only focus suppression must also stay scoped to `.ds-focusable` or `[data-ds-focusable]`. Shared CSS must not remove native outlines from arbitrary focusable elements.

## Review Rubric

Score each protected exemplar on a 0-2 scale per dimension:

| Dimension | 0: Fails | 1: Acceptable | 2: Professional |
| --- | --- | --- | --- |
| Hierarchy | Competing titles, unclear primary action, or metadata over-emphasized. | One readable order, but local grouping or emphasis is uneven. | Clear title, section structure, singular primary action, and muted metadata. |
| Spacing Rhythm | Ad hoc gaps, nested card clutter, or layout shifts between states. | Uses mostly consistent gaps with minor crowding or loose regions. | Rhythm follows composition primitives, state swaps preserve dimensions, and controls scan cleanly. |
| Focus Quality | Missing, doubled, clipped, or color-only focus indication. | Visible keyboard focus, but offset or contrast needs polish. | One clear ring, visible in light/dark/high-contrast contexts, with logical tab order. |
| State Quality | Loading, empty, error, busy, or permission states are absent or vague. | Required states exist with basic labels and recovery affordances. | States preserve context, separate cause from recovery, and keep layout stable. |
| Motion Restraint | Decorative loops, slow feedback, or motion that hides state changes. | Motion is bounded but not clearly tied to meaning. | Motion communicates cause/state, respects reduced motion, and stays within duration caps. |

A protected exemplar passes professional-finish review when every dimension scores at least `1` and the combined score is at least `8` out of `10`. Any `0` in focus or state quality blocks release readiness.

## Gold-standard Reference Set

Use these surfaces as structural references. They are not visual templates to copy literally; they define the expected finish bar for hierarchy, states, focus, and review coverage.

| Reference | Surface | Why it is canonical | Required review dimensions |
| --- | --- | --- | --- |
| `components-settings-apps-panel--default` | Settings app management | Shows product composition with a stable panel, clear title, helper copy, and action grouping. | Hierarchy, spacing rhythm, focus quality |
| `components-settings-apps-panel--loading` | Settings loading state | Preserves context while loading instead of replacing the whole surface with loose chrome. | State quality, spacing rhythm |
| `components-settings-apps-panel--empty` | Settings empty state | Gives a neutral no-data state with a clear next action. | State quality, hierarchy |
| `components-settings-apps-panel--error` | Settings error state | Separates failed cause from retry/recovery affordance. | State quality, focus quality |
| `components-chat-chat-ui-root--default` | Chat product shell | Anchors complex app chrome with a stable shell and readable action priority. | Hierarchy, spacing rhythm, focus quality |
| `components-chat-chat-ui-root--loading-overlay` | Chat loading overlay | Keeps the shell in place while presenting busy state. | State quality, motion restraint |
| `components-chat-chat-ui-root--error-overlay` | Chat error overlay | Demonstrates recoverable page-level failure without flattening the shell. | State quality, hierarchy |
| `chat page - default state` | Web app visual suite | Confirms the product shell works outside isolated Storybook rendering. | Hierarchy, spacing rhythm, focus quality |
| `harness page` | Web app visual suite | Confirms a migrated exemplar page keeps product composition outside settings. | Hierarchy, spacing rhythm, state quality |
| `template browser page` and `template widget page` | Web app visual suite | Confirms template discovery and preview surfaces keep stable structure and state handling. | Hierarchy, state quality |

## Visual QA Protocol

Run `pnpm test:exemplar-evaluation` for the protected professional-finish slice.

The gate owns three responsibilities:

- Verify this document still contains the rubric and gold-standard reference set.
- Verify shared focus CSS still uses scoped opt-in selectors instead of bare global `:focus-visible`.
- Run the Storybook and web visual checks for the protected exemplar stories and pages.

During human review, use the rubric in addition to screenshot diffs. Treat a green pixel diff as incomplete when hierarchy, focus, or state quality has regressed but the pixels happen to match a stale baseline.

## Failure Handling

If a reference story or web visual fails:

- Fix the underlying composition, token, state, or focus issue first.
- Refresh baselines only after a reviewer confirms the change still scores at least `8` on the rubric.
- Update this reference set when a protected exemplar is renamed, removed, or superseded.
