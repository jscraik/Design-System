# aStudio Swift Modular Architecture

Last updated: 2026-01-07

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

This directory contains the refactored aStudio Swift packages, transformed from a monolithic `ChatUISwift` package into four specialized, modular packages.

## Table of contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Package architecture](#package-architecture)
- [Build verification](#build-verification)
- [Next steps](#next-steps)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- macOS 13+ (for macOS apps)
- Xcode 15+ with Swift 5.9

## Quickstart

### 1) Build all Swift packages

```bash
cd platforms/apple/swift/ChatUIFoundation && swift build
cd ../ChatUIThemes && swift build
cd ../ChatUIComponents && swift build
cd ../ChatUIShellChatGPT && swift build
cd ../ChatUITestSupport && swift build
```

### 2) Run Swift tests (optional)

```bash
pnpm test:swift
```

### 3) Verify visually (optional)

- Open `platforms/apple/apps/macos/ComponentGallery` in Xcode to review components.

## Package Architecture

### 1. ChatUIFoundation (`platforms/apple/swift/ChatUIFoundation/`)

**Purpose**: Semantic design tokens, platform utilities, and accessibility helpers  
**Dependencies**: None (foundation layer)  
**Deployment Targets**: iOS 15+, macOS 13+, visionOS 1+

**Provides**:

- `FColor`: Semantic colors via Asset Catalog with automatic light/dark mode
- `FType`: Typography styles matching React components exactly
- `FSpacing`: Standard spacing constants (s2, s4, s8, s12, s16, s24, s32)
- `Platform`: Platform detection helpers (isMac, isVisionOS, isIOS)
- `FAccessibility`: Accessibility utilities and system preference detection

### 2. ChatUIThemes (`platforms/apple/swift/ChatUIThemes/`)

**Purpose**: Theme presets including pixel-perfect ChatGPT styling  
**Dependencies**: ChatUIFoundation  
**Deployment Targets**: iOS 15+, macOS 13+, visionOS 1+

**Provides**:

- `ChatGPTTheme`: Pixel-perfect constants matching the web application
  - Corner radii: app (18pt), card (12pt), row (10pt), pill (999pt)
  - Shadows: opacity (0.45), radius (30pt), Y offset (18pt)
  - Row metrics: padding, icon sizes, chevron sizes
  - Interaction overlays: hover and pressed state opacities
- `DefaultTheme`: Native macOS design patterns as alternative

### 3. ChatUIComponents (`platforms/apple/swift/ChatUIComponents/`)

**Purpose**: Reusable SwiftUI primitives that mirror React component APIs  
**Dependencies**: ChatUIFoundation, ChatUIThemes  
**Deployment Targets**: iOS 15+, macOS 13+, visionOS 1+

**Provides Settings Primitives** (First Deliverable):

- `SettingsDivider`: 1pt height divider with theme-aware opacity
- `SettingsCardView`: Rounded container with ChatGPT-style background and border
- `SettingRowView`: Core primitive with icon, title, subtitle, and trailing content options
- `FoundationSwitchStyle`: Custom toggle style matching ChatGPT switch design
- `SettingToggleView`: Composes SettingRowView with Toggle in trailing position
- `SettingDropdownView`: Composes SettingRowView with Menu in trailing position
- `ChatUIButton`: Migrated button component using new foundation tokens
- `SettingsExampleView`: Demonstration of all settings primitives

### 4. ChatUIShellChatGPT (`platforms/apple/swift/ChatUIShellChatGPT/`)

**Purpose**: Optional complete application shell layouts  
**Dependencies**: ChatUIFoundation, ChatUIComponents, ChatUIThemes  
**Deployment Targets**: iOS 15+, macOS 13+, visionOS 1+

**Provides**:

- `VisualEffectView`: macOS vibrancy effects with iOS/visionOS fallback
- `RoundedAppContainer`: ChatGPT-style app clipping with borders and shadows
- `AppShellView`: NavigationSplitView-based layout with configurable sidebar width

### 5. ChatUITestSupport (`platforms/apple/swift/ChatUITestSupport/`)

**Purpose**: Shared test utilities and mocks for Swift package testing  
**Dependencies**: ChatUIFoundation  
**Deployment Targets**: iOS 15+, macOS 13+

## Asset Catalog Integration

ChatUIFoundation includes a complete Asset Catalog at:

```
platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/
```

**Color Sets Created**:

- Surface colors: `foundation-bg-app`, `foundation-bg-card`, `foundation-bg-card-alt`
- Text colors: `foundation-text-primary`, `foundation-text-secondary`, `foundation-text-tertiary`
- Icon colors: `foundation-icon-primary`, `foundation-icon-secondary`, `foundation-icon-tertiary`
- Accent colors: `foundation-accent-green`, `foundation-accent-blue`, `foundation-accent-orange`, `foundation-accent-red`, `foundation-accent-purple`
- Divider/border: `foundation-divider`

All colors automatically support light/dark mode and high contrast through Asset Catalog configuration.

## Build Verification

```bash
cd platforms/apple/swift/ChatUIFoundation && swift build
cd ../ChatUIThemes && swift build
cd ../ChatUIComponents && swift build
cd ../ChatUIShellChatGPT && swift build
```

## Key Architectural Decisions

1. **Asset Catalog for Colors**: Automatic light/dark mode support without manual switching logic
2. **Semantic Token API**: Components consume `FColor.textPrimary` not `Color("text-primary")` for better discoverability
3. **Platform Helpers**: Centralize iOS/macOS differences in `Platform.swift` rather than scattered `#if os(macOS)` checks
4. **Theme Separation**: ChatGPT-specific styling lives in ChatUIThemes, keeping core components theme-agnostic
5. **Composition Over Inheritance**: `SettingToggleView` composes `SettingRowView` + `Toggle` rather than subclassing

## Migration from Monolithic Package

The original monolithic package at `platforms/apple/swift/ui-swift/` has been:

1. **Moved** to `platforms/apple/swift/ui-swift/` (preserved for reference)
2. **Refactored** into four specialized packages with clear separation of concerns
3. **Enhanced** with Asset Catalog-based tokens for automatic light/dark mode
4. **Modernized** with platform detection helpers and accessibility utilities
5. **Tested** with comprehensive unit tests for each package

## Next Steps

- Follow `platforms/apple/swift/DEVELOPMENT_WORKFLOW.md` for hot reload and test workflows.
- Use `platforms/apple/apps/macos/ComponentGallery` for live component review.
- See `docs/SWIFT_INTEGRATION.md` for app integration details.

## Troubleshooting

### Symptom: `swift test` fails due to missing XCTest

Cause: SwiftPM is using the wrong toolchain or Xcode is not selected.
Fix:

```bash
xcode-select -p
```

Then ensure Xcode 15+ is selected in Xcode Settings → Locations.

### Symptom: Colors are missing in SwiftUI previews

Cause: Asset Catalog resources not loaded.
Fix: Ensure `ChatUIFoundation` includes `Resources/Colors.xcassets` and rebuild the package.

## Requirements Fulfilled

This refactoring fulfills **Requirements 2.1, 2.2, 3.1, 4.1, 5.1** from the specification:

- ✅ **2.1**: Modular SwiftUI foundation with semantic color API and Asset Catalog integration
- ✅ **2.2**: Typography styles, spacing constants, and platform utilities matching React behavior
- ✅ **3.1**: Reusable SwiftUI components with modular packaging and familiar APIs
- ✅ **4.1**: Theme presets with pixel-perfect ChatGPT styling separated from core components
- ✅ **5.1**: Optional application shell layouts that remain completely optional

The modular architecture provides a scalable foundation for native iOS, macOS, and visionOS development with perfect design consistency across platforms.
