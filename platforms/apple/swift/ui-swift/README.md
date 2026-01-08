# ChatUISwift

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


A native macOS SwiftUI component library that uses design tokens for visual consistency with the React ChatUI system.

> Legacy package. For new development, prefer the modular Swift packages under `platforms/apple/swift/`.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- macOS 13+
- Xcode 15+
- Swift 5.9+

## Quickstart

```bash
open platforms/apple/swift/ui-swift/Package.swift
```

```swift
import ChatUISwift

ChatUIButton("Hello") { }
```

## Overview

ChatUISwift provides native macOS components that consume the same design tokens as the React web application, ensuring visual consistency across platforms while delivering truly native macOS experiences.

## Features

- **Design Token Integration**: All components use design tokens that match the React implementation
- **Native macOS Feel**: Components follow macOS design patterns and behaviors
- **SwiftUI Previews**: Full support for Xcode previews with comprehensive examples
- **Accessibility**: Built-in support for VoiceOver, Dynamic Type, and other accessibility features
- **Dark Mode**: Automatic adaptation to system appearance preferences

## Components

### ChatUIButton

A native button component with multiple variants and sizes:

- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Full keyboard navigation and accessibility support

### ChatUIInput

A native text input component with different styles:

- Variants: default, search, password
- Sizes: default, sm, lg
- Native macOS text field behaviors

### ChatUICard

A container component for grouping content:

- Variants: default, elevated, outlined
- Consistent spacing and styling

## Design Tokens

The package includes comprehensive design tokens that match the React implementation:

- **Colors**: Background, text, icon, and accent colors with light/dark mode support
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Corner Radius**: Standard border radius values

## Usage

### Basic Example

```swift
import SwiftUI
import ChatUISwift

struct MyView: View {
    @State private var text = ""

    var body: some View {
        VStack(spacing: DesignTokens.Spacing.sm) {
            ChatUIInput(
                text: $text,
                placeholder: "Enter your message..."
            )

            ChatUIButton("Send Message", variant: .default) {
                // Handle button tap
            }
        }
        .padding(DesignTokens.Spacing.md)
    }
}
```

### Accessibility + Submit Labels

```swift
@State private var query = ""

ChatUIButton(
    systemName: "trash",
    variant: .destructive,
    accessibilityLabel: "Delete item",
    accessibilityHint: "Permanently removes the selected item"
) {
    // Handle delete
}

ChatUIInput(
    text: $query,
    placeholder: "Search messages",
    variant: .search,
    accessibilityLabel: "Search messages",
    submitLabel: .search
)
```

### SwiftUI Previews

The package includes comprehensive preview examples:

```swift
#Preview("Button Variants") {
    VStack {
        ChatUIButton("Default") { }
        ChatUIButton("Destructive", variant: .destructive) { }
        ChatUIButton("Outline", variant: .outline) { }
    }
    .padding()
}
```

## Development

### Playground App (legacy)

`platforms/apple/apps/macos/ChatUIPlayground` now uses the modular Swift packages. It is no longer wired to `platforms/apple/swift/ui-swift`.

For ChatUISwift development, open the package directly:

```bash
open platforms/apple/swift/ui-swift/Package.swift
```

### SwiftUI Previews Workflow

For component development:

1. Open a component file (e.g., `ChatUIButton.swift`)
2. Show Canvas: `⌥⌘⏎` (Option+Command+Enter)
3. Resume previews: `⌥⌘P`
4. Use `#Preview { ... }` blocks for different variants

### Testing

Run tests using Swift Package Manager:

```bash
cd platforms/apple/swift/ui-swift
swift test
```

Or run tests in Xcode:

1. Open the package in Xcode
2. Press ⌘U to run tests

## Requirements

- macOS 13.0+
- Xcode 15.0+
- Swift 5.9+

## Integration

### Adding to Xcode Project

1. In Xcode, go to File → Add Package Dependencies
2. Enter the local path: `platforms/apple/swift/ui-swift`
3. Add `ChatUISwift` to your target

### Swift Package Manager

Add to your `Package.swift`:

```swift
dependencies: [
    .package(path: "../platforms/apple/swift/ui-swift")
],
targets: [
    .target(
        name: "YourTarget",
        dependencies: ["ChatUISwift"]
    )
]
```

## Architecture

The package follows these principles:

1. **Design Tokens First**: All styling comes from centralized design tokens
2. **Native Behaviors**: Components use native macOS patterns and accessibility
3. **SwiftUI Best Practices**: Proper state management and view composition
4. **Preview-Driven Development**: Comprehensive previews for all components

## Future Enhancements

This is Phase 1 of the Native macOS Bridge implementation. Future phases will add:

- JavaScript Core business logic integration
- MCP tool system integration
- Enhanced build pipeline
- Runtime abstraction layer

## Contributing

## Troubleshooting

### Symptom: Previews do not render

Cause: Xcode package dependencies are stale.
Fix: Use **File → Packages → Reset Package Caches** and rebuild.

When adding new components:

1. Use design tokens for all styling
2. Add comprehensive SwiftUI previews
3. Include accessibility support
4. Add examples to the playground app
5. Write unit tests for core functionality
