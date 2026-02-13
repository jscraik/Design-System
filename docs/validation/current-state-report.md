# Current State Measurement Report
**Date:** 2026-01-26
**Phase:** Validation - Week 1

---

## Executive Summary

This report documents the baseline metrics for the AStudio codebase before migration to DesignStudio. These metrics will be used to measure migration success.

---

## Package Inventory

### Current Packages (13)

| Package | Version | Size | Status |
|---------|---------|------|--------|
| `@design-studio/ui` | 0.0.1 | 2.5MB | Core library - KEEP (rename) |
| `@design-studio/icons` | 0.0.1 | 3.7MB | Icons - MERGE into ui |
| `@design-studio/runtime` | 0.0.1 | 68KB | Host adapter - KEEP (rename) |
| `@design-studio/tokens` | 0.0.1 | 160KB | Design tokens - KEEP (rename) |
| `@design-studio/cli` | - | - | Tooling - MOVE to tools/ |
| `@design-studio/cloudflare-template` | - | - | Template - MOVE to tools/ |
| `@design-studio/make-template` | - | - | Template - MOVE to tools/ |
| `@design-studio/skill-ingestion` | - | - | Tooling - MOVE to tools/ |
| `@design-studio/json-render` | - | - | Component - MERGE into ui |
| `@design-studio/effects` | - | - | Component - MERGE into ui |
| `@design-studio/widgets` | - | - | Bundles - MOVE to platforms/web/apps/widgets |

### Target Packages (DesignStudio)

| Package | Source | Target Size |
|---------|--------|-------------|
| `@design-studio/runtime` | `@design-studio/runtime` | ~50KB |
| `@design-studio/tokens` | `@design-studio/tokens` | ~100KB |
| `@design-studio/ui` | `@design-studio/ui` + `@design-studio/icons` + others | ~500KB |

---

## Component Inventory

### By Category

| Category | Component Files | Test Files | Story Files | Coverage |
|----------|-----------------|------------|-------------|----------|
| **base** | 79 | 11 | 42 | 14% |
| **navigation** | 25 | 0 | 15 | 0% |
| **overlays** | 21 | 0 | 18 | 0% |
| **data-display** | 11 | 0 | 9 | 0% |
| **feedback** | 11 | 0 | 10 | 0% |
| **forms** | 9 | 0 | 8 | 0% |
| **chat** | 2 | 0 | 2 | 0% |
| **layout** | 1 | 0 | 1 | 0% |
| **TOTAL** | **159** | **11** | **105** | **~7%** |

### Test Coverage Analysis

**Current state:**
- **Unit tests:** 11 files
- **Storybook stories:** 116 files (across all of packages/ui/src)
- **Coverage:** ~7% (11 tests / 159 components)

**Notes:**
- Most components have Storybook stories (good for visual testing)
- Very few unit tests (gaps in logic testing)
- No a11y tests visible
- No visual regression tests configured

---

## Dependency Analysis

### @design-studio/ui Dependencies

