# Bundle Analysis Report
**Date:** 2026-01-26
**Phase:** Validation - Week 1

---

## Executive Summary

This report analyzes the current state of the AStudio codebase to establish baseline metrics for the DesignStudio migration. Key findings indicate significant optimization opportunities through tree-shaking and package consolidation.

---

## Current Package Structure (13 packages)

| Package | Size | Purpose |
|---------|------|---------|
| `@design-studio/ui` | 2.5MB | Main component library |
| `@design-studio/icons` | 3.7MB | Icon components |
| `@design-studio/runtime` | 68KB | Host abstraction |
| `@design-studio/tokens` | 160KB | Design tokens |
| `@design-studio/make-template` | - | Template CLI |
| `@design-studio/cloudflare-template` | - | Cloudflare Workers template |
| `@design-studio/skill-ingestion` | - | Skill processing |
| `@design-studio/json-render` | - | JSON rendering |
| `@design-studio/cli` | - | CLI tools |
| `@design-studio/widgets` | - | Widget bundles |
| `@design-studio/effects` | - | Animation effects |

**Total UI footprint:** ~6.2MB (ui + icons)

---

## Component Breakdown by Category

| Category | Components | Notes |
|----------|------------|-------|
| **base** | 79 | Primitives (Button, Input, etc.) |
| **navigation** | 25 | Navigation components |
| **overlays** | 21 | Modals, tooltips, popovers |
| **data-display** | 11 | Cards, charts, progress |
| **feedback** | 11 | Toasts, alerts, dialogs |
| **forms** | 9 | Form-specific components |
| **chat** | 2 | Chat-specific components |
| **layout** | 1 | Layout utilities |

**Total:** 159 component files

---

## Bundle Size Analysis (Top 20 files)

| File | Size | Content |
|------|------|---------|
| `registry-Jt_Q1q-L.js` | 384KB | Radix UI registry (?) |
| `index.js` | 228KB | Main entry point |
| `ChatVariants-BDrf08_C.js` | 200KB | Chat variants |
| `Transition-U9d8k6KV.js` | 164KB | Motion/Transition library |
| `FoundationsShowcase-Bu__GpZw.js` | 156KB | Dev: foundations showcase |
| `Select-DgEGi7dn.js` | 136KB | Select component |
| `Chart-CjswXjpG.js` | 124KB | Charts (Recharts) |
| `dev.js` | 76KB | Dev-only exports |
| `utils-BFFdc7Eh.js` | 72KB | Utility functions |
| `Tabs-b8iKj0RU.js` | 72KB | Tabs component |
| `DiscoverySettingsModal--5W2r-Qf.js` | 64KB | Settings modal |
| `Toast-DcRkraxu.js` | 60KB | Toast notifications |
| `SecurityPanel-BB2ZayzS.js` | 56KB | Security panel |
| `Resizable-CS-OlqVd.js` | 52KB | Resizable panels |
| `ChatGPTIconsFixed-DdWHuNvn.js` | 44KB | ChatGPT icons |
| `HoverCard-Vb0RRWW4.js` | 44KB | Hover card |
| `Drawer-D61Ieb96.js` | 44KB | Drawer component |
| `icons.js` | 4.5KB | Icon exports |

**Total dist size:** ~2.5MB

---

## Key Observations

### 1. Large Single-File Bundles
- `registry.js` (384KB) appears to be a Radix UI registry - needs investigation
- `index.js` (228KB) is the main entry point, likely including all exports
- Dev-only content like `FoundationsShowcase` (156KB) and `dev.js` (76KB) in production bundle

### 2. Icon Package Size
- `@design-studio/icons` is 3.7MB - **larger than the entire UI package**
- This should definitely be merged into the main UI package

### 3. Third-Party Dependencies
- Recharts (Chart.js = 124KB)
- Motion library (Transition.js = 164KB)
- Radix UI components scattered across chunks

### 4. Tree-Shaking Effectiveness
**Current state:** Some tree-shaking is happening (evidenced by separate chunks), but:
- Main `index.js` still 228KB (likely barrel export issue)
- Dev content in production bundle
- Icons as separate package prevents cross-package optimization

---

## Import Pattern Analysis

### Current Patterns

```typescript
// Main package import
import { AppsSDKUIProvider } from "@design-studio/ui";

// Category imports (existing)
import { Button, Input } from "@design-studio/ui/base";
import { Toast } from "@design-studio/ui/feedback";

// Icons subpath
import { IconSearch } from "@design-studio/ui/icons";

// Templates
import { ChatTemplate } from "@design-studio/ui/templates";
```

### Analysis
- **Good:** Category imports already exist (`/base`, `/feedback`, etc.)
- **Issue:** Main `index.js` still re-exports everything (228KB)
- **Opportunity:** Build-time code splitting with Vite manualChunks

---

## Recommendations

### High Priority

1. **Merge icons into UI package**
   - Current: 3.7MB separate package
   - Benefit: Better tree-shaking, single bundle optimization
   - Savings: ~100-200KB in real-world usage

2. **Remove dev-only content from production**
   - `FoundationsShowcase` (156KB)
   - `dev.js` (76KB)
   - Savings: ~232KB

3. **Fix barrel export in index.js**
   - Current: 228KB main entry
   - Target: Split by category with manualChunks
   - Potential savings: 150-200KB

### Medium Priority

4. **Lazy-load heavy components**
   - Charts (124KB) - rarely used together
   - Complex modals (64KB+ each)
   - Use React.lazy for conditional components

5. **Configure Vite manualChunks**
   ```typescript
   manualChunks(id) {
     if (id.includes('/base/')) return 'base';
     if (id.includes('/chat/')) return 'chat';
     if (id.includes('/icons/')) return 'icons';
     if (id.includes('recharts')) return 'charts-vendor';
     if (id.includes('motion')) return 'motion-vendor';
   }
   ```

---

## Target State (DesignStudio)

| Metric | Current | Target | Reduction |
|--------|---------|--------|-----------|
| UI Package | 2.5MB | 500KB | 80% |
| Icons | 3.7MB | merged | 100% |
| Total footprint | 6.2MB | 500KB | 92% |

**Note:** These targets assume:
- Icons merged into UI
- Dev-only content removed
- Effective tree-shaking with manualChunks
- Lazy loading for heavy components

---

## Next Steps

1. **Validate tree-shaking prototype** (Task 3)
   - Create test with category imports
   - Measure actual bundle sizes
   - Confirm Vite manualChunks effectiveness

2. **Component inventory** (Task 2)
   - Complete component categorization
   - Identify compound component candidates
   - Document usage patterns

3. **Test coverage baseline** (Task 2)
   - Count existing tests
   - Measure coverage
   - Identify gaps

---

## Appendix: Data Collection Method

```bash
# Bundle sizes
du -sh packages/ui/dist/*.js | sort -hr

# Component counts
find packages/ui/src/components/ui -type f -name "*.tsx" | wc -l

# Test files
find packages/ui/src -name "*.test.tsx" | wc -l

# Storybook stories
find packages/ui/src -name "*.stories.tsx" | wc -l
```
