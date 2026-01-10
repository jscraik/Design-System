import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders a header bar for template surfaces.
public struct TemplateHeaderBarView: View {
    @Environment(\.chatUITheme) private var theme
    @Environment(\.colorScheme) private var scheme

    private let title: String
    private let leading: AnyView?
    private let trailing: AnyView?

    /// Creates a header bar view.
    /// - Parameters:
    ///   - title: The title displayed in the header.
    ///   - leading: Optional leading content (such as a badge or pill).
    ///   - trailing: Optional trailing content (such as controls or pickers).
    public init(title: String, leading: AnyView? = nil, trailing: AnyView? = nil) {
        self.title = title
        self.leading = leading
        self.trailing = trailing
    }

    /// The content and behavior of this view.
    public var body: some View {
        HStack(spacing: FSpacing.s8) {
            Text(title)
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)

            if let leading {
                leading
            }

            Spacer()

            if let trailing {
                trailing
            }
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s8)
        .background(FColor.bgCard)
        .overlay(
            Rectangle()
                .fill(FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight))
                .frame(height: 0.5),
            alignment: .bottom
        )
    }
}

/// Renders a footer bar for template surfaces.
public struct TemplateFooterBarView: View {
    private let leading: AnyView?
    private let trailing: AnyView?

    /// Creates a footer bar view.
    /// - Parameters:
    ///   - leading: Optional leading content.
    ///   - trailing: Optional trailing content.
    public init(leading: AnyView? = nil, trailing: AnyView? = nil) {
        self.leading = leading
        self.trailing = trailing
    }

    /// The content and behavior of this view.
    public var body: some View {
        HStack(spacing: FSpacing.s8) {
            if let leading {
                leading
            }

            Spacer()

            if let trailing {
                trailing
            }
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s8)
        .background(FColor.bgApp)
        .overlay(SettingsDivider(), alignment: .top)
    }
}
