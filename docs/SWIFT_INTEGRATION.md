# Swift Integration Guide

This guide explains how to work with the modular ChatUI Swift packages and the macOS Component Gallery.

## Quick start (recommended)

### 1. Open the Component Gallery

```bash
cd apps/macos/ComponentGallery
open Package.swift
```

### 2. Build and run

In Xcode:

1. Select the `ComponentGallery` scheme
2. Press `⌘R` to run
3. Browse components and accessibility checklists

From the command line:

```bash
cd apps/macos/ComponentGallery
swift build
swift run
```

## Project structure

```
swift/
├── ChatUIFoundation/     # FColor, FType, FSpacing, Platform, FAccessibility
├── ChatUIThemes/         # ChatGPT theme constants
├── ChatUIComponents/     # SwiftUI primitives
└── ChatUIShellChatGPT/   # Optional shell layouts

apps/macos/
├── ComponentGallery/     # Primary dev app
└── ChatUIPlayground/     # Secondary dev app (modular packages)
```

## Design tokens

Use the semantic APIs from `ChatUIFoundation`:

```swift
Text("Hello")
    .font(FType.title())
    .foregroundStyle(FColor.textPrimary)
    .padding(FSpacing.s16)
```

## Component usage

```swift
ChatUIButton("Delete", variant: .destructive, size: .sm) {
    // Handle delete
}

ChatUIInput(
    text: $text,
    placeholder: "Search messages",
    variant: .search,
    accessibilityLabel: "Search messages",
    submitLabel: .search
)
```

## Testing

Run Swift package tests:

```bash
pnpm test:swift
# or individual packages
pnpm test:swift:foundation
pnpm test:swift:components
pnpm test:swift:themes
pnpm test:swift:shell
```

## Accessibility

Use the Component Gallery accessibility panel and:

- `swift/ACCESSIBILITY_TESTING.md`
- `swift/ChatUIComponents/SETTINGS_EXAMPLE_SUMMARY.md`

## Legacy: ui-swift (monolithic package)

The original `swift/ui-swift` package is retained for historical reference. The current macOS apps (`ComponentGallery` and `ChatUIPlayground`) use the modular packages listed above.

- `swift/ui-swift/README.md`

## Troubleshooting

**Xcode cannot find local packages**

- See `swift/ChatUIComponents/XCODE_INTEGRATION.md`.
- Ensure you open `Package.swift` directly for SwiftPM workflows.

**SwiftUI previews not updating**

- Restart previews (`⌥⌘P`)
- Clean build folder (`⇧⌘K`)

## Verify

- `ComponentGallery` runs and shows component sections.
- `ChatUIPlayground` runs and switches between sidebar sections.

## Next steps

- Use `swift/ADOPTION_GUIDE.md` for team rollout.
- Use `swift/DEVELOPMENT_WORKFLOW.md` for detailed workflows.
