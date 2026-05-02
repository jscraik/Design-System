# Gold Examples

Last updated: 2026-04-28
Owner: Jamie Scott Craik (@jscraik)
Review cadence: Every release or when exemplar surfaces change

## Table of Contents

- [Purpose](#purpose)
- [Machine Authority](#machine-authority)
- [Promoted Examples](#promoted-examples)
- [Deferred Categories](#deferred-categories)
- [Promotion Rules](#promotion-rules)

## Purpose

Gold examples are the small set of surfaces agents should copy before creating local UI structure.

They are deliberately narrower than the full component catalog. A gold example must show a canonical route, a concrete file path, the relevant state coverage, and the read-only commands that can verify the surface.

## Machine Authority

`docs/design-system/GOLD_EXAMPLES.json` is the machine-readable inventory.

`docs/design-system/AGENT_UI_ROUTING.json` remains the routing authority for which primitive to use. Route entries link back to this inventory so `agent-design:prepare` can surface examples without agents crawling the whole repo.

## Promoted Examples

| ID                                      | Route need                 | Primary path                                                                          | Covered states               | Why agents should use it                                                        |
| --------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| `settings-panel-apps`                   | `settings_panel`           | `packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx`                                | ready, loading, empty, error | Shows grouped settings sections with the protected Storybook state matrix.      |
| `settings-panel-manage-apps`            | `settings_panel`           | `packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`                    | ready, loading, empty, error | Shows connected and available app sections without a new settings shell.        |
| `async-data-view-product-composition`   | `async_collection`         | `packages/ui/src/components/ui/layout/ProductComposition/ProductComposition.tsx`      | ready, loading, empty, error | Shows `ProductDataView` owning a collection heading and state routing.          |
| `page-shell-template-browser`           | `page_shell`               | `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`                            | ready                        | Shows a real web app page using `ProductPageShell` for stable structure.        |
| `page-shell-sidebar-footer`             | `page_shell`               | `packages/ui/src/storybook/_holding/component-stories/ProductComposition.stories.tsx` | ready                        | Shows `ProductPageShell` with sidebar, main, and footer slots.                  |
| `destructive-confirmation-alert-dialog` | `destructive_confirmation` | `packages/ui/src/storybook/_holding/component-stories/AlertDialog.stories.tsx`        | ready, confirming            | Shows destructive trigger, cancel, confirm, focus, and blocked Escape behavior. |

## Deferred Categories

These are intentionally non-promotable until each category has a protected source path, story path, test path, covered-state list, read-only validation command, and route linkage in `docs/design-system/AGENT_UI_ROUTING.json`:

| Category                            | Missing proof                                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `permission_denied_unavailable`     | Needs protected permission-denied and unavailable variants with accessible cause, recovery, tests, validation, and routing evidence.                              |
| `dense_operational_dashboard`       | Needs a protected dense dashboard fixture that proves scanning, comparison, repeated actions, responsive/focus behavior, tests, validation, and routing evidence. |
| `form_validation_accessible_errors` | Needs a protected form fixture with labels, descriptions, invalid state, field errors, summary errors, recovery copy, tests, validation, and routing evidence.    |

## Promotion Rules

Only promote an example when all of these are true:

- The source path exists in the repository.
- Story and test paths exist when listed.
- Covered states match either the route's required states or an explicit deferred-state list.
- Validation commands are read-only by default.
- `docs/design-system/AGENT_UI_ROUTING.json` points to the same primary example or story path.
- `docs/design-system/PROFESSIONAL_FINISH_REVIEW.md` names the surface when it becomes part of the protected professional-finish reference set.
