# Story 2.1: Keyboard Navigation Testing Guide

**Start Date:** 2026-01-29
**Storybook URL:** http://localhost:6006

---

## Automated Coverage (Already Verified ✅)

We have **20 passing E2E keyboard navigation tests** that cover:

### Modal/Dialog Components (7 tests)
- ✅ ModalDialog focus trap (Tab cycles forward)
- ✅ ModalDialog focus trap (Shift+Tab cycles backward)
- ✅ ModalDialog closes on Escape key
- ✅ ModalDialog closes on overlay click
- ✅ ModalDialog restores focus to trigger on close
- ✅ ModalDialog has proper ARIA attributes
- ✅ ModalDialog passes Axe accessibility scan

### SettingsModal (5 tests)
- ✅ Navigates between main sections with Tab
- ✅ Navigates into panel and back with keyboard
- ✅ Toggles switches with Space/Enter
- ✅ Navigates dropdowns with arrow keys
- ✅ Passes Axe accessibility scan

### IconPickerModal (3 tests)
- ✅ Navigates icon grid with arrow keys
- ✅ Selects color and icon with keyboard
- ✅ Passes Axe accessibility scan

### DiscoverySettingsModal (3 tests)
- ✅ Navigates form controls with Tab
- ✅ Operates range sliders with arrow keys
- ✅ Toggles toggles with Space
- ✅ Passes Axe accessibility scan

---

## Manual Testing Categories

### Category 1: Basic Interactive Components (Forms)

#### Button
**Story:** `Components / Forms / Button`

**Test Steps:**
1. Tab to Button - verify visible focus ring
2. Press Enter/Space - verify activation
3. Check disabled state - Tab to it, verify no focus or focus-visible shows disabled

**Pass Criteria:** All actions workable via keyboard, focus indicator visible

#### Input
**Story:** `Components / Forms / Input`

**Test Steps:**
1. Tab to Input - verify focus ring
2. Type text - verify input accepted
3. Tab to exit - verify focus moves to next element

**Pass Criteria:** Focus visible, input accepted, keyboard can enter/exit

#### Textarea
**Story:** `Components / Forms / Textarea`

**Test Steps:**
1. Tab to Textarea - verify focus ring
2. Type multiple lines - verify multiline input works
3. Tab to exit - verify focus moves to next element

**Pass Criteria:** Focus visible, multiline input works, keyboard can enter/exit

---

### Category 2: Selection Components

#### Checkbox
**Story:** `Components / Forms / Checkbox`

**Test Steps:**
1. Tab to Checkbox - verify focus ring
2. Press Space - verify toggle works
3. Check multiple checkboxes - verify each can be toggled independently

**Pass Criteria:** Toggle works without mouse, focus indicator visible

#### Switch
**Story:** `Components / Base / Toggle`

**Test Steps:**
1. Tab to Switch - verify focus ring
2. Press Space - verify toggle works
3. Check visual state change - verify on/off visible

**Pass Criteria:** Toggle works without mouse, visual feedback provided

#### RadioGroup
**Story:** `Components / Forms / RadioGroup`

**Test Steps:**
1. Tab to first radio option - verify focus
2. Use Arrow keys - verify navigation through options
3. Press Space to select - verify selection works
4. Check only one can be selected

**Pass Criteria:** All options accessible via keyboard, only one selectable

#### Select (Dropdown)
**Story:** `Components / Forms / Select`

**Test Steps:**
1. Tab to Select - verify focus ring
2. Press Space/Enter - verify dropdown opens
3. Use Arrow keys - verify navigation through options
4. Press Enter - verify selection made
5. Press Escape - verify dropdown closes without change

**Pass Criteria:** Full keyboard control, can select without mouse

#### Combobox (if present)
**Story:** `Components / Forms / Combobox`

**Test Steps:**
1. Tab to Combobox - verify focus ring
2. Type to filter - verify text input works
3. Use Arrow keys - verify navigation through filtered options
4. Press Enter - verify selection made
5. Press Escape - verify closes without selection

**Pass Criteria:** Text input + arrow navigation works

---

### Category 3: Navigation Components

#### Tabs
**Story:** `Components / Overlays / Tabs`

**Test Steps:**
1. Tab to tabs - verify first tab gets focus
2. Use Arrow keys - verify navigation between tabs
3. Press Enter - verify tab activation
4. Check all tabs are accessible

