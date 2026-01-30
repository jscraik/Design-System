# Repo Map

Last updated: 2026-01-09

## Doc requirements

- Audience: Engineers and technical leads
- Scope: System architecture and component relationships
- Non-scope: Step-by-step operational procedures
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or monthly (whichever is sooner)

This document provides a quick, task-oriented map of the repository so contributors can find the right surface fast.

## Top-level

- `apps/`: Navigation index (pointers to canonical app locations).
- `platforms/`: Platform-specific code and apps.
  - `platforms/web/apps/web/src/app/`: app shell + router
  - `platforms/web/apps/web/src/pages/`: route-level pages (About/Profile/Settings/Harness)
  - `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`: templates gallery route (`/templates`)
  - `packages/ui/src/dev/templates-gallery.tsx`: canonical templates-gallery registry (consumed via `@design-studio/ui/dev`)
- `platforms/web/apps/storybook/.storybook/`: Storybook configuration + preview styles
  - `platforms/mcp/`: MCP server (tool contracts + integration harness)
  - `platforms/desktop/apps/desktop/`: desktop shell scaffold (Tauri placeholder)
- `packages/`: Reusable JS/TS packages (UI, tokens, runtime, widgets).
- `docs/`: Architecture, guides, audits, and build pipeline documentation.
- `scripts/`: Build pipeline, version sync, and compliance tooling.

## Platform surface

- `apps/`: index only (see `apps/README.md` for mapping)
- `platforms/web/`
  - `platforms/web/apps/web/`: main web app
  - `platforms/web/apps/storybook/`: Storybook harness
- `platforms/desktop/`
  - `platforms/desktop/apps/desktop/`: desktop shell scaffold
- `platforms/mcp/`: MCP server (tool contracts + integration harness)

## JS/TS packages

- `packages/ui/`: React UI library
  - `src/app/`: app-level surfaces (chat, modals, settings)
  - `src/components/ui/`: base UI primitives + utilities (per-component PascalCase folders)
  - `src/design-system/`: design system docs + showcases
  - `src/fixtures/`: sample data for stories/templates
  - `src/hooks/`: shared hooks
  - `src/icons/`: canonical icon system
  - `src/integrations/`: Apps SDK + Figma adapters
  - `src/storybook/`: Storybook pages and docs
  - `src/templates/`: template composites
  - `src/testing/`: test utilities + mocks
- `packages/tokens/`: Design tokens + codegen
  - `src/`: token sources and generators
  - `tests/`: token validation tests
  - `packages/tokens/docs/outputs/manifest.json`: generated validation manifest
- `packages/runtime/`: Shared runtime utilities
  - `src/`: runtime source
  - `docs/`: runtime docs
  - `tests/`: (reserved)
- `packages/widgets/`: Widget library + examples
  - `src/widgets/`: widget implementations (grouped by category)
  - `src/shared/`: shared widget utilities
  - `src/sdk/`: Apps SDK build tooling + generated manifest
  - `src/styles.css`: global widget styles
  - `tests/`: Playwright suites
  - `docs/examples/`: widget demos + sample integrations

## Key docs

- `docs/BUILD_PIPELINE.md`: End-to-end build pipeline
- `docs/architecture/`: Architecture + cross-platform design
- `docs/guides/`: How-tos and integration guides
- `docs/work/`: Work logs and validation notes
