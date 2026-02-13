# AStudio → DesignStudio Migration Guide

This guide helps you migrate from AStudio (`@design-studio/*`) to DesignStudio (`@design-studio/*`).

**Version:** 2.0.0
**Status:** Breaking Changes
**Timeline:** 8-10 weeks (estimated completion: 2026-03)

---

## Executive Summary

DesignStudio is a pragmatic refactoring of AStudio focusing on:
- **89% bundle size reduction** (6.2MB → 500KB)
- **Type-safe tokens** (full autocomplete, no more string typos)
- **Better DX** (category imports, hybrid components)
- **Sustainable testing** (80% smart coverage vs 100% overhead)

**Designer tools** (token editor, Figma sync) are **deferred to post-launch**.

---

## Validation Evidence

The following validation reports support this migration:

- **[Bundle Analysis Report](validation/bundle-analysis-report.md)** - Current state: 6.2MB (2.5MB ui + 3.7MB icons)
- **[Tree-Shaking Results](validation/tree-shaking-results.md)** - Category imports validated (0.99x overhead)
- **[Hybrid Pattern Validation](validation/hybrid-pattern-validation-report.md)** - Props + compound API validated
- **[Current State Report](validation/current-state-report.md)** - 159 components, 7% test coverage
- **[Designer Interview Questions](validation/designer-interview-questions.md)** - Interview guide for designer feedback

---

## Package Changes

### Old Package Structure (13 packages)

```
@design-studio/runtime
@design-studio/tokens
@design-studio/ui
@design-studio/icons
@design-studio/effects
@design-studio/json-render
@design-studio/cli
@design-studio/cloudflare-template
@design-studio/skill-ingestion
@design-studio/widgets
... (4 more)
```

### New Package Structure (3 packages)

```
@design-studio/runtime    # Host abstraction (~50KB)
@design-studio/tokens     # Type-safe tokens (~100KB)
@design-studio/ui          # Components + icons (~500KB)
```

### Mapping

| Old Package | New Package | Notes |
|------------|-------------|-------|
| `@design-studio/runtime` | `@design-studio/runtime` | Mostly rename |
| `@design-studio/tokens` | `@design-studio/tokens` | + Type-safe API |
| `@design-studio/ui` | `@design-studio/ui` | + Hybrid pattern |
| `@design-studio/icons` | `@design-studio/ui/icons` | Merged into ui |
| `@design-studio/effects` | `@design-studio/ui` | Merged into ui |
| `@design-studio/json-render` | `@design-studio/ui` | Merged into ui |
| `@design-studio/widgets` | `platforms/web/apps/widgets` | Moved to platforms |
| `@design-studio/cli` | `tools/cli` | Moved to tools |

---

## Breaking Changes by Category

### 1. Import Paths

All import paths have changed from `@design-studio/*` to `@design-studio/*`.

**Before:**
```tsx
import { Button } from "@design-studio/ui/base";
import { ChatInput } from "@design-studio/ui/chat";
import { tokens } from "@design-studio/tokens";
import { createEmbeddedHost } from "@design-studio/runtime";
import { SendIcon } from "@design-studio/icons";
```

**After:**
```tsx
import { Button, ChatInput } from "@design-studio/ui";
import { tokens } from "@design-studio/tokens";
import { createEmbeddedHost } from "@design-studio/runtime";
import { SendIcon } from "@design-studio/ui/icons";
```

**Migration Script:**
```bash
# Run the automated migration script
pnpm migrate:imports
```

### 2. Tokens API

#### String-Based → Type-Safe

**Before (No Autocomplete):**
```tsx
import { getToken } from "@design-studio/tokens";

const bgColor = getToken("color.background.dark.primary");
// No type checking, no autocomplete
```

**After (Fully Typed):**
```tsx
import { tokens } from "@design-studio/tokens";

const bgColor = tokens.colors.background.dark.primary;
// Full autocomplete, type-safe
```

#### CSS Variables Unchanged

CSS variables still work the same way:

```css
/* Still supported */
.button {
  background-color: var(--color-background-dark-primary);
  padding: var(--spacing-md);
}
```

### 3. Component API: Hybrid Pattern

Components now support **both** props-based and compound APIs.

#### Props-Based (Default, 80% of cases)

**Before:**
```tsx
<ChatInput
  placeholder="Type a message..."
  onSend={handleSubmit}
  showAttachments={true}
/>
```

**After (Same API):**
```tsx
<ChatInput
  placeholder="Type a message..."
  onSend={handleSubmit}
  showAttachments={true}
/>
```

**No changes needed** for most use cases.

#### Compound (Opt-In, 20% of cases)

**New API:**
```tsx
<ChatInput variant="compound">
  <ChatInput.Textarea placeholder="Type a message..." />
  <ChatInput.Actions>
    <ChatInput.SendButton />
  </ChatInput.Actions>
</ChatInput>
```

Use compound when you need:
- Custom layouts
- Multiple slots
- Advanced composition

### 4. Icons

Icons are now imported from `@design-studio/ui/icons`.

**Before:**
```tsx
import { SendIcon } from "@design-studio/icons";
```

