# ChatUIShellChatGPT

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Optional complete application shell layouts for ChatGPT-style experiences.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Overview](#overview)
- [Components](#components)
- [Usage example](#usage-example)
- [Platform support](#platform-support)
- [Verify](#verify)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Xcode 15+
- Swift 5.9
- iOS 15+ / macOS 13+ / visionOS 1+

## Quickstart

```swift
import ChatUIShellChatGPT

RoundedAppContainer {
    AppShellView {
        SidebarView()
    } detail: {
        DetailView()
    }
}
```

## Overview

ChatUIShellChatGPT provides ready-to-use shell components for building complete native macOS applications with ChatGPT-style visual design. This package is completely optional and can be used independently or alongside the core ChatUI packages.

## Components

### VisualEffectView

Platform-adaptive visual effect view that provides native vibrancy on macOS and graceful fallback on iOS/visionOS.

**macOS**: Wraps `NSVisualEffectView` for native vibrancy effects
**iOS/visionOS**: Uses SwiftUI `Material` for consistent appearance

```swift
import ChatUIShellChatGPT

// macOS vibrancy
VisualEffectView(material: .sidebar)

// iOS/visionOS fallback
VisualEffectView(material: .regular)
```

**Features:**

- Automatic platform detection
- Configurable material types
- Configurable blending modes (macOS)
- Active state management

### RoundedAppContainer

Container that clips content to ChatGPT app corner radius with border and shadow effects.

```swift
import ChatUIShellChatGPT

RoundedAppContainer {
    // Your app content here
    MyAppView()
}
```

**Features:**

- Clips to `ChatUITheme.appCornerRadius` (18pt in ChatGPT theme)
- Subtle border stroke with opacity
- Shadow using `ChatUITheme` constants:
  - Opacity: 0.45
  - Radius: 30pt
  - Y-offset: 18pt
- Continuous corner style for smooth rendering

### AppShellView

NavigationSplitView-based layout with sidebar and detail panes, styled with platform-appropriate backgrounds.

```swift
import ChatUIShellChatGPT

AppShellView {
    // Sidebar content
    MySidebarView()
} detail: {
    // Detail content
    MyDetailView()
}
```

**Features:**

- Configurable sidebar width (280-400pt)
- Platform-adaptive backgrounds:
  - macOS: `VisualEffectView` with sidebar/window materials
  - iOS/visionOS: `FColor.bgApp`
- Balanced split view style
- Automatic layout management

## Usage Example

Complete example demonstrating all shell components:

```swift
import SwiftUI
import ChatUIShellChatGPT
import ChatUIComponents
import ChatUIFoundation

struct MyApp: View {
    @State private var selectedItem = "Home"

    var body: some View {
        RoundedAppContainer {
            AppShellView {
                // Sidebar
                VStack(alignment: .leading, spacing: 16) {
                    Text("My App")
                        .font(FType.title())
                        .padding()

                    ListItemView(
                        icon: AnyView(Image(systemName: "house.fill")),
                        title: "Home",
                        isSelected: selectedItem == "Home"
                    ) {
                        selectedItem = "Home"
                    }

                    ListItemView(
                        icon: AnyView(Image(systemName: "gear")),
                        title: "Settings",
                        isSelected: selectedItem == "Settings"
                    ) {
                        selectedItem = "Settings"
                    }

                    Spacer()
                }
            } detail: {
                // Detail
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        Text(selectedItem)
                            .font(FType.title())

                        SettingsCardView {
                            // Your content here
                        }
                    }
                    .padding(24)
                }
            }
        }
        .frame(width: 1000, height: 700)
    }
}
```

## Dependencies

- **ChatUIFoundation**: Semantic tokens and platform utilities
- **ChatUIComponents**: Reusable SwiftUI primitives
- **ChatUIThemes**: ChatGPT-style visual constants

## Platform Support

- iOS 15+
- macOS 13+
- visionOS 1+

## Design Philosophy

This package is **completely optional**. You can:

1. Use all shell components for rapid ChatGPT-style app development
2. Use individual components (e.g., just `VisualEffectView`)
3. Build custom layouts using only ChatUIFoundation and ChatUIComponents
4. Mix shell components with custom layouts

The shell components are designed to be composable and non-intrusive.

## Requirements Validation

This package satisfies the following requirements:

- **5.1**: Provides `AppShellView` with NavigationSplitView-based layout
- **5.2**: Provides `VisualEffectView` wrapper for native vibrancy effects
- **5.3**: Provides `RoundedAppContainer` with proper clipping, borders, and shadows
- **5.4**: Remains completely optional, allowing core components to be used independently
- **5.5**: Seamless integration with ChatUIFoundation and ChatUIComponents

## Example Views

See `ShellExampleView.swift` for a comprehensive demonstration of all shell components working together with settings primitives and navigation.

## Testing

Build the package:

```bash
cd platforms/apple/swift/ChatUIShellChatGPT
swift build
```

Run tests:

```bash
swift test
```

## Verify

- Build the package: `cd platforms/apple/swift/ChatUIShellChatGPT && swift build`
- Run the ComponentGallery app and confirm the shell renders correctly.

## Troubleshooting

### Symptom: Glass effects do not appear on macOS

Cause: Reduced transparency or high-contrast accessibility settings are enabled.
Fix: Disable “Reduce transparency” in System Settings or expect the solid fallback.

## License

See repository root for license information.
