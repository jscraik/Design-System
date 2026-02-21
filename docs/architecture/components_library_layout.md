# Components Library Layout

Last updated: 2026-01-09

## Doc requirements

- Audience: Engineers and technical leads
- Scope: System architecture and component relationships
- Non-scope: Step-by-step operational procedures
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overall Structure](#overall-structure)
- [Component Structure Details](#component-structure-details)
  - [React Components Structure](#react-components-structure)
- [Cross-Platform Considerations](#cross-platform-considerations)
  - [Shared Design Tokens](#shared-design-tokens)
  - [Platform-Specific Implementations](#platform-specific-implementations)
  - [Documentation](#documentation)

This document outlines the folder structure for a component library supporting React and Apps SDK surfaces.

## Overall Structure

Repo-specific note: in this workspace, shared hooks live in `packages/ui/src/hooks`, sample data lives in `packages/ui/src/fixtures`, and Storybook/demo pages live in `packages/ui/src/storybook`.

```
components-library/
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── Button/
│   │   │   │   │   │   ├── Button.tsx
│   │   │   │   │   │   ├── Button.stories.tsx
│   │   │   │   │   │   └── Button.test.tsx
│   │   │   │   │   ├── Card/
│   │   │   │   │   │   ├── Card.tsx
│   │   │   │   │   │   ├── Card.stories.tsx
│   │   │   │   │   │   └── Card.test.tsx
│   │   │   │   │   ├── Input/
│   │   │   │   │   │   ├── Input.tsx
│   │   │   │   │   │   ├── Input.stories.tsx
│   │   │   │   │   │   └── Input.test.tsx
│   │   │   │   │   ├── Modal/
│   │   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   │   ├── Modal.stories.tsx
│   │   │   │   │   │   └── Modal.test.tsx
│   │   │   │   │   ├── Accordion/
│   │   │   │   │   │   ├── Accordion.tsx
│   │   │   │   │   │   ├── Accordion.stories.tsx
│   │   │   │   │   │   └── Accordion.test.tsx
│   │   │   │   │   ├── Collapsible/
│   │   │   │   │   │   ├── Collapsible.tsx
│   │   │   │   │   │   ├── Collapsible.stories.tsx
│   │   │   │   │   │   └── Collapsible.test.tsx
│   │   │   │   │   ├── Tabs/
│   │   │   │   │   │   ├── Tabs.tsx
│   │   │   │   │   │   ├── Tabs.stories.tsx
│   │   │   │   │   │   └── Tabs.test.tsx
│   │   │   │   │   ├── Tooltip/
│   │   │   │   │   │   ├── Tooltip.tsx
│   │   │   │   │   │   ├── Tooltip.stories.tsx
│   │   │   │   │   │   └── Tooltip.test.tsx
│   │   │   │   │   ├── Popover/
│   │   │   │   │   │   ├── Popover.tsx
│   │   │   │   │   │   ├── Popover.stories.tsx
│   │   │   │   │   │   └── Popover.test.tsx
│   │   │   │   │   ├── HoverCard/
│   │   │   │   │   │   ├── HoverCard.tsx
│   │   │   │   │   │   ├── HoverCard.stories.tsx
│   │   │   │   │   │   └── HoverCard.test.tsx
│   │   │   │   │   ├── Dialog/
│   │   │   │   │   │   ├── Dialog.tsx
│   │   │   │   │   │   ├── Dialog.stories.tsx
│   │   │   │   │   │   └── Dialog.test.tsx
│   │   │   │   │   ├── AlertDialog/
│   │   │   │   │   │   ├── AlertDialog.tsx
│   │   │   │   │   │   ├── AlertDialog.stories.tsx
│   │   │   │   │   │   └── AlertDialog.test.tsx
│   │   │   │   │   ├── Sheet/
│   │   │   │   │   │   ├── Sheet.tsx
│   │   │   │   │   │   ├── Sheet.stories.tsx
│   │   │   │   │   │   └── Sheet.test.tsx
│   │   │   │   │   └── Drawer/
│   │   │   │   │       ├── Drawer.tsx
│   │   │   │   │       ├── Drawer.stories.tsx
│   │   │   │   │       └── Drawer.test.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useControllableState.ts
│   │   │   │   │   ├── useMediaQuery.ts
│   │   │   │   │   └── useId.ts
│   │   │   │   ├── utils/
│   │   │   │   │   ├── cn.ts
│   │   │   │   │   └── helpers.ts
│   │   │   │   ├── styles/
│   │   │   │   │   ├── globals.css
│   │   │   │   │   ├── theme.css
│   │   │   │   │   └── components.css
│   │   │   │   └── types/
│   │   │   │       └── index.ts
│   │   │   ├── __tests__/
│   │   │   ├── stories/
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   └── vite.config.ts
│   ├── tokens/
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   │   ├── color/
│   │   │   │   │   ├── light.json
│   │   │   │   │   ├── dark.json
│   │   │   │   │   └── index.ts
│   │   │   │   ├── spacing/
│   │   │   │   │   ├── spacing.json
│   │   │   │   │   └── index.ts
│   │   │   │   ├── typography/
│   │   │   │   │   ├── typography.json
│   │   │   │   │   └── index.ts
│   │   │   │   └── sizing/
│   │   │   │       ├── sizing.json
│   │   │   │       └── index.ts
│   │   │   ├── build/
│   │   │   ├── package.json
│   │   │   └── tokens.config.json
│   └── runtime/
│       ├── src/
│       │   ├── index.ts
│       │   ├── client/
│       │   │   └── api.ts
│       │   ├── server/
│       │   │   └── api.ts
│       │   └── types/
│       │       └── index.ts
│       ├── package.json
│       └── tsconfig.json
│   ├── AStudioComponents/
│   │   ├── Sources/
│   │   │   ├── AStudioComponents/
│   │   │   │   ├── Components/
│   │   │   │   │   ├── Button/
│   │   │   │   │   │   ├── Button.swift
│   │   │   │   │   │   └── Button+Configuration.swift
│   │   │   │   │   ├── Card/
│   │   │   │   │   │   ├── Card.swift
│   │   │   │   │   │   └── Card+Configuration.swift
│   │   │   │   │   ├── Input/
│   │   │   │   │   │   ├── Input.swift
│   │   │   │   │   │   └── Input+Configuration.swift
│   │   │   │   │   ├── Modal/
│   │   │   │   │   │   ├── Modal.swift
│   │   │   │   │   │   └── Modal+Configuration.swift
│   │   │   │   │   ├── Accordion/
│   │   │   │   │   │   ├── Accordion.swift
│   │   │   │   │   │   └── Accordion+Configuration.swift
│   │   │   │   │   ├── Collapsible/
│   │   │   │   │   │   ├── Collapsible.swift
│   │   │   │   │   │   └── Collapsible+Configuration.swift
│   │   │   │   │   ├── Tabs/
│   │   │   │   │   │   ├── Tabs.swift
│   │   │   │   │   │   └── Tabs+Configuration.swift
│   │   │   │   │   ├── Tooltip/
│   │   │   │   │   │   ├── Tooltip.swift
│   │   │   │   │   │   └── Tooltip+Configuration.swift
│   │   │   │   │   ├── Popover/
│   │   │   │   │   │   ├── Popover.swift
│   │   │   │   │   │   └── Popover+Configuration.swift
│   │   │   │   │   ├── HoverCard/
│   │   │   │   │   │   ├── HoverCard.swift
│   │   │   │   │   │   └── HoverCard+Configuration.swift
│   │   │   │   │   ├── Dialog/
│   │   │   │   │   │   ├── Dialog.swift
│   │   │   │   │   │   └── Dialog+Configuration.swift
│   │   │   │   │   ├── AlertDialog/
│   │   │   │   │   │   ├── AlertDialog.swift
│   │   │   │   │   │   └── AlertDialog+Configuration.swift
│   │   │   │   │   ├── Sheet/
│   │   │   │   │   │   ├── Sheet.swift
│   │   │   │   │   │   └── Sheet+Configuration.swift
│   │   │   │   │   └── Drawer/
│   │   │   │   │       ├── Drawer.swift
│   │   │   │   │       └── Drawer+Configuration.swift
│   │   │   │   ├── Foundation/
│   │   │   │   │   ├── Theme.swift
│   │   │   │   │   ├── Color.swift
│   │   │   │   │   ├── Typography.swift
│   │   │   │   │   └── Spacing.swift
│   │   │   │   └── Utils/
│   │   │   │       ├── Extensions.swift
│   │   │   │       └── Helpers.swift
│   │   │   └── AStudioComponents.docc/
│   │   │       └── AStudioComponents.md
│   │   ├── Tests/
│   │   │   ├── AStudioComponentsTests/
│   │   │   │   ├── ButtonTests.swift
│   │   │   │   ├── CardTests.swift
│   │   │   │   ├── InputTests.swift
│   │   │   │   └── ModalTests.swift
│   │   │   └── LinuxMain.swift
│   │   ├── Package.swift
│   │   └── README.md
│   ├── AStudioThemes/
│   │   ├── Sources/
│   │   │   └── AStudioThemes/
│   │   │       ├── Theme.swift
│   │   │       ├── Color.swift
│   │   │       ├── Typography.swift
│   │   │       └── Spacing.swift
│   │   ├── Tests/
│   │   │   └── AStudioThemesTests/
│   │   │       └── AStudioThemesTests.swift
│   │   ├── Package.swift
│   │   └── README.md
│   └── AStudioFoundation/
│       ├── Sources/
│       │   └── AStudioFoundation/
│       │       ├── Foundation/
│       │       │   ├── Color.swift
│       │       │   ├── Typography.swift
│       │       │   ├── Spacing.swift
│       │       │   └── Sizing.swift
│       │       ├── Utils/
│       │       │   └── Extensions.swift
│       │       └── Protocols/
│       │           └── ComponentProtocol.swift
│       ├── Tests/
│       │   └── AStudioFoundationTests/
│       │       └── FoundationTests.swift
│       ├── Package.swift
│       └── README.md
├── docs/
│   ├── components/
│   │   ├── button.md
│   │   ├── card.md
│   │   ├── input.md
│   │   ├── modal.md
│   │   ├── accordion.md
│   │   ├── collapsible.md
│   │   ├── tabs.md
│   │   ├── tooltip.md
│   │   ├── popover.md
│   │   ├── hover-card.md
│   │   ├── dialog.md
│   │   ├── alert-dialog.md
│   │   ├── sheet.md
│   │   └── drawer.md
│   ├── getting-started/
│   │   ├── react.md
│   │   └── swift.md
│   ├── theming/
│   │   └── customizing-themes.md
│   └── architecture/
│       └── cross-platform-design.md
├── scripts/
│   ├── build.mjs
│   ├── test.mjs
│   ├── lint.mjs
│   └── release.mjs
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── release.yml
│       └── pr.yml
├── README.md
├── CONTRIBUTING.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tailwind.config.ts
└── vite.config.ts
```

## Component Structure Details

### React Components Structure

Each React component follows the same pattern:

- `ComponentName.tsx` - Main component implementation
- `ComponentName.stories.tsx` - Storybook stories for component
- `ComponentName.test.tsx` - Unit tests for component
- `ComponentName.types.ts` - Type definitions (if needed)

## Cross-Platform Considerations

### Shared Design Tokens

- Color tokens (light/dark mode)
- Spacing tokens
- Typography tokens
- Sizing tokens
- Elevation tokens

### Platform-Specific Implementations

- React components leverage web APIs and are reused in Tauri shells and Apps SDK surfaces.
- Desktop integrations live outside the UI library; UI components stay platform-agnostic.
- Common behavior patterns are maintained across web and desktop shells.

### Documentation

- Component usage guidelines
- API documentation
- Cross-platform behavior notes
- Accessibility considerations
