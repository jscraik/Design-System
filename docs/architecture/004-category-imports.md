# ADR 004: Category Imports with Build-Time Tree-Shaking

**Status:** Accepted
**Date:** 2026-01-26
**Decision:** Use category imports with Vite manualChunks for tree-shaking
**Context:** DesignStudio Migration Phase 1

---

## Context

Component libraries face a DX vs bundle size tradeoff:

### Per-Component Imports (Best Bundle Size, Poor DX)

```typescript
// ❌ DX nightmare: no one types this manually
import { Button } from "@design-studio/ui/base/Button";
import { Input } from "@design-studio/ui/base/Input";
import { ChatInput } from "@design-studio/ui/chat/ChatInput";
```

**Pros:**
- Optimal tree-shaking (each component is separate entry point)
- Smallest bundle size

**Cons:**
- **Terrible DX:** No one types these imports manually
- **High cognitive load:** Need to remember category + component name
- **Verbose:** Long import paths
- **Error-prone:** Easy to get path wrong

### Barrel Exports (Best DX, Poor Tree-Shaking)

```typescript
// ✅ Great DX
import { Button, Input, ChatInput } from "@design-studio/ui";

// ❌ But: may bundle entire library
```

**Pros:**
- **Great DX:** Single import, autocomplete works
- **Simple:** Easy to remember and type
- **Standard:** Matches patterns like Radix UI

**Cons:**
- **Tree-shaking uncertain:** Depends on bundler
- **Risk:** May bundle entire library
- **Not explicit:** Harder to know what gets bundled

### Our Validation Results

From `docs/validation/tree-shaking-results.md`:

| Approach | Bundle Size | Overhead |
|----------|-------------|----------|
| Per-component | 863B | 1x (baseline) |
| Category imports | 854B | 0.99x |
| Barrel exports | 1.6x | 1.6x |

**Key finding:** Category imports with Vite manualChunks achieve **nearly identical** bundle size to per-component imports.

## Decision

Use **category imports with build-time tree-shaking**:

### Import Style

```typescript
// ✅ Recommended: simple and clear
import { Button, Input, ChatInput } from "@design-studio/ui";

// ✅ Icon subpath (if you only need icons)
import { SendIcon, PlusIcon } from "@design-studio/ui/icons";
```

### Build-Time Tree-Shaking

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        base: "src/components/ui/base/index.ts",
        navigation: "src/components/ui/navigation/index.ts",
        overlays: "src/components/ui/overlays/index.ts",
        forms: "src/components/ui/forms/index.ts",
        chat: "src/components/ui/chat/index.ts",
        "data-display": "src/components/ui/data-display/index.ts",
        feedback: "src/components/ui/feedback/index.ts",
        layout: "src/components/ui/layout/index.ts",
        icons: "src/icons/index.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split by category for optimal caching
          if (id.includes("@radix-ui")) return "radix-vendor";
          if (id.includes("/base/")) return "base";
          if (id.includes("/navigation/")) return "navigation";
          if (id.includes("/overlays/")) return "overlays";
          if (id.includes("/forms/")) return "forms";
          if (id.includes("/chat/")) return "chat";
          if (id.includes("/data-display/")) return "data-display";
          if (id.includes("/feedback/")) return "feedback";
          if (id.includes("/layout/")) return "layout";
          if (id.includes("/icons/")) return "icons";
        },
      },
    },
  },
});
```

### Package Exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./base": {
      "types": "./dist/src/components/ui/base/index.d.ts",
      "import": "./dist/base.js"
    },
    "./navigation": {
      "types": "./dist/src/components/ui/navigation/index.d.ts",
      "import": "./dist/navigation.js"
    },
    "./icons": {
      "types": "./dist/src/icons/index.d.ts",
      "import": "./dist/icons.js"
    }
  }
}
```

## Rationale

### Why category imports?

1. **Best DX:** Simple, standard, autocomplete-friendly
2. **Proven effective:** Radix UI, Chakra, MUI all use this pattern
3. **Validated:** Our prototype shows 0.99x overhead (nearly identical)
4. **Build-time optimization:** Vite manualChunks split by category

### Why per-component is a DX anti-pattern

1. **No one types it manually:** Requires IDE auto-imports
2. **High cognitive load:** Need to remember category + name
3. **Verbose:** Long import paths
4. **Error-prone:** Easy to get path wrong
5. **Not industry standard:** Most libraries use barrel exports

### Why manualChunks instead of per-entry?

1. **Better caching:** Split by category for optimal cache hits
2. **Simpler imports:** Single import path
3. **Proven effective:** Our validation shows 0.99x overhead
4. **Industry standard:** Radix UI, Chakra, MUI all use this

### Why Vite manualChunks?

1. **Build-time:** No runtime overhead
2. **Flexible:** Can split by any pattern (category, vendor, etc.)
3. **Proven:** Used by major libraries (Radix, Chakra, etc.)
4. **Future-proof:** Works with any bundler that supports Rollup

## Consequences

### Positive

1. **Best DX:** Simple imports, autocomplete works
2. **Good bundle size:** 0.99x overhead vs per-component
3. **Better caching:** Category splits improve cache hit rates
4. **Industry standard:** Matches patterns users expect

### Negative

1. **Not optimal:** Slightly larger than per-component (0.99x)
2. **Build config complexity:** Need to configure manualChunks
3. **Validation required:** Need to measure actual bundle sizes

### Mitigations

1. **Validation:** Prototype shows 0.99x overhead (acceptable)
2. **Measurement:** Bundle analysis in CI to catch regressions
3. **Documentation:** Clear guidance on import patterns
4. **Subpath exports:** Power users can import specific categories

## Import Guidelines

### Recommended (90% of cases)

```typescript
// Import everything from main entry
import { Button, Input, ChatInput, Modal } from "@design-studio/ui";
```

### Icon-only imports (5% of cases)

```typescript
// Import just icons
import { SendIcon, PlusIcon, TrashIcon } from "@design-studio/ui/icons";
```

### Category-specific imports (5% of cases)

```typescript
// Import specific category (power users)
import { Button, Input } from "@design-studio/ui/base";
```

## Validation Results

From our prototype (`docs/validation/tree-shaking-results.md`):

```
Per-component: 863B (baseline)
Category imports: 854B (0.99x)
Barrel exports: 1.6x (rejected)
```

**Conclusion:** Category imports with manualChunks are **nearly optimal** for bundle size while providing **superior DX**.

## Related Decisions

- [ADR 001: Package Structure](./001-package-structure.md)
- [ADR 002: Hybrid Component Pattern](./002-hybrid-components.md)
- [ADR 003: Type-Safe Tokens](./003-type-safe-tokens.md)

## References

- Validation report: `docs/validation/tree-shaking-results.md`
- Vite config: `packages/ui/vite.config.ts`
- Migration guide: `docs/MIGRATION.md`

---

**Last Updated:** 2026-02-06
