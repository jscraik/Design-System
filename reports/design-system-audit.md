# Design System Audit Report

**Generated:** 2026-02-05
**Scope:** Accessibility, Design Tokens, TypeScript Props, CSS/SVG Optimization
**Agents:** A (A11y), B (Tokens), C (Props), D (CSS/SVG)

---

## 1. Executive Summary

### Issue Count by Category

| Category | Issues | Critical | High | Medium | Low |
|----------|--------|----------|------|--------|-----|
| Accessibility (A) | 24 | 3 | 2 | 7 | 12 |
| Design Tokens (B) | 20 | 0 | 3 | 4 | 13 |
| TypeScript Props (C) | 28 | 0 | 3 | 3 | 22 |
| CSS/SVG Optimization (D) | 27 | 0 | 3 | 11 | 13 |
| **Total** | **99** | **3** | **11** | **25** | **60** |

### Top 5 Priorities

1. **P0 - animation-timeline without @supports** (CSS) - Causes broken layouts in Safari/Firefox
2. **P0 - Button.Icon lacks aria-label enforcement** (A11y) - Screen readers cannot identify icon buttons
3. **P0 - Image alt optional not required** (A11y) - WCAG 1.1.1 violation, missing alt text
4. **P1 - Button variant='compound' mixing concerns** (Props) - Confuses visual/behavioral variants
5. **P1 - Shadow tokens rgba() format** (Tokens) - May fail DTCG validation, portability issue

---

## 2. Prioritized Findings

### P0 - Critical (Must Fix Immediately)

| Priority | Category | File | Issue | Impact | Effort | Suggested Fix |
|----------|----------|------|-------|--------|--------|---------------|
| P0 | CSS | `packages/effects/src/styles/animations.css` | animation-timeline: scroll() without @supports | Broken in Safari/Firefox | M | Wrap in `@supports (animation-timeline: scroll())` with fallback |
| P0 | CSS | `packages/effects/src/styles/animations.css` | animation-timeline: view() without @supports | Broken in Safari/Firefox | M | Wrap in `@supports (animation-timeline: view())` with fallback |
| P0 | CSS | `packages/effects/src/components/view-transition.tsx` | viewTransitionName without @supports check | Broken in non-supporting browsers | M | Add `@supports (view-transition-name: none)` wrapper |
| P0 | A11y | `packages/ui/src/components/ui/base/button/fallback/Button.tsx` | Button.Icon lacks aria-label enforcement | Screen readers cannot identify icon buttons | S | Add required aria-label prop or enforce via TypeScript |
| P0 | A11y | `packages/ui/src/integrations/figma/ImageWithFallback/ImageWithFallback.tsx` | Image component alt is optional not required | WCAG 1.1.1 violation | S | Make alt prop required in TypeScript interface |
| P0 | A11y | `packages/ui/src/components/ui/forms/Slider/` | Slider thumbs lack individual aria-labels for multi-thumb | WCAG 4.1.2 violation, unusable with screen readers | M | Add aria-label or aria-labelledby for each thumb |

### P1 - High Priority (Next Sprint)

