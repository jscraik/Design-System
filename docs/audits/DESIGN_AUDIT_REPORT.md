# ChatGPT Design System Audit Report

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Executive Summary](#executive-summary)
- [✅ FIXES APPLIED (December 25, 2024)](#fixes-applied-december-25-2024)
  - [Critical Fixes](#critical-fixes)
  - [Summary of Changes](#summary-of-changes)
- [✅ COMPLIANT COMPONENTS](#compliant-components)
  - [Fully Conformant](#fully-conformant)
- [⚠️ ISSUES FOUND](#issues-found)
  - [1. COLOR VIOLATIONS](#1-color-violations)
  - [2. TYPOGRAPHY VIOLATIONS](#2-typography-violations)
  - [3. MISSING LETTER-SPACING (TRACKING)](#3-missing-letter-spacing-tracking)
  - [4. BORDER RADIUS INCONSISTENCIES](#4-border-radius-inconsistencies)
- [📋 PRIORITY FIX LIST](#priority-fix-list)
  - [HIGH PRIORITY (Breaking Visual Standards)](#high-priority-breaking-visual-standards)
  - [MEDIUM PRIORITY (Consistency)](#medium-priority-consistency)
  - [LOW PRIORITY (Polish)](#low-priority-polish)
- [🎨 DESIGN SYSTEM REFERENCE](#design-system-reference)
  - [Typography Scale (Use Only These)](#typography-scale-use-only-these)
  - [Color Palette (Use Only These)](#color-palette-use-only-these)
- [📝 NOTES](#notes)
- [✅ RECOMMENDED ACTIONS](#recommended-actions)


## Executive Summary

Comprehensive audit of all UI components against ChatGPT design standards as defined in `/COLOR_REFERENCE.md` and `packages/ui/src/storybook/design-system/DesignTokens/DesignTokens.ts`.

**Status:** ✅ AUDIT COMPLETE - All critical and high priority issues RESOLVED

---

## ✅ FIXES APPLIED (December 25, 2024)

### Critical Fixes

1. **DiscoverySettingsModal.tsx**
   - ✅ Fixed `#4ade80` → `#40C977` (Reset button - line 84)
   - ✅ Fixed `#4ade80` → `#40C977` (Enhancement label - line 496)
   - ✅ Updated modal heading to `font-semibold` with proper tracking

2. **ChatSidebar.tsx**
   - ✅ Fixed user menu background `#2a2a2a` → `#171717` (line 284)
   - ✅ Fixed project modal background `#2a2a2a` → `#171717` (line 328)
   - ✅ Fixed settings modal background `#2a2a2a` → `#171717` (line 457)
   - ✅ Updated modal heading to `font-semibold` with proper tracking

3. **SettingsModal.tsx**
   - ✅ Fixed main modal background `#2a2a2a` → `#171717` (line 131)
   - ✅ Updated heading to `font-semibold` with proper tracking

4. **IconPickerModal.tsx**
   - ✅ Updated modal heading to `font-semibold` with proper tracking

### Summary of Changes

- All modal backgrounds now use correct `#171717` color
- All legacy `#4ade80` green replaced with ChatGPT standard `#40C977`
- All modal headings now use `font-semibold` instead of `font-medium`
- Proper letter-spacing (tracking) added to all headings

---

## ✅ COMPLIANT COMPONENTS

### Fully Conformant

- **DiscoverySettingsModal.tsx** - Recently updated, now fully compliant
- **ChatHeader.tsx** - Model selector matches ChatGPT standards
- **ComposeView.tsx** - Model selector matches ChatGPT standards
- **IconPickerModal.tsx** - Proper colors and typography

---

## ⚠️ ISSUES FOUND

### 1. COLOR VIOLATIONS

#### Critical (Must Fix)

**File: `packages/ui/src/app/modals/DiscoverySettingsModal.tsx`**

- **Line 84**: Reset button uses `#4ade80` → Should be `#40C977`
- **Line 496**: Enhancement label uses `#4ade80` → Should be `#40C977`

**File: `packages/ui/src/app/chat/ChatSidebar.tsx`**

- **Line 284**: User menu uses `#2a2a2a` background → Should be `#171717` for modal-type surfaces
- **Line 328**: Project modal uses `#2a2a2a` → Should be `#171717` (PRIMARY MODAL BG)
- **Line 457**: Settings modal uses `#2a2a2a` → Should be `#171717` (PRIMARY MODAL BG)

**File: `packages/ui/src/app/modals/SettingsModal.tsx`**

- **Line 131**: Main modal uses `#2a2a2a` → Should be `#171717` (PRIMARY MODAL BG)

#### Background Color Usage (By Standard)

According to COLOR_REFERENCE.md:

- `#171717` = Primary Modal Background (ALL modals)
- `#2a2a2a` = Input fields, dropdowns, nested surfaces (NOT modal containers)
- `#2C2C2C` = Header bars, input containers
- `#1a1a1a` = Secondary surfaces, inner content areas

---

### 2. TYPOGRAPHY VIOLATIONS

#### Font Weight Issues

Many components use `font-medium` (500) when they should use `font-semibold` (600) for headings:

**ChatSidebar.tsx**

- Line 255: Section label uses `font-medium` → Should be `font-semibold` with proper tracking
- Line 460: Modal heading uses `font-medium` → Should be `font-semibold`
- Line 483, 511: Option labels use `font-medium` → Should be `font-semibold`

**ChatHeader.tsx**

- Line 83: "Compose" label uses `font-medium` → Should be `font-semibold` for emphasis

**ComposeView.tsx**

- Line 239, 282: Section headers use `font-medium` → Should be `font-semibold`
- Lines 341, 343, 355, 357, 369, 371: Tooltip text uses `font-medium` → Inconsistent with design system

**DiscoverySettingsModal.tsx**

- Line 78: Modal title uses `font-medium` → Should be `font-semibold`

**IconPickerModal.tsx**

- Line 118: Modal title uses `font-medium` → Should be `font-semibold`

#### Font Size Issues

Non-standard font sizes used (not in design system):

**ComposeView.tsx**

- Line 263: Uses `text-[15px]` → Not in typography scale (should use 14px or 16px)
- Line 239, 282: Uses `text-[15px]` → Should be `text-[14px]` with proper tracking

**ProjectView.tsx**

- Line 95: Uses `text-[15px]` → Should be `text-[14px]`

**ChatInput.tsx**

- Line 73: Uses `text-[16px]` → Correct, but missing semibold for labels

**ChatMessages.tsx**

- Line 40: Uses `text-[15px]` → Should be `text-[14px]` or `text-[16px]`

---

### 3. MISSING LETTER-SPACING (TRACKING)

Components missing proper tracking values:

**ChatSidebar.tsx**

- Line 255: Missing `tracking-[-0.32px]` on label
- Line 460: Missing `tracking-[-0.32px]` on modal heading

**ChatInput.tsx**

- Line 73: Has tracking but should verify consistency

**ComposeView.tsx**

- Multiple lines missing tracking on tooltips and labels

---

### 4. BORDER RADIUS INCONSISTENCIES

**Current Issues:**

- Mix of `rounded-xl` (12px), `rounded-[12px]`, `rounded-[16px]`
- Should use design token values: `rounded-[12px]` or `rounded-[16px]`

**Recommendations:**

- Modals: `rounded-[16px]` (large surfaces)
- Dropdowns/Menus: `rounded-[12px]` (medium surfaces)
- Buttons: `rounded-lg` (8px)
- Input fields: `rounded-lg` (8px)

---

## 📋 PRIORITY FIX LIST

### HIGH PRIORITY (Breaking Visual Standards)

1. **Fix Modal Backgrounds**
   - ChatSidebar.tsx (lines 284, 328, 457): `#2a2a2a` → `#171717`
   - SettingsModal.tsx (line 131): `#2a2a2a` → `#171717`

2. **Fix Legacy Green Color**
   - DiscoverySettingsModal.tsx (lines 84, 496): `#4ade80` → `#40C977`

3. **Fix Modal/Heading Typography**
   - All modal titles: `font-medium` → `font-semibold`
   - Add proper tracking: `tracking-[-0.32px]` for 16px text

### MEDIUM PRIORITY (Consistency)

4. **Standardize Font Sizes**
   - Replace all `text-[15px]` with `text-[14px]`
   - Ensure all body text uses 14px or 16px from design system

5. **Fix Section Headers**
   - All section headers: `font-medium` → `font-semibold`
   - Add tracking: `tracking-[-0.3px]` for 14px text

6. **Standardize Border Radius**
   - Modals: Use `rounded-[16px]`
   - Dropdowns: Use `rounded-[12px]`

### LOW PRIORITY (Polish)

7. **Add Missing Tracking**
   - All text elements should have proper tracking
   - 16px: `tracking-[-0.32px]`
   - 14px: `tracking-[-0.3px]`
   - 13px: `tracking-[-0.32px]`
   - 12px: `tracking-[-0.32px]`

---

## 🎨 DESIGN SYSTEM REFERENCE

### Typography Scale (Use Only These)

```
Headings:
- 36px: font-semibold leading-[40px] tracking-[-0.1px]
- 24px: font-semibold leading-[28px] tracking-[-0.25px]
- 18px: font-semibold leading-[26px] tracking-[-0.45px]

Body:
- 16px: font-semibold/normal leading-[24px] tracking-[-0.32px]
- 14px: font-semibold/normal leading-[20px] tracking-[-0.3px]
- 13px: font-normal leading-[18px] tracking-[-0.32px]
- 12px: font-semibold/normal leading-[18px] tracking-[-0.32px]
```

### Color Palette (Use Only These)

```
Backgrounds:
- Modal Background: #171717
- Input/Nested Surface: #2a2a2a
- Header/Input Container: #2C2C2C
- Secondary Surface: #1a1a1a
- App Background: #0D0D0D
- Chat Area: #212121

Accents:
- Primary Green: #40C977 (buttons, active states)
- Dark Green: #2f7a4f (primary action buttons)
- Blue: #48AAFF (links, user messages)
- Purple: #BA8FF7
- Orange: #FF9E6C
- Red: #FF8583

Text:
- Primary: #FFFFFF
- Secondary: #CDCDCD
- Tertiary: white/60 or white/40
```

---

## 📝 NOTES

1. **UI Component Files** (shadcn/ui in `/src/components/ui/`)
   - These are third-party components and use `font-medium` by design
   - Should NOT be modified unless absolutely necessary
   - Focus on custom app components only

2. **Import Files** (`/src/imports/`)
   - These are auto-generated from Figma
   - Should NOT be modified manually
   - Will be regenerated on next import

3. **Font Variation Settings**
   - Some imports use `font-[510]` for SF Pro Medium
   - This is acceptable for Figma imports
   - Custom components should use Tailwind's `font-medium` or `font-semibold`

---

## ✅ RECOMMENDED ACTIONS

1. Run automated find/replace for color values
2. Update modal backgrounds to `#171717`
3. Update all custom component typography to use `font-semibold` for headings
4. Add missing tracking values
5. Standardize border radius values
6. Remove non-standard font sizes (15px)
7. Test all components visually after changes

---

**Last Updated:** December 25, 2024
**Audit Completed By:** AI Assistant
