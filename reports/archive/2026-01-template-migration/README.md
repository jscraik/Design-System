# January 2026 Template Migration Reports

Last updated: 2026-04-24

## Table of Contents

- [Purpose](#purpose)
- [Contents](#contents)
- [Archive Decision](#archive-decision)

## Purpose

This archive preserves the January 2026 template-migration comparison reports
that were previously at the top level of `reports/**`.

## Contents

- `chat_template_modals_deltas.md`
- `chat_template_modals_deltas_manual.md`
- `chat_template_modals_deltas_fuzzy.md`
- `chat_template_modals_deltas_fuzzy_filtered.md`
- `chat_template_modals_mapping_seed.md`
- `templates_drift_report.md`
- `templates_visual_drift.md`
- `temp_vs_packages_ui_mismatches.md`

## Archive Decision

These reports are useful historical evidence, but they are not active source of
truth for the current design-system branch. They contain legacy absolute paths
under `/Users/jamiecraik/dev/aStudio` and overlapping generated snapshots from
the template-migration investigation.

Keep them here when researching the old migration. Do not use them as current
implementation or validation authority without first checking live source,
current plans, and current tests.