| Priority | Category | File | Issue | Impact | Effort | Suggested Fix |
|----------|----------|------|-------|--------|--------|---------------|
| P1 | Props | `packages/ui/src/components/ui/base/button/fallback/Button.tsx` | Button uses variant='compound' mixing visual and behavioral variants | Developer confusion, inconsistent API | M | Split into separate props: variant (visual) + behavior |
| P1 | Tokens | `packages/tokens/src/shadows.ts` | Shadow tokens use rgba() with space-separated values | May fail DTCG validation | S | Use comma-separated rgba() values per DTCG spec |
| P1 | Tokens | `packages/tokens/src/typography.ts` | Typography tokens only export 'SF Pro' without platform fallbacks | Poor cross-platform rendering | M | Add system font stack fallbacks |
| P1 | Tokens | `packages/tokens/src/enhanced.css` | Enhanced CSS defines --ds-color-* tokens not exported in TypeScript | TypeScript/build out of sync | M | Export enhanced tokens in colors.ts or remove from CSS |
| P1 | Props | `packages/ui/src/components/ui/forms/checkbox/fallback/Checkbox.tsx` | Checkbox ComponentState includes 'indeterminate' but handling incomplete | Incomplete state management | M | Complete indeterminate state implementation or remove |
| P1 | Props | `packages/ui/src/components/ui/base/ToggleGroup/fallback/ToggleGroup.tsx` | Toggle uses 'onChange' instead of 'onCheckedChange' convention | Inconsistent with Radix conventions | S | Rename to onCheckedChange for consistency |
| P1 | CSS | `packages/effects/src/styles/animations.css` | transition-behavior: allow-discrete without @supports | Broken in older browsers | S | Add `@supports (transition-behavior: allow-discrete)` wrapper |
| P1 | A11y | `packages/ui/src/components/ui/forms/` | Input, Textarea, Checkbox, Switch, RadioGroup don't enforce labels | WCAG 3.3.2 violation | M | Require label prop or aria-label via TypeScript |
| P1 | A11y | `packages/ui/src/components/ui/forms/combobox/combobox.tsx` | Combobox listbox role missing on ul element | WCAG 4.1.2 violation | S | Add role="listbox" to ul element |
| P1 | A11y | `packages/ui/src/components/ui/navigation/ModelSelector/` | ModelSelector lacks aria-controls and aria-activedescendant | WCAG 4.1.2 violation | M | Implement proper ARIA attributes for combobox pattern |

### P2 - Medium Priority (Backlog)

| Priority | Category | File | Issue | Impact | Effort | Suggested Fix |
|----------|----------|------|-------|--------|--------|---------------|
| P2 | CSS | Multiple files (4 instances) | color-mix() used without @supports fallback | Visual degradation in older browsers | S | Add `@supports (color: color-mix(in srgb, red, blue))` |
| P2 | CSS | Multiple files (4 instances) | :has() selectors without fallback | Broken in Firefox <121 | S | Provide fallback selector or progressive enhancement |
| P2 | CSS | `packages/effects/src/components/scroll/` | @container query without @supports fallback | Broken in older browsers | S | Add `@supports (container-type: inline-size)` wrapper |
| P2 | CSS | Multiple files | Multiple filter animations without will-change | Performance degradation | S | Add `will-change: filter` to animated elements |
| P2 | Props | `packages/ui/src/components/ui/overlays/Popover/` | PopoverContent forceMount defaults to true | Differs from Radix convention | S | Change default to false or document intentional difference |
| P2 | Props | `packages/ui/src/components/ui/forms/select/` | Select variant prop uses different semantics than Button | Inconsistent API | M | Align variant naming with Button or document difference |
| P2 | Props | `packages/ui/src/components/ui/forms/Calendar/` | Calendar disabled prop breaks StatefulComponentProps pattern | Inconsistent component API | M | Refactor to match StatefulComponentProps pattern |
| P2 | Tokens | `packages/tokens/src/tailwind.preset.ts` | 6 high-contrast tokens not exposed | Missing accessibility tokens | S | Add high-contrast tokens to preset |
| P2 | Tokens | `packages/tokens/src/focus.ts` | focus.ts references non-existent color tokens 'blue.7', 'blue.5' | Runtime errors possible | S | Update references to existing tokens |
| P2 | Tokens | Multiple files | Mixed naming: camelCase vs hyphenated vs 's' prefix | Inconsistent developer experience | M | Standardize naming convention across all token files |
| P2 | A11y | `packages/ui/src/components/ui/data-display/Markdown/Markdown.tsx` | Markdown renders list items without ul/ol parents | WCAG 1.3.1 violation | M | Ensure proper list container elements |
| P2 | A11y | `packages/ui/src/components/ui/forms/SegmentedControl/` | SegmentedControl radiogroup lacks aria-label | WCAG 3.3.2 violation | S | Add required aria-label or aria-labelledby |

