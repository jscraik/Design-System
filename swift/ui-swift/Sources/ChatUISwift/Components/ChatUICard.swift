import SwiftUI

/// A native macOS card component that uses design tokens
public struct ChatUICard<Content: View>: View {
    
    public enum Variant {
        case `default`
        case elevated
        case outlined
    }
    
    private let variant: Variant
    private let content: () -> Content
    
    public init(
        variant: Variant = .default,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.variant = variant
        self.content = content
    }
    
    public var body: some View {
        content()
            .padding(DesignTokens.Spacing.sm)
            .background(backgroundForVariant(variant))
            .cornerRadius(DesignTokens.CornerRadius.medium)
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.CornerRadius.medium)
                    .stroke(borderColorForVariant(variant), lineWidth: borderWidthForVariant(variant))
            )
            .shadow(
                color: shadowColorForVariant(variant),
                radius: shadowRadiusForVariant(variant),
                x: 0,
                y: shadowOffsetForVariant(variant)
            )
    }
    
    // MARK: - Style Helpers
    
    private func backgroundForVariant(_ variant: Variant) -> Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        let token = Self.backgroundToken(for: variant, prefersHighContrast: prefersHighContrast)
        return color(for: token)
    }
    
    private func borderColorForVariant(_ variant: Variant) -> Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        let token = Self.borderToken(for: variant, prefersHighContrast: prefersHighContrast)
        return color(for: token)
    }
    
    private func borderWidthForVariant(_ variant: Variant) -> CGFloat {
        switch variant {
        case .outlined:
            return 1
        case .default, .elevated:
            return 0
        }
    }
    
    private func shadowColorForVariant(_ variant: Variant) -> Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        let token = Self.shadowToken(for: variant, prefersHighContrast: prefersHighContrast)
        let base = color(for: token)
        return token == .shadow ? base.opacity(0.1) : base
    }
    
    private func shadowRadiusForVariant(_ variant: Variant) -> CGFloat {
        switch variant {
        case .elevated:
            return 8
        case .default, .outlined:
            return 0
        }
    }
    
    private func shadowOffsetForVariant(_ variant: Variant) -> CGFloat {
        switch variant {
        case .elevated:
            return 2
        case .default, .outlined:
            return 0
        }
    }
    
    static func backgroundToken(for variant: Variant, prefersHighContrast: Bool) -> ChatUICardColorToken {
        if prefersHighContrast {
            return .highContrastBackground
        }
        return .backgroundPrimary
    }
    
    static func borderToken(for variant: Variant, prefersHighContrast: Bool) -> ChatUICardColorToken {
        if prefersHighContrast {
            return variant == .outlined ? .highContrastBorder : .clear
        }
        return variant == .outlined ? .borderTertiary : .clear
    }
    
    static func shadowToken(for variant: Variant, prefersHighContrast: Bool) -> ChatUICardColorToken {
        if prefersHighContrast {
            return .clear
        }
        return variant == .elevated ? .shadow : .clear
    }
    
    private func color(for token: ChatUICardColorToken) -> Color {
        switch token {
        case .backgroundPrimary:
            return DesignTokens.Colors.Background.primary
        case .borderTertiary:
            return DesignTokens.Colors.Background.tertiary
        case .shadow:
            return DesignTokens.Colors.Text.primary
        case .highContrastBackground:
            return DesignTokens.Accessibility.HighContrast.backgroundContrast
        case .highContrastBorder:
            return DesignTokens.Accessibility.HighContrast.borderContrast
        case .clear:
            return Color.clear
        }
    }
}

// MARK: - Convenience Modifiers

extension ChatUICard {
    public func variant(_ variant: Variant) -> ChatUICard<Content> {
        ChatUICard(variant: variant, content: content)
    }
}

enum ChatUICardColorToken {
    case backgroundPrimary
    case borderTertiary
    case shadow
    case highContrastBackground
    case highContrastBorder
    case clear
}
