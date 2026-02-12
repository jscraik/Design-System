# Plan: Migrate Remaining Base Components to StatefulComponentProps

## Objective
Migrate 10 remaining base UI components to use StatefulComponentProps from @design-studio/tokens, completing the Base Components category (Phase 3).

## Components to Migrate

### Radix Fallbacks (6)
1. **Accordion** - Accordion.tsx (has "use client" directive)
2. **Avatar** - Avatar.tsx (has "use client" directive)
3. **Badge** - Badge.tsx
4. **Resizable** - Resizable.tsx
5. **ScrollArea** - ScrollArea.tsx
6. **Separator** - Separator.tsx

### Custom Components (4)
7. **Card** - Card.tsx
8. **Table** - Table.tsx
9. **TextLink** - TextLink.tsx
10. **Transition** - Transition.tsx

## Migration Pattern (Established)

For each component:

1. **Import StatefulComponentProps**:
   ```ts
   import type { StatefulComponentProps, ComponentState } from "@design-studio/tokens";
   ```

2. **Add stateful props** to component props interface:
   ```ts
   loading?: boolean;
   error?: string;
   disabled?: boolean;
   required?: boolean;
   onStateChange?: (state: ComponentState) => void;
   ```

3. **Determine effective state** (priority: loading > error > disabled > default):
   ```ts
   const effectiveState: ComponentState = loading
     ? "loading"
     : error ? "error"
       : disabled ? "disabled"
         : "default";
   ```

4. **Notify parent of state changes**:
   ```ts
   React.useEffect(() => {
     onStateChange?.(effectiveState);
   }, [effectiveState, onStateChange]);
   ```

5. **Apply data attributes** for styling/testing:
   ```ts
   data-state={effectiveState}
   data-error={error ? "true" : undefined}
   ```

6. **Remove "use client" directives** (library package, not Next.js)

## Execution Plan

### Batch 1: Simple Stateful Components
- Badge, Separator, TextLink
- These are display components with minimal state logic

### Batch 2: Interactive Components
- Avatar, ScrollArea
- Have some interaction but limited stateful behavior

### Batch 3: Complex Components
- Accordion, Resizable
- More complex state management, require careful testing

### Batch 4: Container Components
- Card, Table, Transition
- May need different approach (visual only, no meaningful state)

## Verification
After each batch:
- Run `pnpm test` to ensure all tests pass
- Run `pnpm typecheck` to verify TypeScript
- Run `pnpm lint` for Biome checks

## Notes
- Card and Transition may not have meaningful state (display-only)
- Table state is usually row-level, not table-level
- Transition state is inherent to its animation behavior
- Document any components that skip StatefulComponentProps with rationale
