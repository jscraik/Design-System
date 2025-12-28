# Swift Integration Guide

This guide explains how to work with the ChatUISwift package and playground app for native macOS development.

## Quick Start

### 1. Open the Playground App

The fastest way to see SwiftUI components in action:

```bash
# From project root
open apps/macos/ChatUIPlayground/ChatUIPlayground.xcodeproj
```

Or use the build script:

```bash
cd packages/ui-swift
./build.sh playground
```

### 2. Build and Run

In Xcode:

1. Select the ChatUIPlayground scheme
2. Press ⌘R to build and run
3. Browse components in the sidebar
4. Interact with live examples

### 3. SwiftUI Previews

For component development:

1. Open any component file (e.g., `ChatUIButton.swift`)
2. Show Canvas: `⌥⌘⏎` (Option+Command+Enter)
3. Resume previews: `⌥⌘P`
4. See live previews of all variants

## Project Structure

```
packages/ui-swift/                    # Swift Package
├── Package.swift                     # Package manifest
├── Sources/ChatUISwift/              # Source code
│   ├── DesignTokens.swift           # Design token constants
│   ├── Components/                   # SwiftUI components
│   │   ├── ChatUIButton.swift       # Button component
│   │   ├── ChatUIInput.swift        # Input component
│   │   └── ChatUICard.swift         # Card component
│   └── ChatUISwift.swift            # Main module file
├── Tests/ChatUISwiftTests/           # Unit tests
└── README.md                         # Package documentation

apps/macos/ChatUIPlayground/          # Playground App
├── ChatUIPlayground.xcodeproj/       # Xcode project
└── ChatUIPlayground/                 # App source
    ├── ChatUIPlaygroundApp.swift    # App entry point
    ├── ContentView.swift             # Main view
    ├── ComponentGallery.swift        # Component examples
    └── PreviewScenarios.swift        # Preview helpers
```

## Development Workflow

### Two Fast Development Loops

**SwiftUI Previews** (best for components):

- Open component file (e.g., `ChatUIButton.swift`)
- Show Canvas: `⌥⌘⏎` (Option+Command+Enter)
- Resume previews: `⌥⌘P`
- Use `#Preview { ... }` blocks for variants

**Playground App** (best for interactions):

- Run: `⌘R`
- Build only: `⌘B`
- Test keyboard focus, menus, dialogs, real window behavior

### Standard Preview Pattern

Create consistent preview helpers:

```swift
#Preview("Button Variants") {
    SimplePreviewScenarios {
        ChatUIButton("Default") { }
        ChatUIButton("Destructive", variant: .destructive) { }
        ChatUIButton("Outline", variant: .outline) { }
    }
}

#Preview("Dark Mode") {
    SimplePreviewScenarios {
        ChatUIButton("Default Button") { }
    }
    .environment(\.colorScheme, .dark)
}
```

## Design Tokens

All components use design tokens that match the React implementation:

### Colors

```swift
// Background colors (adapt to light/dark mode)
DesignTokens.Colors.Background.primary
DesignTokens.Colors.Background.secondary
DesignTokens.Colors.Background.tertiary

// Text colors
DesignTokens.Colors.Text.primary
DesignTokens.Colors.Text.secondary
DesignTokens.Colors.Text.tertiary

// Accent colors
DesignTokens.Colors.Accent.blue
DesignTokens.Colors.Accent.red
DesignTokens.Colors.Accent.green
```

### Typography

```swift
// Font sizes and weights
DesignTokens.Typography.Heading1.size
DesignTokens.Typography.Heading1.weight
DesignTokens.Typography.Body.size
DesignTokens.Typography.Body.weight
```

### Spacing

```swift
// Spacing scale
DesignTokens.Spacing.xs    // 8pt
DesignTokens.Spacing.sm    // 16pt
DesignTokens.Spacing.md    // 32pt
DesignTokens.Spacing.lg    // 48pt
```

## Component Usage

### ChatUIButton

```swift
// Basic usage
ChatUIButton("Click Me") {
    print("Button tapped!")
}

// With variants and sizes
ChatUIButton("Delete", variant: .destructive, size: .sm) {
    // Handle delete
}

// Icon button
ChatUIButton(systemName: "heart.fill", size: .icon) {
    // Handle favorite
}
```

### ChatUIInput

```swift
@State private var text = ""

// Basic input
ChatUIInput(
    text: $text,
    placeholder: "Enter text..."
)

// Search input
ChatUIInput(
    text: $text,
    placeholder: "Search...",
    variant: .search
)

// With submit handler
ChatUIInput(
    text: $text,
    placeholder: "Message"
) {
    // Handle submit
    print("Submitted: \(text)")
}
```

### ChatUICard

```swift
// Basic card
ChatUICard {
    VStack {
        Text("Card Title")
            .font(.headline)
        Text("Card content goes here")
    }
}

// Elevated card with shadow
ChatUICard(variant: .elevated) {
    // Content
}
```

## Testing

### Running Tests

```bash
# Using build script
cd packages/ui-swift
./build.sh test

# Using Swift Package Manager
swift test

# In Xcode
# Press ⌘U to run tests
```

### Writing Tests

```swift
import XCTest
@testable import ChatUISwift

final class MyComponentTests: XCTestCase {
    func testComponentCreation() {
        // Test component initialization
        XCTAssertNoThrow(ChatUIButton("Test") { })
    }
}
```

## Build Commands

The `packages/ui-swift/build.sh` script provides common tasks:

```bash
./build.sh build      # Build the package
./build.sh test       # Run tests
./build.sh clean      # Clean build artifacts
./build.sh playground # Open playground app
./build.sh package    # Open package in Xcode
./build.sh help       # Show help
```

## Accessibility

All components include built-in accessibility support:

- **VoiceOver**: Proper labels and roles
- **Keyboard Navigation**: Full keyboard support
- **Dynamic Type**: Respects system text size
- **High Contrast**: Adapts to accessibility settings
- **Reduced Motion**: Respects motion preferences

### Testing Accessibility

1. **VoiceOver**: Press ⌘F5 to enable VoiceOver
2. **Keyboard Navigation**: Use Tab/Shift-Tab to navigate
3. **Dynamic Type**: Test with larger text sizes
4. **High Contrast**: Enable in System Preferences

## Troubleshooting

### Common Issues

**Package not found in Xcode:**

- Ensure the package path is correct: `../../../packages/ui-swift`
- Try cleaning and rebuilding: `⌘⇧K` then `⌘B`

**Previews not working:**

- Resume previews: `⌥⌘P`
- Try restarting Xcode
- Check for compilation errors

**Build errors:**

- Clean build folder: `⌘⇧K`
- Check Swift version compatibility
- Ensure macOS 13.0+ deployment target

### Getting Help

1. Check the package README: `packages/ui-swift/README.md`
2. Look at component examples in the playground app
3. Review SwiftUI preview examples in component files
4. Run tests to verify package integrity

## Next Steps

This is Phase 1 of the Native macOS Bridge. Future phases will add:

1. **Token Generation System**: Automated generation from source tokens
2. **JavaScript Core Integration**: Shared business logic
3. **MCP Tool Integration**: Native tool execution
4. **Enhanced Build Pipeline**: Cross-platform builds

For now, focus on:

- Building SwiftUI components with design tokens
- Creating comprehensive previews
- Testing accessibility and native behaviors
- Expanding the component library
