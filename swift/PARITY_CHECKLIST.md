# React vs SwiftUI Component Parity Checklist

This document tracks the parity between React components in `packages/ui` and SwiftUI components in `swift/ChatUIComponents`.

## Legend

- ✅ **Complete**: SwiftUI component matches React component behavior
- 🚧 **In Progress**: Partially implemented
- ⏳ **Planned**: Not yet started
- ➖ **Not Applicable**: Not needed for SwiftUI (platform differences)
- 📝 **Notes**: Additional context or differences

## Foundation Tokens

| Token Category | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Colors - Surface | CSS Variables | FColor (Asset Catalog) | ✅ | Automatic light/dark mode |
| Colors - Text | CSS Variables | FColor (Asset Catalog) | ✅ | Semantic API |
| Colors - Icons | CSS Variables | FColor (Asset Catalog) | ✅ | Semantic API |
| Colors - Accents | CSS Variables | FColor (Asset Catalog) | ✅ | Same across light/dark |
| Typography | Tailwind classes | FType | ✅ | Matching font sizes and weights |
| Spacing | Tailwind classes | FSpacing | ✅ | Matching scale (s2-s32) |
| Corner Radii | Tailwind classes | ChatGPTTheme | ✅ | Pixel-perfect matching |

## Settings Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| SettingRow | `SettingRow.tsx` | `SettingRowView.swift` | ✅ | All trailing variants supported |
| SettingToggle | `SettingToggle.tsx` | `SettingToggleView.swift` | ✅ | Custom switch style matches |
| SettingDropdown | `SettingDropdown.tsx` | `SettingDropdownView.swift` | ✅ | Menu-based implementation |
| SettingsCard | `Card.tsx` (styled) | `SettingsCardView.swift` | ✅ | ChatGPT-style borders and shadows |
| SettingsDivider | `Separator.tsx` | `SettingsDivider.swift` | ✅ | Theme-aware opacity |

## Button Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Button (default) | `Button.tsx` | `ChatUIButton.swift` | ✅ | Migrated from old package |
| Button (destructive) | `Button.tsx` | `ChatUIButton.swift` | ✅ | Red accent variant |
| Button (outline) | `Button.tsx` | `ChatUIButton.swift` | ✅ | Border-only variant |
| Button (ghost) | `Button.tsx` | `ChatUIButton.swift` | ✅ | Transparent background |
| IconButton | `IconButton.tsx` | `ChatUIButton.swift` | ✅ | Icon-only variant |

## Input Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Input (text) | `Input.tsx` | `InputView.swift` | 🚧 | Basic implementation exists |
| Input (password) | `Input.tsx` | `InputView.swift` | ⏳ | Needs secure field variant |
| Input (search) | `Input.tsx` | `InputView.swift` | ⏳ | Needs search styling |
| Textarea | `Textarea.tsx` | ⏳ | ⏳ | Not yet implemented |
| Select | `Select.tsx` | ⏳ | ⏳ | Use SettingDropdownView pattern |

## Card Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Card | `Card.tsx` | `SettingsCardView.swift` | ✅ | ChatGPT-style implementation |
| CardHeader | `Card.tsx` | ⏳ | ⏳ | Can use VStack with Text |
| CardContent | `Card.tsx` | ⏳ | ⏳ | Generic content via @ViewBuilder |
| CardFooter | `Card.tsx` | ⏳ | ⏳ | Can use VStack with Text |

## Navigation Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| ListItem | `ListItem.tsx` | `ListItemView.swift` | 🚧 | Mentioned in tasks, needs implementation |
| Sidebar | `ChatSidebar.tsx` | `AppShellView.swift` | ✅ | NavigationSplitView-based |
| NavigationMenu | `NavigationMenu.tsx` | ➖ | ➖ | Use native SwiftUI navigation |

## Modal/Dialog Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Modal | `Modal.tsx` | `ChatUIModal.swift` | 🚧 | Exists in old package, needs migration |
| Dialog | `Dialog.tsx` | ➖ | ➖ | Use native SwiftUI .sheet() |
| AlertDialog | `AlertDialog.tsx` | ➖ | ➖ | Use native SwiftUI .alert() |
| Sheet | `Sheet.tsx` | ➖ | ➖ | Use native SwiftUI .sheet() |

## Feedback Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Toast | `Toast.tsx` | `ChatUIToast.swift` | 🚧 | Exists in old package, needs migration |
| Alert | `Alert.tsx` | ⏳ | ⏳ | Not yet implemented |
| Progress | `Progress.tsx` | ⏳ | ⏳ | Use native ProgressView |
| Skeleton | `Skeleton.tsx` | ⏳ | ⏳ | Not yet implemented |

