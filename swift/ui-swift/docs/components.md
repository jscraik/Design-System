# ChatUISwift Component Documentation

Generated on 2025-12-28T11:47:27Z

This documentation provides comprehensive information about all SwiftUI components in the ChatUISwift package, including their APIs, usage examples, and accessibility features.

## Table of Contents
- [ChatUIButton](#chatuibutton)
- [ChatUICard](#chatuicard)
- [ChatUIDataDisplay](#chatuidatadisplay)
- [ChatUIInput](#chatuiinput)
- [ChatUIModal](#chatuimodal)
- [ChatUINavigation](#chatuinavigation)
- [ChatUIToast](#chatuitoast)

---

## ChatUIButton

A native macOS button component that uses design tokens

**File:** `Sources/ChatUISwift/Components/ChatUIButton.swift`
### Properties

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `` | ✅ | `—` | Property for configuring variant |
| `size` | `` | ✅ | `—` | Property for configuring size |
| `action` | `` | ✅ | `—` | Property for configuring action |
| `content` | `` | ✅ | `—` | Property for configuring content |
| `isDisabled` | `` | ✅ | `—` | Property for configuring isDisabled |
| `accessibilityLabel` | `` | ✅ | `—` | Property for configuring accessibilityLabel |
| `accessibilityHint` | `` | ✅ | `—` | Property for configuring accessibilityHint |
| `dynamicTypeSize` | `` | ✅ | `—` | Property for configuring dynamicTypeSize |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `baseSize` | `` | ❌ | `Self.fontSize(for: size)` | Property for configuring baseSize |
| `scaledSize` | `` | ❌ | `Self.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)` | Property for configuring scaledSize |
| `resolvedAccessibilityLabel` | `` | ✅ | `—` | Property for configuring resolvedAccessibilityLabel |
| `resolvedAccessibilityHint` | `` | ✅ | `—` | Property for configuring resolvedAccessibilityHint |
| `trimmedHint` | `` | ❌ | `accessibilityHint?.trimmingCharacters(in: .whitespacesAndNewlines)` | Property for configuring trimmedHint |
| `trimmedExplicit` | `` | ❌ | `explicit?.trimmingCharacters(in: .whitespacesAndNewlines)` | Property for configuring trimmedExplicit |
| `trimmedExplicit,` | `` | ✅ | `—` | Property for configuring trimmedExplicit, |
| `trimmedFallback` | `` | ❌ | `fallback?.trimmingCharacters(in: .whitespacesAndNewlines)` | Property for configuring trimmedFallback |
| `trimmedFallback,` | `` | ✅ | `—` | Property for configuring trimmedFallback, |
| `scale` | `` | ❌ | `Self.dynamicTypeScale(for: dynamicTypeSize)` | Property for configuring scale |
| `variant` | `` | ✅ | `—` | Property for configuring variant |
| `size` | `` | ✅ | `—` | Property for configuring size |
| `animationDuration` | `` | ❌ | `DesignTokens.Accessibility.Animation.duration()` | Property for configuring animationDuration |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `opacity` | `` | ❌ | `isPressed ? 0.9 : 1.0` | Property for configuring opacity |
| `token` | `` | ❌ | `Self.backgroundToken(for: variant, isPressed: isPressed, prefersHighContrast: prefersHighContrast)` | Property for configuring token |
| `token` | `` | ❌ | `Self.foregroundToken(for: variant, prefersHighContrast: prefersHighContrast)` | Property for configuring token |
| `token` | `` | ❌ | `Self.borderToken(for: variant, prefersHighContrast: prefersHighContrast)` | Property for configuring token |
| `resolvedLabel` | `` | ❌ | `Self.resolveAccessibilityLabel(explicit: accessibilityLabel, fallback: title)` | Property for configuring resolvedLabel |
| `resolvedLabel` | `` | ❌ | `Self.resolveAccessibilityLabel(explicit: accessibilityLabel, fallback: systemName)` | Property for configuring resolvedLabel |
| `label` | `` | ✅ | `—` | Property for configuring label |
| `hint` | `` | ✅ | `—` | Property for configuring hint |

### Methods

#### `fontForSize`

Method for fontForSize functionality

```swift
private func fontForSize(_ size: Size) -> Font {
```

**Returns:** `Font`

#### `paddingForSize`

Method for paddingForSize functionality

```swift
private func paddingForSize(_ size: Size) -> EdgeInsets {
```

**Returns:** `EdgeInsets`

#### `resolveAccessibilityLabel`

Method for resolveAccessibilityLabel functionality

```swift
static func resolveAccessibilityLabel(explicit: String?, fallback: String?) -> String? {
```

**Returns:** `String?`

#### `fontSize`

Method for fontSize functionality

```swift
static func fontSize(for size: Size) -> CGFloat {
```

**Returns:** `CGFloat`

#### `fontWeight`

Method for fontWeight functionality

```swift
static func fontWeight(for size: Size) -> Font.Weight {
```

**Returns:** `Font.Weight`

#### `paddingInsets`

Method for paddingInsets functionality

```swift
static func paddingInsets(for size: Size) -> EdgeInsets {
```

**Returns:** `EdgeInsets`

#### `scaledFontSize`

Method for scaledFontSize functionality

```swift
static func scaledFontSize(_ baseSize: CGFloat, dynamicTypeSize: DynamicTypeSize) -> CGFloat {
```

**Returns:** `CGFloat`

#### `dynamicTypeScale`

Method for dynamicTypeScale functionality

```swift
static func dynamicTypeScale(for dynamicTypeSize: DynamicTypeSize) -> CGFloat {
```

**Returns:** `CGFloat`

#### `makeBody`

Method for makeBody functionality

```swift
func makeBody(configuration: Configuration) -> some View {
```

**Returns:** `some View`

#### `backgroundForVariant`

Method for backgroundForVariant functionality

```swift
private func backgroundForVariant(_ variant: ChatUIButtonVariant, isPressed: Bool, prefersHighContrast: Bool) -> Color {
```

**Returns:** `Color`

#### `foregroundForVariant`

Method for foregroundForVariant functionality

```swift
private func foregroundForVariant(_ variant: ChatUIButtonVariant, isPressed: Bool, prefersHighContrast: Bool) -> Color {
```

**Returns:** `Color`

#### `borderColorForVariant`

Method for borderColorForVariant functionality

```swift
private func borderColorForVariant(_ variant: ChatUIButtonVariant, prefersHighContrast: Bool) -> Color {
```

**Returns:** `Color`

#### `borderWidthForVariant`

Method for borderWidthForVariant functionality

```swift
private func borderWidthForVariant(_ variant: ChatUIButtonVariant) -> CGFloat {
```

**Returns:** `CGFloat`

#### `cornerRadiusForSize`

Method for cornerRadiusForSize functionality

```swift
private func cornerRadiusForSize(_ size: ChatUIButtonSize) -> CGFloat {
```

**Returns:** `CGFloat`

#### `backgroundToken`

Method for backgroundToken functionality

```swift
static func backgroundToken(for variant: ChatUIButtonVariant, isPressed: Bool, prefersHighContrast: Bool) -> ChatUIButtonColorToken {
```

**Returns:** `ChatUIButtonColorToken`

#### `foregroundToken`

Method for foregroundToken functionality

```swift
static func foregroundToken(for variant: ChatUIButtonVariant, prefersHighContrast: Bool) -> ChatUIButtonColorToken {
```

**Returns:** `ChatUIButtonColorToken`

#### `borderToken`

Method for borderToken functionality

```swift
static func borderToken(for variant: ChatUIButtonVariant, prefersHighContrast: Bool) -> ChatUIButtonColorToken {
```

**Returns:** `ChatUIButtonColorToken`

#### `color`

Method for color functionality

```swift
private func color(for token: ChatUIButtonColorToken) -> Color {
```

**Returns:** `Color`

#### `accessibilityLabelIfPresent`

Method for accessibilityLabelIfPresent functionality

```swift
func accessibilityLabelIfPresent(_ label: String?) -> some View {
```

**Returns:** `some View`

#### `accessibilityHintIfPresent`

Method for accessibilityHintIfPresent functionality

```swift
func accessibilityHintIfPresent(_ hint: String?) -> some View {
```

**Returns:** `some View`

### Accessibility

This component includes the following accessibility features:

- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Custom accessibility labels
- Accessibility hints for complex interactions
- Accessibility hints for complex interactions

**VoiceOver Support:** Standard SwiftUI accessibility

**Keyboard Navigation:** Standard SwiftUI keyboard navigation

**High Contrast:** Adapts to system high contrast settings


---

## ChatUICard

A native macOS card component that uses design tokens

**File:** `Sources/ChatUISwift/Components/ChatUICard.swift`
### Properties

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `` | ✅ | `—` | Property for configuring variant |
| `content` | `` | ✅ | `—` | Property for configuring content |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `token` | `` | ❌ | `Self.backgroundToken(for: variant, prefersHighContrast: prefersHighContrast)` | Property for configuring token |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `token` | `` | ❌ | `Self.borderToken(for: variant, prefersHighContrast: prefersHighContrast)` | Property for configuring token |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `token` | `` | ❌ | `Self.shadowToken(for: variant, prefersHighContrast: prefersHighContrast)` | Property for configuring token |
| `base` | `` | ❌ | `color(for: token)` | Property for configuring base |

### Methods

#### `backgroundForVariant`

Method for backgroundForVariant functionality

```swift
private func backgroundForVariant(_ variant: Variant) -> Color {
```

**Returns:** `Color`

#### `borderColorForVariant`

Method for borderColorForVariant functionality

```swift
private func borderColorForVariant(_ variant: Variant) -> Color {
```

**Returns:** `Color`

#### `borderWidthForVariant`

Method for borderWidthForVariant functionality

```swift
private func borderWidthForVariant(_ variant: Variant) -> CGFloat {
```

**Returns:** `CGFloat`

#### `shadowColorForVariant`

Method for shadowColorForVariant functionality

```swift
private func shadowColorForVariant(_ variant: Variant) -> Color {
```

**Returns:** `Color`

#### `shadowRadiusForVariant`

Method for shadowRadiusForVariant functionality

```swift
private func shadowRadiusForVariant(_ variant: Variant) -> CGFloat {
```

**Returns:** `CGFloat`

#### `shadowOffsetForVariant`

Method for shadowOffsetForVariant functionality

```swift
private func shadowOffsetForVariant(_ variant: Variant) -> CGFloat {
```

**Returns:** `CGFloat`

#### `backgroundToken`

Method for backgroundToken functionality

```swift
static func backgroundToken(for variant: Variant, prefersHighContrast: Bool) -> ChatUICardColorToken {
```

**Returns:** `ChatUICardColorToken`

#### `borderToken`

Method for borderToken functionality

```swift
static func borderToken(for variant: Variant, prefersHighContrast: Bool) -> ChatUICardColorToken {
```

**Returns:** `ChatUICardColorToken`

#### `shadowToken`

Method for shadowToken functionality

```swift
static func shadowToken(for variant: Variant, prefersHighContrast: Bool) -> ChatUICardColorToken {
```

**Returns:** `ChatUICardColorToken`

#### `color`

Method for color functionality

```swift
private func color(for token: ChatUICardColorToken) -> Color {
```

**Returns:** `Color`

#### `variant`

Method for variant functionality

```swift
public func variant(_ variant: Variant) -> ChatUICard<Content> {
```

**Returns:** `ChatUICard<Content>`


---

## ChatUIDataDisplay

A SwiftUI component that provides chatuidatadisplay functionality with design token integration.

**File:** `Sources/ChatUISwift/Components/ChatUIDataDisplay.swift`
### Properties

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `` | ✅ | `—` | Property for configuring title |
| `width` | `` | ✅ | `—` | Property for configuring width |
| `alignment` | `` | ✅ | `—` | Property for configuring alignment |
| `data` | `` | ✅ | `—` | Property for configuring data |
| `columns` | `` | ✅ | `—` | Property for configuring columns |
| `rowContent` | `` | ✅ | `—` | Property for configuring rowContent |
| `onRowTap` | `` | ✅ | `—` | Property for configuring onRowTap |
| `sortColumn` | `` | ✅ | `—` | Property for configuring sortColumn |
| `sortAscending` | `` | ❌ | `true` | Property for configuring sortAscending |
| `dynamicTypeSize` | `` | ✅ | `—` | Property for configuring dynamicTypeSize |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `tableHeader` | `` | ✅ | `—` | Property for configuring tableHeader |
| `borderColor` | `` | ✅ | `—` | Property for configuring borderColor |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `data` | `` | ✅ | `—` | Property for configuring data |
| `style` | `` | ✅ | `—` | Property for configuring style |
| `content` | `` | ✅ | `—` | Property for configuring content |
| `onItemTap` | `` | ✅ | `—` | Property for configuring onItemTap |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `data` | `` | ✅ | `—` | Property for configuring data |
| `columns` | `` | ✅ | `—` | Property for configuring columns |
| `spacing` | `` | ✅ | `—` | Property for configuring spacing |
| `content` | `` | ✅ | `—` | Property for configuring content |
| `onItemTap` | `` | ✅ | `—` | Property for configuring onItemTap |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `title` | `` | ✅ | `—` | Property for configuring title |
| `subtitle` | `` | ✅ | `—` | Property for configuring subtitle |
| `content` | `` | ✅ | `—` | Property for configuring content |
| `actions` | `` | ✅ | `—` | Property for configuring actions |
| `dynamicTypeSize` | `` | ✅ | `—` | Property for configuring dynamicTypeSize |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `cardHeader` | `` | ✅ | `—` | Property for configuring cardHeader |
| `title` | `` | ❌ | `title {` | Property for configuring title |
| `subtitle` | `` | ❌ | `subtitle {` | Property for configuring subtitle |
| `cardActions` | `` | ✅ | `—` | Property for configuring cardActions |
| `borderColor` | `` | ✅ | `—` | Property for configuring borderColor |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `title` | `` | ✅ | `—` | Property for configuring title |
| `systemName` | `` | ✅ | `—` | Property for configuring systemName |
| `variant` | `` | ✅ | `—` | Property for configuring variant |
| `accessibilityLabel` | `` | ✅ | `—` | Property for configuring accessibilityLabel |
| `accessibilityHint` | `` | ✅ | `—` | Property for configuring accessibilityHint |
| `action` | `` | ✅ | `—` | Property for configuring action |

### Methods

#### `tableRow`

Method for tableRow functionality

```swift
private func tableRow(for item: Data.Element, at index: Int) -> some View {
```

**Returns:** `some View`

#### `toggleSort`

Method for toggleSort functionality

```swift
private func toggleSort(for columnIndex: Int) {
```

#### `alignmentForColumn`

Method for alignmentForColumn functionality

```swift
private func alignmentForColumn(_ column: Column) -> Alignment {
```

**Returns:** `Alignment`

#### `scaledFontSize`

Method for scaledFontSize functionality

```swift
private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
```

**Returns:** `CGFloat`

#### `listItem`

Method for listItem functionality

```swift
private func listItem(for item: Data.Element) -> some View {
```

**Returns:** `some View`

#### `spacingForStyle`

Method for spacingForStyle functionality

```swift
private func spacingForStyle(_ style: Style) -> CGFloat {
```

**Returns:** `CGFloat`

#### `paddingForStyle`

Method for paddingForStyle functionality

```swift
private func paddingForStyle(_ style: Style) -> EdgeInsets {
```

**Returns:** `EdgeInsets`

#### `itemPaddingForStyle`

Method for itemPaddingForStyle functionality

```swift
private func itemPaddingForStyle(_ style: Style) -> EdgeInsets {
```

**Returns:** `EdgeInsets`

#### `backgroundForStyle`

Method for backgroundForStyle functionality

```swift
private func backgroundForStyle(_ style: Style) -> Color {
```

**Returns:** `Color`

#### `itemBackgroundForStyle`

Method for itemBackgroundForStyle functionality

```swift
private func itemBackgroundForStyle(_ style: Style) -> Color {
```

**Returns:** `Color`

#### `cornerRadiusForStyle`

Method for cornerRadiusForStyle functionality

```swift
private func cornerRadiusForStyle(_ style: Style) -> CGFloat {
```

**Returns:** `CGFloat`

#### `itemCornerRadiusForStyle`

Method for itemCornerRadiusForStyle functionality

```swift
private func itemCornerRadiusForStyle(_ style: Style) -> CGFloat {
```

**Returns:** `CGFloat`

#### `borderColorForStyle`

Method for borderColorForStyle functionality

```swift
private func borderColorForStyle(_ style: Style) -> Color {
```

**Returns:** `Color`

#### `borderWidthForStyle`

Method for borderWidthForStyle functionality

```swift
private func borderWidthForStyle(_ style: Style) -> CGFloat {
```

**Returns:** `CGFloat`

#### `gridItem`

Method for gridItem functionality

```swift
private func gridItem(for item: Data.Element) -> some View {
```

**Returns:** `some View`

#### `scaledFontSize`

Method for scaledFontSize functionality

```swift
private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
```

**Returns:** `CGFloat`

#### `edit`

Method for edit functionality

```swift
public static func edit(action: @escaping () -> Void) -> DataCardAction {
```

**Returns:** `Void) -> DataCardAction`

#### `delete`

Method for delete functionality

```swift
public static func delete(action: @escaping () -> Void) -> DataCardAction {
```

**Returns:** `Void) -> DataCardAction`

#### `share`

Method for share functionality

```swift
public static func share(action: @escaping () -> Void) -> DataCardAction {
```

**Returns:** `Void) -> DataCardAction`

#### `more`

Method for more functionality

```swift
public static func more(action: @escaping () -> Void) -> DataCardAction {
```

**Returns:** `Void) -> DataCardAction`

### Accessibility

This component includes the following accessibility features:

- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions

**VoiceOver Support:** Standard SwiftUI accessibility

**Keyboard Navigation:** Standard SwiftUI keyboard navigation

**High Contrast:** Adapts to system high contrast settings


---

## ChatUIInput

A native macOS text input component that uses design tokens

**File:** `Sources/ChatUISwift/Components/ChatUIInput.swift`
### Properties

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `text` | `` | ✅ | `—` | Property for configuring text |
| `placeholder` | `` | ✅ | `—` | Property for configuring placeholder |
| `variant` | `` | ✅ | `—` | Property for configuring variant |
| `size` | `` | ✅ | `—` | Property for configuring size |
| `isDisabled` | `` | ✅ | `—` | Property for configuring isDisabled |
| `accessibilityLabel` | `` | ✅ | `—` | Property for configuring accessibilityLabel |
| `accessibilityHint` | `` | ✅ | `—` | Property for configuring accessibilityHint |
| `submitLabel` | `` | ✅ | `—` | Property for configuring submitLabel |
| `onSubmit` | `` | ✅ | `—` | Property for configuring onSubmit |
| `isFocused` | `` | ✅ | `—` | Property for configuring isFocused |
| `dynamicTypeSize` | `` | ✅ | `—` | Property for configuring dynamicTypeSize |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `resolvedAccessibilityLabel` | `` | ✅ | `—` | Property for configuring resolvedAccessibilityLabel |
| `resolvedAccessibilityHint` | `` | ✅ | `—` | Property for configuring resolvedAccessibilityHint |
| `trimmedHint` | `` | ❌ | `accessibilityHint?.trimmingCharacters(in: .whitespacesAndNewlines)` | Property for configuring trimmedHint |
| `trimmedExplicit` | `` | ❌ | `explicit?.trimmingCharacters(in: .whitespacesAndNewlines)` | Property for configuring trimmedExplicit |
| `trimmedExplicit,` | `` | ✅ | `—` | Property for configuring trimmedExplicit, |
| `trimmedPlaceholder` | `` | ❌ | `placeholder.trimmingCharacters(in: .whitespacesAndNewlines)` | Property for configuring trimmedPlaceholder |
| `scale` | `` | ❌ | `Self.dynamicTypeScale(for: dynamicTypeSize)` | Property for configuring scale |
| `variant` | `` | ✅ | `—` | Property for configuring variant |
| `size` | `` | ✅ | `—` | Property for configuring size |
| `isFocused` | `` | ✅ | `—` | Property for configuring isFocused |
| `dynamicTypeSize` | `` | ✅ | `—` | Property for configuring dynamicTypeSize |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `baseSize` | `` | ❌ | `Self.fontSize(for: size)` | Property for configuring baseSize |
| `scaledSize` | `` | ❌ | `ChatUIInput.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)` | Property for configuring scaledSize |
| `token` | `` | ❌ | `Self.backgroundToken(for: variant, prefersHighContrast: prefersHighContrast)` | Property for configuring token |
| `borderColor` | `` | ✅ | `—` | Property for configuring borderColor |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `token` | `` | ❌ | `Self.borderToken(isFocused: isFocused, prefersHighContrast: prefersHighContrast)` | Property for configuring token |
| `borderWidth` | `` | ✅ | `—` | Property for configuring borderWidth |
| `token` | `` | ❌ | `prefersHighContrast ? ChatUIInputColorToken.highContrastText : .textPrimary` | Property for configuring token |
| `label` | `` | ✅ | `—` | Property for configuring label |
| `hint` | `` | ✅ | `—` | Property for configuring hint |
| `label` | `` | ✅ | `—` | Property for configuring label |

### Methods

#### `resolveAccessibilityLabel`

Method for resolveAccessibilityLabel functionality

```swift
static func resolveAccessibilityLabel(explicit: String?, placeholder: String) -> String? {
```

**Returns:** `String?`

#### `scaledFontSize`

Method for scaledFontSize functionality

```swift
static func scaledFontSize(_ baseSize: CGFloat, dynamicTypeSize: DynamicTypeSize) -> CGFloat {
```

**Returns:** `CGFloat`

#### `dynamicTypeScale`

Method for dynamicTypeScale functionality

```swift
static func dynamicTypeScale(for dynamicTypeSize: DynamicTypeSize) -> CGFloat {
```

**Returns:** `CGFloat`

#### `_body`

Method for _body functionality

```swift
func _body(configuration: TextField<Self._Label>) -> some View {
```

**Returns:** `some View`

#### `fontForSize`

Method for fontForSize functionality

```swift
private func fontForSize(_ size: ChatUIInput.Size, dynamicTypeSize: DynamicTypeSize) -> Font {
```

**Returns:** `Font`

#### `paddingForSize`

Method for paddingForSize functionality

```swift
private func paddingForSize(_ size: ChatUIInput.Size) -> EdgeInsets {
```

**Returns:** `EdgeInsets`

#### `backgroundForVariant`

Method for backgroundForVariant functionality

```swift
private func backgroundForVariant(_ variant: ChatUIInput.Variant, prefersHighContrast: Bool) -> Color {
```

**Returns:** `Color`

#### `cornerRadiusForSize`

Method for cornerRadiusForSize functionality

```swift
private func cornerRadiusForSize(_ size: ChatUIInput.Size) -> CGFloat {
```

**Returns:** `CGFloat`

#### `foregroundForVariant`

Method for foregroundForVariant functionality

```swift
private func foregroundForVariant(prefersHighContrast: Bool) -> Color {
```

**Returns:** `Color`

#### `fontSize`

Method for fontSize functionality

```swift
static func fontSize(for size: ChatUIInput.Size) -> CGFloat {
```

**Returns:** `CGFloat`

#### `fontWeight`

Method for fontWeight functionality

```swift
static func fontWeight(for size: ChatUIInput.Size) -> Font.Weight {
```

**Returns:** `Font.Weight`

#### `paddingInsets`

Method for paddingInsets functionality

```swift
static func paddingInsets(for size: ChatUIInput.Size) -> EdgeInsets {
```

**Returns:** `EdgeInsets`

#### `backgroundToken`

Method for backgroundToken functionality

```swift
static func backgroundToken(for variant: ChatUIInput.Variant, prefersHighContrast: Bool) -> ChatUIInputColorToken {
```

**Returns:** `ChatUIInputColorToken`

#### `borderToken`

Method for borderToken functionality

```swift
static func borderToken(isFocused: Bool, prefersHighContrast: Bool) -> ChatUIInputColorToken {
```

**Returns:** `ChatUIInputColorToken`

#### `color`

Method for color functionality

```swift
private func color(for token: ChatUIInputColorToken) -> Color {
```

**Returns:** `Color`

#### `onSubmit`

Method for onSubmit functionality

```swift
public func onSubmit(_ action: @escaping () -> Void) -> ChatUIInput {
```

**Returns:** `Void) -> ChatUIInput`

#### `accessibilityLabelIfPresent`

Method for accessibilityLabelIfPresent functionality

```swift
func accessibilityLabelIfPresent(_ label: String?) -> some View {
```

**Returns:** `some View`

#### `accessibilityHintIfPresent`

Method for accessibilityHintIfPresent functionality

```swift
func accessibilityHintIfPresent(_ hint: String?) -> some View {
```

**Returns:** `some View`

#### `submitLabelIfPresent`

Method for submitLabelIfPresent functionality

```swift
func submitLabelIfPresent(_ label: SubmitLabel?) -> some View {
```

**Returns:** `some View`

### Accessibility

This component includes the following accessibility features:

- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Custom accessibility labels
- Accessibility hints for complex interactions
- Accessibility hints for complex interactions

**VoiceOver Support:** Standard SwiftUI accessibility

**Keyboard Navigation:** Standard SwiftUI keyboard navigation

**High Contrast:** Adapts to system high contrast settings


---

## ChatUIModal

A native macOS modal dialog component with proper focus management

**File:** `Sources/ChatUISwift/Components/ChatUIModal.swift`
### Properties

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isPresented` | `` | ✅ | `—` | Property for configuring isPresented |
| `title` | `` | ✅ | `—` | Property for configuring title |
| `size` | `` | ✅ | `—` | Property for configuring size |
| `onDismiss` | `` | ✅ | `—` | Property for configuring onDismiss |
| `content` | `` | ✅ | `—` | Property for configuring content |
| `isContentFocused` | `` | ✅ | `—` | Property for configuring isContentFocused |
| `dynamicTypeSize` | `` | ✅ | `—` | Property for configuring dynamicTypeSize |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `title` | `` | ❌ | `title {` | Property for configuring title |
| `borderColor` | `` | ✅ | `—` | Property for configuring borderColor |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `animationDuration` | `` | ✅ | `—` | Property for configuring animationDuration |
| `title` | `` | ✅ | `—` | Property for configuring title |
| `style` | `` | ✅ | `—` | Property for configuring style |
| `action` | `` | ✅ | `—` | Property for configuring action |
| `isPresented` | `` | ✅ | `—` | Property for configuring isPresented |
| `title` | `` | ✅ | `—` | Property for configuring title |
| `message` | `` | ✅ | `—` | Property for configuring message |
| `actions` | `` | ✅ | `—` | Property for configuring actions |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `message` | `` | ❌ | `message {` | Property for configuring message |

### Methods

#### `modalHeader`

Method for modalHeader functionality

```swift
private func modalHeader(title: String) -> some View {
```

**Returns:** `some View`

#### `dismissModal`

Method for dismissModal functionality

```swift
private func dismissModal() {
```

#### `widthForSize`

Method for widthForSize functionality

```swift
private func widthForSize(_ size: Size) -> CGFloat {
```

**Returns:** `CGFloat`

#### `heightForSize`

Method for heightForSize functionality

```swift
private func heightForSize(_ size: Size) -> CGFloat? {
```

**Returns:** `CGFloat?`

#### `scaledFontSize`

Method for scaledFontSize functionality

```swift
private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
```

**Returns:** `CGFloat`

#### `cancel`

Method for cancel functionality

```swift
public static func cancel(_ action: @escaping () -> Void = {}) -> Action {
```

**Returns:** `Void = {}) -> Action`

#### `destructive`

Method for destructive functionality

```swift
public static func destructive(_ title: String, action: @escaping () -> Void) -> Action {
```

**Returns:** `Void) -> Action`

#### ``default``

Method for `default` functionality

```swift
public static func `default`(_ title: String, action: @escaping () -> Void) -> Action {
```

**Returns:** `Void) -> Action`

#### `modal<Content: View>`

Presents a modal dialog

```swift
public func modal<Content: View>(
```

#### `alert`

Presents an alert dialog

```swift
public func alert(
```

### Accessibility

This component includes the following accessibility features:

- Custom accessibility labels
- Accessibility hints for complex interactions

**VoiceOver Support:** Standard SwiftUI accessibility

**Keyboard Navigation:** Standard SwiftUI keyboard navigation

**High Contrast:** Adapts to system high contrast settings


---

## ChatUINavigation

A native macOS navigation component following platform patterns

**File:** `Sources/ChatUISwift/Components/ChatUINavigation.swift`
### Properties

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `` | ✅ | `—` | Property for configuring title |
| `showBackButton` | `` | ✅ | `—` | Property for configuring showBackButton |
| `onBack` | `` | ✅ | `—` | Property for configuring onBack |
| `trailingActions` | `` | ✅ | `—` | Property for configuring trailingActions |
| `content` | `` | ✅ | `—` | Property for configuring content |
| `dynamicTypeSize` | `` | ✅ | `—` | Property for configuring dynamicTypeSize |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `navigationBar` | `` | ✅ | `—` | Property for configuring navigationBar |
| `systemName` | `` | ✅ | `—` | Property for configuring systemName |
| `variant` | `` | ✅ | `—` | Property for configuring variant |
| `accessibilityLabel` | `` | ✅ | `—` | Property for configuring accessibilityLabel |
| `accessibilityHint` | `` | ✅ | `—` | Property for configuring accessibilityHint |
| `action` | `` | ✅ | `—` | Property for configuring action |
| `selection` | `` | ✅ | `—` | Property for configuring selection |
| `tabs` | `` | ✅ | `—` | Property for configuring tabs |
| `content` | `` | ✅ | `—` | Property for configuring content |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `tabBar` | `` | ✅ | `—` | Property for configuring tabBar |
| `isSelected` | `` | ❌ | `selection == index` | Property for configuring isSelected |
| `systemName` | `` | ❌ | `tab.systemName {` | Property for configuring systemName |
| `title` | `` | ✅ | `—` | Property for configuring title |
| `systemName` | `` | ✅ | `—` | Property for configuring systemName |
| `title` | `` | ✅ | `—` | Property for configuring title |
| `action` | `` | ✅ | `—` | Property for configuring action |
| `items` | `` | ✅ | `—` | Property for configuring items |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `action` | `` | ❌ | `item.action {` | Property for configuring action |

### Methods

#### `scaledFontSize`

Method for scaledFontSize functionality

```swift
private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
```

**Returns:** `CGFloat`

#### `settings`

Method for settings functionality

```swift
public static func settings(action: @escaping () -> Void) -> NavigationAction {
```

**Returns:** `Void) -> NavigationAction`

#### `add`

Method for add functionality

```swift
public static func add(action: @escaping () -> Void) -> NavigationAction {
```

**Returns:** `Void) -> NavigationAction`

#### `search`

Method for search functionality

```swift
public static func search(action: @escaping () -> Void) -> NavigationAction {
```

**Returns:** `Void) -> NavigationAction`

#### `more`

Method for more functionality

```swift
public static func more(action: @escaping () -> Void) -> NavigationAction {
```

**Returns:** `Void) -> NavigationAction`

#### `tabButton`

Method for tabButton functionality

```swift
private func tabButton(for tab: TabItem, at index: Int) -> some View {
```

**Returns:** `some View`

#### `navigationContainer`

Wraps the view in a navigation container

```swift
public func navigationContainer(
```

### Accessibility

This component includes the following accessibility features:

- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Custom accessibility labels

**VoiceOver Support:** Standard SwiftUI accessibility

**Keyboard Navigation:** Standard SwiftUI keyboard navigation

**High Contrast:** Adapts to system high contrast settings


---

## ChatUIToast

A native macOS toast notification component with system integration

**File:** `Sources/ChatUISwift/Components/ChatUIToast.swift`
### Properties

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `message` | `` | ✅ | `—` | Property for configuring message |
| `style` | `` | ✅ | `—` | Property for configuring style |
| `duration` | `` | ✅ | `—` | Property for configuring duration |
| `showIcon` | `` | ✅ | `—` | Property for configuring showIcon |
| `onDismiss` | `` | ✅ | `—` | Property for configuring onDismiss |
| `isVisible` | `` | ❌ | `true` | Property for configuring isVisible |
| `dynamicTypeSize` | `` | ✅ | `—` | Property for configuring dynamicTypeSize |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `prefersHighContrast` | `` | ❌ | `DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast` | Property for configuring prefersHighContrast |
| `animationDuration` | `` | ✅ | `—` | Property for configuring animationDuration |
| `activeToasts` | `` | ❌ | `[]` | Property for configuring activeToasts |
| `shared` | `` | ❌ | `ChatUIToastManager()` | Property for configuring shared |
| `id` | `` | ❌ | `UUID()` | Property for configuring id |
| `toast` | `` | ✅ | `—` | Property for configuring toast |
| `position` | `` | ✅ | `—` | Property for configuring position |
| `toast` | `` | ❌ | `ChatUIToast(` | Property for configuring toast |
| `item` | `` | ❌ | `ToastItem(toast: toast.show(), position: position)` | Property for configuring item |
| `center` | `` | ❌ | `UNUserNotificationCenter.current()` | Request notification permissions |
| `granted` | `` | ❌ | `try await center.requestAuthorization(options: [.alert, .sound, .badge])` | Property for configuring granted |
| `center` | `` | ❌ | `UNUserNotificationCenter.current()` | Property for configuring center |
| `settings` | `` | ❌ | `await center.notificationSettings()` | Property for configuring settings |
| `content` | `` | ❌ | `UNMutableNotificationContent()` | Property for configuring content |
| `trigger` | `` | ❌ | `delay > 0` | Property for configuring trigger |
| `request` | `` | ❌ | `UNNotificationRequest(` | Property for configuring request |
| `toastManager` | `` | ❌ | `ChatUIToastManager.shared` | Property for configuring toastManager |
| `body` | `` | ✅ | `—` | Property for configuring body |
| `topToasts` | `` | ✅ | `—` | Property for configuring topToasts |
| `bottomToasts` | `` | ✅ | `—` | Property for configuring bottomToasts |
| `topLeadingToasts` | `` | ✅ | `—` | Property for configuring topLeadingToasts |
| `topTrailingToasts` | `` | ✅ | `—` | Property for configuring topTrailingToasts |
| `bottomLeadingToasts` | `` | ✅ | `—` | Property for configuring bottomLeadingToasts |
| `bottomTrailingToasts` | `` | ✅ | `—` | Property for configuring bottomTrailingToasts |

### Methods

#### `dismissToast`

Method for dismissToast functionality

```swift
private func dismissToast() {
```

#### `iconForStyle`

Method for iconForStyle functionality

```swift
private func iconForStyle(_ style: Style) -> String {
```

**Returns:** `String`

#### `iconColorForStyle`

Method for iconColorForStyle functionality

```swift
private func iconColorForStyle(_ style: Style) -> Color {
```

**Returns:** `Color`

#### `backgroundColorForStyle`

Method for backgroundColorForStyle functionality

```swift
private func backgroundColorForStyle(_ style: Style) -> Color {
```

**Returns:** `Color`

#### `textColorForStyle`

Method for textColorForStyle functionality

```swift
private func textColorForStyle(_ style: Style) -> Color {
```

**Returns:** `Color`

#### `borderColorForStyle`

Method for borderColorForStyle functionality

```swift
private func borderColorForStyle(_ style: Style) -> Color {
```

**Returns:** `Color`

#### `accessibilityLabelForStyle`

Method for accessibilityLabelForStyle functionality

```swift
private func accessibilityLabelForStyle(_ style: Style) -> String {
```

**Returns:** `String`

#### `scaledFontSize`

Method for scaledFontSize functionality

```swift
private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
```

**Returns:** `CGFloat`

#### `show`

Method for show functionality

```swift
public func show() -> ChatUIToast {
```

**Returns:** `ChatUIToast`

#### `show`

Method for show functionality

```swift
public func show(
```

#### `removeToast`

Method for removeToast functionality

```swift
private func removeToast(message: String) {
```

#### `requestNotificationPermissions`

Request notification permissions

```swift
public func requestNotificationPermissions() async -> Bool {
```

**Returns:** `Bool`

#### `sendSystemNotification`

Send a system notification

```swift
public func sendSystemNotification(
```

#### `showInfo`

Method for showInfo functionality

```swift
public func showInfo(_ message: String, position: ChatUIToast.Position = .top) {
```

#### `showSuccess`

Method for showSuccess functionality

```swift
public func showSuccess(_ message: String, position: ChatUIToast.Position = .top) {
```

#### `showWarning`

Method for showWarning functionality

```swift
public func showWarning(_ message: String, position: ChatUIToast.Position = .top) {
```

#### `showError`

Method for showError functionality

```swift
public func showError(_ message: String, position: ChatUIToast.Position = .top) {
```

#### `toastContainer`

Adds toast notification support to the view

```swift
public func toastContainer() -> some View {
```

**Returns:** `some View`

### Accessibility

This component includes the following accessibility features:

- Custom accessibility labels
- Accessibility hints for complex interactions
- Custom accessibility labels
- Custom accessibility labels

**VoiceOver Support:** Standard SwiftUI accessibility

**Keyboard Navigation:** Standard SwiftUI keyboard navigation

**High Contrast:** Adapts to system high contrast settings


---

