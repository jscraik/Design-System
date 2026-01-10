# Port ChatGPT UI Templates into Web Platform

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan is governed by `/.agent/PLANS.md` and must remain self-contained as changes are made.

## Purpose / Big Picture

After this change, developers can browse, search, and deep-link to production-ready ChatGPT UI templates inside the web platform at `/templates`, with a deterministic registry (JSON/MD/TS) generated at build time. The widget gallery remains available at `/`, and template previews render safely with error boundaries and theme controls.

## Progress

- [x] (2026-01-09 00:00Z) Initialized ExecPlan and captured scope, outcomes, and constraints.
- [x] (2026-01-09 00:00Z) Aligned web app imports/deps/config to @astudio/ui + @astudio/runtime.
- [x] (2026-01-09 00:00Z) Implemented registry generator + generated outputs (JSON/MD/TS).
- [x] (2026-01-09 00:00Z) Implemented template browser UI, routing/deep-linking, and theme preference.
- [x] (2026-01-09 00:00Z) Updated web app imports/config to `@astudio/ui` following rebrand.
- [x] (2026-01-09 00:00Z) Added/updated tests for registry determinism, routing, search, and a11y.
- [x] (2026-01-09 21:20Z) Audited template components against `@astudio/ui` and documented gaps.
- [x] (2026-01-09 21:40Z) Added Apps SDK UI-first wrappers for missing template primitives and utilities.
- [x] (2026-01-09 22:56Z) Added property test coverage for template preview resilience.
- [x] (2026-01-09 23:02Z) Added routing integration tests for templates navigation and deep links.
- [x] (2026-01-09 23:10Z) Ported educational template into dedicated templates directory with metadata.
- [x] (2026-01-09 23:14Z) Ported components showcase template into dedicated templates directory.
- [x] (2026-01-09 23:18Z) Ported design system templates into dedicated templates directory.
- [x] (2026-01-09 23:23Z) Regenerated template registry for ported Phase 1 templates.

## Surprises & Discoveries

- Observation: Rebrand confirmed; the workspace UI package is `@astudio/ui`, so any lingering `@astudio/ui` references must be updated.
  Evidence: `packages/ui/package.json` declares `name: "@astudio/ui"`.
- Observation: Source templates rely on several local UI primitives (markdown, tag input, shimmer text, etc.) that are not yet exported from `@astudio/ui`.
  Evidence: `packages/ui/src/templates/_temp_import/components/ui/*` includes `markdown.tsx`, `tag-input.tsx`, and `shimmer-text.tsx`, but no equivalents exist under `packages/ui/src/components/ui`.
- Observation: Date range selection already exists in `@astudio/ui` via the DatePicker module.
  Evidence: `packages/ui/src/components/ui/forms/DatePicker/DatePicker.tsx` exports `DateRangePicker`.

## Decision Log

- Decision: Align the web app to the rebranded `@astudio/ui` workspace package.
  Rationale: The UI package is now `@astudio/ui`; reusing it avoids parallel UI foundations and keeps dependency names consistent with the rebrand.
  Date/Author: 2026-01-09 / Codex
- Decision: Use `platforms/web/apps/web/src/templates/registry.tsx` with metadata blocks as the single source for registry generation.
  Rationale: Keeps registry derivation deterministic without executing React modules during generation while allowing clear metadata ownership.
  Date/Author: 2026-01-09 / Codex
- Decision: Add minimal educational/components templates directly in the web app to satisfy category coverage while full source-app porting remains pending.
  Rationale: Source app includes templates not yet ported to the workspace; lightweight placeholders keep UI functional without copying large codebases.
  Date/Author: 2026-01-09 / Codex
- Decision: Implement thin wrappers in `@astudio/ui` for missing template primitives using existing base/overlay components where possible.
  Rationale: Keeps templates Apps SDK UI-first while avoiding direct `@radix-ui/*` usage in template code.
  Date/Author: 2026-01-09 / Codex
- Decision: Avoid non-deterministic IDs in new UI primitives by using in-memory counters.
  Rationale: Code style forbids `Math.random()` in production paths and deterministic IDs are sufficient for tag input behavior.
  Date/Author: 2026-01-09 / Codex

## Outcomes & Retrospective

- Pending. Will summarize completed milestones, remaining work, and lessons learned.

## Context and Orientation

The web platform app lives at `platforms/web/apps/web`. It currently renders a widget gallery at `/` with a minimal router and a `TemplateWidgetPage` for widget previews. The repo already contains an Apps SDK UI component library at `packages/ui` (published as `@astudio/ui`) and tokens at `packages/tokens` (published as `@astudio/tokens`). The source template app is stored under `_temp/ChatGPT UI Templates` and contains a template registry and educational templates not yet integrated into the web platform.

