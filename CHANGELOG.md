# Changelog

Last updated: 2026-01-04

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

- CI workflow for lint, format, compliance, type-checks, and builds.
- Lint + format configuration (ESLint + Prettier).
- Security policy, contributing guide, and license.

### Changed

- UI package now exposes dev/demo exports via `@chatui/ui/dev`.
- Runtime host interface extended to cover display mode and external actions.
- MCP server accepts configurable widget build paths and clearer build errors.

### Fixed

- UI CSS export now points to the generated `ui.css` and is marked as side-effectful.
