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
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    var body: some View {
        AppShellView(
            sidebar: {
                SidebarView()
            },
            detail: {
                DetailView(
                    mcpClient: mcpClient,
                    isLoading: isLoading,
                    errorMessage: errorMessage
                )
            }
        )
        .onAppear {
            setupMCPClient()
            restoreState()
        }
        .onDisappear {
            saveState()
        }
    }
    
    private func setupMCPClient() {
        guard let url = URL(string: appState.mcpBaseURLString) else {
            errorMessage = "Invalid MCP base URL"
            return
        }
        mcpClient = MCPClient(baseURL: url)
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
                Text("ChatUI")
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
                        NavigationButton(
                            section: section,
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
                Text("Version 1.0.0")
                    .font(FType.footnote())
                    .foregroundStyle(FColor.textTertiary)
            }
            .frame(maxWidth: .infinity)
            .padding(FSpacing.s12)
        }
    }
}

struct NavigationButton: View {
    let section: AppSection
    let isSelected: Bool
    let action: () -> Void
    
    @State private var isHovering = false
    @Environment(\.colorScheme) private var scheme
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: FSpacing.s12) {
                Image(systemName: section.systemImage)
                    .font(.system(size: ChatGPTTheme.rowIconSize))
                    .foregroundStyle(isSelected ? FColor.accentBlue : FColor.iconSecondary)
                
                Text(section.title)
                    .font(FType.rowTitle())
                    .foregroundStyle(isSelected ? FColor.textPrimary : FColor.textSecondary)
                
                Spacer()
            }
            .padding(.horizontal, ChatGPTTheme.rowHPadding)
            .padding(.vertical, ChatGPTTheme.rowVPadding)
            .background(buttonBackground)
            .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous))
        }
        .buttonStyle(.plain)
        .onHover { isHovering = $0 }
    }
    
    @ViewBuilder
    private var buttonBackground: some View {
        if isSelected {
            RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous)
                .fill(FColor.accentBlue.opacity(0.15))
        } else if Platform.isMac && isHovering {
            RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous)
                .fill(FColor.bgCardAlt)
                .opacity(scheme == .dark ? ChatGPTTheme.hoverOverlayOpacityDark : ChatGPTTheme.hoverOverlayOpacityLight)
        } else {
            Color.clear
        }
    }
}

// MARK: - Detail View

struct DetailView: View {
    let mcpClient: MCPClient?
    let isLoading: Bool
    let errorMessage: String?
    
    @EnvironmentObject private var appState: AppState
    
    var body: some View {
        Group {
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
