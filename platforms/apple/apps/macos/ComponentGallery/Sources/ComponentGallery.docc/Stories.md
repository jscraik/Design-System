# Component Stories

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


ComponentGallery organizes stories by category. Each gallery section is a deterministic example designed for accessibility and visual regression checks.

## Categories

- Foundation: colors, typography, spacing, and platform utilities
- Settings: settings primitives and composed settings screens
- Buttons: ChatUIButton and icon-only variants
- Inputs: InputView variants and accessibility patterns
- Navigation: ListItemView and navigation patterns
- Themes: ChatGPT theme constants and comparisons
- Accessibility: interaction harness, focus management, VoiceOver, keyboard navigation, high contrast, reduced motion

## Adding Stories

1. Add a new section to the appropriate gallery in `Sources/Galleries/`.
2. Provide a clear title and subtitle describing the scenario.
3. Keep data deterministic to avoid visual diffs.
4. Ensure icon-only controls include accessibility labels.
5. Prefer ChatUIFoundation tokens (FColor, FType, FSpacing) for styling.

## UI Test Harness

The Interaction Harness section includes accessibility identifiers for UI testing. See `platforms/apple/apps/macos/ComponentGallery/UITests/InteractionHarnessUITests.swift` for a reference test and instructions in the README for adding a UI test target in Xcode.

## Unit Tests

ComponentGallery ships with SwiftPM unit tests that validate the `GalleryState` defaults and toggle behavior. Run them with `swift test` from `platforms/apple/apps/macos/ComponentGallery`.