Key files:
- `platforms/web/apps/web/src/app/App.tsx` and `platforms/web/apps/web/src/app/Router.tsx` control routing and top-level UI.
- `platforms/web/apps/web/src/pages/HarnessPage.tsx` is the widget gallery.
- `platforms/web/apps/web/src/pages/TemplateWidgetPage.tsx` renders individual templates by ID.
- `packages/ui/src/dev/templates-gallery.tsx` contains the current template gallery registry in the UI package.
- `scripts/schema/template-registry.schema.json` defines the registry schema.

## Plan of Work

First, align package names and imports in the web app to match workspace packages (`@astudio/ui`, `@astudio/tokens`, `@astudio/runtime`). Update `vite.config.ts` and CSS imports accordingly.

Next, implement the deterministic template registry generator in `platforms/web/apps/web/scripts/generate-template-registry.ts`. The script will scan `platforms/web/apps/web/src/templates/**/*.tsx` for metadata blocks, validate against the schema, normalize tags, and emit `src/generated/template-registry.ts`, `TEMPLATE_REGISTRY.json`, and `TEMPLATE_REGISTRY.md`. Add a `--check` mode that fails if outputs drift.

Then, build the template browser UI in `platforms/web/apps/web/src/components/template-browser/` with `TemplateHost`, `TemplateSearch`, `TemplateSidebar`, `TemplatePreview`, and `TemplateBrowser`, wired to the generated registry. The `TemplateHost` must isolate render errors and provide a copy-diagnostics action.

Finally, update routing to add a `/templates` entry and deep-link support via query param and `/templates/<id>` path. Preserve widget gallery routes and add navigation between gallery and templates.

Next, reconcile template primitives by adding missing wrappers to `packages/ui/src/components/ui` and exporting them from the appropriate `@astudio/ui` subpaths. These wrappers should either forward to existing Apps SDK UI components (preferred) or encapsulate fallback Radix components where `@astudio/ui` already maintains fallbacks. The goal is to eliminate direct usage of `_temp_import/components/ui/*` in the template ports.

## Concrete Steps

Run these commands from the repo root unless noted:

- `rg -n "@astudio/ui|@astudio/tokens" platforms/web/apps/web`
  - Update imports and dependencies in `platforms/web/apps/web/package.json`, `platforms/web/apps/web/src/main.tsx`, `platforms/web/apps/web/src/styles/main.css`, and `platforms/web/apps/web/vite.config.ts`.
  - Create `platforms/web/apps/web/src/templates/*` wrappers with metadata blocks (kebab-case IDs) and stable entry exports.
  - Implement `platforms/web/apps/web/scripts/generate-template-registry.ts` and run `pnpm -C platforms/web/apps/web registry:generate` to produce outputs.
  - Add template browser components under `platforms/web/apps/web/src/components/template-browser/`.
  - Update `platforms/web/apps/web/src/app/Router.tsx` to route `/templates` and parse template IDs.

- Audit missing template primitives and implement wrappers:
  - Create wrapper components in `packages/ui/src/components/ui` for: CodeBlock, EmptyMessage, Image (including avatar support), Indicator, Markdown, Menu (DropdownMenu-based), DateRangePicker, ShimmerText, TagInput, TextLink, and Transition utilities (Stagger/Collapse/SlideIn).
  - Export the wrappers from `packages/ui/src/components/ui/index.ts` and the top-level `packages/ui/src/index.ts` if needed by template ports.
  - Ensure wrappers consume tokens and classes from `@astudio/tokens` and existing theme utilities.
  - Avoid adding new dependencies without explicit approval.

## Validation and Acceptance

- `pnpm -C platforms/web/apps/web registry:generate` should produce deterministic `TEMPLATE_REGISTRY.json`, `TEMPLATE_REGISTRY.md`, and `src/generated/template-registry.ts` without errors.
- Launch `pnpm -C platforms/web/apps/web dev` and confirm:
  - `/` shows the widget gallery.
  - `/templates` shows the template browser with sidebar, search, and preview.
  - `/templates?id=<id>` selects the requested template.
  - `/templates/<id>` also selects the requested template.
  - Theme toggle persists between reloads.
  - Template errors are contained within `TemplateHost` and diagnostics can be copied.

- Run `pnpm -C packages/ui test` if wrappers touch shared UI behavior, and ensure any new wrapper-level tests pass.

## Idempotence and Recovery

Registry generation is idempotent. Re-running the generator should not change outputs unless template metadata changes. If generation fails, fix the metadata blocks in `src/templates` and re-run.

## Artifacts and Notes

Key generated files:
- `platforms/web/apps/web/TEMPLATE_REGISTRY.json`
- `platforms/web/apps/web/TEMPLATE_REGISTRY.md`
- `platforms/web/apps/web/src/generated/template-registry.ts`

## Interfaces and Dependencies

- Use `@astudio/ui` for all components in the template browser and template wrappers.
- Use `@astudio/runtime` for host providers.
- Avoid new dependencies unless explicitly approved; use existing `ajv` from the root devDependencies for schema validation.
- Do not import `@radix-ui/*` directly in `src/templates/**`.
