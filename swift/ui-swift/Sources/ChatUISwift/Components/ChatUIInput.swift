import SwiftUI

/// A native macOS text input component that uses design tokens
public struct ChatUIInput: View {
    
    public enum Variant {
        case `default`
        case search
        case password
    }
    
    public enum Size {
        case `default`
        case sm
        case lg
    }
    
    @Binding private var text: String
    private let placeholder: String
    private let variant: Variant
    private let size: Size
    private let isDisabled: Bool
    private let accessibilityLabel: String?
    private let accessibilityHint: String?
    private let submitLabel: SubmitLabel?
    private let onSubmit: (() -> Void)?
    
    @FocusState private var isFocused: Bool
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    
    public init(
        text: Binding<String>,
        placeholder: String = "",
        variant: Variant = .default,
        size: Size = .default,
        isDisabled: Bool = false,
        accessibilityLabel: String? = nil,
        accessibilityHint: String? = nil,
        submitLabel: SubmitLabel? = nil,
        onSubmit: (() -> Void)? = nil
    ) {
        self._text = text
        self.placeholder = placeholder
        self.variant = variant
        self.size = size
        self.isDisabled = isDisabled
        self.accessibilityLabel = accessibilityLabel
        self.accessibilityHint = accessibilityHint
        self.submitLabel = submitLabel
        self.onSubmit = onSubmit
    }
    
    public var body: some View {
        Group {
            switch variant {
            case .default, .search:
                TextField(placeholder, text: $text)
                    .textFieldStyle(
                        ChatUITextFieldStyle(
                            variant: variant,
                            size: size,
                            isFocused: isFocused,
                            dynamicTypeSize: dynamicTypeSize
                        )
                    )
            case .password:
                SecureField(placeholder, text: $text)
                    .textFieldStyle(
                        ChatUITextFieldStyle(
                            variant: variant,
                            size: size,
                            isFocused: isFocused,
                            dynamicTypeSize: dynamicTypeSize
                        )
                    )
            }
        }
        .focused($isFocused)
        .disabled(isDisabled)
        .onSubmit {
            onSubmit?()
        }
        .accessibilityLabelIfPresent(resolvedAccessibilityLabel)
        .accessibilityHintIfPresent(resolvedAccessibilityHint)
        .submitLabelIfPresent(submitLabel)
    }
    
    private var resolvedAccessibilityLabel: String? {
        Self.resolveAccessibilityLabel(explicit: accessibilityLabel, placeholder: placeholder)
    }
    
    private var resolvedAccessibilityHint: String? {
        let trimmedHint = accessibilityHint?.trimmingCharacters(in: .whitespacesAndNewlines)
        return (trimmedHint?.isEmpty ?? true) ? nil : trimmedHint
    }
    
    static func resolveAccessibilityLabel(explicit: String?, placeholder: String) -> String? {
        let trimmedExplicit = explicit?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmedExplicit, !trimmedExplicit.isEmpty {
            return trimmedExplicit
        }
        let trimmedPlaceholder = placeholder.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedPlaceholder.isEmpty {
            return trimmedPlaceholder
        }
        return nil
    }
    
    static func scaledFontSize(_ baseSize: CGFloat, dynamicTypeSize: DynamicTypeSize) -> CGFloat {
        let scale = Self.dynamicTypeScale(for: dynamicTypeSize)
        return baseSize * scale
    }
    
    static func dynamicTypeScale(for dynamicTypeSize: DynamicTypeSize) -> CGFloat {
        switch dynamicTypeSize {
        case .xSmall:
            return 0.9
        case .small:
            return 0.95
        case .medium:
            return 0.98
        case .large:
            return 1.0
        case .xLarge:
            return 1.05
        case .xxLarge:
            return 1.1
        case .xxxLarge:
            return 1.2
        case .accessibility1:
            return 1.3
        case .accessibility2:
            return 1.4
        case .accessibility3:
            return 1.5
        case .accessibility4:
            return 1.6
        case .accessibility5:
            return 1.7
        @unknown default:
            return 1.0
        }
    }
}

// MARK: - Text Field Style

struct ChatUITextFieldStyle: TextFieldStyle {
    let variant: ChatUIInput.Variant
    let size: ChatUIInput.Size
    let isFocused: Bool
    let dynamicTypeSize: DynamicTypeSize
    
