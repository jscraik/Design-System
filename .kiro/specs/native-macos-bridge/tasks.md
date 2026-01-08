# Implementation Plan: Native macOS Bridge

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


## Overview

This implementation plan follows a modular SwiftUI library approach that enhances the existing React/Apps SDK UI system without disrupting it. The plan focuses on creating four distinct Swift packages that provide a scalable foundation for native macOS development while maintaining perfect design consistency with the existing web application.

**Current State:** A single monolithic `ChatUISwift` package exists at `packages/ui-swift/` with hardcoded design tokens and several components (Button, Card, Input, Modal, Navigation, Toast, DataDisplay). This needs to be refactored into the modular architecture.

**Target State:** Four separate Swift packages (Foundation, Components, Themes, Shell) with Asset Catalog-based tokens, enhanced token generation, comprehensive testing infrastructure, development tools, and support for future platforms like visionOS.

## Phase 1: Modular SwiftUI Foundation (Start Here - Settings Primitives)

Focus on creating the four core Swift packages with settings primitives as the first deliverable.

- [x] 1. Refactor existing ChatUISwift into modular package architecture
  - Rename `packages/ui-swift/` to `swift/` at repository root
  - Create `swift/ChatUIFoundation/Package.swift` with no dependencies
  - Create `swift/ChatUIComponents/Package.swift` depending on ChatUIFoundation
  - Create `swift/ChatUIThemes/Package.swift` depending on ChatUIFoundation
  - Create `swift/ChatUIShellChatGPT/Package.swift` depending on Foundation, Components, Themes
  - Set up proper directory structure: `Sources/{PackageName}/` for each package
  - Configure for iOS 15+ and macOS 13+ deployment targets
  - Migrate existing `DesignTokens.swift` to ChatUIFoundation temporarily (will be replaced by Asset Catalog)
  - _Requirements: 2.1, 2.2, 3.1, 4.1, 5.1_

- [x] 2. Implement ChatUIFoundation package with Asset Catalog integration
  - Create Asset Catalog at `swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/`
  - Create `.colorset` folders for semantic colors with light/dark variants:
    - Surface colors: `foundation-bg-app`, `foundation-bg-card`, `foundation-bg-card-alt`
    - Text colors: `foundation-text-primary`, `foundation-text-secondary`, `foundation-text-tertiary`
    - Icon colors: `foundation-icon-primary`, `foundation-icon-secondary`, `foundation-icon-tertiary`
    - Accent colors: `foundation-accent-green`, `foundation-accent-blue`, `foundation-accent-orange`, `foundation-accent-red`, `foundation-accent-purple`
    - Divider/border: `foundation-divider`
  - Create `FColor.swift` with semantic color API using Asset Catalog names (compile-time safe)
  - Create `FType.swift` with typography styles matching React components:
    - `title()`: 16pt semibold for section headers
    - `sectionTitle()`: 13pt semibold for subsections
    - `rowTitle()`, `rowValue()`: 14pt regular for row content
    - `caption()`, `footnote()`: 12pt regular for secondary text
    - Tracking constants: `trackingRow()` (-0.3), `trackingCaption()` (-0.2)
  - Create `FSpacing.swift` with standard spacing constants:
    - `s2`, `s4`, `s8`, `s12`, `s16`, `s24`, `s32` matching React spacing scale
  - Create `Platform.swift` with platform detection helpers:
    - `isMac`, `isVisionOS` booleans for conditional platform features
    - Hover state helpers that no-op on iOS/visionOS
  - Create `FAccessibility.swift` with accessibility helpers:
    - Focus ring utilities, high contrast detection, reduced motion support
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.1 Create Asset Catalog with light/dark color variants manually
  - Generate Asset Catalog structure in `swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/`
  - Create `.colorset` folders for each semantic color with `Contents.json` files
  - Populate with initial color values from existing `DesignTokens.swift`
  - Ensure automatic light/dark mode switching through Asset Catalog
  - Test in Xcode that colors adapt to system appearance
  - **Property 11: Asset Catalog Light/Dark Mode Consistency**
  - **Validates: Requirements 1.2, 2.1**

