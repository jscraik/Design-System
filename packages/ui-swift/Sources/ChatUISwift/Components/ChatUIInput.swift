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
    private let onSubmit: (() -> Void)?
    
    @FocusState private var isFocused: Bool
    
    public init(
        text: Binding<String>,
        placeholder: String = "",
        variant: Variant = .default,
        size: Size = .default,
        isDisabled: Bool = false,
        onSubmit: (() -> Void)? = nil
    ) {
        self._text = text
        self.placeholder = placeholder
        self.variant = variant
        self.size = size
        self.isDisabled = isDisabled
        self.onSubmit = onSubmit
    }
    
    public var body: some View {
        Group {
            switch variant {
            case .default, .search:
                TextField(placeholder, text: $text)
                    .textFieldStyle(ChatUITextFieldStyle(variant: variant, size: size, isFocused: isFocused))
            case .password:
                SecureField(placeholder, text: $text)
                    .textFieldStyle(ChatUITextFieldStyle(variant: variant, size: size, isFocused: isFocused))
            }
        }
        .focused($isFocused)
        .disabled(isDisabled)
        .onSubmit {
            onSubmit?()
        }
    }
}

// MARK: - Text Field Style

struct ChatUITextFieldStyle: TextFieldStyle {
    let variant: ChatUIInput.Variant
    let size: ChatUIInput.Size
    let isFocused: Bool
    
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .font(fontForSize(size))
            .padding(paddingForSize(size))
            .background(backgroundForVariant(variant))
            .foregroundColor(DesignTokens.Colors.Text.primary)
            .cornerRadius(cornerRadiusForSize(size))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadiusForSize(size))
                    .stroke(borderColor, lineWidth: borderWidth)
            )
    }
    
    private func fontForSize(_ size: ChatUIInput.Size) -> Font {
        switch size {
        case .default:
            return .system(size: DesignTokens.Typography.Body.size, weight: DesignTokens.Typography.Body.weight)
        case .sm:
            return .system(size: DesignTokens.Typography.BodySmall.size, weight: DesignTokens.Typography.BodySmall.weight)
        case .lg:
            return .system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight)
        }
    }
    
    private func paddingForSize(_ size: ChatUIInput.Size) -> EdgeInsets {
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
    
    private func backgroundForVariant(_ variant: ChatUIInput.Variant) -> Color {
        switch variant {
        case .default, .password:
            return DesignTokens.Colors.Background.secondary
        case .search:
            return DesignTokens.Colors.Background.tertiary
        }
    }
    
    private var borderColor: Color {
        if isFocused {
            return DesignTokens.Colors.Accent.blue
        } else {
            return DesignTokens.Colors.Background.tertiary
        }
    }
    
    private var borderWidth: CGFloat {
        return isFocused ? 2 : 1
    }
    
    private func cornerRadiusForSize(_ size: ChatUIInput.Size) -> CGFloat {
        switch size {
        case .sm:
            return DesignTokens.CornerRadius.small
        case .default, .lg:
            return DesignTokens.CornerRadius.medium
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
            onSubmit: action
        )
    }
}