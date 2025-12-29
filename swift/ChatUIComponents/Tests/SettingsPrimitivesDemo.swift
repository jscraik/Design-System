import SwiftUI
import ChatUIComponents

/// Demo view that exercises all settings primitives
/// This serves as both a visual test and integration verification
struct SettingsPrimitivesDemo: View {
    @State private var notificationsEnabled = true
    @State private var selectedTheme = "Auto"
    @State private var selectedLanguage = "English"
    
    private let themeOptions = ["Light", "Dark", "Auto"]
    private let languageOptions = ["English", "Spanish", "French", "German"]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Settings Primitives Demo")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding()
                
                // Card with various row types
                SettingsCardView {
                    SettingRowView(
                        icon: AnyView(Image(systemName: "person.circle")),
                        title: "Account",
                        subtitle: "Manage your profile",
                        trailing: .chevron,
                        action: { print("Account tapped") }
                    )
                    
                    SettingsDivider()
                    
                    SettingToggleView(
                        icon: AnyView(Image(systemName: "bell")),
                        title: "Notifications",
                        subtitle: "Receive push notifications",
                        isOn: $notificationsEnabled
                    )
                    
                    SettingsDivider()
                    
                    SettingDropdownView(
                        icon: AnyView(Image(systemName: "paintbrush")),
                        title: "Theme",
                        subtitle: "Choose app appearance",
                        options: themeOptions,
                        selection: $selectedTheme
                    )
                    
                    SettingsDivider()
                    
                    SettingDropdownView(
                        icon: AnyView(Image(systemName: "globe")),
                        title: "Language",
                        options: languageOptions,
                        selection: $selectedLanguage
                    )
                    
                    SettingsDivider()
                    
                    SettingRowView(
                        icon: AnyView(Image(systemName: "info.circle")),
                        title: "Version",
                        trailing: .text("1.0.0")
                    )
                }
                
                // Another card demonstrating different configurations
                SettingsCardView {
                    SettingRowView(
                        title: "Simple Row",
                        trailing: .none
                    )
                    
                    SettingsDivider()
                    
                    SettingRowView(
                        title: "Row with Chevron",
                        trailing: .chevron,
                        action: { print("Chevron row tapped") }
                    )
                    
                    SettingsDivider()
                    
                    SettingRowView(
                        title: "Row with Custom Content",
                        trailing: .custom(
                            AnyView(
                                HStack {
                                    Image(systemName: "star.fill")
                                        .foregroundColor(.yellow)
                                    Text("Premium")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            )
                        )
                    )
                }
                
                // Standalone divider demo
                VStack {
                    Text("Standalone Divider:")
                        .font(.headline)
                    SettingsDivider()
                        .padding(.horizontal)
                }
                
                // Switch style demo
                VStack(alignment: .leading, spacing: 12) {
                    Text("Foundation Switch Style Demo:")
                        .font(.headline)
                    
                    Toggle("Custom Switch", isOn: $notificationsEnabled)
                        .toggleStyle(FoundationSwitchStyle())
                        .padding(.horizontal)
                }
            }
            .padding()
        }
    }
}

// Preview for SwiftUI Canvas
#if DEBUG
struct SettingsPrimitivesDemo_Previews: PreviewProvider {
    static var previews: some View {
        SettingsPrimitivesDemo()
            .preferredColorScheme(.light)
            .previewDisplayName("Light Mode")
        
        SettingsPrimitivesDemo()
            .preferredColorScheme(.dark)
            .previewDisplayName("Dark Mode")
    }
}
#endif