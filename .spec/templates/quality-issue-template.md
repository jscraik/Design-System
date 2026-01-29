# Quality Issue Template

**Date Found:** YYYY-MM-DD
**Found By:** [Tester Name]
**Epic/Story:** [Epic 2.X - Story Name]
**Component:** [Component Name]
**Category:** [Keyboard Navigation / Reduced Motion / Contrast Ratio]

---

## Issue Summary

**Title:** [Brief description of the issue]
**Severity:** [Critical / High / Medium / Low]
**Status:** [Open / In Progress / Fixed / Verified]

---

## Reproduction Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

---

## Technical Details

### Component Path
```
packages/ui/src/components/[category]/[ComponentName]
```

### Test Environment
- **Browser:** [Chrome 131 / Firefox 144 / Safari 18]
- **OS:** [macOS 15.2 / Windows 11 / etc.]
- **Display:** [100% / 200% zoom / Dark mode / Light mode]
- **Storybook Story:** [Link or path to story]

### Affected States
- [ ] Default
- [ ] Hover
- [ ] Focus
- [ ] Disabled
- [ ] Error
- [ ] Loading
- [ ] Required

---

## Evidence

### Screenshots

**Before:**
[Attach screenshot showing the issue]

**After:**
[Attach screenshot showing the fix (if fixed)]

### Measurements

**Contrast Ratio (if applicable):**
- Foreground: [Color value]
- Background: [Color value]
- Ratio: [X.XX:1]
- Required: [4.5:1 / 3:1]
- Pass/Fail: [Fail]

**Performance (if applicable):**
- Metric: [Value]
- Baseline: [Value]

---

## WCAG Criteria

**WCAG 2.1 Success Criterion:**
[2.1.1 Keyboard / 2.1.2 No Keyboard Trap / 2.1.4 Character Key Shortcuts / 2.2.2 Pause, Stop, Hide / 2.3.1 Three Flashes or Below Threshold / 2.4.7 Focus Visible / etc.]

**Level:** [A / AA / AAA]

**Link:** [https://www.w3.org/WAI/WCAG21/quickref/]

---

## Root Cause

[Analysis of why this issue exists - e.g., missing focus styles, animation not respecting prefers-reduced-motion, color token combination with insufficient contrast]

---

## Proposed Fix

**Approach:** [Description of the fix]

**Code Changes:**
- [ ] Component file
- [ ] Styles/Tailwind classes
- [ ] CSS variables/tokens
- [ ] Test file

**Implementation Estimate:** [X hours]

---

## Fix Validation

- [ ] Fix implemented
- [ ] Tested in [environments]
- [ ] Verified with [tools]
- [ ] Regression test added
- [ ] Documentation updated

**Fixed By:** [Name]
**Fixed Date:** YYYY-MM-DD
**Verified By:** [Name]

---

## Related Issues

- [ ] [Issue #1]
- [ ] [Issue #2]

---

## Notes

[Any additional context, workarounds, or design considerations]
