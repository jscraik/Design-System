import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders a labeled form field row for templates.
public struct TemplateFormFieldView<Content: View>: View {
    private let label: String
    private let actions: AnyView?
    private let content: Content

    /// Creates a form field view with optional actions.
    /// - Parameters:
    ///   - label: The field label displayed above the content.
    ///   - actions: Optional trailing actions displayed next to the label.
    ///   - content: The field content.
    public init(
        label: String,
        actions: AnyView? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.label = label
        self.actions = actions
        self.content = content()
    }

    /// The content and behavior of this view.
    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s8) {
            HStack(spacing: FSpacing.s8) {
                Text(label)
                    .font(FType.sectionTitle())
                    .foregroundStyle(FColor.textSecondary)

                if let actions {
                    Spacer()
                    actions
                }
            }

            content
        }
    }
}
