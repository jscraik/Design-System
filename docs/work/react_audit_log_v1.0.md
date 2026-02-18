# React Audit Log (Dec 2025)

Last updated: 2026-01-04

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

Scope: Full React surface (packages/ui, packages/widgets, platforms/web/apps/web, platforms/web/apps/storybook).
Change policy: Breaking changes allowed.
UX scope: ChatGPT widgets + React UI; record changes for desktop parity.

## Legend

- [A11Y] Accessibility
- [BUG] Bug fix
- [PERF] Performance/bundle
- [DX] Developer experience
- [CLEAN] Dead code/bloat
- [UX] UI/UX consistency

## 2025-12-29

- Start audit. Sequence: packages/ui → packages/widgets → platforms/web/apps/web → platforms/web/apps/storybook.
- [CLEAN][A11Y][DX] `packages/ui/src/app/chat/ChatInput/ChatInput.tsx`: removed console logs, added action callbacks (`onSendMessage`, `onAttachmentAction`, `onToolAction`, `onSearchToggle`, `onResearchToggle`), and removed misleading `cursor-pointer` on non-interactive tool rows.
- [CLEAN][DX] `packages/ui/src/app/chat/ChatMessages/ChatMessages.tsx`: removed console logs; added `onMessageAction` callback for copy/feedback actions.
- [CLEAN][DX] `packages/ui/src/app/chat/ChatSidebar/ChatSidebar.tsx`: removed console logs; added `onAction` callback; wired menu items and rail buttons to state + callbacks; added logout + memory-option hooks; added `ChatSidebarAction` type.
- [BUG][DX] `packages/widgets/src/shared/openai-hooks.ts`: added SSR-safe guards for `window` access in `useOpenAIGlobal`, `useDisplayMode`, and `useCallTool` to prevent server render crashes.
- [BUG][PERF] `packages/widgets/src/shared/widget-base.tsx`: removed side effects during render, added root caching for `mountWidget`, and replaced dynamic Tailwind `maxHeight` class with inline style support via new `style` prop on `WidgetBase`.
- [BUG][DX] `packages/widgets/docs/examples/example-widget/main.tsx` and `packages/widgets/docs/examples/enhanced-example-widget/main.tsx`: explicit `mountWidget` usage to avoid auto-mounting side effects in `createWidget`.
- [A11Y][DX] `packages/ui/src/components/ui/navigation/ModeSelector/ModeSelector.tsx`: added focus trap with Escape + focus restore, dialog semantics, non-interactive overlay, and explicit button type/ref handling.
- [CLEAN] `packages/ui/src/storybook/pages/DashboardPage/DashboardPage.tsx`: removed redundant `cursor-pointer` class from `ListItem` (already applied when clickable).
- [CLEAN][DX] `platforms/web/apps/web/src/pages/SettingsPage.tsx`: removed console logs; added `onExportSettings`, `onResetDefaults`, `onSaveSettings` callbacks for production wiring.
- [BUG][CLEAN][DX] `platforms/web/apps/web/src/pages/ProfilePage.tsx`: fixed `ListItem` usage to render activity text via `label`/`right`; added `onExportData`, `onOpenPrivacySettings`, `onSaveProfile` callbacks.
- [CLEAN][A11Y][SEC] `platforms/web/apps/web/src/pages/AboutPage.tsx`: replaced direct `window.open` usage with `onOpenGithub` hook and added `noopener,noreferrer` fallback.
- [CLEAN][DX] `packages/widgets/src/shared/openai-hooks.ts`: gated console warnings behind dev-only flag to keep production output clean.
- [CLEAN][DX] `packages/widgets/src/shopping-cart/shopping-cart.tsx`: gated missing `sendFollowUpMessage` warning behind dev-only flag.
- [CLEAN][DX] `packages/widgets/docs/examples/example-widget/main.tsx` and `packages/widgets/docs/examples/enhanced-example-widget/main.tsx`: gated tool-call error/warn logs to dev-only.
- [A11Y][BUG] `packages/ui/src/components/ui/base/ListItem/ListItem.tsx`: avoid invalid `disabled` prop on non-button elements by only applying disabled/type to button variant.
- [BUG][DX] `packages/ui/src/storybook/pages/DashboardPage/DashboardPage.stories.tsx`: fixed `ListItem` usage to use `label`/`selected` props instead of unsupported children/active prop.
- [SEC][A11Y] `platforms/web/apps/web/src/pages/HarnessPage.tsx`: added `noopener,noreferrer` when opening widget preview in a new tab.
- [A11Y][BUG] `packages/ui/src/components/ui/overlays/Modal/Modal.tsx`: ensured `aria-describedby` always targets a real element and added hidden description node; stabilized IDs to avoid `undefined-description`.
- [A11Y][BUG] `packages/ui/src/components/ui/navigation/ModelSelector/ModelSelector.tsx`: added `type="button"` to non-submit buttons and preserved disabled behavior for safer form embedding.
- [A11Y][BUG] Added explicit `type="button"` to non-submit buttons across settings panels, modals, chat components, and UI primitives to prevent accidental form submissions.
- [CLEAN][DX] `packages/ui/src/app/chat/ChatInput/ChatInput.tsx`: removed dead internal `activeTag` state; added controlled `activeTag` and `onClearActiveTag` props.
- [SEC] `packages/widgets/src/pizzaz-markdown/main.tsx`: added `noopener` to external link rel for `target="_blank"`.
- [CLEAN][PERF] Replaced index keys with stable keys in lists:
  - `packages/widgets/docs/examples/example-widget/main.tsx`
  - `packages/widgets/docs/examples/enhanced-example-widget/main.tsx`
  - `packages/ui/src/components/ui/navigation/ModeSelector/ModeSelector.tsx`