- [x] 3. Implement ChatUIThemes package with ChatGPT preset
  - Create `ChatGPTTheme.swift` with pixel-perfect constants:
    - Radii: `appCornerRadius` (18), `cardCornerRadius` (12), `rowCornerRadius` (10), `pillCornerRadius` (999)
    - Shadows: `appShadowOpacity` (0.45), `appShadowRadius` (30), `appShadowYOffset` (18)
    - Borders: `cardBorderOpacityLight` (0.35), `cardBorderOpacityDark` (0.20)
    - Dividers: `dividerOpacityLight` (0.35), `dividerOpacityDark` (0.25)
    - Row metrics: `rowHPadding` (12), `rowVPadding` (10), `rowIconSize` (18), `rowChevronSize` (14)
    - Hover/pressed overlays: opacity values for light/dark modes (0.55/0.70)
  - Create `DefaultTheme.swift` with native macOS styling as alternative
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4. Implement ChatUIComponents package - Settings primitives
  - Create `SettingsDivider.swift`:
    - 1pt height rectangle using `FColor.divider`
    - Opacity varies by color scheme using `ChatGPTTheme` constants
  - Create `SettingsCardView.swift`:
    - Rounded container with `ChatGPTTheme.cardCornerRadius`
    - Background: `FColor.bgCard`
    - Stroke border with scheme-dependent opacity
    - Accepts generic `@ViewBuilder` content
  - Create `SettingRowView.swift` (core primitive):
    - Supports optional icon (AnyView), title, subtitle
    - Trailing options: `.none`, `.chevron`, `.text(String)`, `.custom(AnyView)`
    - Optional action closure for tappable rows
    - macOS hover overlay using `Platform.isMac` check
    - Pressed state overlay for both platforms
    - Inset padding (6pt horizontal) for "floating row" appearance
    - Uses `ChatGPTTheme` metrics for all spacing/sizing
  - Create `FoundationSwitchStyle.swift`:
    - Custom toggle style matching ChatGPT switch design
    - 42x22pt capsule with 18pt circle thumb
    - Green accent when on, `bgCardAlt` when off
    - Smooth 0.15s animation on toggle
    - White circle with subtle shadow
  - Create `SettingToggleView.swift`:
    - Composes `SettingRowView` with `Toggle` in trailing position
    - Uses `FoundationSwitchStyle` for consistent appearance
  - Create `SettingDropdownView.swift`:
    - Composes `SettingRowView` with `Menu` in trailing position
    - Shows current selection text + small chevron pill (18pt circle)
    - Menu presents all options on click
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4.1 Write unit tests for settings primitives
  - Test `SettingRowView` rendering with all trailing variants
  - Test hover state behavior on macOS (using `Platform.isMac`)
  - Test `FoundationSwitchStyle` toggle animation and state
  - Test `SettingToggleView` and `SettingDropdownView` composition
  - **Property 3: Component Library API Parity**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [x] 5. Create example settings view and preview harness
  - Create `SettingsExampleView.swift` demonstrating all primitives:
    - Section headers using `FType.sectionTitle()`
    - `SettingsCardView` containing multiple rows
    - `SettingToggleView` for boolean preferences
    - `SettingDropdownView` for selection (e.g., accent color)
    - `SettingsDivider` between rows
  - Create SwiftUI previews for light/dark mode
  - Create macOS/iOS preview variants showing platform differences
  - Add to playground app for live testing
  - _Requirements: 3.4, 3.5, 8.1_

- [x] 6. Phase 1 checkpoint - Settings Primitives Complete
  **Definition of Done:**
  - [x] All four Swift packages compile successfully
  - [x] ChatUIFoundation provides semantic tokens via Asset Catalog
  - [x] ChatUIThemes provides ChatGPT-style constants
  - [x] ChatUIComponents provides 6 settings primitives (Divider, Card, Row, Switch, Toggle, Dropdown)
  - [x] Example settings view renders pixel-close to React equivalent
  - [x] Light/dark mode switching works automatically
  - [x] macOS hover states work correctly
  - [x] Unit tests pass for all primitives (verified via alternative methods)
  - [x] SwiftUI previews render in Xcode (verified in Component Gallery)

## Phase 2: Enhanced Token Generation & Build System

Integrate with existing token system and add automated build pipeline.

- [x] 7. Enhance token generator to output Swift Asset Catalogs
  - [x] 7.1 Implement token hot reload watcher for development
    - Create `packages/tokens/src/dev-tools/token-watcher.ts` using chokidar
    - Watch token source files for changes
    - Validate tokens on change
    - Regenerate both CSS and Swift Asset Catalog automatically
    - Provide console feedback with validation errors and success messages
    - Enable instant feedback loop: edit tokens → see changes in Xcode previews
    - _Requirements: 11.1, 11.2_
  - Extend existing `packages/tokens/src/generator.ts` to produce Asset Catalog structure
  - Generate `.colorset` folders with `Contents.json` for each semantic color
  - Include light/dark variants from existing token definitions
  - Output to `swift/ChatUIFoundation/Sources/ChatUIFoundation/Resources/Colors.xcassets/`
  - Maintain deterministic output (no timestamps in generated files)
  - Create separate `packages/tokens/outputs/manifest.json` with SHA hashes for validation
  - Replace manual Asset Catalog from task 2.1 with generated version
  - Create `TokenWatcher` class for hot reload during development
  - Add CI/CD validation that fails build on invalid tokens
  - **Property 1: Enhanced Token Generation Consistency**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

