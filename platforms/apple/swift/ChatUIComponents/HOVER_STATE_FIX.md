# macOS Hover State Fix

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Issue](#issue)
- [Root Cause](#root-cause)
- [Solution](#solution)
  - [Before (Incorrect Order)](#before-incorrect-order)
  - [After (Correct Order)](#after-correct-order)
- [Implementation Details](#implementation-details)
  - [SettingRowView](#settingrowview)
  - [ListItemView](#listitemview)
  - [Platform Detection](#platform-detection)
- [Testing](#testing)
  - [Manual Testing](#manual-testing)
  - [Automated Testing](#automated-testing)
- [Verification](#verification)
- [Related Files](#related-files)
- [Design Validation](#design-validation)
- [Future Considerations](#future-considerations)


## Issue

The hover states in `SettingRowView` were not working correctly on macOS because the `.onHover` modifier was placed after `.background()` and `.clipShape()` modifiers. This caused the hover detection to not properly trigger the state changes.

## Root Cause

In SwiftUI, modifier order matters. When `.onHover` is applied after `.background()` and `.clipShape()`, the hover detection area may not properly cover the entire view, especially when combined with padding and clipping.

## Solution

Reordered the view modifiers in `SettingRowView` to place `.onHover` before `.background()` and `.clipShape()`:

### Before (Incorrect Order)

```swift
public var body: some View {
    Group {
        // ... content
    }
    .background(rowBackground)
    .clipShape(RoundedRectangle(...))
    .padding(.horizontal, 6)
    .onHover { isHovering in  // ❌ Applied too late
        if Platform.isMac {
            self.isHovering = isHovering
        }
    }
}
```

### After (Correct Order)

```swift
public var body: some View {
    Group {
        // ... content
    }
    .onHover { isHovering in  // ✅ Applied early
        if Platform.isMac {
            self.isHovering = isHovering
        }
    }
    .background(rowBackground)
    .clipShape(RoundedRectangle(...))
    .padding(.horizontal, 6)
}
```

## Implementation Details

### SettingRowView

- Fixed modifier order to place `.onHover` before `.background()`
- Hover state properly updates `isHovering` state variable
- Background responds to `isHovering` state with appropriate overlay

### ListItemView

- Already had correct modifier order (no changes needed)
- Hover state works correctly with selection state

### Platform Detection

- Uses `Platform.isMac` to conditionally apply hover behavior
- Only macOS shows hover effects (iOS and visionOS do not)
- Hover overlay uses `ChatGPTTheme.hoverOverlayOpacityLight/Dark` constants

## Testing

### Manual Testing

1. Build Component Gallery: `swift build` in `platforms/apple/apps/macos/ComponentGallery`
2. Run the app and hover over setting rows
3. Verify hover overlay appears with correct opacity
4. Test in both light and dark modes

### Automated Testing

- Added hover state tests in `ChatUIComponentsTests.swift`
- Tests verify `Platform.isMac` returns true on macOS
- Tests verify components can be created with hover support

## Verification

All Swift packages build successfully:

- ✅ ChatUIFoundation
- ✅ ChatUIComponents
- ✅ ChatUIThemes
- ✅ ComponentGallery

## Related Files

- `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/SettingRowView.swift` - Fixed
- `platforms/apple/swift/ChatUIComponents/Sources/ChatUIComponents/ListItemView.swift` - Already correct
- `platforms/apple/swift/ChatUIFoundation/Sources/ChatUIFoundation/Platform.swift` - Platform detection
- `platforms/apple/swift/ChatUIThemes/Sources/ChatUIThemes/ChatGPTTheme.swift` - Hover opacity constants
- `platforms/apple/swift/ChatUIComponents/Tests/ChatUIComponentsTests/ChatUIComponentsTests.swift` - Tests added

## Design Validation

This fix ensures compliance with:

- **Property 12: Platform-Specific Behavior Adaptation** - Hover states work correctly on macOS
- **Requirement 2.3**: Platform utilities centralize iOS/macOS/visionOS conditional logic
- **Requirement 3.3**: Components handle platform-specific interactions appropriately

## Future Considerations

- Consider adding visual regression tests for hover states
- Document hover state behavior in component documentation
- Add SwiftUI preview examples showing hover states
