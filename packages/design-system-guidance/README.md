# @brainwav/design-system-guidance

Private guidance package for enforcing design-system usage in consumer projects.

## Table of Contents
- [Install](#install)
- [Initialize](#initialize)
- [Check](#check)
- [CI mode](#ci-mode)
- [Scope-Aware Enforcement](#scope-aware-enforcement)
- [Actionable remediation](#actionable-remediation)
- [DESIGN.md migration](#designmd-migration)
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

## Actionable remediation

Guidance findings may include agent-facing remediation metadata when a safe,
deterministic replacement exists:

- `replacementInstruction` names the replacement direction.
- `examplePath` points to a copyable local example when the route table provides one.
- `validationCommands[]` lists read-only checks the agent should run after editing.
- `proposalRequired` is `true` when the finding needs a design-system proposal instead of an automatic edit.
- `recoveryUnavailableReason` explains why guidance did not guess a fix.

Route-backed remediation must use the exported `@brainwav/agent-design-engine`
facade APIs instead of parsing `docs/design-system/AGENT_UI_ROUTING.json`
directly.

## DESIGN.md migration

The guidance wrapper accepts legacy v1 configs and additive v2 configs with `designContract` rollout state.
The contract metadata itself belongs in `DESIGN.md`; `.design-system-guidance.json` stores only rollout state and migration metadata.

Dry-run a migration:

```bash
npx design-system-guidance migrate . --to design-md --dry-run --json
```

Write the migration after review:

```bash
npx design-system-guidance migrate . --to design-md --write --yes
```

Rollback or resume use the same explicit write gate:

```bash
npx design-system-guidance migrate . --rollback --dry-run --json
npx design-system-guidance migrate . --resume --dry-run --json
```

## Included guidance
- `guidelines/` markdown guidance for tokens, typography, spacing, color, and iconography
- `rules.json` machine-readable policy rules
- CLI commands:
  - `design-system-guidance init [path]`
  - `design-system-guidance check [path] [--ci]`
  - `design-system-guidance migrate [path] --to design-md [--dry-run|--write]`