## Layout Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| AppShell | Custom layouts | `AppShellView.swift` | ✅ | NavigationSplitView-based |
| RoundedContainer | Custom styling | `RoundedAppContainer.swift` | ✅ | ChatGPT-style clipping |
| VisualEffect | ➖ | `VisualEffectView.swift` | ✅ | macOS vibrancy, iOS fallback |
| ScrollArea | `ScrollArea.tsx` | ➖ | ➖ | Use native ScrollView |

## Form Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Form | `Form.tsx` | ⏳ | ⏳ | Use native Form |
| Label | `Label.tsx` | ⏳ | ⏳ | Use native Text |
| Checkbox | `Checkbox.tsx` | ⏳ | ⏳ | Use native Toggle |
| RadioGroup | `RadioGroup.tsx` | ⏳ | ⏳ | Use Picker with .radioGroup style |
| Switch | `Switch.tsx` | `FoundationSwitchStyle.swift` | ✅ | Custom toggle style |

## Data Display Components

| Component | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Table | `Table.tsx` | ⏳ | ⏳ | Use native Table (macOS 12+) |
| Badge | `Badge.tsx` | ⏳ | ⏳ | Not yet implemented |
| Avatar | `Avatar.tsx` | ⏳ | ⏳ | Not yet implemented |
| Tooltip | `Tooltip.tsx` | ➖ | ➖ | Use .help() modifier |

## Interaction Patterns

| Pattern | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Hover Effects | CSS :hover | Platform.isMac + .onHover | ✅ | macOS only |
| Touch Feedback | CSS :active | DragGesture | ✅ | iOS/visionOS |
| Focus Rings | CSS :focus | .accessibilityFocusRing() | ✅ | Keyboard navigation |
| Pressed State | CSS :active | @State + gesture | ✅ | All platforms |

## Accessibility Features

| Feature | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| ARIA Labels | aria-label | .accessibilityLabel() | ✅ | Native SwiftUI |
| ARIA Hints | aria-describedby | .accessibilityHint() | ✅ | Native SwiftUI |
| Focus Management | tabIndex | .focusable() | ✅ | Native SwiftUI |
| Screen Reader | ARIA roles | Native VoiceOver | ✅ | Automatic |
| High Contrast | CSS media query | FAccessibility.prefersHighContrast | ✅ | System preference |
| Reduced Motion | CSS media query | FAccessibility.prefersReducedMotion | ✅ | System preference |

## Theme Support

| Feature | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| Light Mode | CSS variables | Asset Catalog | ✅ | Automatic |
| Dark Mode | CSS variables | Asset Catalog | ✅ | Automatic |
| Theme Switching | Context provider | @Environment(\.colorScheme) | ✅ | System-driven |
| Custom Themes | CSS overrides | Custom theme structs | ✅ | ChatGPTTheme, DefaultTheme |

## Platform-Specific Features

| Feature | React | SwiftUI | Status | Notes |
|---|---|---|---|---|
| macOS Vibrancy | ➖ | VisualEffectView | ✅ | NSVisualEffectView wrapper |
| iOS Safe Area | CSS env() | .safeAreaInset() | ✅ | Native SwiftUI |
| visionOS Glass | ➖ | .glassBackgroundEffect() | ✅ | visionOS 1+ |
| Keyboard Shortcuts | ➖ | .keyboardShortcut() | ✅ | Native SwiftUI |

## Component API Comparison

### SettingRow

**React:**

```tsx
<SettingRow
  icon={<BellIcon />}
  title="Notifications"
  subtitle="Receive push notifications"
  trailing={<ChevronRight />}
  onClick={() => navigate('/notifications')}
/>
```

**SwiftUI:**

```swift
SettingRowView(
    icon: AnyView(Image(systemName: "bell.fill")),
    title: "Notifications",
    subtitle: "Receive push notifications",
    trailing: .chevron
) {
    navigationPath.append("notifications")
}
```

**Parity:** ✅ Complete - All features supported

### SettingToggle

**React:**

```tsx
<SettingToggle
  icon={<BellIcon />}
  title="Notifications"
  subtitle="Receive push notifications"
  checked={isEnabled}
  onChange={setIsEnabled}
/>
```

**SwiftUI:**

```swift
SettingToggleView(
    icon: AnyView(Image(systemName: "bell.fill")),
    title: "Notifications",
    subtitle: "Receive push notifications",
    isOn: $isEnabled
)
```

**Parity:** ✅ Complete - Binding-based state management

### SettingDropdown

**React:**

```tsx
<SettingDropdown
  icon={<GlobeIcon />}
  title="Language"
  options={languages}
  value={selectedLanguage}
  onChange={setSelectedLanguage}
/>
```

**SwiftUI:**