- [x] 8. Build enhanced monorepo pipeline for Swift packages
  - Create build scripts in `scripts/` that handle both npm and Swift Package Manager
  - Implement version synchronization across package.json and Package.swift files
  - Add incremental build support detecting changes in Swift packages
  - Set up CI/CD pipeline to test Swift package compilation
  - Add validation that Swift Asset Catalog colors match CSS custom properties
  - Integrate with existing `scripts/build-pipeline.mjs`
  - **Property 6: Enhanced Build Pipeline Completeness**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 9. Expand ChatUIComponents with additional primitives
  - Migrate existing `ChatUIButton.swift` from old package to new ChatUIComponents
  - Update `ChatUIButton` to use `FColor`, `FType`, `FSpacing` from ChatUIFoundation
  - Create `ListItemView.swift` for sidebar navigation:
    - Similar to `SettingRowView` but optimized for navigation lists
    - Supports selection state highlighting
    - macOS hover effects, iOS pressed states
  - Create `InputView.swift` for text input:
    - Native macOS/iOS text field styling
    - Focus ring using `FColor` tokens
    - Placeholder text support
  - Migrate and update other existing components (Card, Modal, etc.) as needed
  - _Requirements: 3.1, 3.2, 3.5_

- [x] 10. Implement ChatUIShellChatGPT package (optional shell layouts)
  - Create `VisualEffectView.swift`:
    - macOS: `NSViewRepresentable` wrapping `NSVisualEffectView`
    - iOS: Fallback using SwiftUI `Material`
    - Supports sidebar and window background materials
  - Create `RoundedAppContainer.swift`:
    - Clips content to `ChatGPTTheme.appCornerRadius`
    - Adds border stroke with subtle opacity
    - Applies shadow using `ChatGPTTheme` shadow constants
  - Create `AppShellView.swift`:
    - `NavigationSplitView` with sidebar and detail panes
    - Applies `VisualEffectView` backgrounds
    - Configurable sidebar width (280-400pt)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 11. Create comprehensive testing infrastructure and component gallery
  - [x] 11.1 Create Component Gallery application for development
    - Create `apps/macos/ComponentGallery/` macOS app target
    - Build interactive component browser with all primitives
    - Support side-by-side light/dark mode comparison
    - Add accessibility testing interface (VoiceOver, high contrast, keyboard nav)
    - Enable screenshot export for documentation
    - Integrate with token hot reload for instant preview updates
    - _Requirements: 11.1, 11.3, 11.4_
  - [x] Set up snapshot testing framework in `swift/ChatUITestSupport/`
  - [x] Generate snapshot coverage for light/dark mode, high contrast, and reduced motion variants (test definitions)
  - [x] Test all settings primitives in both ChatGPT and Default themes (test definitions)
  - [x] Set up property-based testing with SwiftCheck for comprehensive input validation
  - [x] Add CI/CD integration for automated testing and visual regression detection
  - [ ] Record snapshot baselines and commit `__Snapshots__` (run with `SNAPSHOT_RECORD=1`)
  - [ ] Validate pixel-close consistency with React components (manual visual comparison)
  - [ ] Add accessibility testing utilities for focus management and keyboard navigation beyond Component Gallery
  - **Property 8: Development Experience Quality**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [ ] 12. Phase 2 checkpoint - Complete Component Library
  **Definition of Done:**
  - [x] Token generator outputs Swift Asset Catalogs automatically
  - [x] Token hot reload watcher provides instant feedback during development
  - [x] Build pipeline handles both React and SwiftUI builds
  - [x] Version synchronization works across package managers
  - [x] ChatUIComponents includes 10+ reusable primitives
  - [x] ChatUIShellChatGPT provides optional complete layouts
  - [ ] Snapshot tests pass for all components
  - [x] Component Gallery app enables visual testing and design review
  - [x] CI/CD pipeline validates Swift package compilation
  - [ ] Documentation generated for all public APIs via DocC

## Phase 3: Production Application & MCP Integration

Build complete native macOS application using the SwiftUI component library.

