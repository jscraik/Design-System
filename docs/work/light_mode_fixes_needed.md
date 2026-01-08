# Light Mode Fixes Needed - Comparison with Figma

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Current Issues vs Figma Designs](#current-issues-vs-figma-designs)
  - [1. **Compose View (Light Mode)**](#1-compose-view-light-mode)
  - [2. **Chat Input (Light Mode)**](#2-chat-input-light-mode)
  - [3. **Sidebar (Light Mode)**](#3-sidebar-light-mode)
  - [4. **Foundation Colors**](#4-foundation-colors)
  - [5. **Text Colors**](#5-text-colors)
- [Priority Fixes](#priority-fixes)
  - [High Priority](#high-priority)
  - [Medium Priority](#medium-priority)
  - [Low Priority](#low-priority)
- [Next Steps](#next-steps)
- [Key Principle](#key-principle)


## Current Issues vs Figma Designs

### 1. **Compose View (Light Mode)**

**Figma Design Shows:**

- Clean white background (#FFFFFF) for main content area
- Light gray (#F0F0F0 or similar) for panel backgrounds
- Dark, readable text (#0D0D0D or similar) for all labels and content
- Clear borders between sections using medium gray (#D9D9D9 or similar)
- Proper visual hierarchy with distinct layers

**Current Implementation Issues:**

- Text appears too light/washed out
- Insufficient contrast between background layers
- Placeholder text too faint
- Icons may be too light
- Borders not visible enough

**Files to Fix:**

- `packages/ui/src/app/chat/ComposeView.tsx`
- `packages/ui/src/templates/blocks/TemplatePanel.tsx`
- `packages/ui/src/templates/blocks/TemplateHeaderBar.tsx`
- `packages/ui/src/templates/blocks/TemplateFooterBar.tsx`
- `packages/ui/src/templates/blocks/TemplateFormField.tsx`

### 2. **Chat Input (Light Mode)**

**Figma Design Shows:**

- White or very light background for input container
- Medium gray borders that are clearly visible
- Dark icons that stand out
- Proper button contrast

**Current Status:**

- ✅ Icons fixed with light mode support
- ✅ Container backgrounds updated
- ⚠️ May need border color adjustment

**Files Already Fixed:**

- `packages/ui/src/app/chat/ChatInput.tsx`

### 3. **Sidebar (Light Mode)**

**Figma Design Shows:**

- Light gray sidebar background distinct from white main area
- Clear borders
- Readable text and icons

**Current Status:**

- ✅ Background colors updated
- ✅ Toggle functionality fixed
- ✅ Icon colors updated

**Files Already Fixed:**

- `packages/ui/src/app/chat/ChatSidebar.tsx`

### 4. **Foundation Colors**

**Current Values:**

```css
--foundation-bg-light-1: #ffffff;
--foundation-bg-light-2: #f0f0f0;
--foundation-bg-light-3: #d9d9d9;
```

**Analysis:**

- `light-1` (white) - Correct for main background
- `light-2` (#f0f0f0) - Good for panels/cards
- `light-3` (#d9d9d9) - Good for borders and hover states

These values seem appropriate based on Figma.

### 5. **Text Colors**

**Current Values:**

```css
--foundation-text-light-primary: #0d0d0d;
--foundation-text-light-secondary: #5d5d5d;
--foundation-text-light-tertiary: #686868;
```

**Analysis:**

- Primary text is dark enough
- Secondary/tertiary may need verification in context

## Priority Fixes

### High Priority

1. ✅ Fix ChatInput icons (DONE)
2. ✅ Fix sidebar visibility (DONE)
3. ✅ Fix sidebar toggle (DONE)
4. 🔴 Fix ComposeView text contrast
5. 🔴 Fix ComposeView placeholder text
6. 🔴 Fix ComposeView borders

### Medium Priority

1. Verify all template components have proper light mode support
2. Check modal/popover backgrounds in light mode
3. Verify button states in light mode

### Low Priority

1. Fine-tune hover states
2. Verify focus states
3. Check all edge cases

## Next Steps

1. Fix remaining SVG icons in ComposeView to support both themes
2. Ensure all text has proper contrast in both modes
3. Verify borders are visible in both themes
4. Test all interactive states (hover, focus, active) in both modes
5. Compare dark mode against Figma pixel-perfect
6. Ensure light mode has equivalent visual hierarchy

## Key Principle

**Same Layout, Different Colors:**

- Dark mode uses dark backgrounds with light text (matches Figma)
- Light mode uses light backgrounds with dark text (mirrors the hierarchy)
- Both should have identical spacing, borders, and visual structure
