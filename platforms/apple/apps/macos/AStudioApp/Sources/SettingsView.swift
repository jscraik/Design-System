import SwiftUI
import AppKit
import AStudioFoundation
import AStudioComponents
import AStudioSystemIntegration

/// Settings surface for configuring app preferences.
struct SettingsView: View {
    @EnvironmentObject private var appState: AppState
    
    @AppStorage("settings.notificationsEnabled") private var notificationsEnabled = true
    @AppStorage("settings.darkModeEnabled") private var darkModeEnabled = false
    @AppStorage("settings.selectedAccent") private var selectedAccent = "Blue"
    @AppStorage("settings.selectedLanguage") private var selectedLanguage = "English"
    @State private var showingMCPConfig = false
    @State private var mcpURLDraft = ""
    @State private var showingClearDataAlert = false
    @State private var showingSettingsError = false
    @State private var settingsErrorMessage: String?
    private let notificationManager = NotificationManager()
    
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
        Form {
            generalSection
            appearanceSection
            componentDemoSection
            advancedSection
        }
        .navigationTitle("Settings")
        .navigationSubtitle("Configure your aStudio experience")
        .onChange(of: notificationsEnabled) { newValue in
            guard newValue else { return }
            Task {
                do {
                    let granted = try await notificationManager.requestPermission()
                    if !granted {
                        await MainActor.run {
                            notificationsEnabled = false
                            settingsErrorMessage = "Notifications are disabled in System Settings."
                            showingSettingsError = true
                        }
                    }
                } catch {
                    await MainActor.run {
                        notificationsEnabled = false
                        settingsErrorMessage = error.localizedDescription
                        showingSettingsError = true
                    }
                }
            }
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
        .alert("Clear All Data?", isPresented: $showingClearDataAlert) {
            Button("Clear All Data", role: .destructive) {
                clearAllData()
            }
            Button("Cancel", role: .cancel) { }
        } message: {
            Text("This action cannot be undone.")
        }
        .alert("Unable to Complete Action", isPresented: $showingSettingsError) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(settingsErrorMessage ?? "Unknown error.")
        }
    }

    private var generalSection: some View {
        Section("General") {
            Button {
                mcpURLDraft = appState.mcpBaseURLString
                showingMCPConfig = true
            } label: {
                LabeledContent("MCP Server URL") {
                    Text(appState.mcpBaseURLString)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                        .truncationMode(.middle)
                }
            }
            .accessibilityHint("Configure the MCP server URL")

            Toggle("Notifications", isOn: $notificationsEnabled)
                .accessibilityHint("Receive alerts for new messages")

            Button(action: openAboutPanel) {
                LabeledContent("About") {
                    Text("Version \(AppInfo.versionString)")
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    private var appearanceSection: some View {
        Section("Appearance") {
            Picker("Theme Style", selection: themeSelection) {
                ForEach(themeOptions, id: \.self) { option in
                    Text(option).tag(option)
                }
            }
            .accessibilityHint("Switch between ChatGPT and native")
        }
    }

    private var componentDemoSection: some View {
        Section {
            Toggle("Dark Mode", isOn: $darkModeEnabled)
                .accessibilityHint("Preview component demo")

            Picker("Accent Color", selection: $selectedAccent) {
                ForEach(accentOptions, id: \.self) { option in
                    Text(option).tag(option)
                }
            }
            .accessibilityHint("Preview component demo")

            Picker("Language", selection: $selectedLanguage) {
                ForEach(languageOptions, id: \.self) { option in
                    Text(option).tag(option)
                }
            }
            .accessibilityHint("Preview component demo")
        } header: {
            Text("Component Demo")
        } footer: {
            Text("Preview / Component demo")
        }
    }

    private var advancedSection: some View {
        Section("Advanced") {
            Button(action: openDataLocation) {
                LabeledContent("Data Location") {
                    Text(dataLocationDisplay)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                        .truncationMode(.middle)
                }
            }
            .accessibilityHint("Open the data folder in Finder")

            Button(role: .destructive) {
                showingClearDataAlert = true
            } label: {
                Text("Clear All Data")
            }
            .accessibilityHint("Remove all stored messages and settings")
        }
    }
}

private extension SettingsView {
    var dataLocationURL: URL? {
        FileManager.default
            .urls(for: .applicationSupportDirectory, in: .userDomainMask)
            .first?
            .appendingPathComponent("aStudio", isDirectory: true)
    }

    var dataLocationDisplay: String {
        dataLocationURL?.path ?? "~/Library/Application Support/aStudio"
    }

    func openAboutPanel() {
        NSApp.orderFrontStandardAboutPanel(nil)
    }

    func openDataLocation() {
        guard let url = dataLocationURL else { return }
        do {
            if !FileManager.default.fileExists(atPath: url.path) {
                try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
            }
            NSWorkspace.shared.open(url)
        } catch {
            settingsErrorMessage = error.localizedDescription
            showingSettingsError = true
        }
    }

    func clearAllData() {
        guard let url = dataLocationURL else { return }
        do {
            if FileManager.default.fileExists(atPath: url.path) {
                try FileManager.default.removeItem(at: url)
            }
        } catch {
            settingsErrorMessage = error.localizedDescription
            showingSettingsError = true
        }
    }
}

/// Sheet for editing the MCP server base URL.
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
