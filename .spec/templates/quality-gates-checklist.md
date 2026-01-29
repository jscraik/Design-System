# Quality Gates Checklist

**Date:** YYYY-MM-DD
**Tester:**
**Epic/Story:**
**Component/Category:**

---

## 1. Keyboard Navigation

### Component: [Name]

- [ ] **Tab to focus** - Element can receive keyboard focus
- [ ] **Visible focus indicator** - Focus ring/outline is clearly visible
- [ ] **Enter/Space activates** - Primary action works with keyboard
- [ ] **Arrow keys navigate** - Lists/menus/tabs/sliders navigable with arrows
- [ ] **Escape closes/dismisses** - Modals/dropdowns/tooltips close on Escape
- [ ] **Focus trap works** - Modals trap focus (intentionally)
- [ ] **Focus returns** - Focus returns to trigger after modal closes
- [ ] **Home/End work** - Sliders/lists jump to start/end
- [ ] **Tab order is logical** - Visual order matches keyboard order
- [ ] **No keyboard traps** - Can't get stuck in any component

**Issues Found:**
1. [Issue description]
2. [Issue description]

---

## 2. Reduced Motion

### Component: [Name]

- [ ] **No animations play** - Motion respects `prefers-reduced-motion`
- [ ] **Instant transitions** - State changes are immediate (≤0.01s)
- [ ] **No slide animations** - Toasts/modals/drawers appear instantly
- [ ] **No fade effects** - Tooltips/dropdowns appear instantly
- [ ] **Spinners stop rotating** - Loading indicators are static
- [ ] **Carousels snap** - No sliding between items
- [ ] **Functionality preserved** - Component still works without motion

**Issues Found:**
1. [Issue description]
2. [Issue description]

---

## 3. Contrast Ratio

### Component: [Name] - [Light Mode / Dark Mode]

- [ ] **Normal text ≥4.5:1** - Body text meets WCAG AA requirements
- [ ] **Large text ≥3:1** - Headers/meets large text criteria
- [ ] **Icons ≥3:1** - Icon contrast is sufficient
- [ ] **Focus indicator ≥3:1** - Focus ring visible against background
- [ ] **Disabled text readable** - Disabled states maintain readability
- [ ] **Error messages pass** - Error/success colors have sufficient contrast
- [ ] **Helper text passes** - Form helper text has adequate contrast
- [ ] **Links in body text** - Links are distinguishable from surrounding text
- [ ] **Placeholder text** - Input placeholders have sufficient contrast
- [ ] **Secondary/muted text** - Gray-on-gray combinations pass

**Specific Failures (if any):**
- [Element]: [Color1] vs [Color2] = [Ratio]:1 - [Pass/Fail]

**Issues Found:**
1. [Issue description]
2. [Issue description]

---

## 4. Overall Assessment

### Component: [Name]

**Keyboard Navigation:** [PASS / FAIL] - [Notes]
**Reduced Motion:** [PASS / FAIL] - [Notes]
**Contrast Ratio:** [PASS / FAIL] - [Notes]

**Overall:** [PASS / FAIL]

**Priority Issues to Fix:**
1. [Issue 1]
2. [Issue 2]

**Optional Improvements:**
1. [Improvement 1]
2. [Improvement 2]

---

## Testing Notes

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- OS: [macOS/Windows/Linux]
- Display: [Scale/Zoom settings]
- Storybook URL: [Link to specific story]

**Tools Used:**
- [ ] axe DevTools
- [ ] WAVE Extension
- [ ] Lighthouse
- [ ] WebAIM Contrast Checker
- [ ] Browser DevTools

**Additional Context:**
[Any notes about testing conditions, known limitations, etc.]
