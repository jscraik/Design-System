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
    
    public init(
        variant: Variant = .default,
        size: Size = .default,
        isDisabled: Bool = false,
        action: @escaping () -> Void,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.variant = variant
        self.size = size
        self.isDisabled = isDisabled
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
    }
    
    // MARK: - Style Helpers
    
    private func fontForSize(_ size: Size) -> Font {
        switch size {
        case .default:
            return .system(size: DesignTokens.Typography.Body.size, weight: DesignTokens.Typography.Body.weight)
        case .sm:
            return .system(size: DesignTokens.Typography.BodySmall.size, weight: DesignTokens.Typography.BodySmall.weight)
        case .lg:
            return .system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight)
        case .icon:
            return .system(size: DesignTokens.Typography.Body.size, weight: DesignTokens.Typography.Body.weight)
        }
    }
    
    private func paddingForSize(_ size: Size) -> EdgeInsets {
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
}

// MARK: - Button Style

struct ChatUIButtonStyle: ButtonStyle {
    let variant: ChatUIButtonVariant
    let size: ChatUIButtonSize
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(backgroundForVariant(variant, isPressed: configuration.isPressed))
            .foregroundColor(foregroundForVariant(variant, isPressed: configuration.isPressed))
            .cornerRadius(cornerRadiusForSize(size))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadiusForSize(size))
                    .stroke(borderColorForVariant(variant), lineWidth: borderWidthForVariant(variant))
            )
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
    
    private func backgroundForVariant(_ variant: ChatUIButtonVariant, isPressed: Bool) -> Color {
        let opacity = isPressed ? 0.9 : 1.0
        
        switch variant {
        case .default:
            return DesignTokens.Colors.Accent.blue.opacity(opacity)
        case .destructive:
            return DesignTokens.Colors.Accent.red.opacity(opacity)
        case .outline:
            return Color.clear
        case .secondary:
            return DesignTokens.Colors.Background.secondary.opacity(opacity)
        case .ghost:
            return isPressed ? DesignTokens.Colors.Background.secondary.opacity(0.5) : Color.clear
        case .link:
            return Color.clear
        }
    }
    
    private func foregroundForVariant(_ variant: ChatUIButtonVariant, isPressed: Bool) -> Color {
        switch variant {
        case .default:
            return .white
        case .destructive:
            return .white
        case .outline:
            return DesignTokens.Colors.Accent.blue
        case .secondary:
            return DesignTokens.Colors.Text.primary
        case .ghost:
            return DesignTokens.Colors.Text.primary
        case .link:
            return DesignTokens.Colors.Accent.blue
        }
    }
    
    private func borderColorForVariant(_ variant: ChatUIButtonVariant) -> Color {
        switch variant {
        case .outline:
            return DesignTokens.Colors.Accent.blue
        default:
            return Color.clear
        }
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
}

// MARK: - Convenience Initializers

extension ChatUIButton where Content == Text {
    public init(
        _ title: String,
        variant: Variant = .default,
        size: Size = .default,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.init(
            variant: variant,
            size: size,
            isDisabled: isDisabled,
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
        action: @escaping () -> Void
    ) {
        self.init(
            variant: variant,
            size: size,
            isDisabled: isDisabled,
            action: action
        ) {
            Image(systemName: systemName)
        }
    }
}