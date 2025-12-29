import SwiftUI
import ChatUIFoundation

/// Example settings view demonstrating all settings primitives
///
/// This view showcases:
/// - Section headers using `FType.sectionTitle()`
/// - `SettingsCardView` containing multiple rows
/// - `SettingToggleView` for boolean preferences
/// - `SettingDropdownView` for selection (e.g., accent color)
/// - `SettingsDivider` between rows
///
/// The view demonstrates proper usage of all ChatUIComponents settings primitives
/// with theme tokens sourced from ChatUIThemes.
public struct SettingsExampleView: View {
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false
    @State private var selectedAccentColor = "Blue"
    @State private var selectedLanguage = "English"
    
    private let accentColorOptions = ["Blue", "Green", "Orange", "Red", "Purple"]
    private let languageOptions = ["English", "Spanish", "French", "German", "Japanese"]
    
    public init() {}
    
    public var body: some View {
        ScrollView {
            VStack(spacing: FSpacing.s24) {
                // Section header using FType.sectionTitle()
                HStack {
                    Text("Settings")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                    Spacer()
                }
                .padding(.horizontal, FSpacing.s16)
                
                // General settings card
                SettingsCardView {
                    VStack(spacing: 0) {
                        SettingToggleView(
                            icon: AnyView(Image(systemName: "bell.fill")),
                            title: "Notifications",
                            subtitle: "Receive push notifications",
                            isOn: $notificationsEnabled
                        )
                        
                        SettingsDivider()
                        
                        SettingToggleView(
                            icon: AnyView(Image(systemName: "moon.fill")),
                            title: "Dark Mode",
                            subtitle: "Use dark appearance",
                            isOn: $darkModeEnabled
                        )
                        
                        SettingsDivider()
                        
                        SettingDropdownView(
                            icon: AnyView(Image(systemName: "paintbrush.fill")),
                            title: "Accent Color",
                            subtitle: "Choose your preferred accent color",
                            options: accentColorOptions,
                            selection: $selectedAccentColor
                        )
                    }
                }
                .padding(.horizontal, FSpacing.s16)
                
                // Language & About section
                HStack {
                    Text("Preferences")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                    Spacer()
                }
                .padding(.horizontal, FSpacing.s16)
                .padding(.top, FSpacing.s8)
                
                // Language settings card
                SettingsCardView {
                    VStack(spacing: 0) {
                        SettingDropdownView(
                            icon: AnyView(Image(systemName: "globe")),
                            title: "Language",
                            subtitle: "Choose your preferred language",
                            options: languageOptions,
                            selection: $selectedLanguage
                        )
                        
                        SettingsDivider()
                        
                        SettingRowView(
                            icon: AnyView(Image(systemName: "info.circle")),
                            title: "About",
                            subtitle: "Version 1.0.0",
                            trailing: .chevron,
                            action: {
                                // Handle about action
                            }
                        )
                    }
                }
                .padding(.horizontal, FSpacing.s16)
                
                Spacer(minLength: FSpacing.s32)
            }
            .frame(maxWidth: 720, alignment: .leading)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, FSpacing.s16)
        }
    }
}

// MARK: - SwiftUI Previews
// Note: Previews work in Xcode but cannot be compiled via Swift Package Manager command line
// This is expected behavior - open this file in Xcode to see the previews

/*
#Preview("Light Mode") {
    SettingsExampleView()
        .frame(width: 400, height: 600)
        .environment(\.colorScheme, .light)
}

#Preview("Dark Mode") {
    SettingsExampleView()
        .frame(width: 400, height: 600)
        .environment(\.colorScheme, .dark)
}

#Preview("macOS - Light") {
    SettingsExampleView()
        .frame(width: 450, height: 650)
        .environment(\.colorScheme, .light)
}

#Preview("macOS - Dark") {
    SettingsExampleView()
        .frame(width: 450, height: 650)
        .environment(\.colorScheme, .dark)
}

#if os(iOS)
#Preview("iOS - Light") {
    NavigationView {
        SettingsExampleView()
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
    }
    .environment(\.colorScheme, .light)
}

#Preview("iOS - Dark") {
    NavigationView {
        SettingsExampleView()
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
    }
    .environment(\.colorScheme, .dark)
}
#endif
*/
