import SwiftUI
import ChatUIFoundation
import ChatUIComponents

struct SettingsView: View {
    @EnvironmentObject private var appState: AppState
    
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false
    @State private var selectedAccent = "Blue"
    @State private var selectedLanguage = "English"
    @State private var showingMCPConfig = false
    @State private var mcpURLDraft = ""
    
    let accentOptions = ["Blue", "Green", "Orange", "Red", "Purple"]
    let languageOptions = ["English", "Spanish", "French", "German", "Japanese"]
    private let themeOptions = ThemeStyle.allCases.map { $0.title }
    
    private var themeSelection: Binding<String> {
        Binding(
            get: { appState.themeStyle.title },
            set: { newValue in
                appState.themeStyle = ThemeStyle.allCases.first { $0.title == newValue } ?? .chatgpt
            }
        )
    }
    
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
                            mcpURLDraft = appState.mcpBaseURLString
                            showingMCPConfig = true
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
                            subtitle: "Version \(AppInfo.versionString)",
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
                                Image(systemName: "paintbrush.pointed")
                                    .foregroundStyle(FColor.iconSecondary)
                            ),
                            title: "Theme Style",
                            subtitle: "Switch between ChatGPT and native",
                            options: themeOptions,
                            selection: themeSelection
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
        .sheet(isPresented: $showingMCPConfig) {
            MCPServerSheet(
                mcpURL: $mcpURLDraft,
                onCancel: { showingMCPConfig = false },
                onSave: {
                    appState.mcpBaseURLString = mcpURLDraft.trimmingCharacters(in: .whitespacesAndNewlines)
                    showingMCPConfig = false
                }
            )
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

private struct MCPServerSheet: View {
    @Binding var mcpURL: String
    let onCancel: () -> Void
    let onSave: () -> Void
    
    @State private var errorMessage: String?
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            Text("MCP Server")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)
            
            Text("Configure the base URL for the MCP server.")
                .font(FType.caption())
                .foregroundStyle(FColor.textSecondary)
            
            InputView(
                text: $mcpURL,
                placeholder: "http://localhost:8787",
                variant: .default,
                submitLabel: .done
            )
            .onSubmit { validateAndSave() }
            
            if let errorMessage {
                Text(errorMessage)
                    .font(FType.caption())
                    .foregroundStyle(FColor.accentRed)
            }
            
            HStack(spacing: FSpacing.s12) {
                Spacer()
                ChatUIButton("Cancel", variant: .secondary) {
                    onCancel()
                }
                ChatUIButton("Save", variant: .default) {
                    validateAndSave()
                }
            }
        }
        .padding(FSpacing.s24)
        .frame(width: 420)
    }
    
    private func validateAndSave() {
        let trimmed = mcpURL.trimmingCharacters(in: .whitespacesAndNewlines)
        guard let url = URL(string: trimmed),
              let scheme = url.scheme,
              ["http", "https"].contains(scheme.lowercased())
        else {
            errorMessage = "Enter a valid http or https URL."
            return
        }
        errorMessage = nil
        mcpURL = trimmed
        onSave()
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
