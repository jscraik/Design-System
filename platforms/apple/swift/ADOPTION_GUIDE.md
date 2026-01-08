# ChatUI Swift Adoption Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (beginner to intermediate)
- Scope: Task-focused instructions for this topic
- Non-scope: Comprehensive architecture reference
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Complete guide for adopting the ChatUI Swift package architecture in your native iOS, macOS, and visionOS applications.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Package Overview](#package-overview)
3. [Installation](#installation)
4. [Basic Usage](#basic-usage)
5. [Building Your First View](#building-your-first-view)
6. [Advanced Patterns](#advanced-patterns)
7. [Platform-Specific Features](#platform-specific-features)
8. [Accessibility](#accessibility)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

## Getting Started

The ChatUI Swift architecture consists of four modular packages that work together to provide a complete design system for native Apple platform development.

### Prerequisites

- Xcode 15.0+
- Swift 5.9+
- iOS 15.0+ / macOS 13.0+ / visionOS 1.0+

### Quick Start

1. Clone the repository
2. Open your project in Xcode
3. Add Swift packages as local dependencies
4. Import and start building

## Package Overview

### ChatUIFoundation

**What it provides:**

- Semantic color tokens with automatic light/dark mode
- Typography styles matching React components
- Spacing constants
- Platform detection utilities
- Accessibility helpers

**When to use:**

- Every project needs this as the foundation
- Use for consistent colors, typography, and spacing
- Use for platform-specific behavior

### ChatUIThemes

**What it provides:**

- ChatGPT theme constants (corner radii, shadows, borders)
- DefaultTheme for native macOS styling
- Light/dark mode opacity values

**When to use:**

- When building ChatGPT-style interfaces
- When you need pixel-perfect matching with web app
- When you want native macOS alternatives

### ChatUIComponents

**What it provides:**

- Settings primitives (rows, toggles, dropdowns, cards)
- Button components
- Input components
- Navigation components

**When to use:**

- When building settings interfaces
- When you need pre-built UI primitives
- When you want React-like component APIs

### ChatUIShellChatGPT

**What it provides:**

- Complete application shell layouts
- Visual effect views for vibrancy
- Rounded app containers
- NavigationSplitView-based layouts

**When to use:**

- When building complete ChatGPT-style apps
- When you want ready-made layouts
- Optional - can build custom layouts instead

## Installation

### Method 1: Local Package Dependencies (Recommended for Development)

1. Open your Xcode project
2. Go to File → Add Package Dependencies
3. Click "Add Local..."
4. Navigate to the `platforms/apple/swift/` directory in the repository
5. Select the package you want to add (e.g., `ChatUIFoundation`)
6. Repeat for other packages as needed

### Method 2: Swift Package Manager (Package.swift)

Add dependencies to your `Package.swift`:

```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MyApp",
    platforms: [
        .macOS(.v13),
        .iOS(.v15),
        .visionOS(.v1)
    ],
    dependencies: [
        .package(path: "../platforms/apple/swift/ChatUIFoundation"),
        .package(path: "../platforms/apple/swift/ChatUIThemes"),
        .package(path: "../platforms/apple/swift/ChatUIComponents"),
        .package(path: "../platforms/apple/swift/ChatUIShellChatGPT"), // Optional
    ],
    targets: [
        .target(
            name: "MyApp",
            dependencies: [
                "ChatUIFoundation",
                "ChatUIThemes",
                "ChatUIComponents",
                "ChatUIShellChatGPT", // Optional
            ]
        )
    ]
)
```

## Basic Usage

### Step 1: Import Packages

```swift
import SwiftUI
import ChatUIFoundation
import ChatUIThemes
import ChatUIComponents
```

### Step 2: Use Foundation Tokens

```swift
struct MyView: View {
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            Text("Hello, World!")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)

            Text("Subtitle text")
                .font(FType.caption())
                .foregroundStyle(FColor.textSecondary)
        }
        .padding(FSpacing.s24)
        .background(FColor.bgCard)
    }
}
```

### Step 3: Use Components

```swift
struct SettingsView: View {
    @State private var isEnabled = false

    var body: some View {
        SettingsCardView {
            SettingToggleView(
                title: "Enable Feature",
                subtitle: "Turn this feature on or off",
                isOn: $isEnabled
            )
        }
        .padding(FSpacing.s24)
    }
}
```

## Building Your First View

Let's build a complete settings screen step by step.

### Step 1: Create the Basic Structure

```swift
import SwiftUI
import ChatUIFoundation
import ChatUIThemes
import ChatUIComponents

struct MySettingsView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s24) {
                // Content will go here
            }
            .padding(FSpacing.s24)
        }
        .background(FColor.bgApp)
    }
}
```

### Step 2: Add a Section Header

```swift
var body: some View {
    ScrollView {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            Text("General Settings")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textSecondary)
                .padding(.horizontal, FSpacing.s16)
        }
        .padding(FSpacing.s24)
    }
    .background(FColor.bgApp)
}
```

### Step 3: Add a Settings Card

```swift
@State private var notificationsEnabled = true

var body: some View {
    ScrollView {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            Text("General Settings")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textSecondary)
                .padding(.horizontal, FSpacing.s16)

            SettingsCardView {
                SettingToggleView(
                    icon: AnyView(Image(systemName: "bell.fill")),
                    title: "Notifications",
                    subtitle: "Receive push notifications",
                    isOn: $notificationsEnabled
                )
            }
        }
        .padding(FSpacing.s24)
    }
    .background(FColor.bgApp)
}
```

### Step 4: Add Multiple Rows with Dividers

```swift
@State private var notificationsEnabled = true
@State private var darkModeEnabled = false

var body: some View {
    ScrollView {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            Text("General Settings")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textSecondary)
                .padding(.horizontal, FSpacing.s16)

            SettingsCardView {
                VStack(spacing: 0) {
                    SettingToggleView(
                        icon: AnyView(Image(systemName: "bell.fill")),
                        title: "Notifications",
                        subtitle: "Receive push notifications",
                        isOn: $notificationsEnabled
                    )

                    SettingsDivider()

                    SettingToggleView(
                        icon: AnyView(Image(systemName: "moon.fill")),
                        title: "Dark Mode",
                        subtitle: "Use dark color scheme",
                        isOn: $darkModeEnabled
                    )
                }
            }
        }
        .padding(FSpacing.s24)
    }
    .background(FColor.bgApp)
}
```

### Step 5: Add a Dropdown

```swift
@State private var notificationsEnabled = true
@State private var darkModeEnabled = false
@State private var selectedLanguage = "English"

let languages = ["English", "Spanish", "French", "German", "Japanese"]

var body: some View {
    ScrollView {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            Text("General Settings")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textSecondary)
                .padding(.horizontal, FSpacing.s16)

            SettingsCardView {
                VStack(spacing: 0) {
                    SettingToggleView(
                        icon: AnyView(Image(systemName: "bell.fill")),
                        title: "Notifications",
                        subtitle: "Receive push notifications",
                        isOn: $notificationsEnabled
                    )

                    SettingsDivider()

                    SettingToggleView(
                        icon: AnyView(Image(systemName: "moon.fill")),
                        title: "Dark Mode",
                        subtitle: "Use dark color scheme",
                        isOn: $darkModeEnabled
                    )

                    SettingsDivider()

                    SettingDropdownView(
                        icon: AnyView(Image(systemName: "globe")),
                        title: "Language",
                        options: languages,
                        selection: $selectedLanguage
                    )
                }
            }
        }
        .padding(FSpacing.s24)
    }
    .background(FColor.bgApp)
}
```

## Advanced Patterns

### Custom Row Actions

```swift
SettingRowView(
    icon: AnyView(Image(systemName: "gear")),
    title: "Advanced Settings",
    trailing: .chevron
) {
    // Navigate to advanced settings
    navigationPath.append("advanced")
}
```

### Custom Trailing Content

```swift
SettingRowView(
    title: "Storage Used",
    trailing: .custom(AnyView(
        HStack(spacing: 4) {
            Text("2.4 GB")
                .font(FType.rowValue())
                .foregroundStyle(FColor.textSecondary)

            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(FColor.iconTertiary)
        }
    ))
) {
    // Show storage details
}
```

### Platform-Specific Behavior

```swift
struct MyButton: View {
    @State private var isHovering = false

    var body: some View {
        Button("Click Me") {
            // Action
        }
        .background(
            Platform.isMac && isHovering
                ? FColor.bgCardAlt.opacity(0.5)
                : Color.clear
        )
        .if(Platform.isMac) { view in
            view.onHover { isHovering = $0 }
        }
    }
}

// Helper extension
extension View {
    @ViewBuilder
    func `if`<Content: View>(
        _ condition: Bool,
        transform: (Self) -> Content
    ) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
}
```

### Theme-Aware Opacity

```swift
struct ThemeAwareCard: View {
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        VStack {
            // Content
        }
        .background(FColor.bgCard)
        .overlay(
            RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius)
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

## Platform-Specific Features

### macOS Hover Effects

```swift
struct HoverableRow: View {
    @State private var isHovering = false

    var body: some View {
        SettingRowView(title: "Hoverable Row")
            .background(
                RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius)
                    .fill(FColor.bgCardAlt)
                    .opacity(
                        Platform.isMac && isHovering
                            ? ChatGPTTheme.hoverOverlayOpacityLight
                            : 0
                    )
            )
            .if(Platform.isMac) { view in
                view.onHover { isHovering = $0 }
            }
    }
}
```

### iOS Touch Interactions

```swift
struct TouchableRow: View {
    @State private var isPressed = false

    var body: some View {
        SettingRowView(title: "Touchable Row")
            .background(
                RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius)
                    .fill(FColor.bgCardAlt)
                    .opacity(isPressed ? 0.7 : 0)
            )
            .simultaneousGesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in isPressed = true }
                    .onEnded { _ in isPressed = false }
            )
    }
}
```

### visionOS Considerations

```swift
struct VisionOSAdaptiveView: View {
    var body: some View {
        VStack {
            // Content
        }
        .if(Platform.isVisionOS) { view in
            view
                .glassBackgroundEffect()
                .padding(FSpacing.s32)
        }
    }
}
```

## Accessibility

### Focus Rings

```swift
Button("Action") {
    // Action
}
.accessibilityFocusRing()
```

### High Contrast Support

```swift
Text("Important Text")
    .accessibilityHighContrast()
```

### VoiceOver Labels

```swift
SettingToggleView(
    icon: AnyView(Image(systemName: "bell.fill")),
    title: "Notifications",
    isOn: $isEnabled
)
.accessibilityLabel("Enable notifications")
.accessibilityHint("Double tap to toggle notifications on or off")
```

### Reduced Motion

```swift
struct AnimatedView: View {
    var body: some View {
        Text("Content")
            .animation(
                FAccessibility.prefersReducedMotion
                    ? .none
                    : .easeInOut,
                value: someState
            )
    }
}
```

## Testing

### Unit Tests

```swift
import XCTest
@testable import ChatUIComponents

final class SettingRowTests: XCTestCase {
    func testRowRendersTitle() {
        let row = SettingRowView(title: "Test Title")
        // Test implementation
    }

    func testRowWithChevron() {
        let row = SettingRowView(
            title: "Test",
            trailing: .chevron
        )
        // Test implementation
    }
}
```

### SwiftUI Previews

```swift
#Preview("Light Mode") {
    SettingsExampleView()
        .frame(width: 400, height: 600)
}

#Preview("Dark Mode") {
    SettingsExampleView()
        .frame(width: 400, height: 600)
        .environment(\.colorScheme, .dark)
}

#Preview("High Contrast") {
    SettingsExampleView()
        .frame(width: 400, height: 600)
        .environment(\.accessibilityReduceMotion, true)
}
```

## Troubleshooting

### Colors Not Showing

**Problem:** Colors appear as default system colors instead of custom colors.

**Solution:** Ensure the Asset Catalog is properly included in your package resources:

```swift
// In Package.swift
.target(
    name: "YourTarget",
    dependencies: ["ChatUIFoundation"],
    resources: [
        .process("Resources")
    ]
)
```

### Hover Effects Not Working

**Problem:** Hover effects don't appear on macOS.

**Solution:** Ensure you're using `Platform.isMac` check and `.onHover` modifier:

```swift
.if(Platform.isMac) { view in
    view.onHover { isHovering = $0 }
}
```

### SwiftUI Previews Not Loading

**Problem:** Previews show "Cannot preview in this file".

**Solution:** Open the package directly in Xcode (not through Xcode project):

```bash
cd platforms/apple/swift/ChatUIComponents
open Package.swift
```

### Build Errors with Asset Catalog

**Problem:** "Cannot find 'foundation-text-primary' in scope".

**Solution:** Ensure you're using `Color("foundation-text-primary", bundle: .module)` or the `FColor` API.

### Type Mismatch Errors

**Problem:** "Cannot convert value of type 'AnyView' to expected argument type 'Image'".

**Solution:** Wrap images in `AnyView`:

```swift
SettingRowView(
    icon: AnyView(Image(systemName: "bell.fill")),
    title: "Notifications"
)
```

## Next Steps

1. **Explore the Component Gallery**: Run `platforms/apple/apps/macos/ComponentGallery` to see all components in action
2. **Read the Migration Guide**: See `MIGRATION_GUIDE.md` for team adoption strategies
3. **Check the Parity Checklist**: See `PARITY_CHECKLIST.md` for React vs SwiftUI comparison
4. **Review Development Workflow**: See `DEVELOPMENT_WORKFLOW.md` for hot reload and testing
5. **Learn About visionOS**: See `VISIONOS_SUPPORT.md` for future platform considerations

## Support

For issues and questions:

- Check the troubleshooting section above
- Review package README files
- File an issue on the repository
- Check the Component Gallery app for examples

## License

See repository root for license information.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