**Pass Criteria:** All tabs accessible via keyboard, activation works

#### Carousel
**Story:** `Components / Navigation / Carousel`

**Test Steps:**
1. Tab to Carousel - verify focus on carousel
2. Use Arrow keys - verify slide navigation
3. Verify all slides accessible

**Pass Criteria:** All items accessible via arrow keys

---

### Category 4: Overlay Components

#### Modal
**Story:** `Components / Overlays / Modal`

**Test Steps:**
1. Trigger modal (button/keyboard)
2. Verify focus moves to modal
3. Press Tab - verify focus stays within modal (focus trap)
4. Press Escape - verify modal closes
5. Verify focus returns to trigger button

**Pass Criteria:** Cannot escape focus trap, Escape closes, focus returns

#### Drawer
**Story:** `Components / Overlays / Drawer`

**Test Steps:**
1. Trigger drawer
2. Verify focus moves to drawer
3. Press Escape - verify drawer closes
4. Check focus trap while open

**Pass Criteria:** Escape closes, focus managed properly

#### Dropdown Menu
**Story:** `Components / Overlays / DropdownMenu`

**Test Steps:**
1. Tab to trigger - verify focus ring
2. Press Space/Enter - verify menu opens
3. Use Arrow keys - verify navigation through items
4. Press Enter - verify item activation
5. Press Escape - verify menu closes

**Pass Criteria:** Full menu navigation via keyboard

#### Tooltip
**Story:** `Components / Overlays / Tooltip`

**Test Steps:**
1. Tab/hover to trigger - verify tooltip appears
2. If persistent, verify keyboard can trigger it
3. Check if Escape dismisses it (if applicable)
4. Verify tooltip content is accessible (aria-describedby or similar)

**Pass Criteria:** Content is accessible, dismissible if persistent

---

### Category 5: Data Display Components

#### Slider (Range input)
**Story:** `Components / Forms / Slider` (if present)

**Test Steps:**
1. Tab to Slider - verify focus indicator
2. Use Arrow keys - verify value adjustment
3. Press Home - verify jumps to minimum
4. Press End - verify jumps to maximum
5. Verify visual feedback for all actions

**Pass Criteria:** Full range adjustable via keyboard, visual feedback

#### DatePicker
**Story:** `Components / Forms / DatePicker`

**Test Steps:**
1. Tab to DatePicker - verify focus ring
2. Press Enter/Space - verify calendar opens
3. Use Arrow keys - verify date navigation
4. Press Enter - verify date selection
5. Press Escape - verify closes without selection

**Pass Criteria:** Full date selection via keyboard

---

## Component Testing Priority

Test components in this order based on user interaction frequency:

### Priority 1: Most Common (Test First)
1. Button (all variants)
2. Input (all variants)
3. Checkbox
4. Modal
5. Dropdown Menu

### Priority 2: Common
6. Switch/Toggle
7. RadioGroup
8. Tabs
9. Select
10. Tooltip

### Priority 3: Specialized
11. Carousel
12. Slider
13. DatePicker
14. Combobox
15. Drawer

---

## Testing Checklist Template

For each component, use the checklist at `.spec/templates/quality-gates-checklist.md`.

**Example Entry:**

### Button - Default State
- [x] Tab to focus - Focus ring visible
- [x] Enter activates - Button click works
- [x] Space activates - Button click works
- [ ] Disabled state - No focus when disabled

### Button - Disabled State
- [ ] Tab skips disabled button - Cannot receive focus
- [ ] Or: Tab focuses with visible disabled state - Focus shows disabled

---

## Stop Condition

**If >5 components fail keyboard tests, create separate "Keyboard Accessibility Fix" epic.**

This prevents scope creep and ensures we can address issues systematically.

---

## Testing Tools Available

1. **Keyboard Only Test**: Unplug mouse, use only keyboard to navigate Storybook
2. **Tab Ring Visualization**: Some browsers show tab order with native tools
3. **axe DevTools**: Run in browser DevTools to catch keyboard accessibility issues
4. **Screen Reader**: Optional - test with VoiceOver (macOS) or NVDA (Windows)

---

## Next Steps After Testing

1. **Document all findings** using `.spec/templates/quality-issue-template.md`
2. **Prioritize issues** by severity (Critical > High > Medium > Low)
3. **Fix Critical/High issues** before proceeding to Story 2.2
4. **Re-test fixes** to verify they work
5. **Update phase spec** with test results
