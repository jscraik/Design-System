# ADR 001: Package Structure Simplification

**Status:** Accepted
**Date:** 2026-01-26
**Decision:** Simplify from 13 packages to 3 packages
**Context:** DesignStudio Migration Phase 1

---

## Context

AStudio currently has **13 packages** in the `packages/` directory:

- `@design-studio/runtime` - Host abstraction
- `@design-studio/tokens` - Design tokens
- `@design-studio/ui` - UI components
- `@design-studio/icons` - Icon library
- `@design-studio/effects` - Animation effects
- `@design-studio/json-render` - JSON rendering
- `@design-studio/cli` - CLI tools
- `@design-studio/cloudflare-template` - Cloudflare template
- `@design-studio/skill-ingestion` - Skill ingestion
- `@design-studio/widgets` - Widget bundles
- ... (4 more)

### Problems

1. **Fragmentation**: Too many small packages increase cognitive load
2. **Dependency complexity**: Inter-package dependencies create circular dependency risks
3. **Publishing overhead**: Publishing 13 packages is slow and error-prone
4. **DX friction**: Developers need to know which package contains what
5. **Icons as separate package**: Icons are always needed with UI, but separate

## Decision

Simplify to **3 packages**:

```
packages/
├── runtime/                 # @design-studio/runtime (~50KB)
├── tokens/                  # @design-studio/tokens (~100KB)
└── ui/                      # @design-studio/ui (~500KB, includes icons)
```

Move non-library packages to appropriate locations:

```
tools/                       # Tooling packages
├── ...
platforms/                   # App surfaces
├── ...
packages/widgets/            # Widget bundles
```

### Package Responsibilities

#### @design-studio/runtime
- **Purpose:** Host abstraction layer
- **Exports:** `createEmbeddedHost`, `createStandaloneHost`, `HostProvider`, `useHost`
- **Dependencies:** None (except React peer dependency)
- **Size:** ~50KB

#### @design-studio/tokens
- **Purpose:** Type-safe design tokens with CSS variables
- **Exports:** `tokens` object, `ThemeProvider`, `useTheme`
- **Dependencies:** None (except React peer dependency)
- **CSS:** `foundations.css`, `tokens.css`
- **Size:** ~100KB

#### @design-studio/ui
- **Purpose:** React component library with icons
- **Exports:** All UI components, icons
- **Dependencies:** `@design-studio/tokens`, `@design-studio/runtime`
- **Subpath exports:** `/base`, `/navigation`, `/overlays`, `/forms`, `/chat`, `/data-display`, `/feedback`, `/layout`, `/icons`
- **Size:** ~500KB

## Rationale

### Why 3 packages?

1. **Single responsibility:** Each package has a clear, distinct purpose
2. **Minimal fragmentation:** Reduces from 13 to 3 (77% reduction)
3. **Logical grouping:** Icons belong with UI (always used together)
4. **Ecosystem alignment:** Matches patterns like Radix UI (primitives + themes)

### Why not a single package?

1. **Separation of concerns:** Runtime is useful without UI
2. **Token independence:** Tokens should be usable in non-React contexts
3. **Tree-shaking:** Separate packages enable better bundle optimization

### Why not more packages?

1. **Cognitive load:** More packages = more to learn
2. **Versioning complexity:** Multiple packages increase coordination overhead
3. **Publishing friction:** More packages = slower releases

### Why merge icons into UI?

1. **Always used together:** No UI without icons
2. **Reduced imports:** One import instead of two
3. **Simplified tree-shaking:** Single bundle split point

## Consequences

### Positive

1. **77% fewer packages** to publish and maintain
2. **Clearer boundaries** between runtime, tokens, and UI
3. **Better DX** due to simpler import structure
4. **Faster builds** due to reduced package complexity
5. **Easier onboarding** with fewer packages to understand

### Negative

1. **Larger UI package** (~500KB) requires good tree-shaking
2. **Migration cost** for existing users (need to update imports)
3. **Tooling packages** need new home (`tools/` directory)

### Mitigations

1. **Tree-shaking:** Use Vite manualChunks to split by category
2. **Subpath exports:** Enable category-level imports (`@design-studio/ui/base`)
3. **Migration scripts:** Automated import path updates
4. `tools/` directory:** Clear location for non-library packages

## Alternatives Considered

### Alternative 1: Keep 13 packages
**Rejected:** Too much fragmentation, cognitive load, and publishing overhead

### Alternative 2: Single package (@design-studio/all)
**Rejected:** Runtime and tokens should be usable independently

### Alternative 3: 5 packages (add icons, effects, json-render)
**Rejected:** Still too fragmented, icons/effects/json-render always used with UI

### Alternative 4: Monorepo with workspaces (no publish)
**Rejected:** Users need published packages for their own apps

## Related Decisions

- [ADR 002: Hybrid Component Pattern](./002-hybrid-components.md)
- [ADR 003: Type-Safe Tokens](./003-type-safe-tokens.md)
- [ADR 004: Category Imports](./004-category-imports.md)

## References

- Original proposal: `.spec/architecture-2026-01-26-design-studio.md`
- Package structure: `packages/runtime/package.json`, `packages/tokens/package.json`, `packages/ui/package.json`

---

**Last Updated:** 2026-02-06
