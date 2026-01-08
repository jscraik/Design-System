# ChatUIThemes

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Theme presets including pixel-perfect ChatGPT styling and native macOS alternatives.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Overview](#overview)
- [Installation](#installation)
- [Themes](#themes)
- [Usage patterns](#usage-patterns)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Xcode 15+
- Swift 5.9
- iOS 15+ / macOS 13+ / visionOS 1+

## Quickstart

```swift
import ChatUIThemes

ContentView()
  .chatUITheme(.chatgpt)
```

## Overview

ChatUIThemes provides theme presets that enable pixel-perfect ChatGPT-style interfaces and native macOS design patterns. This package remains separate from core components to enable custom themes while providing ready-to-use constants for rapid development.

**Key Features:**

- Pixel-perfect ChatGPT theme constants
- Native macOS design patterns as alternative
- Environment-driven theme tokens (`ChatUITheme`) for components
- Light and dark mode variants for all constants
- Separation from core components for flexibility
- Easy theme switching and customization

## Installation

### Swift Package Manager

Add ChatUIThemes as a dependency in your `Package.swift`:

```swift
dependencies: [
    .package(path: "../ChatUIThemes")
]
```

Then add it to your target dependencies:

```swift
.target(
    name: "YourTarget",
    dependencies: ["ChatUIThemes", "ChatUIFoundation"]
)
```

## Themes

### ChatUITheme (recommended)

`ChatUITheme` is the environment-driven theme used by ChatUI components and shells.
Set it once at the root and all components will adopt the theme tokens.

```swift
import SwiftUI
import ChatUIThemes
import ChatUIComponents

struct RootView: View {
    var body: some View {
        ContentView()
            .chatUITheme(.chatgpt) // or .default
    }
}
```

### ChatGPTTheme

Pixel-perfect constants matching the ChatGPT web application exactly.

```swift
import SwiftUI
import ChatUIThemes
import ChatUIFoundation

struct MyCard: View {
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        VStack {
            // Content
        }
        .background(FColor.bgCard)
        .clipShape(RoundedRectangle(
            cornerRadius: ChatGPTTheme.cardCornerRadius,
            style: .continuous
        ))
        .overlay(
            RoundedRectangle(
                cornerRadius: ChatGPTTheme.cardCornerRadius,
                style: .continuous
            )
            .stroke(
                FColor.divider.opacity(
                    scheme == .dark
                        ? ChatGPTTheme.cardBorderOpacityDark
                        : ChatGPTTheme.cardBorderOpacityLight
                ),
                lineWidth: 1
            )
        )
    }
}
```

**Corner Radii:**

- `ChatGPTTheme.appCornerRadius` - 18pt (app window clipping)
- `ChatGPTTheme.cardCornerRadius` - 12pt (section cards)
- `ChatGPTTheme.rowCornerRadius` - 10pt (interactive rows)
- `ChatGPTTheme.pillCornerRadius` - 999pt (pill-shaped elements)

**Shadows:**

- `ChatGPTTheme.appShadowOpacity` - 0.45 (app window shadow)
- `ChatGPTTheme.appShadowRadius` - 30pt (shadow blur radius)
- `ChatGPTTheme.appShadowYOffset` - 18pt (shadow vertical offset)

**Borders:**

- `ChatGPTTheme.cardBorderOpacityLight` - 0.35 (light mode card borders)
- `ChatGPTTheme.cardBorderOpacityDark` - 0.20 (dark mode card borders)
- `ChatGPTTheme.dividerOpacityLight` - 0.35 (light mode dividers)
- `ChatGPTTheme.dividerOpacityDark` - 0.25 (dark mode dividers)

**Row Metrics:**

- `ChatGPTTheme.rowHPadding` - 12pt (row horizontal padding)
- `ChatGPTTheme.rowVPadding` - 10pt (row vertical padding)
- `ChatGPTTheme.rowIconSize` - 18pt (row icon size)
- `ChatGPTTheme.rowChevronSize` - 14pt (row chevron size)

**Interaction Overlays:**

- `ChatGPTTheme.hoverOverlayOpacityLight` - 0.55 (light mode hover)
- `ChatGPTTheme.hoverOverlayOpacityDark` - 0.55 (dark mode hover)
- `ChatGPTTheme.pressedOverlayOpacityLight` - 0.70 (light mode pressed)
- `ChatGPTTheme.pressedOverlayOpacityDark` - 0.70 (dark mode pressed)

### DefaultTheme

Native macOS design patterns as an alternative to ChatGPT styling.

```swift
import SwiftUI
import ChatUIThemes
import ChatUIFoundation

struct MyNativeCard: View {
    var body: some View {
        VStack {
            // Content
        }
        .background(FColor.bgCard)
        .clipShape(RoundedRectangle(
            cornerRadius: DefaultTheme.cardRadius,
            style: .continuous
        ))
        .shadow(
            color: DefaultTheme.cardShadow,
            radius: DefaultTheme.cardShadowRadius,
            x: DefaultTheme.cardShadowOffset.width,
            y: DefaultTheme.cardShadowOffset.height
        )
    }
}
```

**Corner Radii:**

- `DefaultTheme.cardRadius` - 8pt (native card corners)
- `DefaultTheme.buttonRadius` - 6pt (native button corners)
- `DefaultTheme.inputRadius` - 8pt (native input corners)

**Shadows:**

- `DefaultTheme.cardShadow` - Black with 0.05 opacity
- `DefaultTheme.cardShadowRadius` - 4pt
- `DefaultTheme.cardShadowOffset` - (0, 1)

**Materials:**

- `DefaultTheme.sidebarMaterial` - `.sidebar` (native sidebar material)
- `DefaultTheme.backgroundMaterial` - `.windowBackground` (native window material)

**Spacing:**

- `DefaultTheme.messageSpacing` - 12pt
- `DefaultTheme.sectionSpacing` - 20pt
- `DefaultTheme.containerPadding` - 16pt

## Usage Patterns

### Theme-Aware Components

Components should use `@Environment(\.colorScheme)` to apply theme-specific opacity values:

```swift
import SwiftUI
import ChatUIThemes
import ChatUIFoundation

struct ThemeAwareRow: View {
    @Environment(\.colorScheme) private var scheme
    @State private var isHovering = false

    var body: some View {
        HStack {
            Text("Row Content")
        }
        .padding(.horizontal, ChatGPTTheme.rowHPadding)
        .padding(.vertical, ChatGPTTheme.rowVPadding)
        .background(
            RoundedRectangle(
                cornerRadius: ChatGPTTheme.rowCornerRadius,
                style: .continuous
            )
            .fill(FColor.bgCardAlt)
            .opacity(
                isHovering
                    ? (scheme == .dark
                        ? ChatGPTTheme.hoverOverlayOpacityDark
                        : ChatGPTTheme.hoverOverlayOpacityLight)
                    : 0
            )
        )
        .onHover { isHovering = $0 }
}
}

## Verify

- Build the package: `cd platforms/apple/swift/ChatUIThemes && swift build`
- Apply `.chatUITheme(.chatgpt)` and confirm component styling changes.

## Troubleshooting

### Symptom: Theme tokens do not apply
Cause: The environment theme is not set at the root.
Fix: Wrap your app root in `.chatUITheme(.chatgpt)` or `.chatUITheme(.default)`.
```

### Switching Themes

Switch themes using the environment:

```swift
ContentView()
    .chatUITheme(.default)
```

struct NativeAppTheme: AppTheme {
var cardRadius: CGFloat { DefaultTheme.cardRadius }
var rowPadding: CGFloat { DefaultTheme.containerPadding }
}

````

## Platform Support

- iOS 15+
- macOS 13+
- visionOS 1+

## Design Philosophy

ChatUIThemes follows these principles:

1. **Separation of Concerns**: Theme constants separate from core components
2. **Pixel-Perfect Accuracy**: ChatGPT theme matches web application exactly
3. **Native Alternatives**: DefaultTheme provides platform-appropriate styling
4. **Light/Dark Variants**: All constants support both color schemes
5. **Easy Customization**: Create custom themes by following established patterns

## Requirements Validation

This package satisfies the following requirements:

- **4.1**: ChatGPT theme provides corner radii, shadows, and material constants matching web app
- **4.2**: Theme presets remain separate from core components for flexibility
- **4.3**: DefaultTheme provides native macOS design patterns
- **4.4**: Light and dark mode variants for all theme constants
- **4.5**: Visual output is pixel-close to React component rendering

## Testing

Build the package:

```bash
cd platforms/apple/swift/ChatUIThemes
swift build
````

Run tests:

```bash
swift test
```

## Examples

See the `platforms/apple/apps/macos/ComponentGallery` app for live examples of both themes in use.

## Documentation

For detailed API documentation, build the DocC documentation:

```bash
swift package generate-documentation
```

## License

See repository root for license information.
