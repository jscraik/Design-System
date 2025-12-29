import SwiftUI
import ChatUIFoundation

/// Settings row with a toggle switch in the trailing position
public struct SettingToggleView: View {
    private let icon: AnyView?
    private let title: String
    private let subtitle: String?
    @Binding private var isOn: Bool
    
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
    
    public var body: some View {
        SettingRowView(
            icon: icon,
            title: title,
            subtitle: subtitle,
            trailing: .custom(
                AnyView(
                    Toggle("", isOn: $isOn)
                        .labelsHidden()
                        .toggleStyle(FoundationSwitchStyle())
                )
            ),
            action: nil
        )
    }
}