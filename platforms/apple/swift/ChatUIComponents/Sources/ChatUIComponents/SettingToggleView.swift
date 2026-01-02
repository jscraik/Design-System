import SwiftUI
import ChatUIFoundation

/// Renders a settings row with a toggle switch.
///
/// - Example:
/// ```swift
/// SettingToggleView(title: "Notifications", isOn: $isOn)
/// ```
public struct SettingToggleView: View {
    private let icon: AnyView?
    private let title: String
    private let subtitle: String?
    @Binding private var isOn: Bool
    
    /// Creates a settings toggle view.
    ///
    /// - Parameters:
    ///   - icon: Optional leading icon view.
    ///   - title: Primary title text.
    ///   - subtitle: Optional subtitle text.
    ///   - isOn: Binding for toggle state.
    public init(
        icon: AnyView? = nil,
        title: String,
        subtitle: String? = nil,
        isOn: Binding<Bool>
    ) {
        self.icon = icon
        self.title = title
        self.subtitle = subtitle
        self._isOn = isOn
    }
    
    /// The content and behavior of this view.
    public var body: some View {
        SettingRowView(
            icon: icon,
            title: title,
            subtitle: subtitle,
            trailing: .custom(
                AnyView(
                    toggleView()
                )
            ),
            action: nil
        )
    }

    @ViewBuilder
    private func toggleView() -> some View {
        let base = Toggle("", isOn: $isOn)
            .labelsHidden()
            .toggleStyle(FoundationSwitchStyle())
            .accessibilityLabel(Text(title))
        if let subtitle {
            base.accessibilityHint(Text(subtitle))
        } else {
            base
        }
    }
}
