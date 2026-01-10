# Rename @astudio packages to @astudio and remove legacy aliases

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Developers and downstream apps should only consume packages under the `@astudio/*` npm scope. After this change, any import or dependency that previously referenced `@astudio/*` now points to `@astudio/*`, workspace packages publish as `@astudio/*`, and the legacy shim packages (`packages/astudio-ui`, `packages/astudio-tokens`) are removed. The user-visible proof is that `package.json` dependencies and import statements reference `@astudio/*`, and `pnpm -C packages/cli test` plus a `pnpm install --lockfile-only` run cleanly.

## Progress

- [x] (2026-01-09 00:00Z) Inventory current `@astudio/*` usage and shim packages; identify files/scripts to update.
- [x] (2026-01-09 00:00Z) Rename workspace package names from `@astudio/*` to `@astudio/*` and update internal dependencies.
- [x] (2026-01-09 00:00Z) Update code imports and user-facing docs to `@astudio/*`.
- [x] (2026-01-09 00:00Z) Remove legacy shim packages (`packages/astudio-ui`, `packages/astudio-tokens`) and update any scripts that referenced their paths.
- [x] (2026-01-09 00:00Z) Refresh lockfile and run targeted tests; summarize verification and risks.

## Surprises & Discoveries

- Observation: pnpm lockfile-only install completed with deprecated subdependency warnings.
  Evidence: `pnpm install --lockfile-only` warned about node-domexception@1.0.0 and whatwg-encoding@3.1.1.

## Decision Log

- Decision: Keep `packages/ui` and `packages/tokens` as the source directories while renaming their package names to `@astudio/*`.
  Rationale: Minimizes path churn while producing the desired npm scope.
  Date/Author: 2026-01-09 (assistant).
- Decision: Remove shim packages `packages/astudio-ui` and `packages/astudio-tokens` after updating all `@astudio/*` references.
  Rationale: Avoid duplicate workspace package names and ensure `@astudio/*` is canonical.
  Date/Author: 2026-01-09 (assistant).
- Decision: Drop legacy `CHATUI_*` env/config fallbacks in the CLI once the package rename landed.
  Rationale: Aligns the CLI with the new `astudio` surface and removes legacy aliases.
  Date/Author: 2026-01-09 (assistant).

## Outcomes & Retrospective

Completed rename from `@astudio/*` to `@astudio/*` across workspace packages, code imports, and user-facing docs, removed shim packages, updated scripts, regenerated lockfile, and verified CLI tests. Remaining follow-up is to review any non-package "chatui" branding strings that may need product-level renaming beyond package scope.

## Context and Orientation

Workspace packages live under `packages/`. The current production packages are `packages/ui`, `packages/runtime`, `packages/tokens`, `packages/widgets`, and `packages/cloudflare-template`, which previously published as `@astudio/*`. There are shim packages `packages/astudio-ui` and `packages/astudio-tokens` that re-export `@astudio/*`. The repository already uses `@astudio/*` in some docs and templates, so the goal is to make `@astudio/*` canonical and remove the shims.

## Plan of Work

First, update the `name` fields in the key package manifests to `@astudio/*`, and update all workspace dependencies that currently reference `@astudio/*` to the new scope. This includes `packages/ui`, `packages/runtime`, `packages/tokens`, `packages/widgets`, and `packages/cloudflare-template` plus any package that depends on them.

Second, update all import paths and documentation references from `@astudio/*` to `@astudio/*` using a targeted string replacement across source and doc files. Limit the replacement to the literal `@astudio/` prefix to avoid touching unrelated identifiers.

Third, remove the shim packages `packages/astudio-ui` and `packages/astudio-tokens`, then update root scripts that still reference those directories (such as `build:astudio-*` and `publish:astudio`) to point to the renamed packages under `packages/ui` and `packages/tokens`.

Finally, update the lockfile via `pnpm install --lockfile-only`, run the CLI tests to ensure the toolchain still works, and capture results.

## Concrete Steps

From repo root:

1. Edit package names and dependencies in:
   - `packages/ui/package.json`
   - `packages/runtime/package.json`
   - `packages/tokens/package.json`
   - `packages/widgets/package.json`
   - `packages/cloudflare-template/package.json`
   - any package manifests referencing `@astudio/*`.
2. Replace import/doc references from `@astudio/` to `@astudio/` across source and Markdown files.
3. Delete `packages/astudio-ui/` and `packages/astudio-tokens/` and update root scripts in `package.json` that referenced those directories.
4. Update `pnpm-lock.yaml` with `pnpm install --lockfile-only`.
5. Run `pnpm -C packages/cli test`.

## Validation and Acceptance

- `pnpm -C packages/cli test` passes.
- `pnpm install --lockfile-only` completes and `pnpm-lock.yaml` reflects `@astudio/*` package names.
- `rg -n "@astudio/"` returns no matches outside of historical notes (if any remain, document them).

## Idempotence and Recovery

All changes are file-based and can be repeated safely. If a step breaks the workspace, restore the affected file from version control and re-apply the minimal changes. The shim package removal is reversible by restoring those directories from git.

## Artifacts and Notes

Capture updated lockfile, test output, and any remaining `@astudio/*` references in the final response.

## Interfaces and Dependencies

No new dependencies. The package scope changes from `@astudio/*` to `@astudio/*` across the workspace. The CLI and build scripts continue to use pnpm and existing tooling.

Plan update note: 2026-01-09 — Updated progress, discoveries, decision log, and outcomes after completing the rename and validation.
