# JSC-223 Docs Bloat Audit

Date: 2026-04-24
Scope: read-only audit of `docs/**`, `reports/**`, and `artifacts/reviews/**` for stale docs, duplicate plans/reports, placeholder/draft surfaces, and obsolete validation surfaces.

## Method

- Enumerated plan/report/review surfaces.
- Searched for unresolved placeholders (`Owner: TBD`, `Review cadence: TBD`, `TBD` blocks).
- Detected iterative duplicate artifacts (`round2`, `round3`, `live`, `auto`, `review`).
- Checked whether candidate files are referenced elsewhere (orphan check).
- Sampled headers and metadata for recency/status evidence.

## Findings (severity-ranked)

### High

1. Orphaned report cluster with legacy absolute paths and heavy duplication
- Evidence:
  - `reports/chat_template_modals_deltas.md:3` (`Last updated: 2026-01-04`) and same date pattern across sibling variants (`..._manual`, `..._fuzzy`, `..._fuzzy_filtered`, `..._mapping_seed`).
  - The cluster embeds legacy absolute paths like `/Users/jamiecraik/dev/aStudio` (`reports/chat_template_modals_deltas_manual.md:17`, `reports/templates_drift_report.md:22`).
  - Scale: `rg -n "/Users/jamiecraik/dev/aStudio" reports | wc -l` => `1052`; `rg -n "_temp/ChatGPT UI Templates" reports | wc -l` => `745`.
  - Orphan check: no references found to these filenames in `docs/`, `reports/`, `artifacts/`, root docs (`rg -n <basename> ...` returned empty).
- Risk:
  - High documentation noise with stale path assumptions and overlapping generated snapshots.
- Cleanup candidate:
  - Consolidate to one canonical historical summary report and archive/remove the remaining 7 generated variants.
  - Candidate files:
    - `reports/chat_template_modals_deltas.md`
    - `reports/chat_template_modals_deltas_manual.md`
    - `reports/chat_template_modals_deltas_fuzzy.md`
    - `reports/chat_template_modals_deltas_fuzzy_filtered.md`
    - `reports/chat_template_modals_mapping_seed.md`
    - `reports/templates_drift_report.md`
    - `reports/templates_visual_drift.md`
    - `reports/temp_vs_packages_ui_mismatches.md`

2. Review artifact proliferation in `artifacts/reviews` (iterative rounds not indexed)
- Evidence:
  - 28 markdown review artifacts total, 6 explicitly `round*` (`find artifacts/reviews ... | wc -l` results: `28`, `6`).
  - Multi-round variants for same subject:
    - `agent-usefulness-adversary.md`, `agent-usefulness-adversary-round2.md`, `agent-usefulness-adversary-round3.md`
    - `cli-contract-adversary.md`, `cli-contract-adversary-round2.md`, `cli-contract-adversary-round3.md`
    - `migration-safety-adversary.md`, `migration-safety-adversary-round2.md`, `migration-safety-adversary-round3.md`
  - These are effectively orphaned from docs routing (self-references only via trailing `WROTE` lines).
- Risk:
  - Review history becomes hard to consume; same issue family is split across several files with no authority marker.
- Cleanup candidate:
  - Keep latest per family (`round3`) as canonical and archive prior rounds under a dedicated `artifacts/reviews/archive/` lane (or collapse into one synthesized file per family).

### Medium

3. Placeholder governance metadata remains widespread
- Evidence:
  - `rg -n "Owner:\s*TBD|Review cadence:\s*TBD|\*\*Backup owner:\*\* TBD" docs reports | wc -l` => `104` hits.
  - Examples:
    - `docs/BUILD_PIPELINE.md:10-11`
    - `docs/guides/CHATGPT_INTEGRATION.md:10-11`
    - `docs/json-render/README.md:10-11`
    - `reports/chat_template_modals_deltas.md:10-11`
- Risk:
  - Governance and trust signals are unresolved at scale; difficult to know maintained vs historical docs.
- Cleanup candidate:
  - Bulk normalize with one of:
    - assign real owner/cadence for active docs,
    - or mark historical docs as archived and remove requirement block.

4. Draft/active/completed plan set lacks explicit canonical index for current execution
- Evidence:
  - Mixed plan statuses in `docs/plans`:
    - `docs/plans/2026-04-23-agent-design-engine-plan.md:4` (`status: draft`)
    - `docs/plans/2026-04-07-001-feat-cli-gold-standard-compliance-plan.md:4` (`status: active`)
    - two `completed` plans from 2026-03-05.
  - Baseline inventory exists separately and is current (`docs/plans/2026-04-24-agent-design-engine-baseline-inventory.md:3`).
- Risk:
  - Consumers must infer which plan is authoritative for current work; competing “active/draft/completed” states increase routing ambiguity.
- Cleanup candidate:
  - Add `docs/plans/README.md` authority index: current canonical plan, superseded plans, and historical archive list.

5. Validation documentation includes obsolete prototype-stage placeholders
- Evidence:
  - `docs/validation/tree-shaking-validation-report.md:131-133` includes `TBD` metrics (“Measure after build”).
  - `docs/validation/README.md:10` says validation phase complete, while prototype/placeholder language remains in subordinate reports.
- Risk:
  - Mixed “complete” and “prototype TBD” signals lower confidence in validation pack freshness.
- Cleanup candidate:
  - Keep only final outcome docs (`tree-shaking-results.md`, final summary) in active surface; archive prototype reports or stamp explicitly as historical.

### Low

6. Transcript raw files are low-structure single-line payloads; cleaned versions already exist
- Evidence:
  - Raw files listed alongside cleaned equivalents (`docs/transcripts/README.md`).
  - Raw files are one-line large payloads (`wc -l docs/transcripts/*.md` shows raw files at 1 line each).
- Risk:
  - Minor repository clutter and difficult diff/review ergonomics.
- Cleanup candidate:
  - Move raw transcripts to `docs/transcripts/raw/` or compress/archive externally; keep cleaned transcripts as default.

## Proposed cleanup order (smallest-risk first)

1. Archive duplicate review rounds in `artifacts/reviews` and retain one canonical per family.
2. Consolidate/remove orphan January 2026 generated report cluster in `reports/`.
3. Add `docs/plans/README.md` authority map to disambiguate active vs draft vs historical plans.
4. Resolve/retire `Owner: TBD` + `Review cadence: TBD` blocks on active docs; archive historical docs.
5. Prune validation prototype docs from active surface or relabel as historical snapshots.
6. Move raw transcript payloads out of the default docs path.

## Notes

- This audit intentionally made no code/doc edits outside creating this report.
- No deletion executed; all items above are inventory candidates only.

WROTE: artifacts/reviews/jsc223-docs-bloat-audit.md
