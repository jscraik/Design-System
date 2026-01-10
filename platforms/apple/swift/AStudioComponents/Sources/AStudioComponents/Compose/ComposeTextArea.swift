import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders a text area for compose input with placeholder.
///
/// - Example:
/// ```swift
/// ComposeTextArea(text: $text, placeholder: "Describe your task", minHeight: 120, accessibilityLabel: "Task")
/// ```
public struct ComposeTextArea: View {
    @Environment(\.chatUITheme) private var theme
    @Environment(\.colorScheme) private var scheme

    let text: Binding<String>
    let placeholder: String
    let minHeight: CGFloat
    let accessibilityLabel: String

    /// Creates a compose text area.
    ///
    /// - Parameters:
    ///   - text: Bound text value.
    ///   - placeholder: Placeholder text to show when empty.
    ///   - minHeight: Minimum height for the text area.
    ///   - accessibilityLabel: Accessibility label for VoiceOver.
    public init(
        text: Binding<String>,
        placeholder: String,
        minHeight: CGFloat,
        accessibilityLabel: String
    ) {
        self.text = text
        self.placeholder = placeholder
        self.minHeight = minHeight
        self.accessibilityLabel = accessibilityLabel
    }

    /// The content and behavior of this view.
    public var body: some View {
        ZStack(alignment: .topLeading) {
            if text.wrappedValue.isEmpty {
                Text(placeholder)
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textTertiary)
                    .padding(.horizontal, FSpacing.s12)
                    .padding(.vertical, FSpacing.s8)
            }

            TextEditor(text: text)
                .font(FType.rowTitle())
                .padding(.horizontal, FSpacing.s8)
                .padding(.vertical, FSpacing.s8)
                .frame(minHeight: minHeight)
                .background(FColor.bgApp)
                .clipShape(RoundedRectangle(cornerRadius: theme.inputCornerRadius))
                .overlay(
                    RoundedRectangle(cornerRadius: theme.inputCornerRadius)
                        .stroke(FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight), lineWidth: 1)
                )
                .accessibilityLabel(Text(accessibilityLabel))
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s8)
    }
}
