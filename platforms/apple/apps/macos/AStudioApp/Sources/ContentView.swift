import SwiftUI
import os
import AStudioFoundation
import AStudioThemes
import AStudioShellChatGPT
import AStudioMCP
import AStudioSystemIntegration

private let appLogger = Logger(subsystem: "AStudioApp", category: "ContentView")

/// Root view that hosts the app shell and navigation panes.
struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    let lifecycleManager: AppLifecycleManager
    
    @State private var mcpClient: MCPClient?
    @State private var errorMessage: String?
    
    var body: some View {
        ZStack {
            FColor.bgApp

            RoundedAppContainer {
                AppShellView(
                    sidebar: {
                        SidebarView()
                    },
                    detail: {
                        DetailView(
                            mcpClient: mcpClient,
                            errorMessage: errorMessage
                        )
                    }
                )
            }
            .padding(FSpacing.s12)
        }
        .chatUITheme(appState.themeStyle == .default ? .default : .chatgpt)
        .onAppear {
            setupMCPClient()
            restoreState()
        }
        .onChange(of: appState.mcpBaseURLString) { _ in
            setupMCPClient()
        }
        .onDisappear {
            saveState()
        }
    }
    
    private func setupMCPClient() {
        guard let url = URL(string: appState.mcpBaseURLString) else {
            errorMessage = "Invalid MCP base URL"
            mcpClient = nil
            return
        }
        mcpClient = MCPClient(baseURL: url)
        errorMessage = nil
    }
    
    private func restoreState() {
        Task {
            do {
                if let snapshot = try await lifecycleManager.restoreState(forKey: "appState", as: AppStateSnapshot.self) {
                    await MainActor.run {
                        appState.apply(snapshot: snapshot)
                    }
                }
            } catch {
                appLogger.error("Failed to restore state: \(String(describing: error))")
            }
        }
    }
    
    private func saveState() {
        Task {
            do {
                let snapshot = await MainActor.run { appState.snapshot() }
                try await lifecycleManager.saveState(snapshot, forKey: "appState")
            } catch {
                appLogger.error("Failed to save state: \(String(describing: error))")
            }
        }
    }
}

// MARK: - Sidebar View

/// Sidebar list for navigating between app sections.
struct SidebarView: View {
    @EnvironmentObject private var appState: AppState

    private var selectionBinding: Binding<AppSection?> {
        Binding(
            get: { appState.selectedSection },
            set: { newValue in
                if let newValue {
                    appState.selectedSection = newValue
                }
            }
        )
    }
    
    var body: some View {
        List(selection: selectionBinding) {
            Section {
                ForEach(AppSection.allCases) { section in
                    Label(section.title, systemImage: section.systemImage)
                        .tag(section)
                }
            } footer: {
                Text("Version \(AppInfo.versionString)")
            }
        }
        .listStyle(.sidebar)
        .navigationTitle(AppInfo.displayName)
        .navigationSubtitle("Native macOS Application")
    }
}

// MARK: - Detail View

/// Detail pane that hosts the active app section.
struct DetailView: View {
    let mcpClient: MCPClient?
    let errorMessage: String?
    
    @EnvironmentObject private var appState: AppState
    
    var body: some View {
        VStack(spacing: 0) {
            if let errorMessage {
                ErrorBannerView(message: errorMessage)
            }
            
            switch appState.selectedSection {
            case .chat:
                ChatView(mcpClient: mcpClient)
            case .templates:
                TemplatesView()
            case .tools:
                ToolsView(mcpClient: mcpClient)
            case .settings:
                SettingsView()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

/// Inline error banner for transient issues.
private struct ErrorBannerView: View {
    let message: String
    @Environment(\.chatUITheme) private var theme

    var body: some View {
        HStack(spacing: FSpacing.s8) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(FColor.accentRed)
                .accessibilityHidden(true)
            Text(message)
                .font(FType.caption())
                .foregroundStyle(FColor.textSecondary)
            Spacer()
        }
        .padding(FSpacing.s12)
        .background(FColor.accentRed.opacity(0.12))
        .clipShape(RoundedRectangle(cornerRadius: theme.cardCornerRadius))
        .padding(.horizontal, FSpacing.s16)
        .padding(.top, FSpacing.s16)
    }
}

// Preview support requires Xcode
// Open Package.swift in Xcode to view previews

/*
#Preview("ContentView - Light") {
    ContentView(lifecycleManager: AppLifecycleManager())
        .environmentObject(AppState())
        .frame(width: 1200, height: 800)
}

#Preview("ContentView - Dark") {
    ContentView(lifecycleManager: AppLifecycleManager())
        .environmentObject(AppState())
        .frame(width: 1200, height: 800)
        .environment(\.colorScheme, .dark)
}
*/
