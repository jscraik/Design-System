# Agent UI Routing

Last updated: 2026-03-23
Owner: Jamie Scott Craik (@jscraik)
Review cadence: Every release or monthly (whichever is sooner)

## Table of Contents
- [Purpose](#purpose)
- [Routing order](#routing-order)
- [Lifecycle source of truth](#lifecycle-source-of-truth)
- [Settings cluster defaults](#settings-cluster-defaults)
- [Do not create these by default](#do-not-create-these-by-default)

## Purpose

This guide tells agents and developers which component layer to reach for first when building or refactoring product UI in this repository.

It should reduce unnecessary wrapper creation and keep routing decisions consistent with the design-system contract.

## Routing order

Use this order unless a documented exception exists:

1. Apps SDK primitive when available and sufficient
2. Local design-system primitive or composition when product semantics are needed
3. Fallback primitive only for documented gaps

Before creating a new abstraction, check:

- `docs/design-system/COVERAGE_MATRIX.json`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`

## Lifecycle source of truth

Lifecycle classification lives in `docs/design-system/COMPONENT_LIFECYCLE.json`.

Use the manifest to decide whether a component is:

- `canonical`
- `transitional`
- `deprecated`

If a component is not in the manifest, do not assume it is a preferred routing target.

## Settings cluster defaults

For the settings cluster, prefer recipe-first normalization over new public exports.

Current defaults are:

- `Stack` for vertical rhythm
- `Flex` for row alignment
- `SectionHeader` for repeated section heading structure
- `CollapsibleSection` for advanced or expandable sections
- `EmptyMessage`, `Spinner`, and `ErrorBoundary` for state handling
- `SettingRow`, `SettingToggle`, and `SettingDropdown` as transitional internal recipes while the cluster is normalized

## Do not create these by default

Avoid introducing:

- a second settings shell primitive parallel to existing layout primitives
- a settings-specific layout primitive that duplicates `Stack` or `Flex`
- one-off row exports such as `NotificationRow` or `DangerRow`
- settings-only empty, loading, or error components that duplicate shared primitives
