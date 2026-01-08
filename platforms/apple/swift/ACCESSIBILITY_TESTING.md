# Accessibility Testing Guide

Last updated: 2026-01-04

## Doc requirements
- Audience: Operators and maintainers
- Scope: Operational steps and verification
- Non-scope: Long-form design history
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)


Complete guide for testing and ensuring accessibility compliance in ChatUI Swift applications.

## Table of Contents

1. [Overview](#overview)
2. [Accessibility Requirements](#accessibility-requirements)
3. [Testing Tools](#testing-tools)
4. [VoiceOver Testing](#voiceover-testing)
5. [Keyboard Navigation](#keyboard-navigation)
6. [Visual Accessibility](#visual-accessibility)
7. [Testing Checklist](#testing-checklist)
8. [Common Issues](#common-issues)

## Overview

Accessibility ensures your application is usable by everyone, including people with disabilities. ChatUI Swift components include built-in accessibility support, but proper testing is essential.

### Why Accessibility Matters

- **Legal Compliance**: Many jurisdictions require accessibility
- **Wider Audience**: 15% of the world's population has some form of disability
- **Better UX**: Accessibility improvements benefit all users
- **App Store Requirements**: Apple requires accessibility for App Store approval

### Accessibility Principles

1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: Interface components must be operable by all users
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must be robust enough to work with assistive technologies

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

ChatUI Swift components aim for WCAG 2.1 Level AA compliance:

**Perceivable:**

- Text alternatives for non-text content
- Captions and alternatives for multimedia
- Content can be presented in different ways
- Sufficient color contrast

**Operable:**

- All functionality available from keyboard
- Users have enough time to read and use content
- Content doesn't cause seizures
- Users can navigate and find content

**Understandable:**

- Text is readable and understandable
- Content appears and operates in predictable ways
- Users are helped to avoid and correct mistakes

**Robust:**

- Content is compatible with assistive technologies

### Platform-Specific Requirements

**macOS:**

- Full keyboard navigation support
- VoiceOver compatibility
- High contrast mode support
- Reduced motion support

**iOS:**

- VoiceOver compatibility
- Dynamic Type support
- Reduce Motion support
- Voice Control compatibility

**visionOS:**

- Spatial audio cues
- Eye tracking support
- Voice Control compatibility

## Testing Tools

### Xcode Accessibility Inspector

**Location:** Xcode → Open Developer Tool → Accessibility Inspector

**Features:**

- Audit accessibility issues
- Inspect element properties
- Test VoiceOver behavior
- Check contrast ratios

**Usage:**

1. Run app in simulator
2. Open Accessibility Inspector
3. Select simulator from dropdown
4. Click "Audit" button
5. Review and fix issues

### VoiceOver

**macOS:**

- Enable: `⌘F5`
- Navigate: `⌃⌥→` (next), `⌃⌥←` (previous)
- Activate: `⌃⌥Space`
- Rotor: `⌃⌥U`

**iOS Simulator:**

- Enable: Settings → Accessibility → VoiceOver
- Navigate: Swipe right/left
- Activate: Double tap
- Rotor: Rotate two fingers

### Keyboard Navigation

**macOS:**

- Tab: Move to next focusable element
- Shift+Tab: Move to previous focusable element
- Space: Activate button/toggle
- Return: Activate default button
- Arrow keys: Navigate within controls

### Accessibility Shortcuts

**macOS:**

- `⌘⌥F5`: Toggle VoiceOver
- `⌃⌥⌘8`: Toggle zoom
- `⌃⌥⌘,`: Toggle high contrast

**iOS:**

- Triple-click side button: Accessibility shortcut
- Settings → Accessibility → Accessibility Shortcut

## VoiceOver Testing

### Basic VoiceOver Test

1. **Enable VoiceOver:**

   ```
   macOS: ⌘F5
   iOS: Settings → Accessibility → VoiceOver
   ```

2. **Navigate Through App:**
   - Use VoiceOver commands to navigate
   - Listen to what VoiceOver announces
   - Verify all elements are accessible

3. **Check Announcements:**
   - Element type announced correctly?
   - Label descriptive and concise?
   - Hint provides additional context?
   - State changes announced?

### VoiceOver Labels

**Good Labels:**

```swift
Button("Save") {
    // Action
}
.accessibilityLabel("Save document")
.accessibilityHint("Double tap to save your changes")
```

**Bad Labels:**

```swift
Button {
    // Action
} label: {
    Image(systemName: "square.and.arrow.down")
}
// No label - VoiceOver says "Button"
```

### Testing Checklist

- [ ] All interactive elements have labels
- [ ] Labels are descriptive and concise
- [ ] Hints provide additional context when needed
- [ ] State changes are announced
- [ ] Navigation order is logical
- [ ] Groups are properly labeled
- [ ] Images have alternative text
- [ ] Custom controls have proper traits

### Common VoiceOver Issues

**Issue 1: Missing Labels**

```swift
// Bad
IconButton(icon: Image(systemName: "gear")) {
    // Action
}

// Good
IconButton(icon: Image(systemName: "gear")) {
    // Action
}
.accessibilityLabel("Settings")
```

**Issue 2: Redundant Information**

```swift
// Bad
Button("Save Button") {
    // Action
}
.accessibilityLabel("Save Button Button")

// Good
Button("Save") {
    // Action
}
.accessibilityLabel("Save")
```

**Issue 3: Non-Descriptive Labels**

```swift
// Bad
Button("Click Here") {
    // Action
}

// Good
Button("Save Document") {
    // Action
}
```

## Keyboard Navigation

### Testing Keyboard Navigation

1. **Disconnect Mouse/Trackpad**
2. **Navigate Using Tab:**
   - Tab through all interactive elements
   - Verify focus order is logical
   - Check focus indicators are visible

3. **Activate Elements:**
   - Space bar for buttons/toggles
   - Return for default actions
   - Arrow keys for navigation

4. **Test Shortcuts:**
   - Verify keyboard shortcuts work
   - Check for conflicts
   - Test with modifiers (⌘, ⌥, ⌃)

### Focus Management

**Visible Focus Indicators:**

```swift
Button("Action") {
    // Action
}
.accessibilityFocusRing()
```

**Custom Focus Indicators:**

```swift
Button("Action") {
    // Action
}
.overlay(
    RoundedRectangle(cornerRadius: 8)
        .stroke(FAccessibility.focusRingColor, lineWidth: 2)
        .opacity(isFocused ? 1 : 0)
)
```

**Focus Order:**

```swift
VStack {
    Button("First") { }
        .focusable()
    Button("Second") { }
        .focusable()
    Button("Third") { }
        .focusable()
}
```

### Keyboard Shortcuts

**Adding Shortcuts:**

```swift
Button("Save") {
    save()
}
.keyboardShortcut("s", modifiers: .command)
```

**Testing Shortcuts:**

- [ ] All shortcuts work as expected
- [ ] No conflicts with system shortcuts
- [ ] Shortcuts are documented
- [ ] Shortcuts follow platform conventions

## Visual Accessibility

### Color Contrast

**WCAG Requirements:**

- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

**Testing Contrast:**

1. Use Accessibility Inspector
2. Select element
3. Check "Contrast" section
4. Verify ratios meet requirements

**High Contrast Support:**

```swift
Text("Important")
    .accessibilityHighContrast()
```

### Dynamic Type

**Support Dynamic Type:**

```swift
Text("Hello")
    .font(FType.title())
    .dynamicTypeSize(.xSmall ... .xxxLarge)
```

**Testing Dynamic Type:**

1. Settings → Accessibility → Display & Text Size
2. Adjust text size slider
3. Verify text scales appropriately
4. Check layout doesn't break

### Reduced Motion

**Respect Reduced Motion:**

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

**Testing Reduced Motion:**

1. Settings → Accessibility → Motion
2. Enable "Reduce Motion"
3. Verify animations are disabled/reduced
4. Check functionality still works

### Color Blindness

**Don't Rely on Color Alone:**

```swift
// Bad: Only color indicates state
Circle()
    .fill(isActive ? .green : .red)

// Good: Color + icon/text
HStack {
    Image(systemName: isActive ? "checkmark.circle" : "xmark.circle")
    Text(isActive ? "Active" : "Inactive")
}
.foregroundStyle(isActive ? .green : .red)
```

**Testing Color Blindness:**

- Use color blindness simulators
- Test with grayscale
- Verify information conveyed without color

## Testing Checklist

### Pre-Release Checklist

**VoiceOver:**

- [ ] All interactive elements have labels
- [ ] Labels are descriptive and concise
- [ ] Hints provide context when needed
- [ ] State changes are announced
- [ ] Navigation order is logical
- [ ] Custom controls have proper traits

**Keyboard Navigation:**

- [ ] All functionality accessible via keyboard
- [ ] Focus indicators visible
- [ ] Focus order is logical
- [ ] Keyboard shortcuts work
- [ ] No keyboard traps

**Visual:**

- [ ] Color contrast meets WCAG AA
- [ ] Dynamic Type supported
- [ ] Reduced Motion respected
- [ ] Information not conveyed by color alone
- [ ] High contrast mode supported

**Platform-Specific:**

- [ ] macOS: Full keyboard navigation
- [ ] iOS: VoiceOver gestures work
- [ ] visionOS: Spatial audio cues present

### Component-Specific Checklist

**Buttons:**

- [ ] Label describes action
- [ ] State changes announced
- [ ] Keyboard activatable
- [ ] Focus indicator visible

**Toggles:**

- [ ] Current state announced
- [ ] State changes announced
- [ ] Keyboard toggleable
- [ ] Visual state clear

**Dropdowns:**

- [ ] Current selection announced
- [ ] Options navigable
- [ ] Selection announced
- [ ] Keyboard operable

**Cards:**

- [ ] Content structure clear
- [ ] Headings properly marked
- [ ] Interactive elements accessible
- [ ] Navigation logical

## Common Issues

### Issue 1: Icon-Only Buttons

**Problem:** VoiceOver announces "Button" without context

**Solution:**

```swift
Button {
    // Action
} label: {
    Image(systemName: "gear")
}
.accessibilityLabel("Settings")
.accessibilityHint("Opens settings panel")
```

### Issue 2: Complex Custom Controls

**Problem:** Custom controls not recognized by VoiceOver

**Solution:**

```swift
struct CustomSlider: View {
    @State private var value: Double = 0.5

    var body: some View {
        // Custom slider implementation
            .accessibilityElement()
            .accessibilityLabel("Volume")
            .accessibilityValue("\(Int(value * 100)) percent")
            .accessibilityAdjustableAction { direction in
                switch direction {
                case .increment:
                    value = min(value + 0.1, 1.0)
                case .decrement:
                    value = max(value - 0.1, 0.0)
                @unknown default:
                    break
                }
            }
    }
}
```

### Issue 3: Poor Focus Order

**Problem:** Tab order doesn't match visual order

**Solution:**

```swift
VStack {
    Button("First") { }
    Button("Second") { }
    Button("Third") { }
}
// SwiftUI handles focus order automatically
// If needed, use .focusable() to control order
```

### Issue 4: Missing State Announcements

**Problem:** State changes not announced to VoiceOver

**Solution:**

```swift
@State private var isEnabled = false

Toggle("Feature", isOn: $isEnabled)
    .accessibilityValue(isEnabled ? "On" : "Off")
    .onChange(of: isEnabled) { oldValue, newValue in
        // Announce change
        UIAccessibility.post(
            notification: .announcement,
            argument: "Feature \(newValue ? "enabled" : "disabled")"
        )
    }
```

### Issue 5: Insufficient Contrast

**Problem:** Text doesn't meet contrast requirements

**Solution:**

```swift
// Use semantic colors that meet contrast requirements
Text("Important")
    .foregroundStyle(FColor.textPrimary)
    .background(FColor.bgCard)

// Or check contrast programmatically
if FAccessibility.prefersHighContrast {
    Text("Important")
        .foregroundStyle(.primary)
        .background(.background)
}
```

## Automated Testing

### XCTest Accessibility Tests

```swift
import XCTest

final class AccessibilityTests: XCTestCase {
    func testButtonHasLabel() {
        let button = Button("Save") { }
        // Test button has accessibility label
    }

    func testFocusOrder() {
        // Test focus order is logical
    }

    func testContrastRatios() {
        // Test color contrast meets requirements
    }
}
```

### CI/CD Integration

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  accessibility:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Accessibility Tests
        run: |
          cd platforms/apple/swift/ChatUIComponents
          swift test --filter AccessibilityTests
```

## Best Practices

### Do's

✅ Test with real assistive technologies
✅ Include users with disabilities in testing
✅ Test on multiple platforms
✅ Automate accessibility tests
✅ Document accessibility features
✅ Train team on accessibility

### Don'ts

❌ Rely only on automated tools
❌ Skip manual testing
❌ Ignore accessibility warnings
❌ Use color alone to convey information
❌ Create keyboard traps
❌ Forget to test with VoiceOver

## Resources

- [Apple Accessibility Documentation](https://developer.apple.com/accessibility/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [Accessibility Inspector Guide](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

## Next Steps

1. **Run Accessibility Audit**: Use Accessibility Inspector
2. **Test with VoiceOver**: Navigate entire app
3. **Test Keyboard Navigation**: Disconnect mouse
4. **Fix Issues**: Address all accessibility problems
5. **Automate Tests**: Add to CI/CD pipeline

## License

See repository root for license information.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

## Troubleshooting
- TBD: Add the top 3 failure modes and fixes.

