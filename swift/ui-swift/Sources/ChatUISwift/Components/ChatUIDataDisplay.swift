import SwiftUI

// MARK: - Table Component

/// A native macOS table component for displaying structured data
public struct ChatUITable<Data: RandomAccessCollection, RowContent: View>: View where Data.Element: Identifiable {
    
    public struct Column {
        let title: String
        let width: CGFloat?
        let alignment: HorizontalAlignment
        
        public init(title: String, width: CGFloat? = nil, alignment: HorizontalAlignment = .leading) {
            self.title = title
            self.width = width
            self.alignment = alignment
        }
    }
    
    private let data: Data
    private let columns: [Column]
    private let rowContent: (Data.Element) -> RowContent
    private let onRowTap: ((Data.Element) -> Void)?
    
    @State private var sortColumn: Int?
    @State private var sortAscending = true
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    
    public init(
        data: Data,
        columns: [Column],
        onRowTap: ((Data.Element) -> Void)? = nil,
        @ViewBuilder rowContent: @escaping (Data.Element) -> RowContent
    ) {
        self.data = data
        self.columns = columns
        self.onRowTap = onRowTap
        self.rowContent = rowContent
    }
    
    public var body: some View {
        VStack(spacing: 0) {
            // Header
            tableHeader
            
            // Rows
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(Array(data.enumerated()), id: \.element.id) { index, item in
                        tableRow(for: item, at: index)
                    }
                }
            }
        }
        .background(DesignTokens.Colors.Background.primary)
        .cornerRadius(DesignTokens.CornerRadius.medium)
        .overlay(
            RoundedRectangle(cornerRadius: DesignTokens.CornerRadius.medium)
                .stroke(borderColor, lineWidth: 1)
        )
    }
    
    // MARK: - Header
    
    private var tableHeader: some View {
        HStack(spacing: 0) {
            ForEach(Array(columns.enumerated()), id: \.offset) { index, column in
                Button {
                    toggleSort(for: index)
                } label: {
                    HStack(spacing: DesignTokens.Spacing.xs) {
                        Text(column.title)
                            .font(.system(size: scaledFontSize(14), weight: .semibold))
                            .foregroundColor(DesignTokens.Colors.Text.primary)
                        
                        if sortColumn == index {
                            Image(systemName: sortAscending ? "chevron.up" : "chevron.down")
                                .font(.system(size: 10))
                                .foregroundColor(DesignTokens.Colors.Text.secondary)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: alignmentForColumn(column))
                }
                .buttonStyle(.plain)
                .padding(.horizontal, DesignTokens.Spacing.sm)
                .padding(.vertical, DesignTokens.Spacing.xs)
                .accessibilityLabel("\(column.title) column header")
                .accessibilityHint("Tap to sort by \(column.title)")
                
                if index < columns.count - 1 {
                    Rectangle()
                        .frame(width: 1)
                        .foregroundColor(DesignTokens.Colors.Background.tertiary)
                }
            }
        }
        .background(DesignTokens.Colors.Background.secondary)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(DesignTokens.Colors.Background.tertiary),
            alignment: .bottom
        )
    }
    
    // MARK: - Row
    
    @ViewBuilder
    private func tableRow(for item: Data.Element, at index: Int) -> some View {
        Button {
            onRowTap?(item)
        } label: {
            rowContent(item)
                .frame(maxWidth: .infinity)
                .padding(.horizontal, DesignTokens.Spacing.sm)
                .padding(.vertical, DesignTokens.Spacing.xs)
        }
        .buttonStyle(.plain)
        .background(
            index % 2 == 0 
                ? DesignTokens.Colors.Background.primary
                : DesignTokens.Colors.Background.secondary.opacity(0.3)
        )
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(DesignTokens.Colors.Background.tertiary),
            alignment: .bottom
        )
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(onRowTap != nil ? .isButton : [])
    }
    
    // MARK: - Helpers
    
    private func toggleSort(for columnIndex: Int) {
        if sortColumn == columnIndex {
            sortAscending.toggle()
        } else {
            sortColumn = columnIndex
            sortAscending = true
        }
    }
    
    private func alignmentForColumn(_ column: Column) -> Alignment {
        switch column.alignment {
        case .leading:
            return .leading
        case .center:
            return .center
        case .trailing:
            return .trailing
        default:
            return .leading
        }
    }
    
    private var borderColor: Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        return prefersHighContrast 
            ? DesignTokens.Accessibility.HighContrast.borderContrast
            : DesignTokens.Colors.Background.tertiary
    }
    
    private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
        ChatUIInput.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)
    }
}

// MARK: - List Component

/// A native macOS list component for displaying collections
public struct ChatUIList<Data: RandomAccessCollection, Content: View>: View where Data.Element: Identifiable {
    
    public enum Style {
        case plain
        case grouped
        case sidebar
    }
    
    private let data: Data
    private let style: Style
    private let content: (Data.Element) -> Content
    private let onItemTap: ((Data.Element) -> Void)?
    
