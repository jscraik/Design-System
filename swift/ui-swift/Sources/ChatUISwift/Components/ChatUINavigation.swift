import SwiftUI

/// A native macOS navigation component following platform patterns
public struct ChatUINavigationView<Content: View>: View {
    
    private let title: String
    private let showBackButton: Bool
    private let onBack: (() -> Void)?
    private let trailingActions: [NavigationAction]
    private let content: () -> Content
    
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    
    public init(
        title: String,
        showBackButton: Bool = false,
        onBack: (() -> Void)? = nil,
        trailingActions: [NavigationAction] = [],
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.title = title
        self.showBackButton = showBackButton
        self.onBack = onBack
        self.trailingActions = trailingActions
        self.content = content
    }
    
    public var body: some View {
        VStack(spacing: 0) {
            // Navigation Bar
            navigationBar
            
            // Content
            content()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
    
    // MARK: - Navigation Bar
    
    private var navigationBar: some View {
        HStack(spacing: DesignTokens.Spacing.sm) {
            // Back button
            if showBackButton {
                ChatUIButton(
                    systemName: "chevron.left",
                    variant: .ghost,
                    size: .icon,
                    accessibilityLabel: "Back",
                    accessibilityHint: "Navigate to previous screen"
                ) {
                    onBack?()
                }
            }
            
            // Title
            Text(title)
                .font(.system(size: scaledFontSize(18), weight: .semibold))
                .foregroundColor(DesignTokens.Colors.Text.primary)
                .accessibilityAddTraits(.isHeader)
            
            Spacer()
            
            // Trailing actions
            HStack(spacing: DesignTokens.Spacing.xs) {
                ForEach(Array(trailingActions.enumerated()), id: \.offset) { index, action in
                    ChatUIButton(
                        systemName: action.systemName,
                        variant: action.variant,
                        size: .icon,
                        accessibilityLabel: action.accessibilityLabel,
                        accessibilityHint: action.accessibilityHint
                    ) {
                        action.action()
                    }
                    .accessibilityIdentifier("nav-action-\(index)")
                }
            }
        }
        .padding(.horizontal, DesignTokens.Spacing.md)
        .padding(.vertical, DesignTokens.Spacing.sm)
        .background(DesignTokens.Colors.Background.secondary)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(DesignTokens.Colors.Background.tertiary),
            alignment: .bottom
        )
    }
    
    private func scaledFontSize(_ baseSize: CGFloat) -> CGFloat {
        ChatUIInput.scaledFontSize(baseSize, dynamicTypeSize: dynamicTypeSize)
    }
}

// MARK: - Navigation Action

public struct NavigationAction {
    let systemName: String
    let variant: ChatUIButtonVariant
    let accessibilityLabel: String
    let accessibilityHint: String?
    let action: () -> Void
    
    public init(
        systemName: String,
        variant: ChatUIButtonVariant = .ghost,
        accessibilityLabel: String,
        accessibilityHint: String? = nil,
        action: @escaping () -> Void
    ) {
        self.systemName = systemName
        self.variant = variant
        self.accessibilityLabel = accessibilityLabel
        self.accessibilityHint = accessibilityHint
        self.action = action
    }
    
    // Common actions
    public static func settings(action: @escaping () -> Void) -> NavigationAction {
        NavigationAction(
            systemName: "gearshape",
            accessibilityLabel: "Settings",
            accessibilityHint: "Open settings",
            action: action
        )
    }
    
    public static func add(action: @escaping () -> Void) -> NavigationAction {
        NavigationAction(
            systemName: "plus",
            accessibilityLabel: "Add",
            accessibilityHint: "Add new item",
            action: action
        )
    }
    
    public static func search(action: @escaping () -> Void) -> NavigationAction {
        NavigationAction(
            systemName: "magnifyingglass",
            accessibilityLabel: "Search",
            accessibilityHint: "Search items",
            action: action
        )
    }
    
    public static func more(action: @escaping () -> Void) -> NavigationAction {
        NavigationAction(
            systemName: "ellipsis",
            accessibilityLabel: "More",
            accessibilityHint: "More options",
            action: action
        )
    }
}

// MARK: - Tab Navigation

/// A native macOS tab navigation component
public struct ChatUITabView<Content: View>: View {
    
