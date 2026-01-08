# No Dark-Only Tokens (ESLint Rule)

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
  - [Option 1: Use Foundation Token Pairs (Preferred)](#option-1-use-foundation-token-pairs-preferred)
  - [Option 2: Use Utility Pairs](#option-2-use-utility-pairs)
- [Rule Configuration](#rule-configuration)
- [Rule Behavior](#rule-behavior)
  - [Detects Dark-Only Tokens](#detects-dark-only-tokens)
  - [Allowances](#allowances)
  - [Validations](#validations)
- [Examples](#examples)
  - [❌ Violations](#violations)
  - [✅ Allowed](#allowed)
- [Whitelist: Valid Dark-Only Tokens](#whitelist-valid-dark-only-tokens)
- [Foundation Token Prefixes](#foundation-token-prefixes)
- [Custom Allowances](#custom-allowances)
- [Fixing Violations](#fixing-violations)
  - [Step 1: Find the light mode equivalent](#step-1-find-the-light-mode-equivalent)
  - [Step 2: Add the light mode token](#step-2-add-the-light-mode-token)
  - [Step 3: Or use a utility pair](#step-3-or-use-a-utility-pair)
- [Testing](#testing)
- [Related Documentation](#related-documentation)


## Overview

This ESLint rule prevents dark-only token usage when using **media mode** for dark mode (`darkMode: "media"` in Tailwind config).

When using media mode, **all dark mode classes must have a light mode counterpart**. Dark-only classes will break the UI in light mode.

## The Problem

```tsx
// ❌ BAD: Dark-only - invisible in light mode!
<div className="dark:text-white">Hello</div>

// ❌ BAD: Dark-only - invisible in light mode!
<button className="dark:hover:bg-white/10">Click</button>
```

In light mode, these elements have **no styling at all** - they'll appear unstyled or invisible.

## The Solution

### Option 1: Use Foundation Token Pairs (Preferred)

```tsx
// ✅ GOOD: Token pair with explicit light/dark values
<span className="text-foundation-text-light-primary dark:text-white">
  Hello
</span>

// ✅ GOOD: Token pair with explicit light/dark values
<button className="bg-foundation-bg-light-3 dark:bg-white/10">
  Click
</button>
```

### Option 2: Use Utility Pairs

```tsx
// ✅ GOOD: Utility pair
<div className="text-blue-600 dark:text-blue-400">Hello</div>

// ✅ GOOD: Utility pair with hover
<button className="hover:bg-black/5 dark:hover:bg-white/5">Click</button>
```

## Rule Configuration

```js
// eslint.config.js
import noDarkOnlyTokens from "./packages/ui/eslint-rules-no-dark-only-tokens.js";

export default [
  {
    plugins: {
      "@chatui/no-dark-only-tokens": noDarkOnlyTokens,
    },
    rules: {
      "@chatui/no-dark-only-tokens/no-dark-only-tokens": [
        "error",
        {
          // Optional: allow specific patterns if needed
          allowedPatterns: [],
        },
      ],
    },
  },
];
```

## Rule Behavior

### Detects Dark-Only Tokens

The rule scans for `dark:` prefixed classes and checks if there's a corresponding light mode class:

```tsx
// ❌ ERROR: No light mode for text property
<div className="dark:text-white">Missing light mode</div>

// ❌ ERROR: No light mode for hover state
<button className="dark:hover:bg-white/10">Click</button>

// ❌ ERROR: Template literal with dark-only
<div className={`fixed inset-0 ${isDark ? "dark:bg-black/60" : ""}`}>
  Overlay
</div>
```

### Allowances

The rule **automatically allows**:

1. **Foundation tokens** (indicates proper pairing):

   ```tsx
   // ✅ ALLOWED: Foundation tokens are properly paired by definition
   <div className="dark:text-foundation-text-dark-primary">OK</div>
   ```

2. **Valid dark-only tokens** (intentionally dark-only):

   ```tsx
   // ✅ ALLOWED: These are intentionally dark-only (whitelisted)
   <div className="dark:divide-white/10">OK</div>
   <div className="dark:bg-white/5">OK</div>
   ```

3. **Properly paired utilities**:
   ```tsx
   // ✅ ALLOWED: Has light mode pair
   <div className="text-gray-900 dark:text-white">OK</div>
   ```

### Validations

The rule checks:

1. **JSX className attributes** (`className="..."`)
2. **Template literals** (`className={`... ${dark ? "dark:xxx" : ""}`}`)
3. **Conditional expressions** (`className={isDark ? "dark:xxx" : "light:xxx"}`)
4. **clsx/cn function calls** (`cn("dark:xxx")`)

## Examples

### ❌ Violations

```tsx
// Dark-only text
<div className="dark:text-white">Error</div>

// Dark-only background
<button className="dark:bg-black/60">Error</button>

// Dark-only hover
<a className="dark:hover:bg-white/10">Error</a>

// Dark-only border
<div className="dark:border-white/10">Error</div>

// Template literal with dark-only
<div className={`fixed ${isActive ? "dark:bg-white" : ""}`}>Error</div>
```

### ✅ Allowed

```tsx
// Foundation tokens (properly paired)
<span className="text-foundation-text-light-primary dark:text-white">OK</span>

// Utility pairs
<div className="text-gray-900 dark:text-white">OK</div>

// Hover pairs
<button className="hover:bg-black/5 dark:hover:bg-white/5">OK</button>

// Valid dark-only tokens (whitelisted)
<div className="dark:divide-white/10">OK</div>

// cn/clsx with pairs
<div className={cn("text-blue-600", "dark:text-blue-400")}>OK</div>
```

## Whitelist: Valid Dark-Only Tokens

These tokens are **intentionally dark-only** and won't trigger errors:

- `dark:divide-white/`, `dark:divide-black/`
- `dark:border-white/`, `dark:border-black/`
- `dark:bg-white/`, `dark:bg-black/`
- `dark:text-white/`, `dark:text-black/`
- `dark:shadow-white/`, `dark:shadow-black/`
- `dark:ring-white/`, `dark:ring-black/`

## Foundation Token Prefixes

Classes with these prefixes are assumed to be properly paired:

- `bg-foundation-bg-`
- `bg-foundation-accent-`
- `bg-foundation-surface-`
- `text-foundation-text-`
- `text-foundation-icon-`
- `border-foundation-`
- `shadow-foundation-`
- `ring-foundation-`

## Custom Allowances

If you need to allow specific patterns (not recommended):

```js
{
  "@chatui/no-dark-only-tokens/no-dark-only-tokens": [
    "error",
    {
      allowedPatterns: ["dark:bg-gradient-", "dark:backdrop-"],
    },
  ],
}
```

## Fixing Violations

### Step 1: Find the light mode equivalent

```tsx
// Before (dark-only)
<div className="dark:text-white">Hello</div>
```

### Step 2: Add the light mode token

```tsx
// After (paired)
<span className="text-foundation-text-light-primary dark:text-white">Hello</span>
```

### Step 3: Or use a utility pair

```tsx
// Alternative (utility pair)
<div className="text-gray-900 dark:text-white">Hello</div>
```

## Testing

To test the rule locally:

```bash
# Run ESLint
pnpm lint

# Or lint specific file
pnpm --filter @chatui/ui lint
```

## Related Documentation

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Modal Boundaries](./MODAL_BOUNDARIES.md)
- [ESLint Modal Rules](./ESLINT_MODAL_RULES.md)

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