    public init(
        data: Data,
        style: Style = .plain,
        onItemTap: ((Data.Element) -> Void)? = nil,
        @ViewBuilder content: @escaping (Data.Element) -> Content
    ) {
        self.data = data
        self.style = style
        self.content = content
        self.onItemTap = onItemTap
    }
    
    public var body: some View {
        ScrollView {
            LazyVStack(spacing: spacingForStyle(style)) {
                ForEach(data, id: \.id) { item in
                    listItem(for: item)
                }
            }
            .padding(paddingForStyle(style))
        }
        .background(backgroundForStyle(style))
        .cornerRadius(cornerRadiusForStyle(style))
        .overlay(
            RoundedRectangle(cornerRadius: cornerRadiusForStyle(style))
                .stroke(borderColorForStyle(style), lineWidth: borderWidthForStyle(style))
        )
    }
    
    @ViewBuilder
    private func listItem(for item: Data.Element) -> some View {
        Button {
            onItemTap?(item)
        } label: {
            content(item)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(itemPaddingForStyle(style))
        }
        .buttonStyle(.plain)
        .background(itemBackgroundForStyle(style))
        .cornerRadius(itemCornerRadiusForStyle(style))
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(onItemTap != nil ? .isButton : [])
    }
    
    // MARK: - Style Helpers
    
    private func spacingForStyle(_ style: Style) -> CGFloat {
        switch style {
        case .plain:
            return 0
        case .grouped:
            return DesignTokens.Spacing.xs
        case .sidebar:
            return DesignTokens.Spacing.xxs
        }
    }
    
    private func paddingForStyle(_ style: Style) -> EdgeInsets {
        switch style {
        case .plain:
            return EdgeInsets()
        case .grouped:
            return EdgeInsets(
                top: DesignTokens.Spacing.sm,
                leading: DesignTokens.Spacing.sm,
                bottom: DesignTokens.Spacing.sm,
                trailing: DesignTokens.Spacing.sm
            )
        case .sidebar:
            return EdgeInsets(
                top: DesignTokens.Spacing.xs,
                leading: DesignTokens.Spacing.xs,
                bottom: DesignTokens.Spacing.xs,
                trailing: DesignTokens.Spacing.xs
            )
        }
    }
    
    private func itemPaddingForStyle(_ style: Style) -> EdgeInsets {
        switch style {
        case .plain:
            return EdgeInsets(
                top: DesignTokens.Spacing.sm,
                leading: DesignTokens.Spacing.md,
                bottom: DesignTokens.Spacing.sm,
                trailing: DesignTokens.Spacing.md
            )
        case .grouped, .sidebar:
            return EdgeInsets(
                top: DesignTokens.Spacing.xs,
                leading: DesignTokens.Spacing.sm,
                bottom: DesignTokens.Spacing.xs,
                trailing: DesignTokens.Spacing.sm
            )
        }
    }
    
    private func backgroundForStyle(_ style: Style) -> Color {
        switch style {
        case .plain:
            return DesignTokens.Colors.Background.primary
        case .grouped:
            return DesignTokens.Colors.Background.secondary
        case .sidebar:
            return DesignTokens.Colors.Background.secondary
        }
    }
    
    private func itemBackgroundForStyle(_ style: Style) -> Color {
        switch style {
        case .plain:
            return Color.clear
        case .grouped:
            return DesignTokens.Colors.Background.primary
        case .sidebar:
            return Color.clear
        }
    }
    
    private func cornerRadiusForStyle(_ style: Style) -> CGFloat {
        switch style {
        case .plain:
            return 0
        case .grouped, .sidebar:
            return DesignTokens.CornerRadius.medium
        }
    }
    
    private func itemCornerRadiusForStyle(_ style: Style) -> CGFloat {
        switch style {
        case .plain:
            return 0
        case .grouped:
            return DesignTokens.CornerRadius.small
        case .sidebar:
            return DesignTokens.CornerRadius.small
        }
    }
    
    private func borderColorForStyle(_ style: Style) -> Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        
        if prefersHighContrast {
            return DesignTokens.Accessibility.HighContrast.borderContrast
        }
        
        switch style {
        case .plain:
            return Color.clear
        case .grouped, .sidebar:
            return DesignTokens.Colors.Background.tertiary
        }
    }
    
    private func borderWidthForStyle(_ style: Style) -> CGFloat {
        switch style {
        case .plain:
            return 0
        case .grouped, .sidebar:
            return 1
        }
    }
}

// MARK: - Grid Component

/// A native macOS grid component for displaying items in a grid layout
public struct ChatUIGrid<Data: RandomAccessCollection, Content: View>: View where Data.Element: Identifiable {
    
    private let data: Data
    private let columns: [GridItem]
    private let spacing: CGFloat
    private let content: (Data.Element) -> Content
    private let onItemTap: ((Data.Element) -> Void)?
    
    public init(
        data: Data,
        columns: [GridItem],
        spacing: CGFloat = 16,
        onItemTap: ((Data.Element) -> Void)? = nil,
        @ViewBuilder content: @escaping (Data.Element) -> Content
    ) {
        self.data = data
        self.columns = columns
        self.spacing = spacing
        self.content = content
        self.onItemTap = onItemTap
    }
    
