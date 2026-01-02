import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Select option model for `SelectView`.
public struct SelectOption: Identifiable, Hashable {
    /// Stable identifier for the option.
    public let id: String
    /// Display label for the option.
    public let label: String

    /// Creates a select option.
    ///
    /// - Parameters:
    ///   - value: Option value.
    ///   - label: Optional display label (defaults to `value`).
    public init(value: String, label: String? = nil) {
        self.id = value
        self.label = label ?? value
    }
}

/// Size variants for `SelectView`.
public enum SelectSize {
    case sm
    case `default`
}

/// Renders a dropdown selection view.
///
/// ### Discussion
/// Uses a native `Menu` with a styled label.
///
/// - Example:
/// ```swift
/// SelectView(selection: $selection, options: [SelectOption(value: "One")])
/// ```
public struct SelectView: View {
    @Binding private var selection: String
    private let options: [SelectOption]
    private let placeholder: String
    private let size: SelectSize
    private let isDisabled: Bool
    private let accessibilityLabel: String?
    private let accessibilityHint: String?

    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme

    /// Creates a select view.
    ///
    /// - Parameters:
    ///   - selection: Binding for the selected value.
    ///   - options: Options to display.
    ///   - placeholder: Placeholder text when selection is empty.
    ///   - size: Size variant (default: `.default`).
    ///   - isDisabled: Whether the control is disabled.
    ///   - accessibilityLabel: Accessibility label for VoiceOver.
    ///   - accessibilityHint: Accessibility hint for VoiceOver.
    public init(
        selection: Binding<String>,
        options: [SelectOption],
        placeholder: String = "Select an option",
        size: SelectSize = .default,
        isDisabled: Bool = false,
        accessibilityLabel: String? = nil,
        accessibilityHint: String? = nil
    ) {
        self._selection = selection
        self.options = options
        self.placeholder = placeholder
        self.size = size
        self.isDisabled = isDisabled
        self.accessibilityLabel = accessibilityLabel
        self.accessibilityHint = accessibilityHint
    }

    /// The content and behavior of this view.
    public var body: some View {
        Menu {
            ForEach(options) { option in
                Button {
                    selection = option.id
                } label: {
                    HStack {
                        Text(option.label)
                        if option.id == selection {
                            Spacer()
                            Image(systemName: "checkmark")
                                .font(.system(size: 12, weight: .semibold))
                                .accessibilityHidden(true)
                        }
                    }
                }
            }
        } label: {
            HStack(spacing: FSpacing.s8) {
                Text(displayLabel)
                    .font(fontForSize)
                    .foregroundStyle(displayColor)
                    .lineLimit(1)

                Spacer()

                Image(systemName: "chevron.down")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(FColor.iconSecondary)
                    .accessibilityHidden(true)
            }
            .padding(.horizontal, FSpacing.s12)
            .padding(.vertical, size == .sm ? FSpacing.s4 : FSpacing.s8)
            .background(FColor.bgCard)
            .overlay(
                RoundedRectangle(cornerRadius: theme.inputCornerRadius, style: .continuous)
                    .stroke(
                        FColor.divider.opacity(
                            scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight
                        ),
                        lineWidth: 1
                    )
            )
            .clipShape(RoundedRectangle(cornerRadius: theme.inputCornerRadius, style: .continuous))
        }
        .disabled(isDisabled)
        .accessibilityLabelIfPresent(resolvedAccessibilityLabel)
        .accessibilityHintIfPresent(resolvedAccessibilityHint)
        #if os(macOS)
        .menuStyle(.borderlessButton)
        #endif
    }

    private var displayLabel: String {
        if selection.isEmpty {
            return placeholder
        }
        return options.first(where: { $0.id == selection })?.label ?? selection
    }

    private var displayColor: Color {
        selection.isEmpty ? FColor.textTertiary : FColor.textPrimary
    }

    private var fontForSize: Font {
        size == .sm ? FType.caption() : FType.rowTitle()
    }

    private var resolvedAccessibilityLabel: String? {
        let trimmed = accessibilityLabel?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmed, !trimmed.isEmpty {
            return trimmed
        }
        return placeholder.isEmpty ? nil : placeholder
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