    func _body(configuration: TextField<Self._Label>) -> some View {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        configuration
            .font(fontForSize(size, dynamicTypeSize: dynamicTypeSize))
            .padding(paddingForSize(size))
            .background(backgroundForVariant(variant, prefersHighContrast: prefersHighContrast))
            .foregroundColor(foregroundForVariant(prefersHighContrast: prefersHighContrast))
            .cornerRadius(cornerRadiusForSize(size))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadiusForSize(size))
                    .stroke(borderColor, lineWidth: borderWidth)
            )
    }
    
    private func fontForSize(_ size: ChatUIInput.Size, dynamicTypeSize: DynamicTypeSize) -> Font {
        let baseSize = Self.fontSize(for: size)
        let scaledSize = ChatUIInput.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)
        return .system(size: scaledSize, weight: Self.fontWeight(for: size))
    }
    
    private func paddingForSize(_ size: ChatUIInput.Size) -> EdgeInsets {
        Self.paddingInsets(for: size)
    }
    
    private func backgroundForVariant(_ variant: ChatUIInput.Variant, prefersHighContrast: Bool) -> Color {
        let token = Self.backgroundToken(for: variant, prefersHighContrast: prefersHighContrast)
        return color(for: token)
    }
    
    private var borderColor: Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        let token = Self.borderToken(isFocused: isFocused, prefersHighContrast: prefersHighContrast)
        return color(for: token)
    }
    
    private var borderWidth: CGFloat {
        return isFocused ? DesignTokens.Accessibility.focusRingWidth : 1
    }
    
    private func cornerRadiusForSize(_ size: ChatUIInput.Size) -> CGFloat {
        switch size {
        case .sm:
            return DesignTokens.CornerRadius.small
        case .default, .lg:
            return DesignTokens.CornerRadius.medium
        }
    }
    
    private func foregroundForVariant(prefersHighContrast: Bool) -> Color {
        let token = prefersHighContrast ? ChatUIInputColorToken.highContrastText : .textPrimary
        return color(for: token)
    }
    
    static func fontSize(for size: ChatUIInput.Size) -> CGFloat {
        switch size {
        case .default:
            return DesignTokens.Typography.Body.size
        case .sm:
            return DesignTokens.Typography.BodySmall.size
        case .lg:
            return DesignTokens.Typography.Heading3.size
        }
    }
    
    static func fontWeight(for size: ChatUIInput.Size) -> Font.Weight {
        switch size {
        case .default:
            return DesignTokens.Typography.Body.weight
        case .sm:
            return DesignTokens.Typography.BodySmall.weight
        case .lg:
            return DesignTokens.Typography.Heading3.weight
        }
    }
    
    static func paddingInsets(for size: ChatUIInput.Size) -> EdgeInsets {
        switch size {
        case .default:
            return EdgeInsets(
                top: DesignTokens.Spacing.xs,
                leading: DesignTokens.Spacing.smXs,
                bottom: DesignTokens.Spacing.xs,
                trailing: DesignTokens.Spacing.smXs
            )
        case .sm:
            return EdgeInsets(
                top: DesignTokens.Spacing.xxs,
                leading: DesignTokens.Spacing.xs,
                bottom: DesignTokens.Spacing.xxs,
                trailing: DesignTokens.Spacing.xs
            )
        case .lg:
            return EdgeInsets(
                top: DesignTokens.Spacing.smXs,
                leading: DesignTokens.Spacing.sm,
                bottom: DesignTokens.Spacing.smXs,
                trailing: DesignTokens.Spacing.sm
            )
        }
    }
    
    static func backgroundToken(for variant: ChatUIInput.Variant, prefersHighContrast: Bool) -> ChatUIInputColorToken {
        if prefersHighContrast {
            return .highContrastBackground
        }
        switch variant {
        case .default, .password:
            return .backgroundSecondary
        case .search:
            return .backgroundTertiary
        }
    }
    
    static func borderToken(isFocused: Bool, prefersHighContrast: Bool) -> ChatUIInputColorToken {
        if prefersHighContrast {
            return isFocused ? .highContrastBorder : .highContrastBorder
        }
        return isFocused ? .focusRing : .backgroundTertiary
    }
    
    private func color(for token: ChatUIInputColorToken) -> Color {
        switch token {
        case .backgroundSecondary:
            return DesignTokens.Colors.Background.secondary
        case .backgroundTertiary:
            return DesignTokens.Colors.Background.tertiary
        case .backgroundPrimary:
            return DesignTokens.Colors.Background.primary
        case .textPrimary:
            return DesignTokens.Colors.Text.primary
        case .focusRing:
            return DesignTokens.Accessibility.focusRing
        case .highContrastBackground:
            return DesignTokens.Accessibility.HighContrast.backgroundContrast
        case .highContrastText:
            return DesignTokens.Accessibility.HighContrast.textOnBackground
        case .highContrastBorder:
            return DesignTokens.Accessibility.HighContrast.borderContrast
        }
    }
}

// MARK: - Convenience Modifiers

extension ChatUIInput {
    public func onSubmit(_ action: @escaping () -> Void) -> ChatUIInput {
        ChatUIInput(
            text: self._text,
            placeholder: self.placeholder,
            variant: self.variant,
            size: self.size,
            isDisabled: self.isDisabled,
            accessibilityLabel: self.accessibilityLabel,
            accessibilityHint: self.accessibilityHint,
            submitLabel: self.submitLabel,
            onSubmit: action
        )
    }
}

enum ChatUIInputColorToken {
    case backgroundPrimary
    case backgroundSecondary
    case backgroundTertiary
    case textPrimary
    case focusRing
    case highContrastBackground
    case highContrastText
    case highContrastBorder
}

private extension View {
    @ViewBuilder
    func accessibilityLabelIfPresent(_ label: String?) -> some View {
        if let label {
            self.accessibilityLabel(Text(label))
        } else {
            self
        }
    }
    
    @ViewBuilder
    func accessibilityHintIfPresent(_ hint: String?) -> some View {
        if let hint {
            self.accessibilityHint(Text(hint))
        } else {
            self
        }
    }
    
    @ViewBuilder
    func submitLabelIfPresent(_ label: SubmitLabel?) -> some View {
        if let label {
            self.submitLabel(label)
        } else {
            self
        }
    }
}
