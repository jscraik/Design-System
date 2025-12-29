import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct SettingsView: View {
    @EnvironmentObject private var appState: AppState
    
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false
    @State private var selectedAccent = "Blue"
    @State private var selectedLanguage = "English"
    
    let accentOptions = ["Blue", "Green", "Orange", "Red", "Purple"]
    let languageOptions = ["English", "Spanish", "French", "German", "Japanese"]
    
    var body: some View {
        ScrollView {
            VStack(spacing: FSpacing.s24) {
                // Header
                SettingsHeaderView()
                
                // General Settings
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("General")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                        .padding(.horizontal, FSpacing.s4)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            SettingRowView(
                                icon: AnyView(
                                    Image(systemName: "network")
                                        .foregroundStyle(FColor.iconSecondary)
                                ),
                                title: "MCP Server URL",
                                subtitle: appState.mcpBaseURLString,
                                trailing: .chevron
                            ) {
                                // Open URL configuration
                            }
                            
                            SettingsDivider()
                            
                            SettingToggleView(
                                icon: AnyView(
                                    Image(systemName: "bell.fill")
                                        .foregroundStyle(FColor.iconSecondary)
                                ),
                                title: "Notifications",
                                subtitle: "Receive alerts for new messages",
                                isOn: $notificationsEnabled
                            )
                            
                            SettingsDivider()
                            
                            SettingRowView(
                                icon: AnyView(
                                    Image(systemName: "info.circle")
                                        .foregroundStyle(FColor.iconSecondary)
                                ),
                                title: "About",
                                subtitle: "Version 1.0.0",
                                trailing: .chevron
                            ) {
                                // Show about dialog
                            }
                        }
                    }
                }
                
                // Appearance Settings
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("Appearance")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                        .padding(.horizontal, FSpacing.s4)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            SettingToggleView(
                                icon: AnyView(
                                    Image(systemName: "moon.fill")
                                        .foregroundStyle(FColor.iconSecondary)
                                ),
                                title: "Dark Mode",
                                subtitle: "Use dark color scheme",
                                isOn: $darkModeEnabled
                            )
                            
                            SettingsDivider()
                            
                            SettingDropdownView(
                                icon: AnyView(
                                    Image(systemName: "paintpalette.fill")
                                        .foregroundStyle(FColor.iconSecondary)
                                ),
                                title: "Accent Color",
                                subtitle: "Choose your preferred accent",
                                options: accentOptions,
                                selection: $selectedAccent
                            )
                        }
                    }
                }
                
                // Advanced Settings
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("Advanced")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                        .padding(.horizontal, FSpacing.s4)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            SettingDropdownView(
                                icon: AnyView(
                                    Image(systemName: "globe")
                                        .foregroundStyle(FColor.iconSecondary)
                                ),
                                title: "Language",
                                subtitle: "Interface language",
                                options: languageOptions,
                                selection: $selectedLanguage
                            )
                            
                            SettingsDivider()
                            
                            SettingRowView(
                                icon: AnyView(
                                    Image(systemName: "folder.fill")
                                        .foregroundStyle(FColor.iconSecondary)
                                ),
                                title: "Data Location",
                                subtitle: "~/Library/Application Support/ChatUI",
                                trailing: .chevron
                            ) {
                                // Open data folder
                            }
                            
                            SettingsDivider()
                            
                            SettingRowView(
                                icon: AnyView(
                                    Image(systemName: "trash.fill")
                                        .foregroundStyle(FColor.accentRed)
                                ),
                                title: "Clear All Data",
                                subtitle: "Remove all stored messages and settings",
                                trailing: .none
                            ) {
                                // Show confirmation dialog
                            }
                        }
                    }
                }
            }
            .padding(FSpacing.s16)
        }
    }
}

struct SettingsHeaderView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s8) {
            Text("Settings")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)
            
            Text("Configure your ChatUI experience")
                .font(FType.caption())
                .foregroundStyle(FColor.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// Preview support requires Xcode
// Open Package.swift in Xcode to view previews

/*
#Preview("SettingsView - Light") {
    SettingsView()
        .environmentObject(AppState())
        .frame(width: 800, height: 600)
}

#Preview("SettingsView - Dark") {
    SettingsView()
        .environmentObject(AppState())
        .frame(width: 800, height: 600)
        .environment(\.colorScheme, .dark)
}
*/
