```md
# Bump versions and rebrand Swift packages to aStudio

This ExecPlan is a living document. The sections "Progress", "Surprises & Discoveries", "Decision Log", and "Outcomes & Retrospective" must be kept up to date as work proceeds. This plan is maintained in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Ship the next logical version (0.0.1) across all workspace packages and finish the Swift-side rebrand from ChatUI* to aStudio* so the repo builds, tests, and docs reflect the aStudio name consistently. After this change, developers can consume workspace packages at version 0.0.1, Swift package/module names reflect aStudio, and docs/changelogs describe the 0.0.1 release and aStudio naming consistently.

## Progress

- [x] (2026-01-09 18:20Z) Bumped root version to 0.0.1 and moved root changelog entries into 0.0.1 release.
- [x] (2026-01-09 18:20Z) Updated docs and README references for @astudio/widgets and version examples in build pipeline docs.
- [x] (2026-01-09 21:05Z) Updated workspace package versions to 0.0.1 across packages and platforms, including @astudio/cloudflare-template rename.
- [x] (2026-01-09 21:05Z) Verified changelogs include 0.0.1 release entries for workspace packages.
- [x] (2026-01-09 21:20Z) Audited Swift packages, targets, module names, and paths that still used ChatUI* and mapped renames to aStudio equivalents.
- [x] (2026-01-09 21:35Z) Renamed Swift package/app directories, Package.swift names/products/targets, module identifiers, and Xcode/macOS app targets to aStudio equivalents.
- [x] (2026-01-09 21:45Z) Updated Swift docs, DocC instructions, scripts, and references to match new names.
- [x] (2026-01-09 21:55Z) Ran doc lint and captured failures for follow-up.

## Surprises & Discoveries

- Observation: Swift build/test outputs reference module cache paths from `/Users/jamiecraik/chatui`, causing SwiftPM cache failures after rebranding the repo path to `/Users/jamiecraik/dev/aStudio`.
  Evidence: `pnpm build` Swift test logs show `PCH was compiled with module cache path '/Users/jamiecraik/chatui/...`.
- Observation: `pnpm doc:lint` failed because Vale scanned `.agent` ExecPlans and emitted extensive spelling/style errors.
  Evidence: `pnpm doc:lint` reported 26k errors/19k warnings originating in `.agent/EXECPLAN-*.md` and other legacy docs.

## Decision Log

- Decision: Bump all workspace packages to 0.0.1 and reflect the release in their changelogs before performing Swift package renames.
  Rationale: Version bump and changelog updates are low-risk and set a clean baseline for the subsequent Swift renames.
  Date/Author: 2026-01-09 / Codex
- Decision: Rename Swift package/module/app identifiers to aStudio while retaining ChatUI-prefixed component type names (e.g., ChatUIButton) to avoid breaking public Swift APIs.
  Rationale: The request focused on package/module rebrand; changing public component types would be a larger API-breaking migration requiring explicit approval.
  Date/Author: 2026-01-09 / Codex

## Outcomes & Retrospective

Pending; will be updated after completing version bump, changelog updates, and Swift rebrand.

## Context and Orientation

Workspace packages are defined by `pnpm-workspace.yaml` and include `packages/*`, `platforms/*/apps/*`, and `platforms/mcp`. Each workspace package has a `package.json` with a `version` field. Changelogs are in `CHANGELOG.md` files under root, `packages/`, and `platforms/` and follow Keep a Changelog format.

Swift packages live in `platforms/apple/swift/*` and include `AStudioFoundation`, `AStudioComponents`, `AStudioThemes`, `AStudioShellChatGPT`, `AStudioSystemIntegration`, and `AStudioMCP`. The macOS app lives in `platforms/apple/apps/macos/AStudioApp`. These names appear in folder names, `Package.swift` manifests, module names, Xcode project files, DocC outputs, and docs under `platforms/apple` and `docs/`.

## Plan of Work

1) Update all workspace `package.json` versions to 0.0.1 without reformatting unrelated fields.
2) For each workspace package changelog, move Unreleased entries (if any) to `0.0.1` dated 2026-01-09 and leave an empty Unreleased section.
3) Inventory Swift package/module names and derive a consistent rename map from ChatUI* to aStudio* (directories, package names, target names, product names, module imports, and documentation paths).
4) Apply Swift rename map across the repo: rename directories, update manifests, update imports, update Xcode project files and Info.plist, update docs and references.
5) Re-run doc lint and targeted build/test checks; record failures and root causes, especially where external caches or legacy modules block success.

## Concrete Steps

1) List workspace package.json files:

    rg --files -g "package.json" packages platforms/mcp

2) Update their version fields to 0.0.1 (scripted find/replace with minimal diff).

3) Update changelogs:

    rg --files -g "CHANGELOG.md" packages platforms

4) Swift rename prep:

    rg -n "ChatUI" platforms/apple docs

5) Apply renames and update Swift manifests, then re-run targeted checks:

    pnpm doc:lint
    pnpm lint
    pnpm test
    pnpm build

## Validation and Acceptance

- All workspace `package.json` versions are 0.0.1.
- Workspace changelogs include a 0.0.1 release entry dated 2026-01-09 with accurate notes; Unreleased is empty.
- Swift package/module names and docs use aStudio names consistently, with no lingering ChatUI identifiers except historical records that must remain.
- Doc lint and build/test checks are re-run with outcomes captured; any failures are documented with next steps.

## Idempotence and Recovery

Version/changelog updates are safe to rerun; if a change is incorrect, restore from git and re-apply the minimal edit. Swift renames should be performed with git-aware moves so they can be reverted if needed. Swift build cache issues can be resolved by deleting `.build` directories before retrying.

## Artifacts and Notes

Expected updated files include:

    package.json
    packages/*/package.json
    platforms/*/apps/*/package.json
    platforms/mcp/package.json
    CHANGELOG.md
    packages/*/CHANGELOG.md
    platforms/*/CHANGELOG.md
    platforms/apple/swift/*/Package.swift
    platforms/apple/apps/macos/* (Xcode project files and Info.plist)

## Interfaces and Dependencies

No new runtime dependencies are required for the Swift rename. Version bump uses existing `package.json` and changelog conventions. Swift renames must preserve module APIs and public types while updating names to the aStudio namespace.
```

Note: ExecPlan rewritten on 2026-01-09 to reflect the updated scope (workspace version bump + Swift rebrand) and to conform to `.agent/PLANS.md` formatting requirements.
