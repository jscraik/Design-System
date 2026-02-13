# Changelog

Last updated: 2026-01-31

## Doc requirements

- Audience: Contributors and release stakeholders
- Scope: Release history and notable changes
- Non-scope: Usage instructions or implementation details
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Figma Variables Contract doc (`docs/design-system/collections/figma-variables-contract.md`).
- Collections README with designer/developer checklists (`docs/design-system/collections/README.md`).
- Repo-local Codex rules (`codex/rules/design-system.rules` + `codex/rules/README.md`).
- Repo-root `.rules` include + `FORJAMIE.md` living map.

### Changed

- Collection rules docs updated to link the Figma contract and clarify mappings.
- Documentation audit updates: clarified historical JS bridge notes in cross-platform architecture docs, marked package changelogs as archived in favor of the root changelog, and tuned Vale with an aStudio vocabulary to reduce false-positive spelling errors.

## [0.0.1] - 2026-01-09

### Added

- CI workflow for lint, format, compliance, type-checks, and builds.
- Lint + format configuration (ESLint + Prettier).
- Security policy, contributing guide, and license.

### Changed

- UI package now exposes dev/demo exports via `@design-studio/ui/dev`.
- Runtime host interface extended to cover display mode and external actions.
- MCP server accepts configurable widget build paths and clearer build errors.

### Fixed

- UI CSS export now points to the generated `ui.css` and is marked as side-effectful.
