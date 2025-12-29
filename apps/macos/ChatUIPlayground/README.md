# ChatUI Playground (macOS)

ChatUIPlayground is a lightweight macOS app for quick validation of the modular Swift packages. It is a secondary dev surface alongside `apps/macos/ComponentGallery`.

## What this app is for

- Validate component styling against the ChatGPT theme.
- Smoke test inputs, buttons, settings, and navigation primitives.
- Spot check changes to `ChatUIFoundation`, `ChatUIComponents`, and `ChatUIShellChatGPT`.

## Prerequisites

- macOS 13+
- Xcode 15+

## Quick start

Open the Xcode project:

```bash
open apps/macos/ChatUIPlayground/ChatUIPlayground.xcodeproj
```

Select the `ChatUIPlayground` scheme and run with `⌘R`.

## Package dependencies

This app references local Swift packages:

- `swift/ChatUIFoundation`
- `swift/ChatUIComponents`
- `swift/ChatUIThemes`
- `swift/ChatUIShellChatGPT`

If Xcode cannot resolve these packages, re-add them under
**General → Frameworks, Libraries, and Embedded Content**.

## App structure

- `ChatUIPlayground/ContentView.swift` — app shell and sidebar navigation.
- `ChatUIPlayground/ComponentGallery.swift` — section routing for components.
- `ChatUIPlayground/PreviewScenarios.swift` — shared preview helpers.

Sections shown in the sidebar:

- Buttons
- Inputs
- Settings
- Navigation

## Verify

1. Build and run the app from Xcode.
2. Switch between sidebar sections and confirm content renders.
3. Toggle light/dark mode and confirm colors update via `FColor`.

## Troubleshooting

**Local packages not found**

- Use **File → Packages → Reset Package Caches**.
- Re-add the local package paths listed above.

**Build errors about missing modules**

- Ensure the app target includes the package products.
- Clean build folder: `⇧⌘K`, then build again.

## Related docs

- `apps/macos/SETUP_GUIDE.md`
- `docs/SWIFT_INTEGRATION.md`
