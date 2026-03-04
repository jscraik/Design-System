# Rules Reference

## Table of Contents
- [Rule IDs](#rule-ids)
- [Severity behavior](#severity-behavior)

## Rule IDs
- `config-required`: target config file is missing.
- `config-invalid`: config cannot be parsed or does not define `docs` as a string array.
- `docs-exist`: configured docs are missing.
- `docs-toc`: markdown docs are missing a `## Table of Contents` heading.
- `no-deprecated-icons-import`: source file imports deprecated `@design-studio/astudio-icons`.
- `no-raw-hex-colors`: source file contains literal hex colors.
- `no-raw-px-values`: source file contains literal `px` values.

## Severity behavior
By default, violations are warnings (exit code `0`). In CI mode (`--ci` or `CI=true`), any violation exits with code `1`.
