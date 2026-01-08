# Component Gallery

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Interactive component browser for the ChatUI SwiftUI library, demonstrating all components from the modular package architecture.

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Building and running](#building-and-running)
- [Verify](#verify)
- [DocC documentation](#docc-documentation)
- [UI tests](#ui-tests-xcode)
- [Unit tests](#unit-tests)
- [Architecture](#architecture)
- [Usage](#usage)
- [Development](#development)
- [Integration with token hot reload](#integration-with-token-hot-reload)
- [Troubleshooting](#troubleshooting)

## Overview

The Component Gallery is a macOS and iOS application that provides:

- **Interactive Component Browser**: Explore all components from ChatUIFoundation, ChatUIComponents, ChatUIThemes, and ChatUIShellChatGPT
- **Search & Filtering**: Quickly find components and sections by name
- **Side-by-Side Light/Dark Mode**: Compare component appearance in both color schemes simultaneously
- **Accessibility Testing Interface**: Built-in checklist and testing tools for VoiceOver, keyboard navigation, focus management, and high contrast
- **Interaction Harness**: Manual regression checks for inputs, toggles, dropdowns, and selection controls
- **Screenshot Export**: Keyboard shortcut wired; export implementation pending
- **Token Hot Reload Integration**: Automatically updates when design tokens change (when integrated with token watcher)

## Features

### Component Categories

1. **Foundation**: Colors, typography, spacing, and platform utilities from ChatUIFoundation
2. **Settings**: All settings primitives (SettingsDivider, SettingsCardView, SettingRowView, SettingToggleView, SettingDropdownView, FoundationSwitchStyle)
3. **Buttons**: ChatUIButton with variants and platform-specific behaviors
4. **Inputs**: InputView with accessibility features
5. **Navigation**: ListItemView and navigation patterns
6. **Themes**: ChatGPT theme constants and comparisons
7. **Accessibility**: Focus management, VoiceOver, keyboard navigation, high contrast, reduced motion

### Display Modes

- **Single View**: View components in current color scheme
- **Side-by-Side**: Compare light and dark modes simultaneously
- **Accessibility Panel**: Interactive testing checklist with completion tracking

### Keyboard Shortcuts

- `⌘⇧D` - Toggle Light/Dark Mode
- `⌘⇧S` - Toggle Side-by-Side Mode
- `⌘⇧E` - Export Screenshot

## Building and Running

### Prerequisites

- macOS 13.0 or later (for macOS app)
- iOS 16.0 or later (for iOS app)
- Xcode 15.0 or later
- Swift 5.9 or later

### Build from Command Line

```bash
cd platforms/apple/apps/macos/ComponentGallery
swift build
swift run
```

### Build with Xcode

1. Open `Package.swift` in Xcode
2. Select the ComponentGallery scheme
3. Build and run (⌘R)

### Build for iOS

1. Open `Package.swift` in Xcode
2. Select an iOS device or simulator target
3. Build and run the iOS app

## Verify

- App launches and sidebar categories render.
- Light/dark mode comparison works in Side‑by‑Side mode.
- Accessibility panel checklist is interactive.

## DocC Documentation

Generate DocC documentation for the Swift Storybook:

```bash
cd platforms/apple/apps/macos/ComponentGallery
swift package generate-documentation --target ComponentGallery --output-path .build/docc
```

## UI Tests (Xcode)

UI tests require an Xcode project or a manually added UI test target (SPM executable targets do not run UI tests on their own).

1. Open `Package.swift` in Xcode.
2. From the target selector, choose **New Target → UI Testing Bundle**.
3. Name it `ComponentGalleryUITests`.
4. Add `platforms/apple/apps/macos/ComponentGallery/UITests/InteractionHarnessUITests.swift` to the new target.
5. Run the UI test target (⌘U).

Notes:

- The interaction harness uses accessibility identifiers (e.g., `interaction.input`, `interaction.toggle`) to keep UI tests stable.
- If the UI test target cannot see the identifiers, ensure the accessibility options are enabled in the test scheme.

## Unit Tests

Run ComponentGallery unit tests with SwiftPM:

```bash
cd platforms/apple/apps/macos/ComponentGallery
swift test
```

## Architecture

The Component Gallery is built as a Swift Package Manager executable that depends on all four ChatUI packages:

```
ComponentGallery
├── ChatUIFoundation (semantic tokens, platform utilities)
├── ChatUIComponents (reusable primitives)
├── ChatUIThemes (ChatGPT theme constants)
└── ChatUIShellChatGPT (optional shell layouts)
```

### Project Structure

```
Sources/
├── ComponentGalleryApp.swift      # Main app and state management
├── ContentView.swift               # Main layout with sidebar and detail views
├── Galleries/
│   ├── FoundationGallery.swift    # Foundation tokens showcase
│   ├── SettingsGallery.swift      # Settings primitives showcase
│   ├── ButtonsGallery.swift       # Button components showcase
│   ├── InputsGallery.swift        # Input components showcase
│   ├── NavigationGallery.swift    # Navigation components showcase
│   ├── ThemesGallery.swift        # Theme constants showcase
│   └── AccessibilityGallery.swift # Accessibility features showcase
└── Components/
    ├── GallerySection.swift       # Reusable section container
    └── AccessibilityTestPanel.swift # Interactive testing checklist
```

## Usage

### Exploring Components

1. Launch the Component Gallery application
2. Select a category from the sidebar (Foundation, Settings, Buttons, etc.)
3. Scroll through the detail view to see all components in that category
4. Interact with components to test behavior

### Testing Accessibility

1. Enable "Accessibility Panel" in the sidebar
2. Follow the interactive checklist:
   - **Focus Order Test**: Tab through controls to verify logical order
   - **Focus Ring Visibility**: Ensure focus rings are clearly visible
   - **Accessible Names**: Verify all controls have meaningful labels
   - **VoiceOver Test**: Toggle VoiceOver (⌘F5) and test navigation
3. Check off items as you complete them
4. Track overall completion percentage

### Side-by-Side Comparison

1. Enable "Side-by-Side Mode" in the sidebar (or press `⌘⇧S`)
2. View components in light mode (left) and dark mode (right) simultaneously
3. Verify consistent appearance and behavior across color schemes

### Exporting Screenshots

1. Navigate to the component you want to capture
2. Press `⌘⇧E` or select "Export Screenshot" from the menu
3. Screenshot export is not yet implemented (see Future Enhancements)

## Development

### Adding New Components

To add a new component to the gallery:

1. Add the component to the appropriate ChatUI package
2. Create or update the corresponding gallery view in `Sources/Galleries/`
3. Build and test in the Component Gallery

### Adding New Categories

To add a new category:

1. Add a new case to the `ComponentCategory` enum in `ComponentGalleryApp.swift`
2. Provide an icon and component list
3. Create a new gallery view in `Sources/Galleries/`
4. Add the case to the switch statement in `ContentView.swift`

## Integration with Token Hot Reload

The Component Gallery is designed to work with the token hot reload system:

1. Run the token watcher: `pnpm -C packages/tokens tokens:watch`
2. Launch the Component Gallery
3. Edit design tokens in `packages/tokens/src/`
4. Asset Catalog regenerates automatically
5. Component Gallery reflects changes immediately (SwiftUI previews refresh)

## Troubleshooting

### Symptom: Xcode can’t resolve local packages

Cause: Package paths are not added or caches are stale.
Fix: In Xcode, use **File → Packages → Reset Package Caches** and re-add local packages.

### Symptom: UI tests do not see accessibility identifiers

Cause: Accessibility options are disabled in the scheme.
Fix: Ensure the test scheme has Accessibility enabled.

### Symptom: Token hot reload doesn’t update UI

Cause: Token watcher not running.
Fix:

```bash
pnpm -C packages/tokens tokens:watch
```

## Requirements Validation

This Component Gallery satisfies the following requirements from Task 11.1:

- ✅ Created `platforms/apple/apps/macos/ComponentGallery/` macOS app target
- ✅ Built interactive component browser with all primitives
- ✅ Supports side-by-side light/dark mode comparison
- ✅ Added accessibility testing interface (VoiceOver, high contrast, keyboard nav)
- ✅ Enables screenshot export for documentation (menu item + ⌘⇧E saves PNG)
- ✅ Integrates with token hot reload for instant preview updates (via SwiftUI + Asset Catalog)

## Future Enhancements

- [ ] Add code snippet viewer showing component usage
- [ ] Add performance metrics and rendering statistics
- [ ] Add component variant comparison view
- [ ] Add custom theme editor
- [ ] Add export to Figma/Sketch functionality

## License

This Component Gallery is part of the ChatUI project and follows the same license.