```swift
SettingDropdownView(
    icon: AnyView(Image(systemName: "globe")),
    title: "Language",
    options: languages,
    selection: $selectedLanguage
)
```

**Parity:** ✅ Complete - Binding-based state management

## Implementation Priority

### Phase 1: Complete ✅

- [x] Foundation tokens (FColor, FType, FSpacing)
- [x] Settings primitives (Row, Toggle, Dropdown, Card, Divider)
- [x] ChatGPT theme constants
- [x] Platform detection utilities
- [x] Accessibility helpers
- [x] Button components (migrated)
- [x] Shell layouts (AppShell, RoundedContainer, VisualEffect)

### Phase 2: In Progress 🚧

- [ ] Input components (text, password, search)
- [ ] ListItem component for navigation
- [ ] Modal/Dialog migration from old package
- [ ] Toast migration from old package

### Phase 3: Planned ⏳

- [ ] Card header/footer components
- [ ] Form components (Label, Checkbox, RadioGroup)
- [ ] Data display components (Table, Badge, Avatar)
- [ ] Feedback components (Alert, Progress, Skeleton)
- [ ] Additional input variants (Textarea, Select)

## Behavioral Differences

### State Management

**React:** Props + useState/useReducer
**SwiftUI:** @State + @Binding + @ObservedObject

**Impact:** SwiftUI uses property wrappers for reactive state. Components accept `Binding<T>` instead of value + onChange callback.

### Event Handling

**React:** onClick, onChange, onHover callbacks
**SwiftUI:** Action closures, .onChange() modifiers, .onHover() modifiers

**Impact:** SwiftUI uses trailing closures and view modifiers instead of props.

### Conditional Rendering

**React:** Ternary operators, && operator
**SwiftUI:** if/else in @ViewBuilder, .if() custom modifier

**Impact:** SwiftUI requires @ViewBuilder context for conditional views.

### Platform Detection

**React:** User agent detection, CSS media queries
**SwiftUI:** #if os(macOS), Platform.isMac helpers

**Impact:** SwiftUI has compile-time and runtime platform detection.

## Testing Parity

| Test Type | React | SwiftUI | Status |
|---|---|---|---|
| Unit Tests | Jest + Testing Library | XCTest | ✅ |
| Component Tests | Storybook | SwiftUI Previews | ✅ |
| Integration Tests | Playwright | XCUITest | ⏳ |
| Visual Regression | Chromatic | Snapshot Testing | ⏳ |
| Accessibility Tests | axe-core | Accessibility Inspector | ✅ |

## Documentation Parity

| Documentation | React | SwiftUI | Status |
|---|---|---|---|
| Component README | ✅ | ✅ | Complete |
| API Documentation | JSDoc | DocC | ✅ |
| Usage Examples | Storybook | Component Gallery | ✅ |
| Migration Guide | ➖ | ✅ | Complete |
| Adoption Guide | ➖ | ✅ | Complete |

## Known Limitations

### SwiftUI Limitations

1. **No CSS-like Styling**: SwiftUI uses view modifiers instead of CSS classes
2. **Limited Animation Control**: Animations are more declarative, less granular control
3. **Platform Differences**: Some features only available on specific platforms
4. **Preview Limitations**: SwiftUI Previews require Xcode, can't run in CI

### React Limitations

1. **No Native Vibrancy**: Can't achieve true macOS vibrancy effects
2. **Limited System Integration**: Can't access native system features easily
3. **Performance**: Web rendering slower than native SwiftUI
4. **Platform Detection**: Less reliable than native platform checks

## Recommendations

### When to Use React Components

- Web applications
- Cross-platform web apps
- Rapid prototyping
- When you need CSS flexibility

### When to Use SwiftUI Components

- Native iOS/macOS/visionOS apps
- When you need native performance
- When you need system integration (Keychain, Spotlight, etc.)
- When you want automatic platform adaptation

### Hybrid Approach

For teams building both web and native apps:

1. Use React for web applications
2. Use SwiftUI for native applications
3. Share design tokens between both (CSS variables ↔ Asset Catalog)
4. Maintain component parity through this checklist
5. Use Component Gallery and Storybook for visual comparison

## Next Steps

1. **Complete Phase 2 Components**: Input, ListItem, Modal, Toast
2. **Implement Phase 3 Components**: Card variants, Form components, Data display
3. **Add Integration Tests**: XCUITest for end-to-end flows
4. **Add Visual Regression**: Snapshot testing for all components
5. **Expand Documentation**: Add more usage examples and patterns

## Contributing

When adding new components:

1. Update this checklist with the new component
2. Ensure React and SwiftUI APIs are similar
3. Document any behavioral differences
4. Add examples to Component Gallery and Storybook
5. Write unit tests for both platforms

## License

See repository root for license information.
