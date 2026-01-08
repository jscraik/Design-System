# ChatUIComponents

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Reusable SwiftUI primitives that mirror React component APIs with compile-time safety.

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

```swift
import ChatUIComponents

SettingsCardView {
    SettingRowView(title: "Example")
}
```

## Overview

ChatUIComponents provides reusable SwiftUI primitives that mirror React component APIs, enabling developers to build native iOS, macOS, and visionOS applications with familiar patterns and consistent behavior. All components use ChatUIFoundation tokens exclusively and support automatic light/dark mode.

**Key Features:**

- Settings primitives matching React components
- Compile-time safe token usage
- Automatic light/dark mode support
- Platform-appropriate interactions (macOS hover, iOS touch)
- Built-in accessibility support
- Composition-based architecture

## Installation

### Swift Package Manager

Add ChatUIComponents as a dependency in your `Package.swift`:

```swift
dependencies: [
    .package(path: "../ChatUIComponents")
]
```

Then add it to your target dependencies:

```swift
.target(
    name: "YourTarget",
    dependencies: ["ChatUIComponents", "ChatUIFoundation", "ChatUIThemes"]
)
```

## Components

> Components read their styling tokens from the environment. Apply a theme once at the root:
>
> ```swift
> ContentView()
>     .chatUITheme(.chatgpt) // or .default
> ```

### ChatShell (slot-based layouts)

Compose chat variants with consistent spacing and theming:

```swift
ChatVariantSplitSidebar(
    sidebar: { SidebarView() },
    header: { HeaderView() },
    messages: { MessagesView() },
    composer: { ComposerView() }
)
```

Also available:

- `ChatVariantCompact` (no sidebar)
- `ChatVariantContextRail` (right-side context panel)

### Template Registry (SwiftUI previews)

Browse the built-in template previews (including chat variants):

```swift
import ChatUIComponents

if let template = TemplateRegistry.template(for: .chatVariants) {
    template.makeView()
}
```

### TextareaView

Multiline input with tokenized borders and focus ring:

```swift
@State private var notes = ""

TextareaView(
    text: $notes,
    placeholder: "Write a note..."
)
```

### BadgeView

Status badge with variants:

```swift
BadgeView("New")
BadgeView("Pro", variant: .secondary)
BadgeView("Error", variant: .destructive)
BadgeView("Outline", variant: .outline)
```

### AvatarView

User avatar with optional initials fallback:

```swift
AvatarView(image: Image("avatar"), initials: "JD")
AvatarView(url: URL(string: "https://example.com/avatar.png"), initials: "AB")
```

### SelectView

Dropdown select with tokenized trigger:

```swift
@State private var plan = ""

SelectView(
    selection: $plan,
    options: [
        SelectOption(value: "starter", label: "Starter"),
        SelectOption(value: "pro", label: "Pro"),
        SelectOption(value: "enterprise", label: "Enterprise")
    ],
    placeholder: "Choose a plan"
)
```

### AlertView

Inline alert with title/description:

```swift
AlertView(variant: .destructive, icon: Image(systemName: "exclamationmark.triangle.fill")) {
    AlertTitle("Something went wrong")
    AlertDescription("Please check your connection and try again.")
}
```

### SkeletonView

Loading placeholder:

```swift
SkeletonView()
    .frame(width: 160, height: 12)
```

### ToastView + ToastContainerView

Transient notifications:

```swift
@State private var showToast = true

ToastContainerView(position: .bottomTrailing) {
    ToastView(
        isPresented: $showToast,
        variant: .success,
        title: "Saved",
        description: "Your changes were saved."
    )
}
```

### ModalDialogView

Modal dialog with header/body/footer helpers:

```swift
@State private var showModal = false

ModalDialogView(isPresented: $showModal, title: "Confirm") {
    ModalBodyView {
        Text("Are you sure?")
    }
    ModalFooterView {
        ChatUIButton("Cancel", variant: .secondary) { showModal = false }
        ChatUIButton("Confirm", variant: .default) { showModal = false }
    }
}
```

### ChatUITableView (macOS-friendly)

Tokenized table layout for macOS surfaces:

```swift
ChatUITableView(
    data: items,
    columns: [
        ChatUITableColumn(title: "Name"),
        ChatUITableColumn(title: "Status", alignment: .center)
    ]
) { item in
    HStack {
        Text(item.name)
        Spacer()
        BadgeView(item.status, variant: .secondary)
    }
}
```

### chatUITooltip