### P3 - Low Priority (Nice to Have)

| Priority | Category | File | Issue | Impact | Effort | Suggested Fix |
|----------|----------|------|-------|--------|--------|---------------|
| P3 | Tokens | `packages/tokens/docs/outputs/manifest.json` | Manifest under-reports token count (excludes enhanced) | Documentation inaccuracy | S | Include enhanced tokens in manifest generation |
| P3 | Props | 10 files | Documentation gaps (missing JSDoc) | Reduced IDE support | M | Add JSDoc comments to public APIs |
| P3 | Props | 13 files | Consistency issues (size naming, variant values) | Minor API friction | L | Audit and standardize naming across components |

---

## 3. Quick Wins (Low Effort, High Impact)

These fixes can be done immediately with minimal risk:

1. **Make Image alt required** - Single line change to TypeScript interface
2. **Add aria-label to Button.Icon** - Add required prop or default behavior
3. **Fix rgba() format in shadow tokens** - Search/replace space-separated to comma-separated
4. **Add @supports for transition-behavior** - Wrap existing CSS in feature query
5. **Add role="listbox" to Combobox** - Single attribute addition
6. **Rename Toggle onChange to onCheckedChange** - Find/replace with deprecation period
7. **Add will-change to filter animations** - Performance optimization, single property

---

## 4. Breaking Changes (Require Major Version Bump)

The following changes would require a major version bump due to API changes:

| Issue | Current | Proposed | Migration Path |
|-------|---------|----------|----------------|
| Button variant='compound' | Single variant prop mixing concerns | Separate visual and behavioral props | Codemod to split variant into two props |
| Toggle onChange prop | onChange | onCheckedChange | Deprecate onChange, add onCheckedChange, remove in next major |
| Image alt optional | alt?: string | alt: string | Add required alt prop - may break existing usages |
| Select variant semantics | Different from Button | Aligned with Button | Document breaking change, provide migration guide |

---

## 5. Appendix: Full Agent Findings

### Agent A: Accessibility Audit (24 violations)

```json
{
  "critical": [
    {
      "component": "Button.Icon",
      "issue": "lacks aria-label enforcement",
      "wcag": "4.1.2",
      "impact": "high"
    },
    {
      "component": "Image",
      "issue": "alt is optional not required",
      "wcag": "1.1.1",
      "impact": "high"
    },
    {
      "component": "Slider",
      "issue": "thumbs lack individual aria-labels for multi-thumb",
      "wcag": "4.1.2",
      "impact": "high"
    }
  ],
  "medium": [
    {
      "components": ["Input", "Textarea", "Checkbox", "Switch", "RadioGroup"],
      "issue": "don't enforce labels",
      "wcag": "3.3.2",
      "impact": "medium"
    },
    {
      "component": "Combobox",
      "issue": "listbox role missing on ul element",
      "wcag": "4.1.2",
      "impact": "medium"
    },
    {
      "component": "ModelSelector",
      "issue": "lacks aria-controls and aria-activedescendant",
      "wcag": "4.1.2",
      "impact": "medium"
    },
    {
      "component": "Markdown",
      "issue": "renders list items without ul/ol parents",
      "wcag": "1.3.1",
      "impact": "medium"
    },
    {
      "component": "SegmentedControl",
      "issue": "radiogroup lacks aria-label",
      "wcag": "3.3.2",
      "impact": "medium"
    }
  ]
}
```

### Agent B: Design Tokens (20 issues)

