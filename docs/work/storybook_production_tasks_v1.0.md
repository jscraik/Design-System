# Storybook Production Completion Tasks

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


This checklist captures the remaining manual steps to finish the Storybook hardening pass and validate production readiness. Run these after pulling latest changes.

## Required

- [ ] Install deps and update lockfile (needed after Storybook test dependency alignment).
  - Command: `pnpm install`
- [ ] Run Storybook interaction tests (Vitest addon).
  - Command: `pnpm storybook:test`
  - If your environment blocks local ports, override the port:
    - `VITEST_BROWSER_PORT=63316 pnpm storybook:test`
- [ ] Run Storybook visual regression tests (Playwright).
  - Command: `pnpm test:visual:storybook`
  - To update baselines (if needed): `pnpm test:visual:storybook:update`
- [ ] Run Storybook a11y coverage (test-storybook).
  - Command: `pnpm -C packages/ui test:a11y`

## Recommended (to validate full pipeline)

- [ ] Build Storybook for production output.
  - Command: `pnpm storybook:build`
- [ ] Run component unit tests for UI package.
  - Command: `pnpm -C packages/ui test`

## Swift Storybook (ComponentGallery)

- [ ] Build and run ComponentGallery for macOS.
  - Command: `swift build --package-path platforms/apple/apps/macos/ComponentGallery`
- [ ] Build and run ComponentGallery for iOS (Xcode).
  - Open `platforms/apple/apps/macos/ComponentGallery/Package.swift` in Xcode and run the iOS scheme.
- [ ] Generate DocC output for ComponentGallery.
  - Command: `xcodebuild docbuild -scheme ComponentGallery -destination 'generic/platform=macOS'`
  - Output path: `~/Library/Developer/Xcode/DerivedData/.../Build/Products/Debug/ComponentGallery.doccarchive`

## Notes

- Storybook Vitest browser mode requires binding to a local port. If this fails in a restricted environment, run tests on a host that allows local port binding.
