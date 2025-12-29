import SwiftUI
import ChatUIFoundation
import ChatUIThemes

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

/// A native button component that uses ChatUIFoundation tokens
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
        switch size {
        case .default:
            return FType.rowTitle()
        case .sm:
            return FType.caption()
        case .lg:
            return FType.title()
        case .icon:
            return FType.rowTitle()
        }
    }
    
    private func paddingForSize(_ size: Size) -> EdgeInsets {
        switch size {
        case .default:
            return EdgeInsets(top: FSpacing.s8, leading: FSpacing.s16, bottom: FSpacing.s8, trailing: FSpacing.s16)
        case .sm:
            return EdgeInsets(top: FSpacing.s4, leading: FSpacing.s12, bottom: FSpacing.s4, trailing: FSpacing.s12)
        case .lg:
            return EdgeInsets(top: FSpacing.s12, leading: FSpacing.s24, bottom: FSpacing.s12, trailing: FSpacing.s24)
        case .icon:
            return EdgeInsets(top: FSpacing.s8, leading: FSpacing.s8, bottom: FSpacing.s8, trailing: FSpacing.s8)
        }
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
}

// MARK: - Button Style

struct ChatUIButtonStyle: ButtonStyle {
    let variant: ChatUIButtonVariant
    let size: ChatUIButtonSize
    @Environment(\.chatUITheme) private var theme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.isEnabled) private var isEnabled
    
    func makeBody(configuration: Configuration) -> some View {
        let prefersHighContrast = FAccessibility.prefersHighContrast
        let scale = reduceMotion ? 1.0 : (configuration.isPressed ? 0.98 : 1.0)
        configuration.label
            .background(backgroundForVariant(variant, isPressed: configuration.isPressed, prefersHighContrast: prefersHighContrast))
            .foregroundColor(foregroundForVariant(variant, isPressed: configuration.isPressed, prefersHighContrast: prefersHighContrast))
            .cornerRadius(cornerRadiusForSize(size))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadiusForSize(size))
                    .stroke(borderColorForVariant(variant, prefersHighContrast: prefersHighContrast), lineWidth: borderWidthForVariant(variant))
            )
            .scaleEffect(scale)
            .opacity(isEnabled ? 1 : 0.55)
            .animation(reduceMotion ? nil : .easeInOut(duration: 0.15), value: configuration.isPressed)
    }
    
    private func backgroundForVariant(_ variant: ChatUIButtonVariant, isPressed: Bool, prefersHighContrast: Bool) -> Color {
        let opacity = isPressed ? 0.9 : 1.0
        
        if prefersHighContrast {
            switch variant {
            case .default, .destructive, .secondary:
                return FColor.textPrimary.opacity(opacity)
            case .outline, .ghost, .link:
                return Color.clear
            }
        }
        
        switch variant {
        case .default:
            return FColor.accentBlue.opacity(opacity)
        case .destructive:
            return FColor.accentRed.opacity(opacity)
        case .outline:
            return Color.clear
        case .secondary:
            return FColor.bgCard.opacity(opacity)
        case .ghost:
            return isPressed ? FColor.bgCard.opacity(opacity) : Color.clear
        case .link:
            return Color.clear
        }
    }
    
    private func foregroundForVariant(_ variant: ChatUIButtonVariant, isPressed: Bool, prefersHighContrast: Bool) -> Color {
        if prefersHighContrast {
            return FColor.bgApp
        }
        
        switch variant {
        case .default, .destructive:
            return Color.white
        case .outline, .link:
            return FColor.accentBlue
        case .secondary, .ghost:
            return FColor.textPrimary
        }
    }
    
    private func borderColorForVariant(_ variant: ChatUIButtonVariant, prefersHighContrast: Bool) -> Color {
        if prefersHighContrast {
            return variant == .outline ? FColor.textPrimary : Color.clear
        }
        return variant == .outline ? FColor.accentBlue : Color.clear
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
        let base = theme.buttonCornerRadius
        switch size {
        case .sm:
            return max(2, base - 2)
        case .default:
            return base
        case .lg:
            return base + 2
        case .icon:
            return max(2, base - 2)
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
