import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders a multiline text input with ChatUI styling.
///
/// ### Discussion
/// Uses a `TextEditor` with placeholder and accessibility labeling.
///
/// - Example:
/// ```swift
/// TextareaView(text: $notes, placeholder: "Add notes")
/// ```
public struct TextareaView: View {
    @Binding private var text: String
    private let placeholder: String
    private let minHeight: CGFloat
    private let isDisabled: Bool
    private let accessibilityLabel: String?
    private let accessibilityHint: String?

    @FocusState private var isFocused: Bool
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme

    /// Creates a textarea view.
    ///
    /// - Parameters:
    ///   - text: Bound text value.
    ///   - placeholder: Placeholder text (default: empty).
    ///   - minHeight: Minimum height for the editor.
    ///   - isDisabled: Whether the input is disabled.
    ///   - accessibilityLabel: Accessibility label for VoiceOver.
    ///   - accessibilityHint: Accessibility hint for VoiceOver.
    public init(
        text: Binding<String>,
        placeholder: String = "",
        minHeight: CGFloat = CGFloat(FSpacing.s32 * 3),
        isDisabled: Bool = false,
        accessibilityLabel: String? = nil,
        accessibilityHint: String? = nil
    ) {
        self._text = text
        self.placeholder = placeholder
        self.minHeight = minHeight
        self.isDisabled = isDisabled
        self.accessibilityLabel = accessibilityLabel
        self.accessibilityHint = accessibilityHint
    }

    /// The content and behavior of this view.
    public var body: some View {
        ZStack(alignment: .topLeading) {
            if text.isEmpty {
                Text(placeholder)
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textTertiary)
                    .padding(.horizontal, FSpacing.s12)
                    .padding(.vertical, FSpacing.s8)
                    .accessibilityHidden(true)
            }

            textEditor
        }
        .frame(minHeight: minHeight, alignment: .topLeading)
        .background(backgroundColor)
        .clipShape(RoundedRectangle(cornerRadius: theme.inputCornerRadius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: theme.inputCornerRadius, style: .continuous)
                .stroke(borderColor, lineWidth: borderWidth)
        )
        .disabled(isDisabled)
        .accessibilityLabelIfPresent(resolvedAccessibilityLabel)
        .accessibilityHintIfPresent(resolvedAccessibilityHint)
    }

    private var textEditor: some View {
        Group {
            if #available(iOS 16.0, macOS 13.0, *) {
                TextEditor(text: $text)
                    .scrollContentBackground(.hidden)
            } else {
                TextEditor(text: $text)
            }
        }
        .font(FType.rowTitle())
        .foregroundStyle(FColor.textPrimary)
        .padding(.horizontal, FSpacing.s12)
        .padding(.vertical, FSpacing.s8)
        .focused($isFocused)
        .accessibilityLabelIfPresent(resolvedAccessibilityLabel)
        .accessibilityHintIfPresent(resolvedAccessibilityHint)
    }

    private var backgroundColor: Color {
        if FAccessibility.prefersHighContrast {
            return FColor.bgApp
        }
        return FColor.bgCard
    }

    private var borderColor: Color {
        if FAccessibility.prefersHighContrast {
            return FColor.textPrimary
        }
        if isFocused {
            return FAccessibility.focusRingColor
        }
        return FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight)
    }

    private var borderWidth: CGFloat {
        return isFocused ? FAccessibility.focusRingWidth : 1
    }

    private var resolvedAccessibilityLabel: String? {
        let trimmed = accessibilityLabel?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmed, !trimmed.isEmpty {
            return trimmed
        }
        let trimmedPlaceholder = placeholder.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmedPlaceholder.isEmpty ? nil : trimmedPlaceholder
    }

    private var resolvedAccessibilityHint: String? {
        let trimmed = accessibilityHint?.trimmingCharacters(in: .whitespacesAndNewlines)
        return (trimmed?.isEmpty ?? true) ? nil : trimmed
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
