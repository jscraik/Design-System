# Repo Structure Migration

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: Jamie Scott Craik (@jscraik)
- Review cadence: Every release or monthly (whichever is sooner)

## Contents

- [Doc requirements](#doc-requirements)
- [Summary](#summary)
- [Path map (old → new)](#path-map-old-new)
  - [Apps](#apps)
  - [Tokens](#tokens)
  - [UI library](#ui-library)
  - [UI import surface (new)](#ui-import-surface-new)
  - [Widgets](#widgets)
- [Tooling updates to check](#tooling-updates-to-check)
- [Verification checklist](#verification-checklist)

This guide documents the 2026 restructure that improved discoverability and normalized package layouts. Use it to update local tooling, scripts, and bookmarks.

## Summary

- `packages/tokens/outputs` moved to `packages/tokens/docs/outputs`.
- UI library app-level surfaces moved under `packages/ui/src/app/`.
- Design system demos consolidated under `packages/ui/src/design-system/`.
- Apps SDK adapters moved under `packages/ui/src/integrations/`.
- Testing helpers consolidated under `packages/ui/src/testing/`.
- Storybook demos/docs consolidated under `packages/ui/src/storybook/`.
- Templates gallery moved into the web app as `/templates`.
- Web app + Storybook moved under `platforms/web/apps/`.
- `apps/` exists as a navigation index only (canonical paths remain under `platforms/`).
- MCP server moved to `platforms/mcp/`.
- Widget SDK tooling moved under `packages/widgets/src/sdk/`.
- Widget examples moved to `packages/widgets/docs/examples/`.
- Templates gallery registry moved under `packages/ui/src/dev/templates-gallery.tsx` (consumed via `@design-studio/ui/dev`).
- `packages/runtime`, `packages/tokens`, and `packages/widgets` now follow `src/ /tests/ /docs/` conventions.

## Path map (old → new)

### Apps

- `apps/web/*` → `platforms/web/apps/web/*`
- `apps/storybook/*` → `platforms/web/apps/storybook/*`
- `apps/ChatGPT-UI_templates/*` → `platforms/web/apps/web/src/pages/TemplateBrowserPage.tsx`
- `apps/mcp/*` → `platforms/mcp/*`
- `apps/` is now an alias/index; treat `platforms/` as canonical for all tooling.
- `platforms/web/apps/templates-gallery/src/shared/lib/template-registry.tsx` → `packages/ui/src/dev/templates-gallery.tsx` (consumed via `@design-studio/ui/dev`)
- `platforms/web/apps/web/src/features/widgets/WidgetHarness.tsx` → `platforms/web/apps/web/src/pages/HarnessPage.tsx`

### Tokens

- `packages/tokens/outputs/manifest.json` → `packages/tokens/docs/outputs/manifest.json`
- `packages/tokens/FIGMA_EXPORT_GUIDE.md` → `packages/tokens/docs/FIGMA_EXPORT_GUIDE.md`

### UI library

- `packages/ui/src/components/chat/*` → `packages/ui/src/app/chat/*`
- `packages/ui/src/components/modals/*` → `packages/ui/src/app/modals/*`
- `packages/ui/src/components/settings/*` → `packages/ui/src/app/settings/*`
- `packages/ui/src/app/chat/chat-variants.tsx` → `packages/ui/src/app/chat/ChatVariants/ChatVariants.tsx`
- `packages/ui/src/app/chat/{constants,types,slots,iconHelpers}.*` → `packages/ui/src/app/chat/shared/*`
- `packages/ui/src/app/chat/compose/{constants,types}.ts` → `packages/ui/src/app/chat/compose/shared/*`
- `packages/ui/src/app/settings/types.ts` → `packages/ui/src/app/settings/shared/types.ts`
- `packages/ui/src/components/showcase/*` → `packages/ui/src/design-system/showcase/*`
- `packages/ui/src/components/figma/*` → `packages/ui/src/integrations/figma/*`
- `packages/ui/src/integrations/figma/ImageWithFallback.tsx` → `packages/ui/src/integrations/figma/ImageWithFallback/ImageWithFallback.tsx`
- `packages/ui/src/components/icons/*` → `packages/ui/src/icons/legacy/*`
- `packages/ui/src/imports/*` → `packages/ui/src/icons/imports/*`
- `packages/ui/src/components/ui/<category>/<component>.*` → `packages/ui/src/components/ui/<category>/<Component>/<Component>.*`
- `packages/ui/src/sdk/apps-sdk.ts` → `packages/ui/src/integrations/apps-sdk/index.ts`
- `packages/ui/src/vendor/appsSdkUi.ts` → `packages/ui/src/integrations/apps-sdk/vendor.ts`
- `packages/ui/src/tests/*` → `packages/ui/src/testing/*`
- `packages/ui/src/test/*` → `packages/ui/src/testing/*`
- `packages/ui/src/storybook/App.tsx` → `packages/ui/src/storybook/App/App.tsx`
- `packages/ui/src/storybook/pages/*.tsx` → `packages/ui/src/storybook/pages/<PageName>/<PageName>.tsx`
- `packages/ui/src/storybook/design-system/DesignTokens.ts` → `packages/ui/src/storybook/design-system/DesignTokens/DesignTokens.ts`
- `@design-studio/ui/forms` → `@design-studio/ui/base`
- `@design-studio/ui/layout` → `@design-studio/ui/data-display`, `@design-studio/ui/feedback`, `@design-studio/ui/navigation`, `@design-studio/ui/overlays`

### UI import surface (new)

Use the published subpaths for UI primitives and app surfaces:

- `@design-studio/ui/app`
- `@design-studio/ui/base`
- `@design-studio/ui/chat`
- `@design-studio/ui/data-display`
- `@design-studio/ui/feedback`
- `@design-studio/ui/icons`
- `@design-studio/ui/modals`
- `@design-studio/ui/navigation`
- `@design-studio/ui/overlays`
- `@design-studio/ui/settings`

### Widgets

- `packages/widgets/src/plugins/*` → `packages/widgets/src/sdk/plugins/*`
- `packages/widgets/src/generated/*` → `packages/widgets/src/sdk/generated/*`
- `packages/widgets/src/widgets/examples/*` → `packages/widgets/docs/examples/*`

## Tooling updates to check

- Local scripts or CI steps that reference legacy `apps/` paths.
- Token generation scripts that previously read from `packages/tokens/outputs/`.

## Verification checklist

- Build pipeline completes: `pnpm build`.
- Token generation writes manifest to `packages/tokens/docs/outputs/manifest.json`.

## Risks and assumptions

- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify

- TBD: Add concrete verification steps and expected results.

## Troubleshooting

- TBD: Add the top 3 failure modes and fixes.
