import SwiftUI
import AStudioFoundation
import AStudioComponents
import AStudioMCP

/// Tool browser for MCP integrations.
struct ToolsView: View {
    let mcpClient: MCPClient?
    
    @State private var availableTools: [ToolInfo] = []
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var selectedTool: ToolInfo?
    @State private var loadTask: Task<Void, Never>?
    
    var body: some View {
        content
            .navigationTitle("MCP Tools")
            .navigationSubtitle("Available tools and integrations")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button(action: loadTools) {
                        Image(systemName: "arrow.clockwise")
                            .foregroundStyle(FColor.iconSecondary)
                    }
                    .accessibilityLabel("Refresh tools")
                    .accessibilityHint("Reload available MCP tools")
                }
            }
            .onAppear {
                loadTools()
            }
            .onDisappear {
                loadTask?.cancel()
            }
    }

    @ViewBuilder
    private var content: some View {
        if isLoading {
            LoadingView()
        } else if let error = errorMessage {
            ErrorView(message: error)
        } else if availableTools.isEmpty {
            EmptyToolsView()
        } else {
            ToolsListView(
                tools: availableTools,
                selectedTool: $selectedTool
            )
        }
    }
    
    private func loadTools() {
        loadTask?.cancel()
        guard let mcpClient else {
            availableTools = []
            errorMessage = "MCP client unavailable"
            isLoading = false
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        loadTask = Task {
            do {
                let tools = try await mcpClient.listToolInfo()
                guard !Task.isCancelled else { return }
                let mapped = tools.map { tool in
                    ToolInfo(
                        name: tool.name,
                        description: tool.description ?? "No description provided",
                        category: tool.annotations?.readOnlyHint == true ? "Read-only" : "Actions"
                    )
                }
                await MainActor.run {
                    availableTools = mapped
                    isLoading = false
                }
            } catch {
                guard !Task.isCancelled else { return }
                await MainActor.run {
                    availableTools = []
                    errorMessage = error.localizedDescription
                    isLoading = false
                }
            }
        }
    }
}

// MARK: - Tool Info Model

/// Basic tool metadata for display in the tool list.
struct ToolInfo: Identifiable {
    let id = UUID()
    let name: String
    let description: String
    let category: String
}

// MARK: - Subviews

/// Loading state view for tool fetches.
struct LoadingView: View {
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            ProgressView()
            
            Text("Loading tools...")
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

/// Error view shown when tool loading fails.
struct ErrorView: View {
    let message: String
    
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundStyle(FColor.accentRed)
                .accessibilityHidden(true)
            
            Text("Error Loading Tools")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)
            
            Text(message)
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(FSpacing.s24)
    }
}

/// Empty state shown when no tools are available.
struct EmptyToolsView: View {
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            Image(systemName: "hammer")
                .font(.system(size: 48))
                .foregroundStyle(FColor.iconTertiary)
                .accessibilityHidden(true)
            
            Text("No Tools Available")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)
            
            Text("Connect to an MCP server to see available tools")
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(FSpacing.s24)
    }
}

/// List view that groups tools by category.
struct ToolsListView: View {
    let tools: [ToolInfo]
    @Binding var selectedTool: ToolInfo?
    
    var body: some View {
        List {
            ForEach(groupedTools.keys.sorted(), id: \.self) { category in
                Section {
                    ForEach(groupedTools[category] ?? []) { tool in
                        ToolRow(
                            tool: tool,
                            isSelected: selectedTool?.id == tool.id
                        ) {
                            selectedTool = tool
                        }
                    }
                } header: {
                    Text(category)
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                }
            }
        }
    }
    
    private var groupedTools: [String: [ToolInfo]] {
        Dictionary(grouping: tools, by: { $0.category })
    }
}

/// Single row for a tool entry.
struct ToolRow: View {
    let tool: ToolInfo
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        ListItemView(
            systemIcon: "hammer.fill",
            title: tool.name,
            subtitle: tool.description,
            trailing: .chevron,
            isSelected: isSelected,
            action: action
        )
    }
}

// Preview support requires Xcode
// Open Package.swift in Xcode to view previews

/*
#Preview("ToolsView - With Tools") {
    ToolsView(mcpClient: nil)
        .frame(width: 800, height: 600)
}

#Preview("ToolsView - Empty") {
    let view = ToolsView(mcpClient: nil)
    view.availableTools = []
    view
        .frame(width: 800, height: 600)
}
*/
