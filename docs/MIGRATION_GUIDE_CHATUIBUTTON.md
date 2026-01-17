# ChatUIButton Migration Guide

Last updated: 2026-01-04

## Doc requirements

- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Overview](#overview)
- [Why Migrate?](#why-migrate)
- [Migration Steps](#migration-steps)
  - [Step 1: Update Imports](#step-1-update-imports)
  - [Step 2: Update Type Names](#step-2-update-type-names)
  - [Step 3: Update Package Dependencies](#step-3-update-package-dependencies)
- [Breaking Changes](#breaking-changes)
  - [Dynamic Type Scaling](#dynamic-type-scaling)
  - [Token Access](#token-access)
- [Feature Parity](#feature-parity)
  - [✅ Fully Compatible Features](#fully-compatible-features)
  - [⚠️ Different Implementations](#different-implementations)
  - [🚧 Missing Features](#missing-features)
- [Code Examples](#code-examples)
  - [Basic Button](#basic-button)
  - [Icon Button](#icon-button)
  - [Custom Content](#custom-content)
  - [Disabled State](#disabled-state)
- [Timeline](#timeline)
- [Support](#support)
- [Future Enhancements](#future-enhancements)

## Overview

The `ui-swift` package is now in maintenance mode. All new development should use the `AStudioComponents` package for button components.

## Why Migrate?

| Feature              | AStudioComponents                           | ui-swift               |
| -------------------- | ------------------------------------------- | ---------------------- |
| **Platform Support** | iOS 15+, macOS 13+, visionOS 1+             | macOS 13+ only         |
| **Token System**     | AStudioFoundation (FType, FSpacing, FColor) | Internal DesignTokens  |
| **Testing**          | Property-based tests (SwiftCheck)           | Traditional unit tests |
| **Accessibility**    | Full WCAG 2.2 AA support                    | Basic support          |
| **Maintenance**      | ✅ Active                                   | ⚠️ Legacy              |
| **Dynamic Type**     | Not yet implemented                         | ✅ Implemented         |

## Migration Steps

### Step 1: Update Imports

```swift
// Before
import ui_swift

// After
import AStudioComponents
import AStudioFoundation
import AStudioThemes
```

### Step 2: Update Type Names

The type names are identical, so no code changes needed:

```swift
// These work in both packages
let button = ChatUIButton("Click me", variant: .default, size: .lg)
let iconButton = ChatUIButton(systemName: "star.fill", variant: .secondary)
```

### Step 3: Update Package Dependencies

**Before (Package.swift):**

```swift
dependencies: [
    .package(path: "../ui-swift")
],
targets: [
    .target(
        name: "YourApp",
        dependencies: ["ui-swift"]
    )
]
```

**After (Package.swift):**

```swift
dependencies: [
    .package(path: "../AStudioComponents"),
    .package(path: "../AStudioFoundation"),
    .package(path: "../AStudioThemes")
],
targets: [
    .target(
        name: "YourApp",
        dependencies: [
            "AStudioComponents",
            "AStudioFoundation",
            "AStudioThemes"
        ]
    )
]
```

## Breaking Changes

### Dynamic Type Scaling

**Note:** The AStudioComponents version does not yet support dynamic type scaling.

If you need this feature, please file an issue or use the ui-swift version temporarily:

```swift
// Temporary workaround if you need dynamic type scaling
import ui_swift  // Use for now
let button = ui_swift.ChatUIButton("Text")  // Has dynamic type support
```

### Token Access

**AStudioComponents** uses `AStudioFoundation` tokens:

```swift
// Instead of DesignTokens (ui-swift)
let spacing = DesignTokens.Spacing.sm

// Use FType (AStudioFoundation)
let spacing = FSpacing.s12
```

## Feature Parity

### ✅ Fully Compatible Features

- All button variants (default, destructive, outline, secondary, ghost, link)
- All button sizes (default, sm, lg, icon)
- Accessibility labels and hints
- Disabled states
- High contrast support

### ⚠️ Different Implementations

| Feature       | AStudioComponents             | ui-swift                            |
| ------------- | ----------------------------- | ----------------------------------- |
| Font API      | `FType.rowTitle()`            | `DesignTokens.Typography.Body.size` |
| Spacing API   | `FSpacing.s8`                 | `DesignTokens.Spacing.xs`           |
| Color API     | `FColor.accentBlue`           | `DesignTokens.Colors.Accent.blue`   |
| Theme Support | `@Environment(\.chatUITheme)` | DesignTokens static                 |

### 🚧 Missing Features

The following features exist in ui-swift but not yet in AStudioComponents:

- **Dynamic Type Scaling** - Planned for next release
- **Public Test Helpers** - Use property-based tests instead

## Code Examples

### Basic Button

```swift
import AStudioComponents

ChatUIButton("Save Changes", variant: .default) {
    handleSave()
}
```

### Icon Button

```swift
ChatUIButton(systemName: "trash", variant: .destructive, size: .icon) {
    handleDelete()
}
```

### Custom Content

```swift
ChatUIButton(variant: .outline) {
    HStack {
        Image(systemName: "link")
        Text("Open URL")
    }
} action: {
    openURL()
}
```

### Disabled State

```swift
ChatUIButton("Submit", isDisabled: !isValid) {
    submitForm()
}
```

## Timeline

- **Now** - ui-swift marked as deprecated
- **6 months** - No new features in ui-swift
- **12 months** - End of life, removal recommended

## Support

For questions or issues:

1. Check [AStudioComponents documentation](../platforms/apple/swift/AStudioComponents/README.md)
2. File an issue on GitHub
3. Contact the aStudio team

## Future Enhancements

We're working on adding the following features to AStudioComponents:

1. **Dynamic Type Scaling** - Better accessibility support
2. **Animation Presets** - Consistent animations across components
3. **Theming Improvements** - More theme customization options

Stay tuned for updates.

## Risks and assumptions

- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify

- TBD: Add concrete verification steps and expected results.

## Troubleshooting

- TBD: Add the top 3 failure modes and fixes.