**After:**
```tsx
import { SendIcon } from "@design-studio/ui/icons";

// Or import from main package
import { SendIcon } from "@design-studio/ui";
```

### 5. Runtime API

Runtime API is mostly unchanged, just renamed.

**Before:**
```tsx
import { createEmbeddedHost, HostProvider } from "@design-studio/runtime";
```

**After:**
```tsx
import { createEmbeddedHost, HostProvider } from "@design-studio/runtime";
```

---

## Deprecated Features

The following features are **removed** in DesignStudio 2.0:

| Feature | Replacement | Notes |
|---------|-------------|-------|
| `getToken("path")` | `tokens.path.to.value` | Use type-safe API |
| Per-component imports | Category imports | `from "@design-studio/ui"` |
| `@design-studio/*` packages | `@design-studio/*` | Update all imports |
| Visual token editor | **Deferred** | Coming in v2.1+ |
| Figma sync plugin | **Deferred** | Coming in v2.1+ |
| Storybook theme switcher | **Deferred** | Coming in v2.1+ |

---

## Migration Steps

### Step 1: Update Dependencies

```bash
# Remove old packages
pnpm remove @design-studio/runtime @design-studio/tokens @design-studio/ui @design-studio/icons

# Add new packages
pnpm add @design-studio/runtime @design-studio/tokens @design-studio/ui
```

### Step 2: Run Migration Script

```bash
# Auto-migrate all import paths
pnpm migrate:imports
```

The script will:
- Update all `@design-studio/*` imports to `@design-studio/*`
- Convert `getToken()` calls to `tokens.*` paths
- Update icon imports
- Remove unused imports

### Step 3: Manual Review

Check these files manually:

1. **Token usage:**
   ```bash
   # Find any remaining getToken calls
   rg "getToken\(" src/
   ```

2. **Component imports:**
   ```bash
   # Find any remaining @astudio imports
   rg "@design-studio/" src/
   ```

3. **Type errors:**
   ```bash
   pnpm type-check
   ```

### Step 4: Test Your Changes

```bash
# Run linter
pnpm lint

# Run type check
pnpm type-check

# Run tests
pnpm test

# Run your app
pnpm dev
```

### Step 5: Build Verification

```bash
# Check bundle size
pnpm build

# Verify tree-shaking
# Look for unused code in dist/
```

---

## Rollback Plan

If you encounter issues:

1. **Revert import changes:**
   ```bash
   git checkout -- src/
   ```

2. **Restore old packages:**
   ```bash
   pnpm remove @design-studio/*
   pnpm add @design-studio/runtime @design-studio/tokens @design-studio/ui @design-studio/icons
   ```

3. **Report the issue:**
   - GitHub Issues: https://github.com/your-org/aStudio/issues
   - Include: error messages, reproduction steps, environment info

---

## Common Issues

### Issue: "Cannot find module '@design-studio/*'"

**Solution:**
```bash
pnpm install
```

### Issue: Type errors with tokens

**Problem:** Using old `getToken()` syntax

**Solution:** Use type-safe API
```tsx
// ❌ Wrong
const color = getToken("color.background.dark.primary");

// ✅ Right
const color = tokens.colors.background.dark.primary;
```

### Issue: Icons not found

**Problem:** Importing from old path

**Solution:** Update import
```tsx
// ❌ Wrong
import { Icon } from "@design-studio/icons";

// ✅ Right
import { Icon } from "@design-studio/ui/icons";
```

### Issue: Bundle size increased

**Problem:** Category imports pulling too much

**Solution:** Use subpath imports
```tsx
// For icons only
import { Icon } from "@design-studio/ui/icons";

// For specific category (coming soon)
import { Button } from "@design-studio/ui/base";
```

---

## Need Help?

- **Documentation:** https://github.com/your-org/aStudio/docs
- **GitHub Issues:** https://github.com/your-org/aStudio/issues
- **Discord:** https://discord.gg/your-server
- **Email:** design-studio@your-org.com

---

## Changelog

### 2.0.0 (2026-03 - TBD)

**Breaking Changes:**
- Renamed all packages from `@design-studio/*` to `@design-studio/*`
- Removed `getToken()` in favor of type-safe `tokens.*` API
- Merged icons package into `@design-studio/ui`
- Implemented hybrid component pattern (props default, compound opt-in)
- Switched to category imports (better DX, build-time tree-shaking)
- Reduced bundle size by 89% (6.2MB → 500KB)

**Added:**
- Type-safe token API with full autocomplete
- Hybrid component pattern (props + compound)
- ThemeProvider and useTheme hook
- Migration scripts for automatic updates

**Deprecated:**
- Visual token editor (deferred to v2.1+)
- Figma sync plugin (deferred to v2.1+)
- Storybook theme switcher (deferred to v2.1+)

**Removed:**
- `@design-studio/*` packages (use `@design-studio/*`)
- `getToken()` function (use `tokens.*`)
- Per-component imports (use category imports)
- Separate icons package (merged into ui)

---

**Last Updated:** 2026-01-26
**Migration Guide Version:** 1.0.0
