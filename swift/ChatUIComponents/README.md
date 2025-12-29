# ChatUIComponents

Reusable SwiftUI primitives that mirror React component APIs with compile-time safety.

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
- Opacity varies by color scheme (ChatGPTTheme constants)
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

- `ChatGPTTheme.cardCornerRadius` (12pt) with continuous style
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
- Uses `ChatGPTTheme` metrics for all spacing/sizing

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
cd swift/ChatUIComponents
swift build
```

Run tests:

```bash
swift test
```

## Examples

See the `apps/macos/ComponentGallery` app for live examples of all components with interactive demonstrations.

## Documentation

For detailed API documentation, build the DocC documentation:

```bash
swift package generate-documentation
```

## License

See repository root for license information.
