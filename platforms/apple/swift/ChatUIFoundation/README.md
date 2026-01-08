# ChatUIFoundation

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Semantic design tokens, platform utilities, and accessibility helpers for native SwiftUI development.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Overview](#overview)
- [Installation](#installation)
- [Components](#components)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Xcode 15+
- Swift 5.9
- iOS 15+ / macOS 13+ / visionOS 1+

## Quickstart

1. Add the local package to your app:

```swift
dependencies: [
    .package(path: "../ChatUIFoundation")
]
```

2. Use tokens:

```swift
import ChatUIFoundation

Text("Hello").foregroundStyle(FColor.textPrimary)
```

## Overview

ChatUIFoundation is the foundation layer of the ChatUI Swift package architecture. It provides semantic design tokens through Asset Catalog integration, typography styles matching React components, platform detection utilities, and comprehensive accessibility helpers.

**Key Features:**

- Automatic light/dark mode through Asset Catalog
- Compile-time safe semantic color API
- Typography styles matching React components exactly
- Platform detection helpers (iOS, macOS, visionOS)
- Accessibility utilities and system preference detection

## Installation

### Swift Package Manager

Add ChatUIFoundation as a dependency in your `Package.swift`:

```swift
dependencies: [
    .package(path: "../ChatUIFoundation")
]
```

Then add it to your target dependencies:

```swift
.target(
    name: "YourTarget",
    dependencies: ["ChatUIFoundation"]
)
```

## Components

### FColor - Semantic Colors

Compile-time safe semantic color API backed by Asset Catalog with automatic light/dark mode support.

```swift
import SwiftUI
import ChatUIFoundation

struct MyView: View {
    var body: some View {
        VStack {
            Text("Primary Text")
                .foregroundStyle(FColor.textPrimary)

            Text("Secondary Text")
                .foregroundStyle(FColor.textSecondary)
        }
        .background(FColor.bgCard)
    }
}
```

**Available Colors:**

**Surface Colors:**

- `FColor.bgApp` - Window background
- `FColor.bgCard` - Section card background
- `FColor.bgCardAlt` - Hover/pressed overlay base

**Text Colors:**

- `FColor.textPrimary` - Primary text
- `FColor.textSecondary` - Secondary text
- `FColor.textTertiary` - Tertiary text

**Icon Colors:**

- `FColor.iconPrimary` - Primary icons
- `FColor.iconSecondary` - Secondary icons
- `FColor.iconTertiary` - Tertiary icons

**Accent Colors:**

- `FColor.accentGreen` - Green accent (same across light/dark)
- `FColor.accentBlue` - Blue accent
- `FColor.accentOrange` - Orange accent
- `FColor.accentRed` - Red accent
- `FColor.accentPurple` - Purple accent

**Dividers/Borders:**

- `FColor.divider` - Divider and border color

All colors automatically adapt to light/dark mode and high contrast through Asset Catalog configuration.

### FType - Typography

Typography styles matching React components exactly with proper tracking constants.

```swift
import SwiftUI
import ChatUIFoundation

struct MyView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Section Title")
                .font(FType.title())

            Text("Row Title")
                .font(FType.rowTitle())
                .tracking(FType.trackingRow())

            Text("Caption text")
                .font(FType.caption())
                .tracking(FType.trackingCaption())
        }
    }
}
```

**Available Styles:**

- `FType.title()` - 16pt semibold for section headers
- `FType.sectionTitle()` - 13pt semibold for subsections
- `FType.rowTitle()` - 14pt regular for row content
- `FType.rowValue()` - 14pt regular for row values
- `FType.caption()` - 12pt regular for secondary text
- `FType.footnote()` - 12pt regular for footnotes

**Tracking Constants:**

- `FType.trackingRow()` - -0.3 for row text
- `FType.trackingCaption()` - -0.2 for caption text

### FSpacing - Spacing Constants

Standard spacing constants matching React spacing scale.

```swift
import SwiftUI
import ChatUIFoundation

struct MyView: View {
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            Text("Item 1")
                .padding(FSpacing.s12)

            Text("Item 2")
                .padding(.horizontal, FSpacing.s24)
                .padding(.vertical, FSpacing.s8)
        }
    }
}
```

**Available Constants:**

- `FSpacing.s2` - 2pt
- `FSpacing.s4` - 4pt
- `FSpacing.s8` - 8pt
- `FSpacing.s12` - 12pt
- `FSpacing.s16` - 16pt
- `FSpacing.s24` - 24pt
- `FSpacing.s32` - 32pt

### Platform - Platform Detection

Centralized platform detection helpers to avoid scattered conditional compilation.

```swift
import SwiftUI
import ChatUIFoundation

struct MyView: View {
    var body: some View {
        Button("Click Me") {
            // Action
        }
        .if(Platform.isMac) { view in
            view.onHover { isHovering in
                // macOS hover logic
            }
        }
    }
}
```

**Available Helpers:**

- `Platform.isMac` - Boolean for macOS detection
- `Platform.isVisionOS` - Boolean for visionOS detection
- `Platform.isIOS` - Boolean for iOS detection
- `Platform.hoverEffect(_:)` - Apply hover effect on macOS only

### FAccessibility - Accessibility Utilities

Comprehensive accessibility helpers and system preference detection.

## Verify

- Build the package: `cd platforms/apple/swift/ChatUIFoundation && swift build`
- Import `ChatUIFoundation` in a SwiftUI view and reference `FColor` / `FType`.

## Troubleshooting

### Symptom: Colors render as clear/empty

Cause: Asset Catalog resources not bundled.
Fix: Ensure `Resources/Colors.xcassets` is present in the package and rebuild.

```swift
import SwiftUI
import ChatUIFoundation

struct MyView: View {
    var body: some View {
        Button("Action") {
            // Action
        }
        .accessibilityFocusRing()
        .accessibilityHighContrast()
    }
}
```

**Available Utilities:**

**Constants:**

- `FAccessibility.focusRingColor` - Focus ring color (accentBlue)
- `FAccessibility.focusRingWidth` - Focus ring width (2pt)

**System Preferences:**

- `FAccessibility.prefersHighContrast` - High contrast mode detection
- `FAccessibility.prefersReducedMotion` - Reduced motion detection

**View Modifiers:**

- `.accessibilityFocusRing()` - Add focus ring for keyboard navigation
- `.accessibilityHighContrast()` - Apply high contrast styling

## Asset Catalog Structure

ChatUIFoundation includes a complete Asset Catalog at:

```
platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/
```

Each color is defined as a `.colorset` with light and dark appearance variants. The Asset Catalog provides:

- Automatic light/dark mode switching
- High contrast support
- Compile-time safety through named colors
- Zero manual color switching logic

## Platform Support

- iOS 15+
- macOS 13+
- visionOS 1+

## Design Philosophy

ChatUIFoundation follows these principles:

1. **Semantic API**: Use `FColor.textPrimary` not `Color("text-primary")` for discoverability
2. **Compile-Time Safety**: Asset Catalog names are compile-time checked
3. **Zero Manual Logic**: Light/dark mode handled automatically by Asset Catalog
4. **Platform Centralization**: Platform differences centralized in `Platform.swift`
5. **Accessibility by Default**: Built-in accessibility support for all components

## Requirements Validation

This package satisfies the following requirements:

- **1.1**: Design tokens as single source of truth with automatic generation
- **1.2**: Semantic color API with automatic light/dark mode through Asset Catalog
- **2.1**: Modular SwiftUI foundation with semantic tokens and compile-time safety
- **2.2**: Typography styles, spacing constants, and platform utilities matching React
- **2.3**: Platform detection helpers centralizing iOS/macOS/visionOS logic
- **2.4**: Accessibility helpers including focus rings and system preference detection
- **2.5**: Semantic APIs preventing typos and enabling autocomplete

## Testing

Build the package:

```bash
cd platforms/apple/swift/ChatUIFoundation
swift build
```

Run tests:

```bash
swift test
```

## Examples

See the `platforms/apple/apps/macos/ComponentGallery` app for live examples of all foundation tokens in use.

## Documentation

For detailed API documentation, build the DocC documentation:

```bash
swift package generate-documentation
```

## License

See repository root for license information.
