import SwiftUI
import ChatUIFoundation

/// Renders a settings row with a dropdown menu.
///
/// - Example:
/// ```swift
/// SettingDropdownView(title: "Theme", options: ["Light", "Dark"], selection: $selection)
/// ```
public struct SettingDropdownView: View {
    private let icon: AnyView?
    private let title: String
    private let subtitle: String?
    private let options: [String]
    @Binding private var selection: String
    
    /// Creates a settings dropdown view.
    ///
    /// - Parameters:
    ///   - icon: Optional leading icon view.
    ///   - title: Primary title text.
    ///   - subtitle: Optional subtitle text.
    ///   - options: Options to display.
    ///   - selection: Binding for the selected option.
    public init(
        icon: AnyView? = nil,
        title: String,
        subtitle: String? = nil,
        options: [String],
        selection: Binding<String>
    ) {
        self.icon = icon
        self.title = title
        self.subtitle = subtitle
        self.options = options
        self._selection = selection
    }
    
    /// The content and behavior of this view.
    public var body: some View {
        SettingRowView(
            icon: icon,
            title: title,
            subtitle: subtitle,
            trailing: .custom(AnyView(menuTrailing)),
            action: nil
        )
    }
    
    @ViewBuilder
    private var menuTrailing: some View {
        let menu = Menu {
            ForEach(options, id: \.self) { option in
                Button(option) {
                    selection = option
                }
            }
        } label: {
            HStack(spacing: FSpacing.s8) {
                Text(selection)
                    .font(FType.rowValue())
                    .foregroundStyle(FColor.textSecondary)
                    .tracking(FType.trackingRow())
                
                ZStack {
                    Circle()
                        .fill(FColor.bgCardAlt)
                        .frame(width: 18, height: 18)
                    
                    Image(systemName: "chevron.down")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(FColor.iconSecondary)
                        .accessibilityHidden(true)
                }
            }
        }
        .accessibilityLabel(Text(title))
        #if os(macOS)
        .menuStyle(.borderlessButton)
        #endif

        if let subtitle {
            menu.accessibilityHint(Text(subtitle))
        } else {
            menu
        }
    }
}
