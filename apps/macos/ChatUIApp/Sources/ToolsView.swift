import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIMCP

struct ToolsView: View {
    let mcpClient: MCPClient?
    
    @State private var availableTools: [ToolInfo] = []
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var selectedTool: ToolInfo?
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            ToolsHeaderView()
            
            SettingsDivider()
            
            // Content
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
        .onAppear {
            loadTools()
        }
    }
    
    private func loadTools() {
        // Placeholder for loading available MCP tools
        // In a real implementation, this would query the MCP server
        availableTools = [
            ToolInfo(
                name: "display_chat",
                description: "Display a chat message with optional widget",
                category: "Display"
            ),
            ToolInfo(
                name: "display_table",
                description: "Display data in a table format",
                category: "Display"
            ),
            ToolInfo(
                name: "add_to_cart",
                description: "Add an item to the shopping cart",
                category: "E-commerce"
            )
        ]
    }
}

// MARK: - Tool Info Model

struct ToolInfo: Identifiable {
    let id = UUID()
    let name: String
    let description: String
    let category: String
}

// MARK: - Subviews

struct ToolsHeaderView: View {
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: FSpacing.s4) {
                Text("MCP Tools")
                    .font(FType.title())
                    .foregroundStyle(FColor.textPrimary)
                
                Text("Available tools and integrations")
                    .font(FType.caption())
                    .foregroundStyle(FColor.textSecondary)
            }
            
            Spacer()
            
            Button(action: {}) {
                Image(systemName: "arrow.clockwise")
                    .font(.system(size: 18))
                    .foregroundStyle(FColor.iconSecondary)
            }
            .buttonStyle(.plain)
        }
        .padding(FSpacing.s16)
    }
}

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

struct ErrorView: View {
    let message: String
    
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundStyle(FColor.accentRed)
            
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

struct EmptyToolsView: View {
    var body: some View {
        VStack(spacing: FSpacing.s16) {
            Image(systemName: "hammer")
                .font(.system(size: 48))
                .foregroundStyle(FColor.iconTertiary)
            
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

struct ToolsListView: View {
    let tools: [ToolInfo]
    @Binding var selectedTool: ToolInfo?
    
    var body: some View {
        ScrollView {
            VStack(spacing: FSpacing.s12) {
                ForEach(groupedTools.keys.sorted(), id: \.self) { category in
                    ToolCategorySection(
                        category: category,
                        tools: groupedTools[category] ?? [],
                        selectedTool: $selectedTool
                    )
                }
            }
            .padding(FSpacing.s16)
        }
    }
    
    private var groupedTools: [String: [ToolInfo]] {
        Dictionary(grouping: tools, by: { $0.category })
    }
}

struct ToolCategorySection: View {
    let category: String
    let tools: [ToolInfo]
    @Binding var selectedTool: ToolInfo?
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s8) {
            Text(category)
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)
                .padding(.horizontal, FSpacing.s4)
            
            SettingsCardView {
                VStack(spacing: 0) {
                    ForEach(tools) { tool in
                        ToolRow(
                            tool: tool,
                            isSelected: selectedTool?.id == tool.id
                        ) {
                            selectedTool = tool
                        }
                        
                        if tool.id != tools.last?.id {
                            SettingsDivider()
                        }
                    }
                }
            }
        }
    }
}

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
