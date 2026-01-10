# aStudio Playground Setup Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


> Note: The primary macOS development app is `platforms/apple/apps/macos/ComponentGallery`. `AStudioPlayground` is a lightweight companion for quick experiments with the modular Swift packages.

This guide explains how to open and run the existing AStudioPlayground Xcode project in this repo.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Package dependencies](#package-dependencies)
- [Swift Package Manager](#swift-package-manager-command-line)
- [Using the playground](#using-the-playground)
- [Troubleshooting](#troubleshooting)
- [Next steps](#next-steps)
- [File structure](#file-structure)
- [Verify](#verify)

## Prerequisites

- macOS 13+
- Xcode 15+

## Quick start

1. Open the project:

   ```bash
   open platforms/apple/apps/macos/AStudioPlayground/AStudioPlayground.xcodeproj
   ```

2. Select the `AStudioPlayground` scheme.
3. Build and run with `⌘R`.

## Package dependencies

AStudioPlayground uses local Swift packages:

- `platforms/apple/swift/AStudioFoundation`
- `platforms/apple/swift/AStudioComponents`
- `platforms/apple/swift/AStudioThemes`
- `platforms/apple/swift/AStudioShellChatGPT`

If Xcode cannot resolve the modules:

1. Select the AStudioPlayground project and target.
2. Open **General** → **Frameworks, Libraries, and Embedded Content**.
3. Click **+** → **Add Package Dependency...** → **Add Local...**.
4. Add each path above and select its product.

## Swift Package Manager (command line)

```bash
cd platforms/apple/apps/macos/AStudioPlayground
swift build
swift run
```

Note: SwiftUI previews are best in Xcode.

## Using the playground

- Sidebar sections: Buttons, Inputs, Settings, Navigation.
- Component entry point: `platforms/apple/apps/macos/AStudioPlayground/AStudioPlayground/ComponentGallery.swift`.
- App shell: `platforms/apple/apps/macos/AStudioPlayground/AStudioPlayground/ContentView.swift`.

## Troubleshooting

### Package not found

- Confirm the local package paths above are correct relative to the `.xcodeproj`.
- Try **File → Packages → Reset Package Caches** in Xcode.

### Build errors

- Ensure macOS 13.0+ is selected for the target.
- Verify all package products are added to the target.

### Previews not working

- Resume previews: `⌥⌘P`.
- Clean build folder: `⇧⌘K`.

## Next steps

Once the playground runs:

1. Browse the sidebar and verify each section renders.
2. Toggle light/dark mode to confirm token usage.
3. Open `ComponentGallery.swift` and update sections to validate new components.

## File structure

```
platforms/apple/apps/macos/AStudioPlayground/
├── AStudioPlayground.xcodeproj/
└── AStudioPlayground/
    ├── AStudioPlaygroundApp.swift
    ├── ContentView.swift
    ├── ComponentGallery.swift
    ├── PreviewScenarios.swift
    └── Assets.xcassets/
```

## Verify

- ✅ The app builds and runs without errors
- ✅ Sidebar navigation switches sections correctly
- ✅ Components render with semantic tokens (colors/spacing)
- ✅ Light/dark mode works as expected

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

