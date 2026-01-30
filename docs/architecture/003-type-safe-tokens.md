# ADR 003: Type-Safe Tokens

**Status:** Accepted
**Date:** 2026-01-26
**Decision:** Use DTCG JSON → TypeScript generation for type-safe token API
**Context:** DesignStudio Migration Phase 1

---

## Context

AStudio currently uses **string-based token access**:

```typescript
import { getToken } from "@design-studio/tokens";

const bgColor = getToken("color.background.dark.primary");
```

### Problems

1. **No autocomplete:** Can't discover tokens while typing
2. **No type safety:** Typos only caught at runtime
3. **No refactoring:** Can't safely rename tokens
4. **No navigation:** Can't jump to definition
5. **Stringly-typed:** Easy to make mistakes

### Example Error

```typescript
// ❌ Typo: only caught at runtime
const bgColor = getToken("color.background.dar.primary"); // "dar" instead of "dark"
```

## Decision

Generate **type-safe token objects** from DTCG JSON:

### Source: DTCG JSON
```json
{
  "$type": "design-token-group",
  "color": {
    "$type": "design-token-group",
    "background": {
      "$type": "design-token-group",
      "dark": {
        "$type": "design-token-group",
        "primary": {
          "$type": "color",
          "value": "#212121"
        }
      }
    }
  }
}
```

### Generated: TypeScript
```typescript
export const tokens = {
  colors: {
    background: {
      dark: {
        primary: "#212121",
        secondary: "#303030",
      },
      light: {
        primary: "#FFFFFF",
        secondary: "#EDEDED",
      },
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },
} as const;

// Infer types
export type Tokens = typeof.tokens;
```

### Usage
```typescript
import { tokens } from "@design-studio/tokens";

// ✅ Fully typed, autocomplete works
const bgColor = tokens.colors.background.dark.primary;

// ✅ Type error if token doesn't exist
const invalid = tokens.colors.background.dar.primary; // TypeScript error!

// ✅ Can jump to definition
Cmd+Click on `primary` jumps to the token definition
```

## Rationale

### Why type-safe tokens?

1. **Autocomplete:** Discover tokens while typing
2. **Type safety:** Catch errors at compile time
3. **Refactoring:** Safely rename tokens
4. **Navigation:** Jump to definition
5. **Documentation:** Token structure is self-documenting

### Why DTCG JSON?

1. **Standard format:** [Design Token Community Group](https://tr.designtokens.org/) is the W3C standard
2. **Tooling ecosystem:** Many tools support DTCG JSON
3. **IDE friendly:** Can generate from any source (Figma, Style Dictionary, etc.)
4. **Future-proof:** Aligns with industry direction

### Why not keep string-based API?

1. **No type safety:** Typos only caught at runtime
2. **Poor DX:** Can't autocomplete or navigate
3. **Hard to refactor:** Can't safely rename tokens
4. **Stringly-typed:** Goes against TypeScript best practices

### Why not use Zod/similar?

1. **Overhead:** Zod adds runtime validation (not needed for tokens)
2. **Bundle size:** Zod is ~20KB, tokens should be smaller
3. **Complexity:** DTCG JSON → TS is simpler than DTCG JSON → Zod → TS

## Implementation

### Generator Script

```typescript
// packages/tokens/scripts/generate-tokens.ts
import { readFileSync, writeFileSync } from "node:fs";
import { dtcgToTypescript } from "./generator";

const dtcgJson = JSON.parse(
  readFileSync("src/tokens/index.dtcg.json", "utf-8")
);

const typescript = dtcgToTypescript(dtcgJson);
writeFileSync("src/tokens.generated.ts", typescript);
```

### Build Process

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.build.json && tsx scripts/generate-tokens.ts"
  }
}
```

### Export Structure

```typescript
// src/index.ts
export { tokens } from "./tokens.generated";
export { ThemeProvider, useTheme } from "./theme";
export type { Tokens } from "./tokens.generated";
```

## Migration Path

### Step 1: Run codemod
```bash
# Auto-migrate getToken() calls to tokens.*
pnpm migrate:tokens
```

### Step 2: Manual review
```bash
# Find any remaining getToken calls
rg "getToken\(" src/
```

### Step 3: Type check
```bash
pnpm type-check
```

## Consequences

### Positive

1. **Type safety:** Catch token errors at compile time
2. **Better DX:** Autocomplete, navigation, refactoring
3. **Self-documenting:** Token structure is explicit
4. **Standard format:** DTCG JSON is interoperable

### Negative

1. **Breaking change:** Need to migrate all token usage
2. **Bundle size:** `as const` objects are slightly larger than strings
3. **Learning curve:** Developers need to learn new API

### Mitigations

1. **Migration scripts:** Automated codemods
2. **Documentation:** Clear migration guide
3. **Backward compatibility:** Could support both APIs temporarily
4. **Tree-shaking:** Unused tokens are tree-shaken

## Deferred

The following are **deferred to post-launch**:

1. **Visual token editor:** Web-based GUI for token management
2. **Figma sync plugin:** Bidirectional sync between Figma and code
3. **Theme builder UI:** Visual theme creation tool

**Rationale:** These tools add 11-15 weeks of work. Focus on DX improvements first.

## Related Decisions

- [ADR 001: Package Structure](./001-package-structure.md)
- [ADR 002: Hybrid Component Pattern](./002-hybrid-components.md)
- [ADR 004: Category Imports](./004-category-imports.md)

## References

- DTCG Specification: https://tr.designtokens.org/
- Migration guide: `docs/MIGRATION.md`
- Generator script: `packages/design-studio-tokens/scripts/generate-tokens.ts`

---

**Last Updated:** 2026-01-26
