import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes
import ChatUIShellChatGPT
import ChatUIMCP
import ChatUISystemIntegration

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
                print("Failed to restore state: \(error)")
            }
        }
    }
    
    private func saveState() {
        Task {
            do {
                let snapshot = appState.snapshot()
                try await lifecycleManager.saveState(snapshot, forKey: "appState")
            } catch {
                print("Failed to save state: \(error)")
            }
        }
    }
}

// MARK: - Sidebar View

struct SidebarView: View {
    @EnvironmentObject private var appState: AppState
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(alignment: .leading, spacing: FSpacing.s8) {
                Text(AppInfo.displayName)
                    .font(FType.title())
                    .foregroundStyle(FColor.textPrimary)
                
                Text("Native macOS Application")
                    .font(FType.caption())
                    .foregroundStyle(FColor.textSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(FSpacing.s16)
            
            SettingsDivider()
            
            // Navigation
            ScrollView {
                VStack(spacing: FSpacing.s4) {
                    ForEach(AppSection.allCases) { section in
                        ListItemView(
                            systemIcon: section.systemImage,
                            title: section.title,
                            isSelected: appState.selectedSection == section
                        ) {
                            appState.selectedSection = section
                        }
                    }
                }
                .padding(FSpacing.s8)
            }
            
            Spacer()
            
            // Footer
            SettingsDivider()
            
            VStack(spacing: FSpacing.s8) {
                Text("Version \(AppInfo.versionString)")
                    .font(FType.footnote())
                    .foregroundStyle(FColor.textTertiary)
            }
            .frame(maxWidth: .infinity)
            .padding(FSpacing.s12)
        }
    }
}

// MARK: - Detail View

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
            case .tools:
                ToolsView(mcpClient: mcpClient)
            case .settings:
                SettingsView()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

private struct ErrorBannerView: View {
    let message: String
    @Environment(\.chatUITheme) private var theme

    var body: some View {
        HStack(spacing: FSpacing.s8) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(FColor.accentRed)
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