**Production:**
- `@openai/apps-sdk-ui`: ^0.2.1 (OpenAI's design system)
- 26 `@radix-ui/*` packages (headless primitives)
- `lucide-react`: ^0.562.0 (icons)
- `motion`: ^11.0.0 (animations)
- `recharts`: 2.15.2 (charts)
- `react-hook-form`: ^7.70.0 (forms)
- `next-themes`: 0.4.6 (theming)

**Dev:**
- `vitest`: ^4.0.16 (testing)
- `@storybook/react-vite`: ^10.1.11 (docs)
- `vite`: ^7.3.0 (build)

### Key Observations

1. **Heavy Radix UI dependency:** 26 packages from Radix
2. **Motion library:** Large dependency (164KB in bundle)
3. **Recharts:** Significant (124KB) but optional usage
4. **No TypeScript strict mode:** Should enable for migration

---

## Export Structure Analysis

### Current Exports (@design-studio/ui)

```typescript
// Main entry
export * from "./dist/index.js"

// Category exports (existing)
"./base" → base components
"./chat" → chat components
"./icons" → icon subpath
"./data-display" → data display
"./feedback" → feedback
"./forms" → forms
"./layout" → layout
"./navigation" → navigation
"./overlays" → overlays
"./modals" → modals
"./settings" → settings
"./templates" → templates
"./experimental" → experimental
"./dev" → dev-only
"./showcase" → showcase
```

### Export Types

1. **Barrel exports:** Main `index.js` re-exports everything
2. **Category exports:** Subpaths for categories (good DX)
3. **Dev exports:** `./dev` path for dev-only content

**Issue:** Dev content likely included in production builds

---

## Import Pattern Analysis

### Common Patterns Found

```typescript
// 1. Main package import (bundles everything)
import { AppsSDKUIProvider } from "@design-studio/ui";

// 2. Category imports (better)
import { Button, Input } from "@design-studio/ui/base";
import { Toast } from "@design-studio/ui/feedback";

// 3. Icons subpath
import { IconSearch, IconX } from "@design-studio/ui/icons";

// 4. Templates
import { ChatTemplate } from "@design-studio/ui/templates";
```

**Analysis:**
- Category imports already exist (good DX foundation)
- Main index.js still large (228KB)
- Icons as separate package causes duplication

---

## Component Patterns Analysis

### File Structure Pattern

```
ComponentName/
├── ComponentName.tsx       # Implementation
├── ComponentName.test.tsx  # Tests (rare)
├── ComponentName.stories.tsx # Stories (common)
└── index.ts                # Export
```

### Radix UI Pattern

Most components use Radix UI primitives:

```
ComponentName/
├── ComponentName.tsx       # Wrapper/hoc
└── fallback/
    └── ComponentName.tsx   # Radix primitive fallback
```

**Note:** This is the "fallback" pattern for Radix UI components

---

## TypeScript Configuration

### Current State

```json
{
  "compilerOptions": {
    "strict": false,  // ❌ Not strict!
    "target": "ES2022",
    "module": "ESNext"
  }
}
```

**Recommendation:** Enable strict mode for DesignStudio migration

---

## Documentation Coverage

### Existing Documentation

| Type | Count | Location |
|------|-------|----------|
| Storybook stories | 116 | packages/ui/src/**/*.stories.tsx |
| Component docs | Embedded | In Storybook |
| Migration guide | 1 | CLAUDE.md |
| Architecture docs | 1 | .spec/architecture-*.md |
| API docs | Minimal | Component-level only |

### Gaps

- No comprehensive component API reference
- No pattern library
- No usage examples beyond Storybook
- No migration guide for users
- No contribution guidelines

---

## Build & Tooling

### Build Tools

- **Vite:** ^7.3.0 (build tool)
- **TypeScript:** ^5.7.2
- **Vitest:** ^4.0.16 (tests)
- **Storybook:** ^10.1.11 (docs)

### Build Commands

```bash
pnpm build           # Build all
pnpm build:lib       # Build libraries
pnpm build:widget    # Build widget HTML
```

### Build Output

```
packages/ui/dist/
├── index.js         # 228KB (main entry)
├── *.js             # Chunks (2.5MB total)
└── ui.css           # 160KB (styles)
```

---

## Current State Summary

### Strengths
✅ Category exports already exist
✅ Storybook coverage is good (116 stories)
✅ Modern tooling (Vite, Vitest)
✅ Radix UI primitives for accessibility

### Weaknesses
❌ Low test coverage (7%)
❌ Dev content in production bundle
❌ No TypeScript strict mode
❌ Icons as separate package (3.7MB!)
❌ Large main entry point (228KB)

### Opportunities
🎯 Merge icons into UI package
🎯 Enable TypeScript strict mode
🎯 Remove dev content from production
🎯 Implement manualChunks for better tree-shaking
🎯 Increase test coverage to 80%

---

## Success Criteria (Baseline)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Bundle size | 6.2MB | 500KB | ❌ |
| Test coverage | 7% | 80% | ❌ |
| TypeScript | Not strict | Strict | ❌ |
| Packages | 13 | 3 | ❌ |
| Documentation | Minimal | Comprehensive | ❌ |

---

## Next Steps

1. **Complete tree-shaking validation** (Task 3)
2. **Prepare designer interview questions** (Task 5)
3. **Implement hybrid pattern examples** (Task 4)

---

## Appendix: Data Collection Commands

```bash
# Component counts
find packages/ui/src/components/ui -type f -name "*.tsx" | wc -l

# Test files
find packages/ui/src -name "*.test.tsx" | wc -l

# Story files
find packages/ui/src -name "*.stories.tsx" | wc -l

# Package sizes
du -sh packages/*/dist 2>/dev/null | sort -hr

# Category breakdown
for dir in packages/ui/src/components/ui/*/; do
  echo "$(basename "$dir"): $(find "$dir" -type f -name "*.tsx" | wc -l)"
done
```
