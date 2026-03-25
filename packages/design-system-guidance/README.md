# @brainwav/design-system-guidance

Private guidance package for enforcing design-system usage in consumer projects.

## Table of Contents
- [Install](#install)
- [Initialize](#initialize)
- [Check](#check)
- [CI mode](#ci-mode)
- [Scope-Aware Enforcement](#scope-aware-enforcement)
- [Included guidance](#included-guidance)

## Install
```bash
pnpm add -D @brainwav/design-system-guidance
```

## Initialize
```bash
npx design-system-guidance init .
```

## Check
```bash
npx design-system-guidance check .
```

## CI mode
```bash
npx design-system-guidance check . --ci
```

## Scope-Aware Enforcement
The config supports protected-surface scopes, an optional exemption ledger, and explicit scope precedence so one repo can enforce different severities by path.

Example:

```json
{
  "schemaVersion": 1,
  "docs": ["docs/design-system/CONTRACT.md"],
  "include": ["packages/ui/src", "platforms/web/apps/web/src"],
  "ignore": ["node_modules", "dist", ".git"],
  "scopes": {
    "error": ["packages/ui/src/app/settings/**/*.{ts,tsx,js,jsx,css}"],
    "warn": [
      "packages/ui/src/components/ui/**/*.{ts,tsx,js,jsx,css}",
      "platforms/web/apps/web/src/pages/**/*.{ts,tsx,js,jsx,css}"
    ],
    "exempt": [
      "packages/tokens/**",
      "**/*.{test,spec}.{ts,tsx,js,jsx}",
      "**/*.stories.tsx"
    ]
  },
  "scopePrecedence": ["error", "warn", "exempt"],
  "exemptionLedger": "docs/design-system/ENFORCEMENT_EXEMPTIONS.json"
}
```

Behavior:
- files matching `scopes.error` emit `error` level violations for pattern rules
- files matching `scopes.warn` emit `warn` level violations for pattern rules
- files matching `scopes.exempt` skip pattern-rule evaluation
- the exemption ledger can suppress a specific `ruleId` for a specific path glob when the entry includes ownership and expiry metadata

## Included guidance
- `guidelines/` markdown guidance for tokens, typography, spacing, color, and iconography
- `rules.json` machine-readable policy rules
- CLI commands:
  - `design-system-guidance init [path]`
  - `design-system-guidance check [path] [--ci]`
