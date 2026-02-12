# Design System Codex Rules

This directory contains repo-local execpolicy rules for the design system workflow. These rules enforce safe tool preferences (ripgrep over grep, fd over find) and require confirmation for write-affecting operations.

## Applying the rules

To apply these rules repo-wide, create a `.rules` file at the repository root that includes this ruleset:

```bash
include: ./codex/rules/design-system.rules
```

## How to test

Test the rules using `codex execpolicy check`:

```bash
# Should allow (ripgrep is permitted)
codex execpolicy check --pretty --rules codex/rules/design-system.rules -- rg pattern src/

# Should forbid (grep is blocked, use rg instead)
codex execpolicy check --pretty --rules codex/rules/design-system.rules -- grep pattern file
```