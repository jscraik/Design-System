# Template Library Architecture

Last updated: 2026-01-04

## Doc requirements
- Audience: Engineers and technical leads
- Scope: System architecture and component relationships
- Non-scope: Step-by-step operational procedures
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Goals](#goals)
- [Repo-accurate structure (source of truth)](#repo-accurate-structure-source-of-truth)
- [Core building blocks (React)](#core-building-blocks-react)
- [Core building blocks (SwiftUI)](#core-building-blocks-swiftui)
- [Cross-platform parity rules](#cross-platform-parity-rules)
- [Accessibility requirements](#accessibility-requirements)
- [Usage examples](#usage-examples)
  - [React](#react)
  - [SwiftUI](#swiftui)
- [Related docs](#related-docs)
- [How to view templates (checklist)](#how-to-view-templates-checklist)


This document describes the internal template library used to compose ChatUI surfaces across web, widgets, and macOS.

## Goals

- Provide reusable layout shells + blocks that slot together quickly.
- Keep visual parity across React, Widgets, SwiftUI, and AppKit.
- Ensure accessibility and reduced-motion defaults.

## Repo-accurate structure (source of truth)

- React templates: `packages/ui/src/templates`
- React blocks: `packages/ui/src/templates/blocks`
- React registries:
  - Templates: `packages/ui/src/templates/registry.ts`
  - Blocks: `packages/ui/src/templates/blocks/registry.ts`
- SwiftUI templates + blocks: `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/Templates`
- SwiftUI registry: `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/Templates/TemplateRegistry.swift`
- Widgets: `packages/widgets/src/widgets/**` (each widget renders a template from `@chatui/ui/templates`)

## Core building blocks (React)

- `TemplateShell`: layout frame with optional sidebar/header/body/footer/detail slots.
- `TemplatePanel`: card wrapper with tokenized background/border.
- `TemplateHeaderBar`: reusable header bar with title + optional leading/trailing actions.
- `TemplateFooterBar`: reusable footer/action bar with left/right groups.
- `TemplateFormField`: label + optional actions + content stack for form fields.
- `TemplateFieldGroup`: label + actions row + content stack for multi-line groups.
- `ChatHeaderBlock`: wrapper for `ChatHeader`.
- `ChatSidebarBlock`: wrapper for `ChatSidebar`.
- `ChatMessagesBlock`: wrapper for `ChatMessages`.
- `ChatInputBlock`: wrapper for `ChatInput`.
- `SettingRowBlock`: wrapper for `SettingRow`.
- `SettingToggleBlock`: wrapper for `SettingToggle`.
- `SettingDropdownBlock`: wrapper for `SettingDropdown`.
- Templates:
  - `ComposeTemplate`
  - `ChatTemplate`
  - `ChatHeaderTemplate`
  - `ChatSidebarTemplate`
  - `ChatMessagesTemplate`
  - `ChatInputTemplate`
  - `AppsPanelTemplate`
  - `ArchivedChatsPanelTemplate`
  - `AudioSettingsPanelTemplate`
  - `CheckForUpdatesPanelTemplate`
  - `DataControlsPanelTemplate`
  - `ManageAppsPanelTemplate`
  - `NotificationsPanelTemplate`
  - `PersonalizationPanelTemplate`
  - `SecurityPanelTemplate`

## Core building blocks (SwiftUI)

- `TemplateHeaderBarView`: header bar with title + optional actions.
- `TemplateFooterBarView`: footer/action bar with left/right groups.
- `TemplateFormFieldView`: label + optional actions + content stack for form fields.
- `TemplateFieldGroupView`: label + actions row + content stack for grouped fields.
- `ChatHeaderBlockView`: chat header block (SwiftUI).
- `ChatSidebarBlockView`: chat sidebar block (SwiftUI).
- `ChatMessagesBlockView`: chat messages list block (SwiftUI).
- `ChatInputBlockView`: chat input block (SwiftUI).
- Templates:
  - `ComposeView`
  - `ChatTemplateView`
  - `ChatHeaderTemplateView`
  - `ChatSidebarTemplateView`
  - `ChatMessagesTemplateView`
  - `ChatInputTemplateView`
  - `ChatVariantsTemplateView`

## Cross-platform parity rules

- Use ChatUIFoundation tokens (colors, spacing, typography) in SwiftUI.
- Use foundation CSS tokens in React/Widgets (`--foundation-*`).
- Avoid ad-hoc sizing; prefer `FSpacing` and `FType` in Swift.
- Keep action labels and icon semantics consistent between platforms.

## Accessibility requirements

- All icon-only buttons must have accessible labels.
- Focus order: list → content → actions, without focus traps.
- Reduced motion: disable or shorten animations when enabled.
- Contrast: active/hover states must meet WCAG 2.2 AA.

## Usage examples

### React

```tsx
import { TemplatePanel, TemplateHeaderBar, TemplateFooterBar } from "@chatui/ui/templates";

<TemplatePanel
  header={<TemplateHeaderBar title="Compose" />}
  footer={<TemplateFooterBar leading={<Actions />} trailing={<Submit />} />}
>
  <ComposeForm />
</TemplatePanel>;
```

### SwiftUI

```swift
TemplateHeaderBarView(title: "Compose")
TemplateFooterBarView(
    leading: AnyView(ComposeToolsRow()),
    trailing: AnyView(ComposeSendRow())
)
```

## Related docs

- `docs/architecture/template-api.md`

## How to view templates (checklist)

- Storybook: run `pnpm dev:storybook`, open **Components → Templates → Gallery**.
- SwiftUI previews: open the Swift files in Xcode (e.g. `ChatTemplateView.swift`) and render `#Preview` blocks.
