import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders a labeled group of form fields for templates.
public struct TemplateFieldGroupView<Content: View>: View {
    private let label: String
    private let actions: AnyView?
    private let content: Content

    /// Creates a field group view with optional actions.
    /// - Parameters:
    ///   - label: The group label displayed above the fields.
    ///   - actions: Optional trailing actions displayed next to the label.
    ///   - content: The grouped field content.
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

                Spacer()

                if let actions {
                    actions
                }
            }

            content
        }
    }
}