- [A11Y] `packages/ui/src/components/ui/base/Toggle/Toggle.tsx`: added accessible labeling props and wired `ToggleRow` to use `aria-labelledby`/`aria-describedby`.
- [A11Y] Added explicit `ariaLabel` for inline `Toggle` usages in `ComposeView`, `DiscoverySettingsModal`, and `platforms/web/apps/web` Settings page.
- [A11Y] `packages/ui/src/components/ui/base/Toggle/Toggle.stories.tsx`: added `ariaLabel` for standalone Toggle story examples.
- [A11Y] `packages/ui/src/components/ui/base/SegmentedControl/SegmentedControl.tsx`: added `role="radiogroup"` and `role="radio"` + `aria-checked` for better screen reader support.
- [CLEAN][PERF] Replaced index keys with stable keys in settings lists:
  - `packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx`
  - `packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx`
  - `packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`
- [CLEAN][PERF] `packages/widgets/src/solar-system/solar-system.tsx`: removed unused key on `motion.span` and used stable key for streamed words.
- [A11Y][BUG] `platforms/web/apps/web/src/pages/HarnessPage.tsx`: added explicit `type="button"` for widget selection buttons to prevent unintended form submits.
- [A11Y] `packages/ui/src/components/ui/overlays/Tooltip/fallback/Tooltip.tsx`: added light fill token for tooltip arrow to avoid dark-only token usage.
- [A11Y] `packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx`: added labeled back control and search input aria-label for archived chat search.
- [A11Y] `packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.tsx`: upgraded switch buttons to `role="switch"` with `aria-checked` and label associations; labeled back control.
- [A11Y] `packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx`: upgraded MFA switch to `role="switch"` with label association; labeled back control.
- [A11Y] `packages/ui/src/components/ui/forms/RangeSlider/RangeSlider.tsx`: added `useId` + `htmlFor` label wiring and fallback `aria-label` prop for unlabeled sliders.
- [A11Y] `packages/ui/src/components/ui/base/IconButton/IconButton.tsx`: accepted standard `aria-label`/`aria-labelledby` props and wired them to the underlying button for lint/a11y parity.
- [A11Y] `packages/ui/src/components/ui/base/RadioGroup/fallback/RadioGroup.tsx`: paired dark-only background token with a light-mode counterpart.
- [A11Y] `packages/ui/src/components/ui/base/Select/fallback/Select.tsx`: added light hover token to pair with dark hover styles under media-based theming.
- [A11Y] `packages/ui/src/components/ui/overlays/Modal/Modal.tsx`: wired focus-trap ref to the dialog element to ensure correct focus management.
- [BUG] `packages/ui/src/app/chat/ChatSidebar/ChatSidebar.tsx`: removed duplicate `type` attribute on collapse/expand button.
