import SwiftUI
import ChatUIFoundation

/// Settings row with a dropdown menu in the trailing position
public struct SettingDropdownView: View {
    private let icon: AnyView?
    private let title: String
    private let subtitle: String?
    private let options: [String]
    @Binding private var selection: String
    
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
    
    public var body: some View {
        SettingRowView(
            icon: icon,
            title: title,
            subtitle: subtitle,
            trailing: .custom(AnyView(menuTrailing)),
            action: nil
        )
    }
    
    private var menuTrailing: some View {
        Menu {
            ForEach(options, id: \.self) { option in
                Button(option) {
                    selection = option
                }
            }
        } label: {
            HStack(spacing: 8) {
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
                }
            }
        }
        #if os(macOS)
        .menuStyle(.borderlessButton)
        #endif
    }
}
