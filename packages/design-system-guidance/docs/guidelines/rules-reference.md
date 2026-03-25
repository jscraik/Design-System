# Rules Reference

## Table of Contents
- [Rule IDs](#rule-ids)
- [Severity behavior](#severity-behavior)

## Rule IDs
- `config-required`: target config file is missing.
- `config-invalid`: config cannot be parsed or does not define `docs` as a string array.
- `docs-exist`: configured docs are missing.
- `docs-toc`: markdown docs are missing a `## Table of Contents` heading.
- `exemption-ledger-missing`: configured exemption ledger file is missing.
- `exemption-ledger-invalid`: exemption ledger entries are missing required metadata.
- `exemption-ledger-expired`: exemption ledger entry removeBy date has passed.
- `no-deprecated-icons-import`: source file imports deprecated `@design-studio/astudio-icons`.
- `no-foundation-token-usage`: source file contains `foundation-*` token references.
- `no-global-focus-visible`: stylesheet contains a global or unscoped `:focus-visible` selector.
- `no-h-screen`: source file contains `h-screen`.
- `no-raw-hex-colors`: source file contains literal hex colors.
- `no-raw-px-values`: source file contains literal `px` values.
- `no-arbitrary-tracking-values`: source file contains `tracking-[...]` utilities.

## Severity behavior
By default, violations are warnings (exit code `0`). In CI mode (`--ci` or `CI=true`), errors exit with code `1` while warnings remain report-only.

Pattern-rule severity is scope-aware:
- if a file matches `scopes.error`, matching pattern rules emit `error`
- if a file matches `scopes.warn`, matching pattern rules emit `warn`
- if a file matches `scopes.exempt`, pattern rules are skipped
- if a file matches more than one scope, the most specific glob wins and `scopePrecedence` breaks ties

Ledger rules are always reported at their configured level because they validate the enforcement mechanism itself.
