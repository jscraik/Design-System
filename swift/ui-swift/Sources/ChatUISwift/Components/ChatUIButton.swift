import SwiftUI

// MARK: - Button Enums

public enum ChatUIButtonVariant {
    case `default`
    case destructive
    case outline
    case secondary
    case ghost
    case link
}

public enum ChatUIButtonSize {
    case `default`
    case sm
    case lg
    case icon
}

/// A native macOS button component that uses design tokens
public struct ChatUIButton<Content: View>: View {
    
    public typealias Variant = ChatUIButtonVariant
    public typealias Size = ChatUIButtonSize
    
    private let variant: Variant
    private let size: Size
    private let action: () -> Void
    private let content: () -> Content
    private let isDisabled: Bool
    private let accessibilityLabel: String?
    private let accessibilityHint: String?
    
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    
    public init(
        variant: Variant = .default,
        size: Size = .default,
        isDisabled: Bool = false,
        accessibilityLabel: String? = nil,
        accessibilityHint: String? = nil,
        action: @escaping () -> Void,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.variant = variant
        self.size = size
        self.isDisabled = isDisabled
        self.accessibilityLabel = accessibilityLabel
        self.accessibilityHint = accessibilityHint
        self.action = action
        self.content = content
    }
    
    public var body: some View {
        Button(action: action) {
            content()
                .font(fontForSize(size))
                .padding(paddingForSize(size))
        }
        .buttonStyle(ChatUIButtonStyle(variant: variant, size: size))
        .disabled(isDisabled)
        .accessibilityLabelIfPresent(resolvedAccessibilityLabel)
        .accessibilityHintIfPresent(resolvedAccessibilityHint)
    }
    
    // MARK: - Style Helpers
    