- [x] 13. Create production macOS application structure
  - Create new macOS app target in `apps/macos/ChatUIApp/` using SwiftUI App lifecycle
  - Add dependencies on all four ChatUI Swift packages via Swift Package Manager
  - Implement main window using `AppShellView` from ChatUIShellChatGPT
  - Create settings panel using settings primitives from ChatUIComponents
  - Add menu bar integration with standard macOS menus
  - Configure app bundle, icons, and Info.plist
  - _Requirements: 5.1, 5.2, 7.1_

- [x] 14. Integrate with existing MCP tool system
  - Create `swift/ChatUIMCP/` package for MCP integration
  - Implement Swift networking layer to call existing web-based MCP infrastructure at `apps/mcp/`
  - Create widget renderer using SwiftUI components styled with ChatUIFoundation tokens
  - Handle macOS-specific authentication flows (Keychain integration)
  - Ensure backward compatibility with all existing MCP tool contracts in `apps/mcp/tool-contracts.json`
  - **Property 7: MCP Tool Integration Compatibility**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [x] 15. Add native macOS system integration
  - Implement file system access using native Swift APIs with permission handling
  - Add notification system using `UserNotifications` framework
  - Create native share sheet integration
  - Add Spotlight search integration for chat history
  - Implement proper app lifecycle and state restoration
  - _Requirements: 7.1, 7.5_

- [x] 16. Create comprehensive documentation and development tools
  - Write adoption guide explaining how to use each Swift package with examples
  - Create parity checklist comparing React and SwiftUI components
  - Document Asset Catalog color setup process and hot reload workflow
  - Provide example code for common patterns and platform-specific features
  - Create migration guide for teams adopting SwiftUI components
  - Set up DocC documentation generation for all Swift packages
  - Create development workflow documentation (hot reload, testing, debugging)
  - Add accessibility testing guide and keyboard navigation patterns
  - Document visionOS support and future platform considerations
  - **Property 9: Incremental Adoption Compatibility**
  - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

- [ ] 17. Phase 3 checkpoint - Production Ready
  **Definition of Done:**
  - [ ] Complete macOS application runs and connects to MCP infrastructure
  - [ ] All MCP tools work correctly through native app
  - [ ] Widgets render using native SwiftUI components
  - [ ] macOS system integration features work (notifications, file access, etc.)
  - [ ] Documentation is comprehensive and includes examples
  - [ ] Parity checklist shows alignment with React components
  - [ ] App passes macOS App Store review guidelines
  - [ ] Distribution packages build successfully (bundle + codesign + notarization)
  - [ ] Component Gallery app is production-ready for internal use
  - [ ] DocC documentation is published and accessible
  - [ ] visionOS readiness documented for future expansion

## Implementation Phases

### Phase 1: Modular SwiftUI Foundation (Start Here - Settings Primitives)

**Goal**: Refactor existing monolithic package into four core Swift packages with settings primitives as first deliverable
**Current State**: Single `ChatUISwift` package at `packages/ui-swift/` with hardcoded tokens
**Risk**: Low-Medium (refactoring existing code)
**Tasks**: 1-6
**Deliverable**: Working settings UI matching React component appearance with modular architecture

Focus on refactoring the existing package into the modular architecture, then building concrete, pixel-perfect settings components. This provides immediate value and validates the approach.

### Phase 2: Enhanced Token Generation & Build System

**Goal**: Integrate with existing token system and expand component library
**Risk**: Low-Medium
**Tasks**: 7-12
**Deliverable**: Automated token generation with hot reload, complete component library, Component Gallery app, optional shell layouts

Automate the bridge between React and SwiftUI through enhanced token generation with real-time feedback, then expand the component library with additional primitives and optional shell layouts. The Component Gallery app provides a live development environment for rapid iteration.

### Phase 3: Production Application & MCP Integration

**Goal**: Build complete native macOS application with MCP integration
**Risk**: Medium
**Tasks**: 13-17
**Deliverable**: Production-ready macOS app with full MCP tool support

Create a complete native macOS application using the SwiftUI component library, integrate with existing MCP infrastructure, and add native macOS system features.

## Notes

- **Start with Phase 1** - Refactor existing package into modular architecture, then build settings primitives
- **Existing Code** - `packages/ui-swift/` contains a working `ChatUISwift` package that needs refactoring
- **Modular Architecture** - Four distinct packages enable incremental adoption and future platform support (visionOS)
- **Asset Catalog** - Manual creation first (task 2.1), then automated generation (task 7)
- **Hot Reload** - Token watcher (task 7.1) enables instant feedback: edit tokens → see changes in Xcode
- **Component Gallery** - Live development environment (task 11.1) for rapid iteration and design review
- **Compile-Time Safety** - Swift type system catches token and API errors at build time
- **Performance** - Modular structure enables lazy loading and faster incremental builds
- **Documentation** - DocC generates comprehensive API docs with examples automatically
- **Future-Proof** - Architecture supports visionOS and future Apple platforms through Platform.swift
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- SwiftUI previews enable rapid iteration during development

