import SwiftUI
import ChatUIFoundation
import ChatUIComponents

/// Renders MCP widget data using native SwiftUI components
public struct WidgetRenderer: View {
    private let widgetData: WidgetData?
    private let toolResult: MCPToolCallResult?

    public init(widgetData: WidgetData) {
        self.widgetData = widgetData
        self.toolResult = nil
    }

    public init(result: MCPToolCallResult) {
        self.widgetData = nil
        self.toolResult = result
    }

    public var body: some View {
        if let widgetData {
            switch widgetData.type {
            case .card:
                renderCard(widgetData)
            case .list:
                renderList(widgetData)
            case .chart:
                renderChart(widgetData)
            case .table:
                renderTable(widgetData)
            case .custom:
                renderCustom(widgetData)
            }
        } else if let toolResult {
            renderToolResult(toolResult)
        } else {
            EmptyView()
        }
    }
    
    // MARK: - Card Rendering
    
    @ViewBuilder
    private func renderCard(_ widgetData: WidgetData) -> some View {
        SettingsCardView {
            VStack(alignment: .leading, spacing: FSpacing.s12) {
                if let title = widgetData.title {
                    Text(title)
                        .font(FType.title())
                        .foregroundStyle(FColor.textPrimary)
                }
                
                if let content = widgetData.content {
                    Text(content)
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textSecondary)
                        .tracking(FType.trackingRow())
                }
            }
            .padding(FSpacing.s16)
        }
    }
    
    // MARK: - List Rendering
    
    @ViewBuilder
    private func renderList(_ widgetData: WidgetData) -> some View {
        SettingsCardView {
            VStack(spacing: 0) {
                if let items = widgetData.items {
                    ForEach(items) { item in
                        SettingRowView(
                            icon: item.icon.map { iconName in
                                AnyView(
                                    Image(systemName: iconName)
                                        .foregroundStyle(FColor.iconSecondary)
                                )
                            },
                            title: item.title,
                            subtitle: item.subtitle,
                            trailing: item.action != nil ? .chevron : .none,
                            action: item.action != nil ? {
                                // Handle action
                                print("Action: \(item.action!)")
                            } : nil
                        )
                        
                        if item.id != items.last?.id {
                            SettingsDivider()
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Chart Rendering
    
    @ViewBuilder
    private func renderChart(_ widgetData: WidgetData) -> some View {
        SettingsCardView {
            VStack(alignment: .leading, spacing: FSpacing.s16) {
                if let title = widgetData.title {
                    Text(title)
                        .font(FType.title())
                        .foregroundStyle(FColor.textPrimary)
                }
                
                // Placeholder for chart rendering
                // In production, this would use Swift Charts or similar
                Text("Chart rendering not yet implemented")
                    .font(FType.caption())
                    .foregroundStyle(FColor.textTertiary)
                    .padding(FSpacing.s24)
            }
            .padding(FSpacing.s16)
        }
    }
    
    // MARK: - Table Rendering
    
    @ViewBuilder
    private func renderTable(_ widgetData: WidgetData) -> some View {
        SettingsCardView {
            VStack(alignment: .leading, spacing: FSpacing.s16) {
                if let title = widgetData.title {
                    Text(title)
                        .font(FType.title())
                        .foregroundStyle(FColor.textPrimary)
                }
                
                if let items = widgetData.items {
                    VStack(spacing: 0) {
                        ForEach(items) { item in
                            HStack {
                                Text(item.title)
                                    .font(FType.rowTitle())
                                    .foregroundStyle(FColor.textPrimary)
                                
                                Spacer()
                                
                                if let subtitle = item.subtitle {
                                    Text(subtitle)
                                        .font(FType.rowValue())
                                        .foregroundStyle(FColor.textSecondary)
                                }
                            }
                            .padding(.horizontal, FSpacing.s12)
                            .padding(.vertical, FSpacing.s8)
                            
                            if item.id != items.last?.id {
                                SettingsDivider()
                            }
                        }
                    }
                }
            }
            .padding(FSpacing.s16)
        }
    }
    
    // MARK: - Custom Rendering
    
    @ViewBuilder
    private func renderCustom(_ widgetData: WidgetData) -> some View {
        SettingsCardView {
            VStack(alignment: .leading, spacing: FSpacing.s16) {
                if let title = widgetData.title {
                    Text(title)
                        .font(FType.title())
                        .foregroundStyle(FColor.textPrimary)
                }
                
                if let content = widgetData.content {
                    Text(content)
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textSecondary)
                }
                
                Text("Custom widget rendering")
                    .font(FType.caption())
                    .foregroundStyle(FColor.textTertiary)
            }
            .padding(FSpacing.s16)
        }
    }

    // MARK: - Tool Result Rendering

    @ViewBuilder
    private func renderToolResult(_ result: MCPToolCallResult) -> some View {
        if result.isError == true {
            SettingsCardView {
                VStack(alignment: .leading, spacing: FSpacing.s8) {
                    Text("Tool Error")
                        .font(FType.title())
                        .foregroundStyle(FColor.accentRed)
                    if let message = result.content.first?.text {
                        Text(message)
                            .font(FType.rowTitle())
                            .foregroundStyle(FColor.textSecondary)
                            .tracking(FType.trackingRow())
                    } else {
                        Text("The tool reported an error.")
                            .font(FType.rowTitle())
                            .foregroundStyle(FColor.textSecondary)
                    }
                }
                .padding(FSpacing.s16)
            }
        } else if let structured = result.structuredContent {
            MCPStructuredContentView(content: structured)
        } else {
            MCPContentBlocksView(blocks: result.content)
        }
    }
}

// MARK: - Preview

#if DEBUG
struct WidgetRenderer_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: FSpacing.s16) {
            // Card widget
            WidgetRenderer(widgetData: WidgetData(
                type: .card,
                title: "Card Widget",
                content: "This is a card widget with some content",
                items: nil,
                metadata: nil
            ))
            
            // List widget
            WidgetRenderer(widgetData: WidgetData(
                type: .list,
                title: nil,
                content: nil,
                items: [
                    WidgetItem(id: "1", title: "Item 1", subtitle: "Subtitle 1", icon: "star.fill", action: "action1"),
                    WidgetItem(id: "2", title: "Item 2", subtitle: "Subtitle 2", icon: "heart.fill", action: "action2"),
                    WidgetItem(id: "3", title: "Item 3", subtitle: nil, icon: "bolt.fill", action: nil)
                ],
                metadata: nil
            ))
        }
        .padding(FSpacing.s24)
        .frame(width: 400)
        .background(FColor.bgApp)
    }
}
#endif