```json
{
  "high": [
    {
      "file": "packages/tokens/src/shadows.ts",
      "issue": "Shadow tokens use rgba() with space-separated values, may fail DTCG validation"
    },
    {
      "file": "packages/tokens/src/typography.ts",
      "issue": "Typography tokens only export 'SF Pro' without platform fallbacks"
    },
    {
      "file": "packages/tokens/src/enhanced.css",
      "issue": "Enhanced CSS defines --ds-color-* tokens not exported in TypeScript"
    }
  ],
  "medium": [
    {
      "file": "packages/tokens/src/tailwind.preset.ts",
      "issue": "6 high-contrast tokens not exposed"
    },
    {
      "file": "packages/tokens/src/focus.ts",
      "issue": "focus.ts references non-existent color tokens 'blue.7', 'blue.5'"
    },
    {
      "file": "packages/tokens/",
      "issue": "Mixed naming: camelCase vs hyphenated vs 's' prefix"
    }
  ],
  "low": [
    {
      "file": "packages/tokens/docs/outputs/manifest.json",
      "issue": "Manifest under-reports token count (excludes enhanced)"
    }
  ]
}
```

### Agent C: TypeScript Props (28 issues)

```json
{
  "high": [
    {
      "file": "packages/ui/src/components/ui/base/button/fallback/Button.tsx",
      "issue": "Button uses variant='compound' mixing visual and behavioral variants"
    },
    {
      "file": "packages/ui/src/components/ui/forms/checkbox/fallback/Checkbox.tsx",
      "issue": "Checkbox ComponentState includes 'indeterminate' but handling incomplete"
    },
    {
      "file": "packages/ui/src/components/ui/base/ToggleGroup/fallback/ToggleGroup.tsx",
      "issue": "Toggle uses 'onChange' instead of 'onCheckedChange' convention"
    }
  ],
  "medium": [
    {
      "file": "packages/ui/src/components/ui/overlays/Popover/",
      "issue": "PopoverContent forceMount defaults to true (differs from Radix)"
    },
    {
      "file": "packages/ui/src/components/ui/forms/select/",
      "issue": "Select variant prop uses different semantics than Button"
    },
    {
      "file": "packages/ui/src/components/ui/forms/Calendar/",
      "issue": "Calendar disabled prop breaks StatefulComponentProps pattern"
    }
  ],
  "documentation_gaps": 10,
  "consistency_issues": 13
}
```

### Agent D: CSS/SVG Optimization (27 issues)

```json
{
  "high": [
    {
      "file": "packages/effects/src/styles/animations.css",
      "issue": "animation-timeline: scroll() without @supports",
      "instances": 2
    },
    {
      "file": "packages/effects/src/styles/animations.css",
      "issue": "animation-timeline: view() without feature detection",
      "instances": 2
    },
    {
      "file": "packages/effects/src/components/view-transition.tsx",
      "issue": "viewTransitionName without @supports check"
    }
  ],
  "medium": [
    {
      "file": "packages/effects/src/styles/animations.css",
      "issue": "color-mix() used without @supports fallback",
      "instances": 4
    },
    {
      "file": "packages/effects/src/styles/animations.css",
      "issue": "transition-behavior: allow-discrete without @supports"
    },
    {
      "file": "packages/effects/src/components/",
      "issue": ":has() selectors without fallback",
      "instances": 4
    },
    {
      "file": "packages/effects/src/components/scroll/",
      "issue": "@container query without @supports fallback"
    },
    {
      "file": "packages/effects/src/components/",
      "issue": "Multiple filter animations without will-change"
    }
  ]
}
```

---

## Summary by Priority

| Priority | Count | Categories |
|----------|-------|------------|
| P0 | 6 | 3 CSS, 3 A11y |
| P1 | 10 | 3 Props, 3 Tokens, 2 CSS, 2 A11y |
| P2 | 12 | 4 CSS, 3 Props, 3 Tokens, 2 A11y |
| P3 | 24 | 13 Props, 1 Tokens |

**Immediate Action Required:** 6 P0 issues
**Next Sprint:** 10 P1 issues
**Backlog:** 36 P2/P3 issues