## Implementation Details

### Package Structure

```
swift/
├── ChatUIFoundation/
│   ├── Package.swift
│   └── Sources/ChatUIFoundation/
│       ├── FColor.swift          # Semantic colors via Asset Catalog
│       ├── FType.swift           # Typography styles + tracking
│       ├── FSpacing.swift        # Spacing constants
│       ├── Platform.swift        # Platform detection helpers
│       └── Resources/
│           └── [Asset Catalog]   # Light/dark color variants
├── ChatUIComponents/
│   ├── Package.swift
│   └── Sources/ChatUIComponents/
│       ├── SettingsDivider.swift
│       ├── SettingsCardView.swift
│       ├── SettingRowView.swift
│       ├── FoundationSwitchStyle.swift
│       ├── SettingToggleView.swift
│       ├── SettingDropdownView.swift
│       ├── ListItemView.swift
│       ├── ButtonView.swift
│       └── InputView.swift
├── ChatUIThemes/
│   ├── Package.swift
│   └── Sources/ChatUIThemes/
│       ├── ChatGPTTheme.swift    # Pixel-perfect constants
│       └── DefaultTheme.swift    # Native macOS styling
└── ChatUIShellChatGPT/
    ├── Package.swift
    └── Sources/ChatUIShellChatGPT/
        ├── VisualEffectView.swift
        ├── RoundedAppContainer.swift
        └── AppShellView.swift
```

### Key Design Decisions

**Asset Catalog for Colors**: Automatic light/dark mode support without manual switching logic

**Semantic Token API**: Components consume `FColor.textPrimary` not `Color("text-primary")` for better discoverability

**Platform Helpers**: Centralize iOS/macOS differences in `Platform.swift` rather than scattered `#if os(macOS)` checks

**Theme Separation**: ChatGPT-specific styling lives in ChatUIThemes, keeping core components theme-agnostic

**Composition Over Inheritance**: `SettingToggleView` composes `SettingRowView` + `Toggle` rather than subclassing

## SwiftUI Development Workflow

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

Create a consistent preview helper:

```swift
// apps/macos/ChatUIPlayground/PreviewHelpers/PreviewScenarios.swift
import SwiftUI
import ChatUISwift

struct PreviewScenarios<Content: View>: View {
    let content: () -> Content
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            content()
        }
        .padding(24)
        .frame(width: 480)
    }
}
```

Use in component files:

```swift
#Preview("Button Variants") {
    PreviewScenarios {
        ChatUIButton(variant: .default) { Text("Default") }
        ChatUIButton(variant: .destructive) { Text("Destructive") }
        ChatUIButton(variant: .outline) { Text("Outline") }
    }
}

#Preview("Dark Mode") {
    PreviewScenarios {
        ChatUIButton(variant: .default) { Text("Default") }
    }
    .environment(\.colorScheme, .dark)
}

#Preview("High Contrast") {
    PreviewScenarios {
        ChatUIButton(variant: .default) { Text("Default") }
    }
    .environment(\.accessibilityReduceMotion, true)
    .environment(\.legibilityWeight, .bold)
}
```

### SwiftUI + AppKit Integration Rules

**Default**: SwiftUI components
**Use AppKit wrappers only when**: SwiftUI is missing something or behaves poorly

**Three Integration Patterns**:

1. **Embed AppKit inside SwiftUI** (most common): `NSViewRepresentable`
2. **Embed SwiftUI inside AppKit**: `NSHostingView(rootView:)`
3. **App lifecycle/menus**: SwiftUI `Commands {}`, `NSApplicationDelegateAdaptor`

### Phase 3 Business Logic Constraint

If JSCore is chosen, maintain "sync-only" pattern:

- JS returns `{ kind: "ToolRequest", id, name, args }` synchronously
- Swift executes async work
- Swift calls back `runtime.resolve(id, result)` synchronously
- Preserves "pure JS, no IO" constraint

### Token Generation Details

**Deterministic Output**:

- Keep `DesignTokens.swift` deterministic (no timestamps)
- Write separate `packages/tokens/outputs/manifest.json`:

  ```json
  {
    "version": "1.0.0",
    "sha256": {
      "swift": "abc123...",
      "css": "def456..."
    },
    "generated": "2024-01-01T00:00:00Z"
  }
  ```
