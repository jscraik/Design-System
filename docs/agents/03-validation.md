# Validation and checks

## Focused validation loop
- Run focused checks immediately after edits.
- Complete broader checks required by the changed scope, risk, or repository policy. Repeat checks only after relevant changes, unresolved failures, or a required freshness check.
- Record exact command output for failed checks.

## Safety checks
- Verify required binaries before command-heavy tasks.
- Verify target paths exist before editing.
