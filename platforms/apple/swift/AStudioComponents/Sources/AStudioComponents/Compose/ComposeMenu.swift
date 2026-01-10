import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders a dropdown menu for the compose toolbar.
///
/// - Example:
/// ```swift
/// ComposeMenu(title: "Model", options: ["Auto", "Pro"], selection: $selection)
/// ```
public struct ComposeMenu: View {
    @Environment(\.chatUITheme) private var theme

    let title: String
    let options: [String]
    @Binding var selection: String

    /// Creates a compose menu.
    ///
    /// - Parameters:
    ///   - title: Menu label text.
    ///   - options: Available options.
    ///   - selection: Binding for the selected option.
    public init(title: String, options: [String], selection: Binding<String>) {
        self.title = title
        self.options = options
        self._selection = selection
    }

    /// The content and behavior of this view.
    public var body: some View {
        Menu {
            ForEach(options, id: \.self) { option in
                Button(option) {
                    selection = option
                }
            }
        } label: {
            HStack(spacing: FSpacing.s8) {
                Text(title)
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textPrimary)
                Image(systemName: "chevron.down")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(FColor.iconSecondary)
            }
            .padding(.vertical, FSpacing.s8)
            .padding(.horizontal, FSpacing.s12)
            .background(FColor.bgCard)
            .clipShape(RoundedRectangle(cornerRadius: theme.inputCornerRadius))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(Text("Select \(title)"))
    }
}