    @Binding private var selection: Int
    private let tabs: [TabItem]
    private let content: () -> Content
    
    public init(
        selection: Binding<Int>,
        tabs: [TabItem],
        @ViewBuilder content: @escaping () -> Content
    ) {
        self._selection = selection
        self.tabs = tabs
        self.content = content
    }
    
    public var body: some View {
        VStack(spacing: 0) {
            // Tab bar
            tabBar
            
            // Content
            content()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
    
    private var tabBar: some View {
        HStack(spacing: 0) {
            ForEach(Array(tabs.enumerated()), id: \.offset) { index, tab in
                tabButton(for: tab, at: index)
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
    
    @ViewBuilder
    private func tabButton(for tab: TabItem, at index: Int) -> some View {
        let isSelected = selection == index
        
        Button {
            selection = index
        } label: {
            HStack(spacing: DesignTokens.Spacing.xs) {
                if let systemName = tab.systemName {
                    Image(systemName: systemName)
                        .font(.system(size: 16))
                }
                
                Text(tab.title)
                    .font(.system(size: 14, weight: isSelected ? .semibold : .regular))
            }
            .foregroundColor(isSelected 
                ? DesignTokens.Colors.Accent.blue 
                : DesignTokens.Colors.Text.secondary)
            .padding(.horizontal, DesignTokens.Spacing.sm)
            .padding(.vertical, DesignTokens.Spacing.xs)
        }
        .buttonStyle(.plain)
        .background(
            isSelected 
                ? DesignTokens.Colors.Accent.blue.opacity(0.1)
                : Color.clear
        )
        .overlay(
            Rectangle()
                .frame(height: 2)
                .foregroundColor(isSelected ? DesignTokens.Colors.Accent.blue : Color.clear),
            alignment: .bottom
        )
        .accessibilityLabel(tab.title)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
        .accessibilityIdentifier("tab-\(index)")
    }
}

// MARK: - Tab Item

public struct TabItem {
    let title: String
    let systemName: String?
    
    public init(title: String, systemName: String? = nil) {
        self.title = title
        self.systemName = systemName
    }
}

// MARK: - Breadcrumb Navigation

/// A breadcrumb navigation component for hierarchical navigation
public struct ChatUIBreadcrumb: View {
    
    public struct Item {
        let title: String
        let action: (() -> Void)?
        
        public init(title: String, action: (() -> Void)? = nil) {
            self.title = title
            self.action = action
        }
    }
    
    private let items: [Item]
    
    public init(items: [Item]) {
        self.items = items
    }
    
    public var body: some View {
        HStack(spacing: DesignTokens.Spacing.xs) {
            ForEach(Array(items.enumerated()), id: \.offset) { index, item in
                if index > 0 {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 12))
                        .foregroundColor(DesignTokens.Colors.Text.tertiary)
                        .accessibilityHidden(true)
                }
                
                if let action = item.action {
                    Button(item.title) {
                        action()
                    }
                    .buttonStyle(.plain)
                    .foregroundColor(DesignTokens.Colors.Accent.blue)
                    .font(.system(size: 14))
                } else {
                    Text(item.title)
                        .foregroundColor(DesignTokens.Colors.Text.primary)
                        .font(.system(size: 14, weight: .medium))
                }
            }
            
            Spacer()
        }
        .padding(.horizontal, DesignTokens.Spacing.md)
        .padding(.vertical, DesignTokens.Spacing.xs)
        .background(DesignTokens.Colors.Background.tertiary)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Breadcrumb navigation")
    }
}

// MARK: - View Modifiers

extension View {
    /// Wraps the view in a navigation container
    public func navigationContainer(
        title: String,
        showBackButton: Bool = false,
        onBack: (() -> Void)? = nil,
        trailingActions: [NavigationAction] = []
    ) -> some View {
        ChatUINavigationView(
            title: title,
            showBackButton: showBackButton,
            onBack: onBack,
            trailingActions: trailingActions
        ) {
            self
        }
    }
}