# UI Library Organization

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This document explains how the UI library is structured for discoverability and reuse across chat surfaces, Storybook, and templates.

## Table of contents

- [Directory structure](#directory-structure)
- [Component categories](#component-categories)
- [Import patterns](#import-patterns)
- [Adding new components](#adding-new-components)
- [Design principles](#design-principles)
- [Verify](#verify)

## Directory Structure

```
src/
├── app/                     # App-level chat surfaces and flows
│   ├── chat/
│   ├── modals/
│   └── settings/
├── components/
│   └── ui/                  # Base UI primitives
├── design-system/
│   └── showcase/            # Design system docs + showcase views
├── fixtures/                # Sample data for demos/templates
├── hooks/                   # Shared hooks
├── icons/                   # Canonical icon system
├── integrations/
│   ├── apps-sdk/            # Apps SDK adapter layer
│   └── figma/               # Figma helpers
├── storybook/               # Storybook pages and docs
├── templates/               # Template composites
└── testing/                 # Test utilities + mocks
```

## Component Categories

### `app/chat` - Chat Surfaces

Chat-specific components for the main chat interface.

**Components:**

- `ChatHeader` - Top navigation bar with model selector
- `ChatInput` - Message input with attachments
- `ChatMessages` - Message list display
- `ChatSidebar` - Left sidebar with conversations
- `ComposeView` - Compose mode interface
- `ChatShell` - Slot-based layout container for chat variants
- `ChatVariantSplitSidebar` - Desktop-style sidebar layout
- `ChatVariantCompact` - Compact layout for small surfaces
- `ChatVariantContextRail` - Right-rail context panel layout

**Usage:**

```tsx
import { ChatHeader, ChatInput, ChatMessages } from "@chatui/ui";
```

### `app/modals` - Modal Dialogs

Reusable modal dialog components.

**Components:**

- `SettingsModal` - Main settings dialog
- `DiscoverySettingsModal` - Discovery configuration
- `IconPickerModal` - Icon selection dialog

**Usage:**

```tsx
import { SettingsModal } from "@chatui/ui/modals";
```

### `app/settings` - Settings System

Modular settings panels and reusable setting controls.

**Panels:**

- `PersonalizationPanel`
- `NotificationsPanel`
- `AppsPanel`
- `DataControlsPanel`
- `ArchivedChatsPanel`
- `SecurityPanel`
- `ManageAppsPanel`
- `CheckForUpdatesPanel`
- `AudioSettingsPanel`

**Reusable Controls:**

- `SettingRow` - Generic settings row
- `SettingToggle` - Toggle switch
- `SettingDropdown` - Radix-based dropdown

**Usage:**

```tsx
import { SettingRow, SettingToggle } from "@chatui/ui/settings";
```

### `design-system/showcase` - Design System Documentation

Components that demonstrate and document the design system.

**Components:**

- `ColorPaletteShowcase`
- `ColorShowcase`
- `DesignSystemDocs`
- `FoundationsShowcase`
- `IconographyShowcase`
- `SpacingShowcase`
- `TypographyShowcase`

**Usage:**

```tsx
import { DesignSystemDocs } from "@chatui/ui/showcase";
```

### `integrations/figma` - Figma Utilities

Utilities for Figma integration.

**Components:**

- `ImageWithFallback` - Image component with fallback handling

### `icons` - Icon Library

ChatGPT icon system (canonical source).

**Usage:**

```tsx
import { IconSettings, IconUser } from "@chatui/ui";
```

### `components/ui` - Base UI Primitives

Low-level reusable UI components organized by category.

**Structure:**

```
components/ui/
├── base/           # Buttons, badges, cards
├── chat/           # Chat-specific UI elements
├── data-display/   # Tables, lists, stats
├── feedback/       # Alerts, toasts, progress
├── forms/          # Inputs, selects, sliders
├── layout/         # Containers, grids, dividers
├── navigation/     # Tabs, breadcrumbs, menus
└── overlays/       # Modals, popovers, tooltips
```

**Naming:** Component folders and files use `PascalCase` (e.g. `Button/Button.tsx`), while category folders stay `kebab-case` (e.g. `data-display`).

**Usage:**

```tsx
import { Button, Card, Toggle } from "@chatui/ui";
```

## Import Patterns

### Direct Imports (Recommended)

```tsx
import { ChatHeader } from "@chatui/ui";
import { SettingRow } from "@chatui/ui/settings";
```

### Barrel Imports

Each category has an `index.ts` for convenient imports:

```tsx
import { SettingsModal, IconPickerModal } from "@chatui/ui/modals";
import { DesignSystemDocs } from "@chatui/ui/showcase";
```

## Adding New Components

### 1. Choose the Right Category

- **Chat surfaces** → `app/chat`
- **Modal dialogs** → `app/modals`
- **Settings panels** → `app/settings`
- **Design system docs** → `design-system/showcase`
- **Reusable primitives** → `components/ui`

### 2. Create Component Files

```
ComponentName.tsx
ComponentName.stories.tsx (if applicable)
```

### 3. Update Barrel Export

Add to the category's `index.ts`:

```tsx
export { ComponentName } from "./ComponentName";
```

### 4. Update Main Index (if needed)

For commonly used components, add to `packages/ui/src/index.ts`

## Design Principles

1. **Separation of Concerns** - Each category has a clear purpose
2. **Reusability** - Components are designed to be reused across apps
3. **Discoverability** - Clear naming and organization
4. **Tree-Shaking** - Barrel exports enable optimal bundling
5. **Co-location** - Stories live next to components

## Migration Notes

## Verify

- Run Storybook (`pnpm dev:storybook`) and confirm components appear under the expected section.

Components were reorganized from a flat structure to this categorized structure on 2025-12-28. All import paths have been updated throughout the codebase.
