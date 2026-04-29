---
schemaVersion: agent-design.v1
brandProfile: astudio-default@1
---
# aStudio Agent UI Contract

## Table of Contents
- [Purpose](#purpose)
- [Surface Roles](#surface-roles)
- [State Model](#state-model)
- [Focus Contract](#focus-contract)
- [Motion Contract](#motion-contract)
- [Viewport And Input](#viewport-and-input)
- [Component Routing](#component-routing)
- [Token Notes](#token-notes)

## Purpose

This file is the machine-readable design contract for coding agents building UI in this repository. Agents should lint this contract before designing new product surfaces and should treat the professional UI rule sources as enforcement inputs, not optional prose.

## Surface Roles

Every protected surface must name its shell, section, row, state, and accent responsibilities. The shell surface role owns dynamic viewport handling and safe-area layout. Sections own meaningful grouping, rows own labels and trailing controls, state surfaces own loading and recovery presentation, and accents own emphasis only.

## State Model

Loading, empty, and error states must be visible, recoverable, and styled with the same semantic hierarchy as the rest of the surface. Busy states must not remove accessible names or trap agents into inventing one-off placeholders.

## Focus Contract

Focus affordances are scoped to the component or composition that owns the interaction. Agents must not add global focus-ring rules or unscoped `:focus-visible` styles as a shortcut.

## Motion Contract

Motion should be compositor-only, purposeful, and bounded. Every motion pattern needs a reduced-motion fallback so generated UI remains usable for reduced-motion users.

## Viewport And Input

Protected shells must use dynamic viewport or safe-area aware layout. Touch targets, keyboard access, non-hover alternatives, and accessible names are required before a generated surface is considered complete.

## Component Routing

Before creating a new abstraction, agents must check `docs/design-system/COMPONENT_LIFECYCLE.json` and `docs/design-system/COVERAGE_MATRIX.json`. Prefer Apps SDK primitives when sufficient, then local canonical design-system primitives such as `Stack`, `Flex`, `SectionHeader`, `EmptyMessage`, `Spinner`, and `ErrorBoundary`.

## Token Notes

Use semantic token roles from the token package and active profile. Do not add
placeholder raw values as contract examples; accents should be referenced by
role and component responsibility rather than by ad hoc hex literals.
