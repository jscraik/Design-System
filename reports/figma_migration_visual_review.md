# Figma Migration — Visual Review Backlog

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


**Created:** 2026-01-02  
**Purpose:** Now that the templates gallery is driven by the canonical `@chatui/ui` sources (and `_temp/**` is archived), this backlog tracks **visual parity + polish** items to review and iterate after functional consolidation.

## How to review

1. Start the gallery: `pnpm dev:templates-gallery` (defaults to `http://localhost:3001`).
2. Compare against the Figma source project and/or the archived reference app in `_temp/ChatGPT UI Templates (1)`.
3. Log differences here with:
   - **Observed issue**
   - **Expected (Figma)**
   - **Actual (current)**
   - **File pointer(s)**
   - **Priority**: P0 (blocks usage) / P1 (high) / P2 (polish)

## Gallery shell (app chrome)

- [ ] Sidebar density + spacing parity (P1) — `platforms/web/apps/web/src/pages/TemplatesGalleryPage.tsx`
- [ ] Preview container styling (radius/shadow/border) parity (P2) — `platforms/web/apps/web/src/pages/TemplatesGalleryPage.tsx`
- [ ] Keyboard focus visibility + order in sidebar (P0) — `platforms/web/apps/web/src/pages/TemplatesGalleryPage.tsx`

## Layouts

- [ ] Compose template polish (P2) — `packages/ui/src/templates/ComposeTemplate/ComposeTemplate.tsx`
- [ ] Chat template polish (P2) — `packages/ui/src/templates/ChatTemplate/ChatTemplate.tsx`
- [ ] Chat header template parity (P1) — `packages/ui/src/templates/ChatHeaderTemplate/ChatHeaderTemplate.tsx`
- [ ] Chat sidebar template parity (P1) — `packages/ui/src/templates/ChatSidebarTemplate/ChatSidebarTemplate.tsx`
- [ ] Chat messages template parity (P1) — `packages/ui/src/templates/ChatMessagesTemplate/ChatMessagesTemplate.tsx`
- [ ] Chat input template parity (P1) — `packages/ui/src/templates/ChatInputTemplate/ChatInputTemplate.tsx`
- [ ] Chat variants template parity (P2) — `packages/ui/src/templates/ChatVariantsTemplate/ChatVariantsTemplate.tsx`

## Templates (slot-based / legacy)

- [ ] Chat Full Width slot styling parity (P2) — `packages/ui/src/templates/ChatFullWidthTemplate/ChatFullWidthTemplate.tsx`
- [ ] Chat Two Pane slot styling parity (P2) — `packages/ui/src/templates/ChatTwoPaneTemplate/ChatTwoPaneTemplate.tsx`
- [ ] Dashboard template visual polish (P2) — `packages/ui/src/templates/DashboardTemplate/DashboardTemplate.tsx`

## Components (demos)

- [ ] New Components Showcase contrast + spacing pass (P2) — `packages/ui/src/templates/NewComponentsShowcase/NewComponentsShowcase.tsx`
- [ ] Chat Header demo states parity (P2) — `packages/ui/src/templates/demos/ChatHeaderDemo/ChatHeaderDemo.tsx`
- [ ] Model Selector demo parity (P2) — `packages/ui/src/templates/demos/ModelSelectorDemo/ModelSelectorDemo.tsx`
- [ ] Chat Input demo parity (P2) — `packages/ui/src/templates/demos/ChatInputDemo/ChatInputDemo.tsx`
- [ ] Attachment Menu demo parity (P2) — `packages/ui/src/templates/demos/AttachmentMenuDemo/AttachmentMenuDemo.tsx`

## Panels

- [ ] Apps panel parity (P2) — `packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx`
- [ ] Archived chats panel parity (P2) — `packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx`
- [ ] Audio settings panel parity (P2) — `packages/ui/src/app/settings/AudioSettingsPanel/AudioSettingsPanel.tsx`
- [ ] Check for updates panel parity (P2) — `packages/ui/src/app/settings/CheckForUpdatesPanel/CheckForUpdatesPanel.tsx`
- [ ] Data controls panel parity (P2) — `packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.tsx`
- [ ] Manage apps panel parity (P2) — `packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx`
- [ ] Notifications panel parity (P2) — `packages/ui/src/app/settings/NotificationsPanel/NotificationsPanel.tsx`
- [ ] Personalization panel parity (P2) — `packages/ui/src/app/settings/PersonalizationPanel/PersonalizationPanel.tsx`
- [ ] Security panel parity (P2) — `packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx`

## Modals (demos)

- [ ] Icon picker modal spacing + focus trap verification (P1) — `packages/ui/src/app/modals/IconPickerModal/IconPickerModal.tsx`
- [ ] Discovery settings modal controls alignment (P1) — `packages/ui/src/app/modals/DiscoverySettingsModal/DiscoverySettingsModal.tsx`
- [ ] Settings modal section layout parity (P1) — `packages/ui/src/app/modals/SettingsModal/SettingsModal.tsx`

## Design system (showcases)

- [ ] Foundations showcase layout parity (P2) — `packages/ui/src/design-system/showcase/FoundationsShowcase.tsx`
- [ ] Color showcase token rendering parity (P2) — `packages/ui/src/design-system/showcase/ColorShowcase.tsx`
- [ ] Typography showcase (P2) — `packages/ui/src/design-system/showcase/TypographyShowcase.tsx`
- [ ] Spacing showcase (P2) — `packages/ui/src/design-system/showcase/SpacingShowcase.tsx`
- [ ] Iconography showcase (P2) — `packages/ui/src/design-system/showcase/IconographyShowcase.tsx`
- [ ] Design system docs layout + code block styling (P2) — `packages/ui/src/design-system/showcase/DesignSystemDocs.tsx`

## Blocks (samples)

- [ ] TemplateShell sample sizing + dividers (P2) — `packages/ui/src/templates/blocks/registry.tsx`
- [ ] TemplatePanel sample variants (P2) — `packages/ui/src/templates/blocks/registry.tsx`
- [ ] TemplateHeaderBar sample alignment (P2) — `packages/ui/src/templates/blocks/registry.tsx`
- [ ] TemplateFooterBar sample alignment (P2) — `packages/ui/src/templates/blocks/registry.tsx`
- [ ] Form field + field group samples (P2) — `packages/ui/src/templates/blocks/registry.tsx`
- [ ] Chat blocks sample spacing (P2) — `packages/ui/src/templates/blocks/registry.tsx`
- [ ] Settings blocks sample spacing (P2) — `packages/ui/src/templates/blocks/registry.tsx`
