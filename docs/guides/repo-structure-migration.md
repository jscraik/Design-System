# Repo Structure Migration

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Summary](#summary)
- [Path map (old → new)](#path-map-old-new)
  - [Apple platform](#apple-platform)
  - [Apps](#apps)
  - [Tokens](#tokens)
  - [UI library](#ui-library)
  - [UI import surface (new)](#ui-import-surface-new)
  - [Widgets](#widgets)
- [Tooling updates to check](#tooling-updates-to-check)
- [Verification checklist](#verification-checklist)


This guide documents the 2026 restructure that improved discoverability and normalized package layouts. Use it to update local tooling, scripts, and bookmarks.

## Summary

- Apple platform code moved under `platforms/apple/`.
- `packages/tokens/outputs` moved to `packages/tokens/docs/outputs`.
- UI library app-level surfaces moved under `packages/ui/src/app/`.
- Design system demos consolidated under `packages/ui/src/design-system/`.
- Apps SDK adapters moved under `packages/ui/src/integrations/`.
- Testing helpers consolidated under `packages/ui/src/testing/`.
- Storybook demos/docs consolidated under `packages/ui/src/storybook/`.
- Templates gallery moved into the web app as `/templates`.
- Web app + Storybook moved under `platforms/web/apps/`.
- MCP server moved to `platforms/mcp/`.
- Widget SDK tooling moved under `packages/widgets/src/sdk/`.
- Widget examples moved to `packages/widgets/docs/examples/`.
- Templates gallery registry moved under `packages/ui/src/dev/templates-gallery.tsx` (consumed via `@chatui/ui/dev`).
- `packages/runtime`, `packages/tokens`, and `packages/widgets` now follow `src/ /tests/ /docs/` conventions.

## Path map (old → new)

### Apple platform

- `apps/macos/*` → `platforms/apple/apps/macos/*`
- `swift/*` → `platforms/apple/swift/*`
- `swift/ui-swift/*` → `platforms/apple/swift/ui-swift/*`

### Apps

- `apps/web/*` → `platforms/web/apps/web/*`
- `apps/storybook/*` → `platforms/web/apps/storybook/*`
- `apps/ChatGPT-UI_templates/*` → `platforms/web/apps/web/src/pages/TemplatesGalleryPage.tsx`
- `apps/mcp/*` → `platforms/mcp/*`
- `platforms/web/apps/templates-gallery/src/shared/lib/template-registry.tsx` → `packages/ui/src/dev/templates-gallery.tsx` (consumed via `@chatui/ui/dev`)
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
- `@chatui/ui/forms` → `@chatui/ui/base`
- `@chatui/ui/layout` → `@chatui/ui/data-display`, `@chatui/ui/feedback`, `@chatui/ui/navigation`, `@chatui/ui/overlays`

### UI import surface (new)

Use the published subpaths for UI primitives and app surfaces:

- `@chatui/ui/app`
- `@chatui/ui/base`
- `@chatui/ui/chat`
- `@chatui/ui/data-display`
- `@chatui/ui/feedback`
- `@chatui/ui/icons`
- `@chatui/ui/modals`
- `@chatui/ui/navigation`
- `@chatui/ui/overlays`
- `@chatui/ui/settings`

### Widgets

- `packages/widgets/src/plugins/*` → `packages/widgets/src/sdk/plugins/*`
- `packages/widgets/src/generated/*` → `packages/widgets/src/sdk/generated/*`
- `packages/widgets/src/widgets/examples/*` → `packages/widgets/docs/examples/*`

## Tooling updates to check

- Local scripts or CI steps that reference `apps/macos/` or `swift/` paths.
- Xcode project local package references (now relative to `platforms/apple/`).
- Token generation scripts that previously read from `packages/tokens/outputs/`.

## Verification checklist

- Build pipeline completes: `pnpm build`.
- Swift packages build: `pnpm test:swift:foundation` (and other variants).
- macOS apps open: `platforms/apple/apps/macos/ComponentGallery/Package.swift`.
- Token generation writes manifest to `packages/tokens/docs/outputs/manifest.json`.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

