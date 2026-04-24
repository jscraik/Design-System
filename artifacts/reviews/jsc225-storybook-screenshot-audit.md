# JSC-225 Storybook Screenshot Audit

## Scope
- Repository: `/Users/jamiecraik/dev/design-system-agent-engine-worktree`
- Branch: `jscraik/jsc-208-agent-design-engine`
- Target: `platforms/web/apps/storybook/screenshots/**`
- Mode: read-only audit (no file edits outside this report)
- Date: 2026-04-24

## Findings (severity-ranked)

### HIGH: `platforms/web/apps/storybook/screenshots/**` appears to be generated ephemeral output, not active CI/review evidence
- Evidence (tracked corpus size/churn surface): `git ls-files platforms/web/apps/storybook/screenshots | wc -l` = `496` and `du -sh platforms/web/apps/storybook/screenshots` = `8.1M`.
- Evidence (ignored-but-tracked drift): `git ls-files -ci --exclude-standard | rg "^platforms/web/apps/storybook/screenshots/" | wc -l` = `496`.
- Evidence (ignore policy includes screenshot directories): `.gitignore:72` (`screenshots/`).
- Evidence (metadata provenance shows local generated captures): `platforms/web/apps/storybook/screenshots/components-chat-chat-header--default.png.argos.json:2-3` (`http://localhost:6006`, `"colorScheme": "light"`), `:22-29` (`@storybook/addon-vitest`, `@argos-ci/storybook`).
- Evidence (current Storybook visual lane does not target this directory): `platforms/web/apps/storybook/playwright.visual.config.ts:76` writes snapshots to `./tests/visual/__snapshots__`; `:47` reporter output is `playwright-report/visual`.
- Evidence (entrypoint for `pnpm test:visual:storybook` runs Playwright suite, not screenshot-dir consumer): `package.json:69-70`; `scripts/run-playwright-suite.mjs:21-32`.
- Evidence (CI visual job runs only web visual lane and uploads web snapshot/report paths): `.github/workflows/ci.yml:306-317`.
- Remediation suggestion: classify `platforms/web/apps/storybook/screenshots/**` as generated artifact output and remove from version control in a follow-up cleanup PR, keeping canonical visual evidence in `tests/visual/__snapshots__`, Playwright reports/artifacts, and Argos CI baselines.

### MEDIUM: Documentation/runtime contract is partially misaligned, increasing ambiguity about screenshot authority
- Evidence (docs still advertise manual Argos upload from `./screenshots`): `docs/guides/UI_COMPONENT_TOOLING.md:96-102`; root script mirrors this (`package.json:80`).
- Evidence (storybook visual spec header references stale update flag): `platforms/web/apps/storybook/storybook-visual.spec.ts:9` says `--update-screenshots`, but workspace script uses `--update-snapshots` (`package.json:70`).
- Remediation suggestion: if screenshots folder is removed, tighten docs/scripts to one canonical path contract (Playwright snapshots + Argos CI) and align spec comments with actual CLI flags.

## Decision
`platforms/web/apps/storybook/screenshots/**` should be treated as **ephemeral generated output**, not committed canonical review evidence.

## Recommended policy
1. Untrack `platforms/web/apps/storybook/screenshots/**` in a dedicated cleanup change.
2. Keep CI and review evidence anchored on:
   - `tests/visual/__snapshots__` (Playwright baselines)
   - `playwright-report/visual` and CI uploaded artifacts
   - Argos CI comparisons/baselines
3. Keep or replace `pnpm argos:upload` only if a current, documented manual workflow is still required; otherwise deprecate it to avoid path drift.

## Notes
- Local-memory bootstrap/search tools were not exposed in this session, so this audit is based on repository-local evidence only.

WROTE: artifacts/reviews/jsc225-storybook-screenshot-audit.md
