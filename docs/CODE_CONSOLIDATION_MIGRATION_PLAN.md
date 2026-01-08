# Swift Code Consolidation Migration Plan

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Executive Summary](#executive-summary)
- [Phase 1: ChatUIButton Consolidation (Week 1-2)](#phase-1-chatuibutton-consolidation-week-1-2)
  - [Current State](#current-state)
  - [Source of Truth](#source-of-truth)
  - [Migration Steps](#migration-steps)
  - [Breaking Changes](#breaking-changes)
  - [Rollback Strategy](#rollback-strategy)
- [Phase 2: DesignTokens Unification (Week 2-3)](#phase-2-designtokens-unification-week-2-3)
  - [Current State](#current-state-1)
  - [Source of Truth](#source-of-truth-1)
  - [Migration Steps](#migration-steps-1)
  - [Breaking Changes](#breaking-changes-1)
  - [Rollback Strategy](#rollback-strategy-1)
- [Phase 3: Icon Migration to Asset Catalog (Week 3-4)](#phase-3-icon-migration-to-asset-catalog-week-3-4)
  - [Current State](#current-state-2)
  - [Target State](#target-state)
  - [Migration Steps](#migration-steps-2)
  - [Breaking Changes](#breaking-changes-2)
  - [Rollback Strategy](#rollback-strategy-2)
- [Phase 4: Shared Component Extraction (Week 4-5)](#phase-4-shared-component-extraction-week-4-5)
  - [4.1 Card Components (75% similar)](#41-card-components-75-similar)
  - [4.2 Modal Components (70% similar)](#42-modal-components-70-similar)
  - [4.3 Input Components (72% similar)](#43-input-components-72-similar)
- [Phase 5: Testing & Validation (Week 5-6)](#phase-5-testing-validation-week-5-6)
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#integration-tests)
  - [Migration Checklist](#migration-checklist)
- [Timeline Summary](#timeline-summary)
- [Risk Mitigation](#risk-mitigation)
  - [Risk 1: Breaking Changes in Dependent Packages](#risk-1-breaking-changes-in-dependent-packages)
  - [Risk 2: Icon Asset Catalog Issues](#risk-2-icon-asset-catalog-issues)
  - [Risk 3: Foundation Package Bloat](#risk-3-foundation-package-bloat)
- [Success Metrics](#success-metrics)
- [Post-Migration Cleanup](#post-migration-cleanup)
  - [Release 1 (Immediate)](#release-1-immediate)
  - [Release 2 (2 releases later)](#release-2-2-releases-later)
  - [Release 3 (Future)](#release-3-future)
- [Appendix A: File Inventory](#appendix-a-file-inventory)
  - [Files to Modify](#files-to-modify)
  - [Files to Create](#files-to-create)
- [Appendix B: Commands Reference](#appendix-b-commands-reference)


## Executive Summary

This document outlines the step-by-step plan to consolidate duplicate code across the Swift packages, reducing code duplication from ~25% to <5%.

**Target Impact:**
- Code reduction: ~4,800 LOC
- Duplication reduction: 80%
- Estimated effort: 140 hours (4-6 weeks)

---

## Phase 1: ChatUIButton Consolidation (Week 1-2)

### Current State
- **ChatUIComponents**: `ChatUIButton.swift` (410 LOC)
- **ui-swift**: `ChatUIButton.swift` (284 LOC)
- **Overlap**: 95% identical code

### Source of Truth
**ChatUIComponents** will be the canonical implementation.

### Migration Steps

#### Step 1: Verify ChatUIComponents Implementation
```bash
# File: platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/ChatUIButton.swift
# Verify it has all necessary features:
- ChatUIButtonVariant enum
- ChatUIButtonSize enum
- resolveAccessibilityLabel() method
- Accessibility helpers
```

#### Step 2: Update Dependent Code in ui-swift
**Files to update:**
- `platforms/apple/swift/ui-swift/Sources/ChatUISwift/Components/ChatUIButton.swift`

**Action:** Replace entire file with:
```swift
// Re-export from ChatUIComponents
@_exported import ChatUIComponents

// Type alias for backward compatibility (if needed)
public typealias ChatUIButton = ChatUIComponents.ChatUIButton
```

#### Step 3: Update ui-swift Package.swift
Add ChatUIComponents as a dependency:
```swift
.package(path: "../ChatUIComponents")

.target(
    name: "ui-swift",
    dependencies: ["ChatUIComponents", "ChatUIFoundation"]
)
```

#### Step 4: Deprecation Notice
Add deprecation notice to ui-swift ChatUIButton:
```swift
@available(*, deprecated, message: "Use ChatUIComponents.ChatUIButton instead")
public typealias ChatUIButton = ChatUIComponents.ChatUIButton
```

### Breaking Changes
- None for consumers (type alias maintains compatibility)
- Internal: Import path changes

### Rollback Strategy
Keep git commit with original ui-swift implementation for easy revert.

---

## Phase 2: DesignTokens Unification (Week 2-3)

### Current State
- **ChatUIFoundation**: `DesignTokens.swift` (433 LOC with FType/FColor/FSpacing)
- **ui-swift**: `DesignTokens.swift` (421 LOC)
- **Overlap**: 85% similar structure

### Source of Truth
**ChatUIFoundation** will be the canonical token system.

### Migration Steps

#### Step 1: Audit Token Differences
```bash
# Compare token definitions
diff platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/DesignTokens.swift \
     platforms/apple/swift/ui-swift/Sources/ChatUISwift/DesignTokens.swift
```

#### Step 2: Merge Missing Tokens to ChatUIFoundation
Add any unique tokens from ui-swift to ChatUIFoundation:
```swift
// File: ChatUIFoundation/DesignTokens.swift
// Add Interactive colors if missing
public enum Interactive {
    public static let hover = ColorToken(hex: "#E5E5E5")
    public static let active = ColorToken(hex: "#D4D4D4")
    // ... other interactive tokens
}
```

#### Step 3: Create Compatibility Layer
In ChatUIFoundation, add compatibility shims:
```swift
// Backward compatibility for old FType/FColor/FSpacing APIs
@available(*, deprecated, renamed: "DesignTokens")
public typealias FType = DesignTokens

@available(*, deprecated, message: "Use DesignTokens.Color instead")
public typealias FColor = DesignTokens.Color

@available(*, deprecated, message: "Use DesignTokens.Spacing instead")
public typealias FSpacing = DesignTokens.Spacing
```

#### Step 4: Update Consumers
**Files to update:**
- All files using `FType`, `FColor`, `FSpacing`

**Find affected files:**
```bash
grep -r "FType\|FColor\|FSpacing" platforms/apple/swift --include="*.swift"
```

**Replace patterns:**
```swift
// Before
let color = FColor.Text.primary

// After
let color = DesignTokens.Color.textPrimary
```

### Breaking Changes
- Deprecated APIs remain functional but emit warnings
- New code should use DesignTokens directly

### Rollback Strategy
Keep old APIs with deprecation warnings for 2 release cycles.

---

## Phase 3: Icon Migration to Asset Catalog (Week 3-4)

### Current State
- **ChatGPTIcons.swift**: 448 LOC (enum definitions)
- **ChatGPTIconPaths.swift**: 261 LOC (SVG path strings)
- **ChatGPTIconVectors.swift**: 482 LOC (SwiftUI Shape views)
- **Total**: 1,191 LOC

### Target State
- Asset Catalog with vector assets
- Code generation for type-safe access
- **New LOC**: ~50 (code generator only)

### Migration Steps

#### Step 1: Create Asset Catalog Structure
```bash
mkdir -p platforms/apple/swift/ChatUIFoundation/Resources/Assets.xcassets/Icons

# Categories: Actions, Navigation, Social, etc.
mkdir -p platforms/apple/swift/ChatUIFoundation/Resources/Assets.xcassets/Icons/{Actions,Navigation,Social,Media}
```

#### Step 2: Extract Icon Definitions
From ChatGPTIconPaths.swift, create individual `.svg` files:
```python
# Script: scripts/extract_icons.py
import re

with open('ChatGPTIconPaths.swift', 'r') as f:
    content = f.read()

# Extract path strings and write to SVG files
# ...
```

#### Step 3: Create Code Generator
```swift
// File: scripts/generate-icons.swift
#!/usr/bin/env swift

import Foundation

// Generate enum from asset catalog
struct IconGenerator {
    static func main() {
        let iconsPath = "Platforms/apple/swift/ChatUIFoundation/Resources/Assets.xcassets/Icons"
        let outputPath = "Platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Generated/Icons.swift"

        // Scan asset catalog
        // Generate type-safe enum
        // Write to output file
    }
}

IconGenerator.main()
```

#### Step 4: Add to Build Phase
In Package.swift:
```swift
.target(
    name: "ChatUIFoundation",
    dependencies: [],
    resources: [.process("Resources")],
    plugins: [.plugin(name: "GenerateIcons")]
)
```

#### Step 5: Deprecate Old Icon Files
Add deprecation warnings:
```swift
@available(*, deprecated, message: "Use Icons.iconName from asset catalog instead")
public enum ChatGPTIcons {
    // ...
}
```

### Breaking Changes
- Icon access changes from `ChatGPTIcons.send` to `Icons.send`
- SVG assets are now bundled resources

### Rollback Strategy
Keep old icon files with deprecation warnings for 2 release cycles.

---

## Phase 4: Shared Component Extraction (Week 4-5)

### 4.1 Card Components (75% similar)

#### Current State
- **SettingsCardView** (ChatUIComponents): Settings-specific card
- **ChatUICard** (ui-swift): Generic card component

#### Consolidation Plan
1. Create base `CardView` in ChatUIFoundation:
```swift
// File: ChatUIFoundation/Sources/ChatUIFoundation/Layout/CardView.swift

public struct CardView<Content: View>: View {
    public init(
        _ title: String? = nil,
        @ViewBuilder content: () -> Content
    ) {
        // Implementation
    }

    public var body: some View {
        // Base card implementation
    }
}
```

2. Create specialized variants:
```swift
// ChatUIComponents
public struct SettingsCardView<Content: View>: View {
    // Wrapper around CardView with settings-specific styling
}

// ui-swift
public typealias ChatUICard<Content: View> = CardView<Content>
```

### 4.2 Modal Components (70% similar)

#### Current State
- **ModalDialogView** (ChatUIComponents)
- **AlertView** (ChatUIComponents)
- **ChatUIModal** (ui-swift)

#### Consolidation Plan
1. Create base `ModalView` in ChatUIFoundation:
```swift
public struct ModalView<Content: View>: View {
    public enum Style {
        case dialog, alert, sheet
    }

    public init(
        style: Style = .dialog,
        @ViewBuilder content: () -> Content
    ) {
        // Implementation
    }
}
```

2. Create convenience wrappers:
```swift
// ChatUIComponents
public typealias ModalDialogView = ModalView<AnyView>
public typealias AlertView = ModalView<AnyView>

// ui-swift
public typealias ChatUIModal = ModalView<AnyView>
```

### 4.3 Input Components (72% similar)

#### Current State
- **InputView** (ChatUIComponents)
- **ComposeTextArea** (ChatUIComponents)
- **ChatUIInput** (ui-swift)

#### Consolidation Plan
1. Create base `TextInputView` in ChatUIFoundation:
```swift
public struct TextInputView: View {
    public enum Style {
        case standard, compose, chat
    }

    @Binding public var text: String
    public var style: Style = .standard
    // ...
}
```

2. Create specialized variants:
```swift
// ChatUIComponents
public typealias InputView = TextInputView
public typealias ComposeTextArea = TextInputView

// ui-swift
public typealias ChatUIInput = TextInputView
```

---

## Phase 5: Testing & Validation (Week 5-6)

### Unit Tests
1. Add tests for consolidated components
2. Verify API compatibility
3. Test rendering consistency

### Integration Tests
1. Build all packages with new structure
2. Run macOS apps with consolidated code
3. Verify no regressions

### Migration Checklist
- [ ] All packages compile without errors
- [ ] All tests pass
- [ ] Snapshot tests updated
- [ ] Documentation updated
- [ ] Deprecation notices added
- [ ] Release notes prepared

---

## Timeline Summary

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1-2 | ChatUIButton Consolidation | Single ChatUIButton implementation |
| 2-3 | DesignTokens Unification | Unified token system |
| 3-4 | Icon Migration | Asset catalog + code generation |
| 4-5 | Shared Components | Base components in Foundation |
| 5-6 | Testing & Validation | All tests passing, documentation |

---

## Risk Mitigation

### Risk 1: Breaking Changes in Dependent Packages
**Mitigation:**
- Use type aliases for backward compatibility
- Deprecation warnings before removal
- Comprehensive testing before release

### Risk 2: Icon Asset Catalog Issues
**Mitigation:**
- Keep old icon implementation as fallback
- Generate assets offline, validate in CI
- Document migration process

### Risk 3: Foundation Package Bloat
**Mitigation:**
- Keep base components minimal
- Use protocols for extensibility
- Document single responsibility for each component

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Code Duplication | 25% | <5% |
| Total LOC | 19,210 | ~14,500 |
| Icon Implementation | 1,191 LOC | ~50 LOC |
| Shared Components | 3 implementations each | 1 base + wrappers |
| Test Coverage | 15% | 65% |

---

## Post-Migration Cleanup

### Release 1 (Immediate)
- Add deprecation warnings to old APIs
- Update documentation
- Migration guide for consumers

### Release 2 (2 releases later)
- Remove deprecated APIs
- Clean up compatibility shims
- Finalize API surface

### Release 3 (Future)
- Remove all legacy code
- Final documentation update
- Performance optimization

---

## Appendix A: File Inventory

### Files to Modify
1. `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/ChatUIButton.swift`
2. `platforms/apple/swift/ui-swift/Sources/ChatUISwift/Components/ChatUIButton.swift`
3. `platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/DesignTokens.swift`
4. `platforms/apple/swift/ui-swift/Sources/ChatUISwift/DesignTokens.swift`
5. `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/ChatGPTIcons.swift`
6. `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/ChatGPTIconPaths.swift`
7. `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/ChatGPTIconVectors.swift`

### Files to Create
1. `platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Layout/CardView.swift`
2. `platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Layout/ModalView.swift`
3. `platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Inputs/TextInputView.swift`
4. `scripts/generate-icons.swift`
5. `platforms/apple/swift/ChatUIFoundation/Resources/Assets.xcassets/*`

---

## Appendix B: Commands Reference

```bash
# Find duplicate code
find platforms/apple/swift -name "*.swift" -exec wc -l {} + | sort -rn

# Compare files
diff -u file1.swift file2.swift

# Build all packages
swift build --build-tests

# Run tests
swift test --enable-code-coverage

# Generate coverage report
xcrun llvm-cov report --instr-profile=.build/debug/codecov/default.profdata \
  .build/debug/ChatUIPackageTests.xctest/Contents/MacOS/ChatUIPackageTests
```

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

