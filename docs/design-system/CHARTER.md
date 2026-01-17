# UI Design System Charter (Apps SDK UI–First)

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Governance rules for the aStudio UI design system
- Non-scope: Implementation details for individual components or app features
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Purpose

This charter defines the governance and non-negotiable rules for the aStudio UI design system. It establishes Apps SDK UI as the canonical foundation for all embedded ChatGPT surfaces and as the baseline contract for web foundations and parity across SwiftUI.

## Scope

In scope:

- Web UI built with React/Vite/Tailwind and `@astudio/ui`.
- SwiftUI packages and macOS/iOS/visionOS applications under `platforms/apple/swift` and `platforms/apple/apps`.
- Embedded ChatGPT Apps SDK widgets under `packages/widgets`.
- Design tokens, component APIs, interaction patterns, and QA gates.

Out of scope:

- Non-UI backend services (except UI-related APIs or contracts).
- One-off marketing sites or experiments that do not ship to production.
- Third-party integrations not used in the UI layer.

## Supported Surfaces

- Web (React/Vite/Tailwind)
- Embedded ChatGPT Apps SDK widgets
- SwiftUI (iOS, macOS, visionOS)

## Foundation Rule (Non-Negotiable)

Apps SDK UI (`@openai/apps-sdk-ui`) is the canonical foundation for all ChatGPT-embedded surfaces and the baseline for web UI foundations. Custom tokens or components must either:

1. Alias or extend Apps SDK UI foundations, or
2. Use Radix primitives strictly as a fallback when Apps SDK UI lacks required coverage, while still adhering to Apps SDK UI tokens, accessibility, and interaction conventions.

## Radix Fallback Policy

Radix primitives may be used only when Apps SDK UI lacks the required component. All Radix-based components must:

- Live under `packages/ui/src/components/**/fallback/**`.
- Consume semantic tokens aligned to Apps SDK UI foundations.
- Match Apps SDK UI interaction behavior (focus, disabled, loading, density).
- Include a migration trigger and rationale documented in component headers.

## Governance and Ownership

- Owner: TBD (confirm)
- Review cadence: TBD (confirm)
- Contribution model: RFC required for new tokens, components, or breaking changes.

## RFC Process (Required)

Any proposal that adds or changes tokens, components, or UX patterns must include:

- Design review and accessibility signoff.
- Impact analysis on web + SwiftUI + widgets.
- Migration plan for breaking changes.

## Component Lifecycle

Proposal → Alpha → Beta → Stable → Deprecated → Removed

Each transition requires:

- Documented criteria and testing evidence.
- Compatibility notes for web + SwiftUI + widgets.
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
- Dynamic Type and VoiceOver for SwiftUI.
- Keyboard-only and screen-reader support for all interactive components.

## Security and Privacy

- No direct `window.openai` access outside the runtime abstraction.
- Tokens and UI state must not leak secrets or user data.
- Widget state must remain within host token budget.