Tooltips on macOS (uses `.help`):

```swift
Text("Hover me")
    .chatUITooltip("More info")
```

### SettingsDivider

1pt height divider with theme-aware opacity.

```swift
import SwiftUI
import ChatUIComponents

struct MySettings: View {
    var body: some View {
        VStack(spacing: 0) {
            SettingRowView(title: "Row 1")
            SettingsDivider()
            SettingRowView(title: "Row 2")
        }
    }
}
```

**Features:**

- Uses `FColor.divider` for consistent color
- Opacity varies by color scheme (ChatUITheme tokens)
- 1pt height for subtle separation

### SettingsCardView

Rounded container with ChatGPT-style background and border.

```swift
import SwiftUI
import ChatUIComponents

struct MySettings: View {
    var body: some View {
        SettingsCardView {
            VStack(spacing: 0) {
                SettingRowView(title: "Setting 1")
                SettingsDivider()
                SettingRowView(title: "Setting 2")
            }
        }
    }
}
```

**Features:**

- `ChatUITheme.cardCornerRadius` (12pt in ChatGPT theme) with continuous style
- `FColor.bgCard` background
- Stroke border with scheme-dependent opacity
- Accepts generic `@ViewBuilder` content

### SettingRowView

Core primitive with icon, title, subtitle, and trailing content options.

```swift
import SwiftUI
import ChatUIComponents

struct MySettings: View {
    var body: some View {
        VStack(spacing: 0) {
            // Simple row
            SettingRowView(title: "Simple Row")

            // Row with icon
            SettingRowView(
                icon: AnyView(Image(systemName: "bell.fill")),
                title: "Notifications"
            )

            // Row with subtitle
            SettingRowView(
                title: "Account",
                subtitle: "Manage your account settings"
            )

            // Row with chevron
            SettingRowView(
                title: "Advanced",
                trailing: .chevron
            ) {
                // Navigation action
            }

            // Row with text value
            SettingRowView(
                title: "Language",
                trailing: .text("English")
            )

            // Row with custom trailing
            SettingRowView(
                title: "Custom",
                trailing: .custom(AnyView(
                    Image(systemName: "star.fill")
                ))
            )
        }
    }
}
```

**Features:**

- Optional icon (AnyView for flexibility)
- Title and optional subtitle
- Trailing options: `.none`, `.chevron`, `.text(String)`, `.custom(AnyView)`
- Optional action closure for tappable rows
- macOS hover overlay using `Platform.isMac` check
- Pressed state overlay for both platforms
- Inset padding (6pt horizontal) for "floating row" appearance
- Uses `ChatUITheme` metrics for all spacing/sizing

**Trailing Options:**

```swift
public enum SettingTrailing {
    case none                    // No trailing content
    case chevron                 // Right-pointing chevron
    case text(String)            // Text value
    case custom(AnyView)         // Custom view
}
```

### FoundationSwitchStyle

Custom toggle style matching ChatGPT switch design.

```swift
import SwiftUI
import ChatUIComponents

struct MySettings: View {
    @State private var isEnabled = false

    var body: some View {
        Toggle("Enable Feature", isOn: $isEnabled)
            .toggleStyle(FoundationSwitchStyle())
    }
}
```

**Features:**

- 42x22pt capsule with 18pt circle thumb
- Green accent when on, `bgCardAlt` when off
- Smooth 0.15s animation on toggle
- White circle with subtle shadow
- Accessibility label ("On"/"Off")

## Verify

- Build the package: `cd platforms/apple/swift/ChatUIComponents && swift build`
- Open `platforms/apple/apps/macos/ComponentGallery` and confirm settings primitives render.

## Troubleshooting

### Symptom: Components render without theme styling

Cause: No theme applied to the environment.
Fix: Apply `.chatUITheme(.chatgpt)` or `.chatUITheme(.default)` at the root.

### SettingToggleView

Composes `SettingRowView` with `Toggle` in trailing position.

```swift
import SwiftUI
import ChatUIComponents

struct MySettings: View {
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false

    var body: some View {
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
                    title: "Dark Mode",
                    isOn: $darkModeEnabled
                )
            }
        }
    }
}
```

**Features:**

- Combines `SettingRowView` with `Toggle`
- Uses `FoundationSwitchStyle` automatically
- Optional icon and subtitle
- Binding for state management

### SettingDropdownView

Composes `SettingRowView` with `Menu` in trailing position.

