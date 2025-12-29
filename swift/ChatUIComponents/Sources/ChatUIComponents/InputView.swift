import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// A text input component with native macOS/iOS styling
/// Uses ChatUIFoundation tokens for consistent appearance
public struct InputView: View {
    
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
    @Environment(\.colorScheme) private var scheme
    
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
                    .textFieldStyle(InputViewStyle(
                        variant: variant,
                        size: size,
                        isFocused: isFocused,
                        scheme: scheme
                    ))
            case .password:
                SecureField(placeholder, text: $text)
                    .textFieldStyle(InputViewStyle(
                        variant: variant,
                        size: size,
                        isFocused: isFocused,
                        scheme: scheme
                    ))
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
}

// MARK: - Text Field Style

struct InputViewStyle: TextFieldStyle {
    let variant: InputView.Variant
    let size: InputView.Size
    let isFocused: Bool
    let scheme: ColorScheme
    
    func _body(configuration: TextField<Self._Label>) -> some View {
        let prefersHighContrast = FAccessibility.prefersHighContrast
        
        configuration
            .font(fontForSize(size))
            .padding(paddingForSize(size))
            .background(backgroundForVariant(variant, prefersHighContrast: prefersHighContrast))
            .foregroundColor(foregroundForVariant(prefersHighContrast: prefersHighContrast))
            .cornerRadius(cornerRadiusForSize(size))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadiusForSize(size))
                    .stroke(borderColor(prefersHighContrast: prefersHighContrast), lineWidth: borderWidth)
            )
    }
    
    private func fontForSize(_ size: InputView.Size) -> Font {
        switch size {
        case .default:
            return FType.rowTitle()
        case .sm:
            return FType.caption()
        case .lg:
            return FType.title()
        }
    }
    
    private func paddingForSize(_ size: InputView.Size) -> EdgeInsets {
        switch size {
        case .default:
            return EdgeInsets(top: FSpacing.s8, leading: FSpacing.s12, bottom: FSpacing.s8, trailing: FSpacing.s12)
        case .sm:
            return EdgeInsets(top: FSpacing.s4, leading: FSpacing.s8, bottom: FSpacing.s4, trailing: FSpacing.s8)
        case .lg:
            return EdgeInsets(top: FSpacing.s12, leading: FSpacing.s16, bottom: FSpacing.s12, trailing: FSpacing.s16)
        }
    }
    
    private func backgroundForVariant(_ variant: InputView.Variant, prefersHighContrast: Bool) -> Color {
        if prefersHighContrast {
            return FColor.bgApp
        }
        
        switch variant {
        case .default, .password:
            return FColor.bgCard
        case .search:
            return FColor.bgCardAlt
        }
    }
    
    private func borderColor(prefersHighContrast: Bool) -> Color {
        if prefersHighContrast {
            return FColor.textPrimary
        }
        
        if isFocused {
            return FAccessibility.focusRingColor
        }
        
        return FColor.divider.opacity(scheme == .dark ? ChatGPTTheme.dividerOpacityDark : ChatGPTTheme.dividerOpacityLight)
    }
    
    private var borderWidth: CGFloat {
        return isFocused ? FAccessibility.focusRingWidth : 1
    }
    
    private func cornerRadiusForSize(_ size: InputView.Size) -> CGFloat {
        switch size {
        case .sm:
            return 4
        case .default, .lg:
            return 8
        }
    }
    
    private func foregroundForVariant(prefersHighContrast: Bool) -> Color {
        return prefersHighContrast ? FColor.textPrimary : FColor.textPrimary
    }
}

// MARK: - Convenience Modifiers

extension InputView {
    /// Adds a submit action to the input
    public func onSubmit(_ action: @escaping () -> Void) -> InputView {
        InputView(
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

// MARK: - Private Extensions

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
