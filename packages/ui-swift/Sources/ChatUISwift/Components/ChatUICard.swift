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
        switch variant {
        case .default, .elevated, .outlined:
            return DesignTokens.Colors.Background.primary
        }
    }
    
    private func borderColorForVariant(_ variant: Variant) -> Color {
        switch variant {
        case .outlined:
            return DesignTokens.Colors.Background.tertiary
        case .default, .elevated:
            return Color.clear
        }
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
        switch variant {
        case .elevated:
            return DesignTokens.Colors.Text.primary.opacity(0.1)
        case .default, .outlined:
            return Color.clear
        }
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
}

// MARK: - Convenience Modifiers

extension ChatUICard {
    public func variant(_ variant: Variant) -> ChatUICard<Content> {
        ChatUICard(variant: variant, content: content)
    }
}