    public var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: spacing) {
                ForEach(data, id: \.id) { item in
                    gridItem(for: item)
                }
            }
            .padding(DesignTokens.Spacing.md)
        }
        .background(DesignTokens.Colors.Background.primary)
    }
    
    @ViewBuilder
    private func gridItem(for item: Data.Element) -> some View {
        Button {
            onItemTap?(item)
        } label: {
            content(item)
        }
        .buttonStyle(.plain)
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(onItemTap != nil ? .isButton : [])
    }
}

// MARK: - Data Card Component

/// A specialized card component for displaying data with optional actions
public struct ChatUIDataCard<Content: View>: View {
    
    private let title: String?
    private let subtitle: String?
    private let content: () -> Content
    private let actions: [DataCardAction]
    
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    
    public init(
        title: String? = nil,
        subtitle: String? = nil,
        actions: [DataCardAction] = [],
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.title = title
        self.subtitle = subtitle
        self.actions = actions
        self.content = content
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.sm) {
            // Header
            if title != nil || subtitle != nil || !actions.isEmpty {
                cardHeader
            }
            
            // Content
            content()
            
            // Actions
            if !actions.isEmpty {
                cardActions
            }
        }
        .padding(DesignTokens.Spacing.md)
        .background(DesignTokens.Colors.Background.primary)
        .cornerRadius(DesignTokens.CornerRadius.medium)
        .overlay(
            RoundedRectangle(cornerRadius: DesignTokens.CornerRadius.medium)
                .stroke(borderColor, lineWidth: 1)
        )
        .shadow(
            color: DesignTokens.Colors.Text.primary.opacity(0.05),
            radius: 4,
            x: 0,
            y: 2
        )
    }
    
    // MARK: - Header
    
    @ViewBuilder
    private var cardHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: DesignTokens.Spacing.xxs) {
                if let title = title {
                    Text(title)
                        .font(.system(size: scaledFontSize(16), weight: .semibold))
                        .foregroundColor(DesignTokens.Colors.Text.primary)
                        .accessibilityAddTraits(.isHeader)
                }
                
                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.system(size: scaledFontSize(14)))
                        .foregroundColor(DesignTokens.Colors.Text.secondary)
                }
            }
            
            Spacer()
            
            if !actions.isEmpty && actions.count <= 2 {
                HStack(spacing: DesignTokens.Spacing.xs) {
                    ForEach(Array(actions.prefix(2).enumerated()), id: \.offset) { index, action in
                        ChatUIButton(
                            systemName: action.systemName,
                            variant: action.variant,
                            size: .icon,
                            accessibilityLabel: action.accessibilityLabel,
                            accessibilityHint: action.accessibilityHint
                        ) {
                            action.action()
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Actions
    
    @ViewBuilder
    private var cardActions: some View {
        if actions.count > 2 {
            HStack(spacing: DesignTokens.Spacing.sm) {
                ForEach(Array(actions.enumerated()), id: \.offset) { index, action in
                    ChatUIButton(
                        action.title ?? action.accessibilityLabel,
                        variant: action.variant,
                        size: .sm
                    ) {
                        action.action()
                    }
                }
                
                Spacer()
            }
        }
    }
    
    // MARK: - Helpers
    
    private var borderColor: Color {
        let prefersHighContrast = DesignTokens.Accessibility.AccessibilityPreferences.prefersHighContrast
        return prefersHighContrast 
            ? DesignTokens.Accessibility.HighContrast.borderContrast
            : DesignTokens.Colors.Background.tertiary
    }
    
    private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
        ChatUIInput.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)
    }
}

// MARK: - Data Card Action

public struct DataCardAction {
    let title: String?
    let systemName: String
    let variant: ChatUIButtonVariant
    let accessibilityLabel: String
    let accessibilityHint: String?
    let action: () -> Void
    
    public init(
        title: String? = nil,
        systemName: String,
        variant: ChatUIButtonVariant = .ghost,
        accessibilityLabel: String,
        accessibilityHint: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.systemName = systemName
        self.variant = variant
        self.accessibilityLabel = accessibilityLabel
        self.accessibilityHint = accessibilityHint
        self.action = action
    }
    
    // Common actions
    public static func edit(action: @escaping () -> Void) -> DataCardAction {
        DataCardAction(
            systemName: "pencil",
            accessibilityLabel: "Edit",
            accessibilityHint: "Edit this item",
            action: action
        )
    }
    
    public static func delete(action: @escaping () -> Void) -> DataCardAction {
        DataCardAction(
            systemName: "trash",
            variant: .destructive,
            accessibilityLabel: "Delete",
            accessibilityHint: "Delete this item",
            action: action
        )
    }
    
    public static func share(action: @escaping () -> Void) -> DataCardAction {
        DataCardAction(
            systemName: "square.and.arrow.up",
            accessibilityLabel: "Share",
            accessibilityHint: "Share this item",
            action: action
        )
    }
    
    public static func more(action: @escaping () -> Void) -> DataCardAction {
        DataCardAction(
            systemName: "ellipsis",
            accessibilityLabel: "More",
            accessibilityHint: "More options",
            action: action
        )
    }
}