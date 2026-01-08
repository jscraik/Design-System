# Modal Module Boundaries

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [1. Infrastructure Layer (Stateless, Reusable)](#1-infrastructure-layer-stateless-reusable)
  - [Location: `packages/ui/src/hooks/` + `packages/ui/src/components/ui/`](#location-packagesuisrchooks-packagesuisrccomponentsui)
- [2. Feature Modals (Stateful, Business Logic)](#2-feature-modals-stateful-business-logic)
  - [Location: `packages/ui/src/app/modals/`](#location-packagesuisrcappmodals)
- [3. Settings Components (Leaf Building Blocks)](#3-settings-components-leaf-building-blocks)
  - [Location: `packages/ui/src/app/settings/`](#location-packagesuisrcappsettings)
- [4. Panel Components (Nested Views)](#4-panel-components-nested-views)
  - [Location: `packages/ui/src/app/settings/`](#location-packagesuisrcappsettings-1)
- [5. Dependency Graph (Acyclic)](#5-dependency-graph-acyclic)
- [6. State Ownership Rules](#6-state-ownership-rules)
  - [Infrastructure (OWNED: None, PASS-THROUGH: All)](#infrastructure-owned-none-pass-through-all)
  - [Feature Modals (OWNED: Business State)](#feature-modals-owned-business-state)
  - [Settings Components (OWNED: None, CONTROLLED)](#settings-components-owned-none-controlled)
- [7. Data Flow Patterns](#7-data-flow-patterns)
  - [Pattern A: Synced State (DiscoverySettingsModal, IconPickerModal)](#pattern-a-synced-state-discoverysettingsmodal-iconpickermodal)
  - [Pattern B: Local-Only State (SettingsModal, PersonalizationPanel)](#pattern-b-local-only-state-settingsmodal-personalizationpanel)
  - [Pattern C: Controlled Components (SettingRow, SettingToggle, SettingDropdown)](#pattern-c-controlled-components-settingrow-settingtoggle-settingdropdown)
- [8. Future Modal Guidelines](#8-future-modal-guidelines)
  - [When to Create a New Modal](#when-to-create-a-new-modal)
  - [State Ownership Checklist](#state-ownership-checklist)
  - [Example: Creating a New Modal](#example-creating-a-new-modal)
- [9. Anti-Patterns to Avoid](#9-anti-patterns-to-avoid)
  - [❌ Duplicate Focus Trap Logic](#duplicate-focus-trap-logic)
  - [❌ Direct DOM Manipulation](#direct-dom-manipulation)
  - [❌ Complex Object Callbacks](#complex-object-callbacks)
  - [❌ State Drift Without Sync](#state-drift-without-sync)
- [10. Testing Strategy](#10-testing-strategy)
  - [Infrastructure Tests](#infrastructure-tests)
  - [Component Tests](#component-tests)
- [Summary](#summary)


## Overview

This document defines the module boundaries, state ownership, and dependencies for the modal system in ChatUI.

---

## 1. Infrastructure Layer (Stateless, Reusable)

### Location: `packages/ui/src/hooks/` + `packages/ui/src/components/ui/`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HOOKS (hooks/)                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  useFocusTrap.ts                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │ RESPONSIBILITIES:                                               │ │   │
│  │  │ • Focus capture (dialogRef.current?.focus())                   │ │   │
│  │  │ • Focus trap (Tab/Shift+Tab cycling)                           │ │   │
│  │  │ • Escape key handling → onClose() callback                     │ │   │
│  │  │ • Focus restoration (lastActiveRef.current?.focus())           │ │   │
│  │  │                                                                  │ │   │
│  │  │ STATE (internal, private):                                      │ │   │
│  │  │ • dialogRef: RefObject<HTMLDivElement>                          │ │   │
│  │  │ • lastActiveRef: RefObject<HTMLElement | null>                 │ │   │
│  │  │                                                                  │ │   │
│  │  │ OUTPUT:                                                          │ │   │
│  │  │ • dialogRef, trapProps (ref, tabIndex)                         │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  UI OVERLAYS (ui/overlays/)                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  modal.tsx                                                            │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │ ModalDialog (stateless wrapper)                                  │ │   │
│  │  │ • Uses useFocusTrap internally                                  │ │   │
│  │  │ • Renders overlay button (optional)                              │ │   │
│  │  │ • Renders dialog container with ARIA                            │ │   │
│  │  │                                                                  │ │   │
│  │  │ ModalHeader, ModalBody, ModalFooter (layout)                    │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

EXPORTS: `useFocusTrap`, `ModalDialog`, `ModalHeader`, `ModalBody`, `ModalFooter`
DEPENDENCIES: None (only React, internal utilities)
```

---

## 2. Feature Modals (Stateful, Business Logic)

### Location: `packages/ui/src/app/modals/`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DiscoverySettingsModal.tsx                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ OWNED STATE (local, ephemeral):                                      │   │
│  │ • targetSize, autoPlanBudget (numbers)                              │   │
│  │ • promptEnhancement (enum: rewrite|augment|preserve)                │   │
│  │ • manualRuns, mcpRuns, textFormat, reasoningEffort, verbosity       │   │
│  │ • showAutoPlanBudget (boolean)                                      │   │
│  │                                                                  │   │
│  │ SYNC STATE (derived from props):                                     │   │
│  │ • Synced when isOpen changes via useEffect                          │   │
│  │                                                                  │   │
│  │ CALLBACKS (owned by parent):                                         │   │
│  │ • onPromptEnhancementChange, onTargetSizeChange                     │   │
│  │                                                                  │   │
│  │ DEPENDS ON:                                                          │   │
│  │ • ModalDialog (infrastructure)                                     │   │
│  │ • SectionHeader, SegmentedControl, Toggle, RangeSlider            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  IconPickerModal.tsx                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ OWNED STATE (local, ephemeral):                                      │   │
│  │ • selectedColorId, selectedIcon (derived from props on open)        │   │
│  │                                                                  │   │
│  │ CONSTANTS (static):                                                  │   │
│  │ • colors: { id, className, bg }[]                                  │   │
│  │ • icons: { id, component }[]                                        │   │
│  │                                                                  │   │
│  │ CALLBACKS:                                                            │   │
│  │ • onSave(iconId, colorId) - returns IDs, not CSS classes           │   │
│  │                                                                  │   │
│  │ DEPENDS ON:                                                          │   │
│  │ • ModalDialog (infrastructure)                                     │   │
│  │ • ChatGPTIcons (icon set)                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  SettingsModal.tsx                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ NAVIGATION STATE (local):                                            │   │
│  │ • currentView: SettingsView (main | personalization | ...)          │   │
│  │                                                                  │   │
│  │ SETTINGS STATE (local, ephemeral):                                   │   │
│  │ • All setting values (showAdditionalModels, accentColor, etc.)     │   │
│  │ • ~25 useState hooks                                                │   │
│  │                                                                  │   │
│  │ PANEL DELEGATION:                                                    │   │
│  │ • Renders PersonalizationPanel, SecurityPanel, etc.                │   │
│  │ • Each panel receives onBack callback                               │   │
│  │                                                                  │   │
│  │ DEPENDS ON:                                                          │   │
│  │ • ModalDialog (infrastructure)                                     │   │
│  │ • SettingRow, SettingToggle (settings components)                 │   │
│  │ • All *Panel components (settings/)                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Settings Components (Leaf Building Blocks)

### Location: `packages/ui/src/app/settings/`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SettingRow.tsx                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RESPONSIBILITIES:                                                    │   │
│  │ • Display-only row with optional click handling                      │   │
│  │ • Renders icon, label, description, right content                   │   │
│  │ • Button wrapper when onClick provided                              │   │
│  │                                                                  │   │
│  │ STATE: None (stateless)                                              │   │
│  │                                                                  │   │
│  │ DEPENDS ON: None (only icons)                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  SettingToggle.tsx                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RESPONSIBILITIES:                                                    │   │
│  │ • Toggle switch UI (iOS-style)                                      │   │
│  │ • Calls onCheckedChange on user interaction                         │   │
│  │                                                                  │   │
│  │ STATE: None (stateless, controlled by parent)                        │   │
│  │                                                                  │   │
│  │ DEPENDS ON: None                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  SettingDropdown.tsx                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RESPONSIBILITIES:                                                    │   │
│  │ • Dropdown selection UI                                              │   │
│  │ • Uses Radix DropdownMenu primitives                                │   │
│  │                                                                  │   │
│  │ STATE: None (stateless, controlled by parent)                        │   │
│  │                                                                  │   │
│  │ DEPENDS ON: DropdownMenu (ui/overlays/dropdown-menu)                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Panel Components (Nested Views)

### Location: `packages/ui/src/app/settings/`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PersonalizationPanel.tsx                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RESPONSIBILITIES:                                                    │   │
│  │ • "Base style and tone" configuration                              │   │
│  │ • Characteristics toggles (Warm, Enthusiastic, etc.)               │   │
│  │ • Custom instructions display                                       │   │
│  │ • Memory link                                                       │   │
│  │ • Advanced settings section (collapsible)                           │   │
│  │                                                                  │   │
│  │ STATE (local, ephemeral):                                           │   │
│  │ • baseStyle, warmStyle, enthusiasticStyle, etc.                     │   │
│  │ • showAdvanced (boolean)                                            │   │
│  │                                                                  │   │
│  │ DEPENDS ON:                                                          │   │
│  │ • SettingDropdown, SettingToggle                                    │   │
│  │ • ChatGPTIcons                                                      │   │
│  │                                                                  │   │
│  │ PARENT: SettingsModal                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  SecurityPanel.tsx, ManageAppsPanel.tsx, etc.                             │
│  (Similar structure - owned state, no modal dependencies)                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dependency Graph (Acyclic)

```
                    ┌─────────────────────┐
                    │   useFocusTrap      │
                    │   (hooks/)          │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   ModalDialog       │
                    │   (ui/overlays/)    │
                    └─────────┬───────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
        ┌───────────┐ ┌───────────┐ ┌─────────────┐
        │Discovery  │ │  Icon     │ │  Settings   │
        │Settings   │ │  Picker   │ │  Modal      │
        │Modal      │ │  Modal    │ │             │
        └─────┬─────┘ └───────────┘ └──────┬──────┘
              │                            │
              ▼                            ▼
      ┌────────────────┐          ┌──────────────────┐
      │RangeSlider,    │          │Personalization   │
      |SegmentedControl│          │Panel, Security   │
      │Toggle, etc.    │          │Panel, etc.       │
      └────────────────┘          └──────────────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │  SettingRow      │
                                  │  SettingToggle   │
                                  │  SettingDropdown │
                                  └──────────────────┘
```

---

## 6. State Ownership Rules

### Infrastructure (OWNED: None, PASS-THROUGH: All)

| Component      | State Owned | State Received                | State Passed     |
| -------------- | ----------- | ----------------------------- | ---------------- |
| `useFocusTrap` | Refs only   | `isOpen`, `onClose`           | None             |
| `ModalDialog`  | None        | `isOpen`, `onClose`, children | None to children |

### Feature Modals (OWNED: Business State)

| Component                | State Owned                       | State Sync                       | Callbacks                                         |
| ------------------------ | --------------------------------- | -------------------------------- | ------------------------------------------------- |
| `DiscoverySettingsModal` | ~10 useState hooks                | Props → State on `isOpen` change | `onTargetSizeChange`, `onPromptEnhancementChange` |
| `IconPickerModal`        | `selectedIcon`, `selectedColorId` | Props → State on `isOpen` change | `onSave(iconId, colorId)`                         |
| `SettingsModal`          | ~25 useState hooks                | None (all local)                 | None (no persistence)                             |

### Settings Components (OWNED: None, CONTROLLED)

| Component         | State Owned | Controlled By | Callback             |
| ----------------- | ----------- | ------------- | -------------------- |
| `SettingRow`      | None        | N/A (display) | `onClick` (optional) |
| `SettingToggle`   | None        | Parent        | `onCheckedChange`    |
| `SettingDropdown` | None        | Parent        | `onValueChange`      |

---

## 7. Data Flow Patterns

### Pattern A: Synced State (DiscoverySettingsModal, IconPickerModal)

```
Parent Component
     │
     ├─ externalValue ─────────────────┐
     │                                  │
     ▼                                  │
Modal (isOpen=true) ── useEffect ────▶ setLocalState(externalValue)
     │
     ├─ User changes local state
     │
     └─ onChange(newValue) ────────────▶ Parent (receives update)
```

### Pattern B: Local-Only State (SettingsModal, PersonalizationPanel)

```
Modal/Panel (isOpen=true)
     │
     ├─ All state owned locally
     │
     ├─ User changes state
     │
     └─ No persistence (ephemeral)
```

### Pattern C: Controlled Components (SettingRow, SettingToggle, SettingDropdown)

```
Parent
     │
     ├─ value={state} ──────────────────▶ Component (display)
     │                                    │
     │                                    ▼
     │                              User interaction
     │                                    │
     └────────────── onChange(newValue) ◀─┘
```

---

## 8. Future Modal Guidelines

### When to Create a New Modal

**Use `ModalDialog` when:**

- You need a dialog with focus trap, Escape handling
- You want consistent styling and ARIA attributes
- You don't need custom overlay behavior

**Use raw `<div role="dialog">` when:**

- You need custom overlay behavior (e.g., multiple overlays)
- You need to integrate with existing modal infrastructure
- You need special z-index stacking

### State Ownership Checklist

- [ ] Modal owns only its business logic state
- [ ] Focus trap state is delegated to `useFocusTrap`
- [ ] Parent owns persisted state (if any)
- [ ] State sync happens via `useEffect` on `isOpen` change
- [ ] Callbacks receive primitive values, not complex objects

### Example: Creating a New Modal

```tsx
// packages/ui/src/app/modals/MyModal.tsx
import { useState } from "react";
import { ModalDialog, ModalHeader, ModalBody, ModalFooter } from "../ui/overlays/modal";

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onValueChange: (value: string) => void;
}

export function MyModal({ isOpen, onClose, value: externalValue, onValueChange }: MyModalProps) {
  // 1. Sync local state when modal opens
  const [localValue, setLocalValue] = useState(externalValue);
  useEffect(() => {
    if (!isOpen) return;
    setLocalValue(externalValue);
  }, [isOpen, externalValue]);

  // 2. Handle changes
  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onValueChange(newValue);
  };

  // 3. Render with ModalDialog
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="My Modal">
      <ModalHeader title="My Modal" showClose onClose={onClose} />
      <ModalBody>{/* Content */}</ModalBody>
      <ModalFooter>{/* Actions */}</ModalFooter>
    </ModalDialog>
  );
}
```

---

## 9. Anti-Patterns to Avoid

### ❌ Duplicate Focus Trap Logic

```tsx
// DON'T: Copy-paste focus trap code into each modal
const getFocusable = (container) => {
  /* ... */
};
useEffect(() => {
  /* focus trap logic */
}, []);
```

**DO:** Use `ModalDialog` or `useFocusTrap` directly.

### ❌ Direct DOM Manipulation

```tsx
// DON'T: Manually manage focus
useEffect(() => {
  if (isOpen) dialogRef.current?.focus();
}, [isOpen]);
```

**DO:** Let `useFocusTrap` handle focus management.

### ❌ Complex Object Callbacks

```tsx
// DON'T: Return complex objects from callbacks
onSave({ iconId: string, colorId: string, colorClass: string });
```

**DO:** Return primitive values (IDs, strings, numbers).

### ❌ State Drift Without Sync

```tsx
// DON'T: Assume props never change
const [state, setState] = useState(propValue); // No sync effect!
```

**DO:** Sync state when `isOpen` changes via `useEffect`.

---

## 10. Testing Strategy

### Infrastructure Tests

```tsx
// useFocusTrap.test.ts
describe("useFocusTrap", () => {
  it("should trap focus within container", () => {
    /* ... */
  });
  it("should restore focus on unmount", () => {
    /* ... */
  });
  it("should call onClose on Escape", () => {
    /* ... */
  });
});
```

### Component Tests

```tsx
// DiscoverySettingsModal.test.ts
describe("DiscoverySettingsModal", () => {
  it("should sync local state when opened", () => {
    /* ... */
  });
  it("should call onTargetSizeChange when slider changes", () => {
    /* ... */
  });
});
```

---

## Summary

| Layer                                          | Responsibility                     | State                    | Dependencies             |
| ---------------------------------------------- | ---------------------------------- | ------------------------ | ------------------------ |
| Infrastructure (`useFocusTrap`, `ModalDialog`) | Focus management, layout, ARIA     | Refs only                | React, utilities         |
| Feature Modals                                 | Business logic, state coordination | Local ephemeral + synced | Infrastructure, settings |
| Settings Components                            | Display, interaction forwarding    | None (controlled)        | Icons only               |
| Panels                                         | Nested view state                  | Local only               | Settings components      |

**Key Principle:** Each layer owns only what it needs to own. Infrastructure owns focus, modals own business logic, settings components are pure/controlled.
