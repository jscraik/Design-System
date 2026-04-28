# Agent UI Routing

Last updated: 2026-04-28
Owner: Jamie Scott Craik (@jscraik)
Review cadence: Every release or monthly (whichever is sooner)

## Table of Contents

- [Purpose](#purpose)
- [Machine authority](#machine-authority)
- [Routing order](#routing-order)
- [Agent Composition Primitives](#agent-composition-primitives)
- [Exemplar surface migration](#exemplar-surface-migration)
- [Lifecycle source of truth](#lifecycle-source-of-truth)
- [Settings cluster defaults](#settings-cluster-defaults)
- [Do not create these by default](#do-not-create-these-by-default)

## Purpose

This guide tells agents and developers which component layer to reach for first when building or refactoring product UI in this repository.

It should reduce unnecessary wrapper creation and keep routing decisions consistent with the design-system contract.

## Machine authority

`docs/design-system/AGENT_UI_ROUTING.json` is the machine-readable routing
authority for agents and command code.

This Markdown file explains the routing model for humans. Runtime command code
must consume the authored JSON route source through
`packages/agent-design-engine` facade APIs instead of parsing this prose.

## Routing order

Use this order unless a documented exception exists:

1. Apps SDK primitive when available and sufficient
2. Local design-system primitive or composition when product semantics are needed
3. Fallback primitive only for documented gaps

Before creating a new abstraction, check:

- `docs/design-system/COVERAGE_MATRIX.json`
- `docs/design-system/COMPONENT_LIFECYCLE.json`
- `docs/design-system/PROFESSIONAL_UI_CONTRACT.md`

## Agent Composition Primitives

For new product surfaces, start with the smallest local composition primitive that owns the semantic role you need:

| Need                               | Preferred primitive   | Role                                                                                    |
| ---------------------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| Full page or tool surface          | `ProductPageShell`    | Owns viewport-safe shell, page heading, optional sidebar, main region, and footer.      |
| Grouped panel or card-like region  | `ProductPanel`        | Owns semantic panel chrome, heading, actions, body, and footer.                         |
| Repeated content group             | `ProductSection`      | Owns section heading and vertical rhythm.                                               |
| Async collection or results region | `ProductDataView`     | Combines section hierarchy with ready/loading/empty/error/busy state routing.           |
| Local async state inside a panel   | `ProductStateWrapper` | Swaps between ready content and accessible loading, empty, error, or busy presentation. |

Use `Stack`, `Flex`, and `Grid` inside these primitives for local rhythm and alignment. Do not rebuild page shells from loose `div` chains when one of these primitives fits.

Routing rules:

- Use Apps SDK primitives for basic controls, text inputs, badges, images, code blocks, and popovers when the wrapper covers the behavior.
- Use local product composition primitives when the surface needs hierarchy, state handling, product semantics, or viewport-safe layout.
- Use fallback primitives only when the component lifecycle manifest marks a local wrapper as transitional or missing.
- Use templates for complete known product patterns; use product composition primitives for new surfaces and partial workflows.
- Add a lifecycle entry before making a new primitive a recommended routing target.

## Exemplar surface migration

Protected exemplar surfaces should model the patterns agents are expected to copy:

- Start app pages with `ProductPageShell` instead of hand-rolled viewport wrappers.
- Use `ProductPanel` for framed preview or control regions instead of ad hoc card chains.
- Use `ProductSection` for repeated groups inside panels and settings surfaces.
- Keep surface color and text roles on mapped semantic utilities such as `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-text-secondary`, `text-muted-foreground`, `border-border`, `ring-ring`, and `text-interactive`.
- Do not use foundation utilities, raw color literals, raw pixel values, or arbitrary tracking/layout escapes in product exemplar surfaces unless a documented exception is added to the guidance ledger.

Current migrated exemplars:

- `platforms/web/apps/web/src/pages/HarnessPage.tsx`
- `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`
- `packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx`
- `packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`

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