    private func fontForSize(_ size: Size) -> Font {
        let baseSize = Self.fontSize(for: size)
        let scaledSize = Self.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)
        return .system(size: scaledSize, weight: Self.fontWeight(for: size))
    }
    
    private func paddingForSize(_ size: Size) -> EdgeInsets {
        Self.paddingInsets(for: size)
    }
    
    private var resolvedAccessibilityLabel: String? {
        Self.resolveAccessibilityLabel(explicit: accessibilityLabel, fallback: nil)
    }
    
    private var resolvedAccessibilityHint: String? {
        let trimmedHint = accessibilityHint?.trimmingCharacters(in: .whitespacesAndNewlines)
        return (trimmedHint?.isEmpty ?? true) ? nil : trimmedHint
    }
    
    static func resolveAccessibilityLabel(explicit: String?, fallback: String?) -> String? {
        let trimmedExplicit = explicit?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmedExplicit, !trimmedExplicit.isEmpty {
            return trimmedExplicit
        }
        let trimmedFallback = fallback?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmedFallback, !trimmedFallback.isEmpty {
            return trimmedFallback
        }
        return nil
    }
    
    static func fontSize(for size: Size) -> CGFloat {
        switch size {
        case .default:
            return DesignTokens.Typography.Body.size
        case .sm:
            return DesignTokens.Typography.BodySmall.size
        case .lg:
            return DesignTokens.Typography.Heading3.size
        case .icon:
            return DesignTokens.Typography.Body.size
        }
    }
    
    static func fontWeight(for size: Size) -> Font.Weight {
        switch size {
        case .default:
            return DesignTokens.Typography.Body.weight
        case .sm:
            return DesignTokens.Typography.BodySmall.weight
        case .lg:
            return DesignTokens.Typography.Heading3.weight
        case .icon:
            return DesignTokens.Typography.Body.weight
        }
    }
    
    static func paddingInsets(for size: Size) -> EdgeInsets {
        switch size {
        case .default:
            return EdgeInsets(
                top: DesignTokens.Spacing.xs,
                leading: DesignTokens.Spacing.sm,
                bottom: DesignTokens.Spacing.xs,
                trailing: DesignTokens.Spacing.sm
            )
        case .sm:
            return EdgeInsets(
                top: DesignTokens.Spacing.xxs,
                leading: DesignTokens.Spacing.smXs,
                bottom: DesignTokens.Spacing.xxs,
                trailing: DesignTokens.Spacing.smXs
            )
        case .lg:
            return EdgeInsets(
                top: DesignTokens.Spacing.smXs,
                leading: DesignTokens.Spacing.mdSm,
                bottom: DesignTokens.Spacing.smXs,
                trailing: DesignTokens.Spacing.mdSm
            )
        case .icon:
            return EdgeInsets(
                top: DesignTokens.Spacing.xs,
                leading: DesignTokens.Spacing.xs,
                bottom: DesignTokens.Spacing.xs,
                trailing: DesignTokens.Spacing.xs
            )
        }
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

// MARK: - Button Style

struct ChatUIButtonStyle: ButtonStyle {
    let variant: ChatUIButtonVariant
    let size: ChatUIButtonSize
    
    func makeBody(configuration: Configuration) -> some View {
        let animationDuration = DesignTokens.Accessibility.Animation.duration()
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        configuration.label
            .background(backgroundForVariant(variant, isPressed: configuration.isPressed, prefersHighContrast: prefersHighContrast))
            .foregroundColor(foregroundForVariant(variant, isPressed: configuration.isPressed, prefersHighContrast: prefersHighContrast))
            .cornerRadius(cornerRadiusForSize(size))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadiusForSize(size))
                    .stroke(borderColorForVariant(variant, prefersHighContrast: prefersHighContrast), lineWidth: borderWidthForVariant(variant))
            )
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(.easeInOut(duration: animationDuration), value: configuration.isPressed)
    }
    
    private func backgroundForVariant(_ variant: ChatUIButtonVariant, isPressed: Bool, prefersHighContrast: Bool) -> Color {
        let opacity = isPressed ? 0.9 : 1.0
        let token = Self.backgroundToken(for: variant, isPressed: isPressed, prefersHighContrast: prefersHighContrast)
        return color(for: token).opacity(opacity)
    }
    
    private func foregroundForVariant(_ variant: ChatUIButtonVariant, isPressed: Bool, prefersHighContrast: Bool) -> Color {
        let token = Self.foregroundToken(for: variant, prefersHighContrast: prefersHighContrast)
        return color(for: token)
    }
    
    private func borderColorForVariant(_ variant: ChatUIButtonVariant, prefersHighContrast: Bool) -> Color {
        let token = Self.borderToken(for: variant, prefersHighContrast: prefersHighContrast)
        return color(for: token)
    }
    
    private func borderWidthForVariant(_ variant: ChatUIButtonVariant) -> CGFloat {
        switch variant {
        case .outline:
            return 1
        default:
            return 0
        }
    }
    
    private func cornerRadiusForSize(_ size: ChatUIButtonSize) -> CGFloat {
        switch size {
        case .sm:
            return DesignTokens.CornerRadius.small
        case .default, .lg:
            return DesignTokens.CornerRadius.medium
        case .icon:
            return DesignTokens.CornerRadius.small
        }
    }
    
    static func backgroundToken(for variant: ChatUIButtonVariant, isPressed: Bool, prefersHighContrast: Bool) -> ChatUIButtonColorToken {
        if prefersHighContrast {
            switch variant {
            case .default, .destructive, .secondary:
                return .highContrastBackground
            case .outline, .ghost, .link:
                return .clear
            }
        }
        switch variant {
        case .default:
            return .accentBlue
        case .destructive:
            return .accentRed
        case .outline:
            return .clear
        case .secondary:
            return .backgroundSecondary
        case .ghost:
            return isPressed ? .backgroundSecondary : .clear
        case .link:
            return .clear
        }
    }
    
    static func foregroundToken(for variant: ChatUIButtonVariant, prefersHighContrast: Bool) -> ChatUIButtonColorToken {
        if prefersHighContrast {
            return .highContrastText
        }
        switch variant {
        case .default, .destructive:
            return .textOnAccent
        case .outline, .link:
            return .accentBlue
        case .secondary, .ghost:
            return .textPrimary
        }
    }
    
    static func borderToken(for variant: ChatUIButtonVariant, prefersHighContrast: Bool) -> ChatUIButtonColorToken {
        if prefersHighContrast {
            return variant == .outline ? .highContrastBorder : .clear
        }
        return variant == .outline ? .borderAccentBlue : .clear
    }
    
    private func color(for token: ChatUIButtonColorToken) -> Color {
        switch token {
        case .accentBlue:
            return DesignTokens.Colors.Accent.blue
        case .accentRed:
            return DesignTokens.Colors.Accent.red
        case .backgroundSecondary:
            return DesignTokens.Colors.Background.secondary
        case .textPrimary:
            return DesignTokens.Colors.Text.primary
        case .textOnAccent:
            return .white
        case .borderAccentBlue:
            return DesignTokens.Colors.Accent.blue
        case .highContrastBackground:
            return DesignTokens.Accessibility.HighContrast.backgroundContrast
        case .highContrastText:
            return DesignTokens.Accessibility.HighContrast.textOnBackground
        case .highContrastBorder:
            return DesignTokens.Accessibility.HighContrast.borderContrast
        case .clear:
            return Color.clear
        }
    }
}

enum ChatUIButtonColorToken {
    case accentBlue
    case accentRed
    case backgroundSecondary
    case textPrimary
    case textOnAccent
    case borderAccentBlue
    case highContrastBackground
    case highContrastText
    case highContrastBorder
    case clear
}

// MARK: - Convenience Initializers

extension ChatUIButton where Content == Text {
    public init(
        _ title: String,
        variant: Variant = .default,
        size: Size = .default,
        isDisabled: Bool = false,
        accessibilityLabel: String? = nil,
        accessibilityHint: String? = nil,
        action: @escaping () -> Void
    ) {
        let resolvedLabel = Self.resolveAccessibilityLabel(explicit: accessibilityLabel, fallback: title)
        self.init(
            variant: variant,
            size: size,
            isDisabled: isDisabled,
            accessibilityLabel: resolvedLabel,
            accessibilityHint: accessibilityHint,
            action: action
        ) {
            Text(title)
        }
    }
}

extension ChatUIButton where Content == Image {
    public init(
        systemName: String,
        variant: Variant = .default,
        size: Size = .icon,
        isDisabled: Bool = false,
        accessibilityLabel: String? = nil,
        accessibilityHint: String? = nil,
        action: @escaping () -> Void
    ) {
        let resolvedLabel = Self.resolveAccessibilityLabel(explicit: accessibilityLabel, fallback: systemName)
        self.init(
            variant: variant,
            size: size,
            isDisabled: isDisabled,
            accessibilityLabel: resolvedLabel,
            accessibilityHint: accessibilityHint,
            action: action
        ) {
            Image(systemName: systemName)
        }
    }
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
}