```swift
import SwiftUI
import ChatUIComponents

struct MySettings: View {
    @State private var selectedLanguage = "English"
    @State private var selectedAccent = "Green"

    let languages = ["English", "Spanish", "French", "German", "Japanese"]
    let accents = ["Green", "Blue", "Orange", "Red", "Purple"]

    var body: some View {
        SettingsCardView {
            VStack(spacing: 0) {
                SettingDropdownView(
                    icon: AnyView(Image(systemName: "globe")),
                    title: "Language",
                    subtitle: "Choose your preferred language",
                    options: languages,
                    selection: $selectedLanguage
                )

                SettingsDivider()

                SettingDropdownView(
                    title: "Accent Color",
                    options: accents,
                    selection: $selectedAccent
                )
            }
        }
    }
}
```

**Features:**

- Combines `SettingRowView` with `Menu`
- Shows current selection text + small chevron pill (18pt circle)
- Menu presents all options on click
- Optional icon and subtitle
- Binding for state management

### ChatUIButton

Migrated button component using new foundation tokens.

```swift
import SwiftUI
import ChatUIComponents

struct MyView: View {
    var body: some View {
        VStack(spacing: 12) {
            ChatUIButton(variant: .default) {
                Text("Default Button")
            }

            ChatUIButton(variant: .destructive) {
                Text("Delete")
            }

            ChatUIButton(variant: .outline) {
                Text("Cancel")
            }
        }
    }
}
```

**Features:**

- Multiple variants (default, destructive, outline, ghost)
- Uses `FColor` tokens for consistent styling
- Platform-appropriate interactions
- Accessibility support

## Complete Example

```swift
import SwiftUI
import ChatUIComponents
import ChatUIFoundation
import ChatUIThemes

struct SettingsView: View {
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false
    @State private var selectedLanguage = "English"
    @State private var selectedAccent = "Green"

    let languages = ["English", "Spanish", "French", "German", "Japanese"]
    let accents = ["Green", "Blue", "Orange", "Red", "Purple"]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Section header
                Text("Settings")
                    .font(FType.sectionTitle())
                    .foregroundStyle(FColor.textSecondary)
                    .padding(.horizontal, 16)

                // General settings card
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

                        SettingRowView(
                            icon: AnyView(Image(systemName: "gear")),
                            title: "Advanced",
                            trailing: .chevron
                        ) {
                            // Navigate to advanced settings
                        }
                    }
                }

                // Preferences section
                Text("Preferences")
                    .font(FType.sectionTitle())
                    .foregroundStyle(FColor.textSecondary)
                    .padding(.horizontal, 16)

                // Preferences card
                SettingsCardView {
                    VStack(spacing: 0) {
                        SettingDropdownView(
                            icon: AnyView(Image(systemName: "globe")),
                            title: "Language",
                            options: languages,
                            selection: $selectedLanguage
                        )

                        SettingsDivider()

                        SettingDropdownView(
                            icon: AnyView(Image(systemName: "paintpalette.fill")),
                            title: "Accent Color",
                            options: accents,
                            selection: $selectedAccent
                        )
                    }
                }
            }
            .padding(24)
        }
        .background(FColor.bgApp)
    }
}
```

## Platform Support

- iOS 15+
- macOS 13+
- visionOS 1+

## Design Philosophy

ChatUIComponents follows these principles:

1. **Composition Over Inheritance**: Components compose primitives rather than subclass
2. **Token-Driven**: All styling uses ChatUIFoundation tokens exclusively
3. **Platform-Appropriate**: macOS hover effects, iOS touch interactions
4. **Accessibility by Default**: Built-in VoiceOver support and keyboard navigation
5. **Familiar APIs**: Mirror React component patterns for easy adoption

## Requirements Validation

This package satisfies the following requirements:

- **3.1**: Settings primitives matching React component behavior with property-based testing support
- **3.2**: Layout primitives mirroring React card component styling with automatic accessibility
- **3.3**: Navigation interfaces handling platform-specific interactions appropriately
- **3.4**: Exclusive use of ChatUIFoundation tokens with compile-time safety
- **3.5**: Built-in accessibility support including VoiceOver labels and keyboard navigation

## Testing

Build the package:

```bash
cd platforms/apple/swift/ChatUIComponents
swift build
```

Run tests:

```bash
swift test
```

## Examples

See the `platforms/apple/apps/macos/ComponentGallery` app for live examples of all components with interactive demonstrations.

## Documentation

For detailed API documentation, build the DocC documentation:

```bash
swift package generate-documentation
```

## License

See repository root for license information.
