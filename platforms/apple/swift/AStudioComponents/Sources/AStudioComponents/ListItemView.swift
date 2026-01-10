import SwiftUI
import AStudioFoundation
import AStudioThemes

/// A list item component optimized for sidebar navigation.
///
/// ### Discussion
/// Similar to `SettingRowView` but designed for navigation lists with selection state.
///
/// - Example:
/// ```swift
/// ListItemView(systemIcon: "gear", title: "Settings", trailing: .chevron)
/// ```
public struct ListItemView: View {
    private let icon: AnyView?
    private let title: String
    private let subtitle: String?
    private let trailing: ListItemTrailing
    private let isSelected: Bool
    private let action: (() -> Void)?
    
    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme
    @State private var isHovering = false
    @State private var isPressed = false
    
    /// Creates a list item view.
    ///
    /// - Parameters:
    ///   - icon: Optional leading icon view.
    ///   - title: Primary title text.
    ///   - subtitle: Optional subtitle text.
    ///   - trailing: Trailing content configuration.
    ///   - isSelected: Whether the item is selected.
    ///   - action: Optional action when tapped.
    public init(
        icon: AnyView? = nil,
        title: String,
        subtitle: String? = nil,
        trailing: ListItemTrailing = .none,
        isSelected: Bool = false,
        action: (() -> Void)? = nil
    ) {
        self.icon = icon
        self.title = title
        self.subtitle = subtitle
        self.trailing = trailing
        self.isSelected = isSelected
        self.action = action
    }
    
    /// The content and behavior of this view.
    public var body: some View {
        Group {
            if let action {
                Button(action: action) {
                    itemContent
                }
                .buttonStyle(.plain)
                .simultaneousGesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { _ in
                            isPressed = true
                        }
                        .onEnded { _ in
                            isPressed = false
                        }
                )
            } else {
                itemContent
            }
        }
        #if os(macOS)
        .onHover { isHovering = $0 }
        #endif
        .background(itemBackground)
        .clipShape(RoundedRectangle(cornerRadius: theme.rowCornerRadius, style: .continuous))
        .padding(.horizontal, FSpacing.s4) // Inset for "floating" appearance
        .accessibilityElement(children: shouldCombineAccessibility ? .combine : .contain)
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }
    
    private var itemContent: some View {
        HStack(spacing: FSpacing.s12) {
            if let icon {
                icon
                    .frame(width: theme.rowIconSize, height: theme.rowIconSize)
                    .foregroundStyle(isSelected ? FColor.accentBlue : FColor.iconTertiary)
                    .accessibilityHidden(true)
            }
            
            VStack(alignment: .leading, spacing: FSpacing.s2) {
                Text(title)
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textPrimary)
                    .tracking(FType.trackingRow())
                    .fontWeight(.regular)
                
                if let subtitle {
                    Text(subtitle)
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                        .tracking(FType.trackingCaption())
                }
            }
            
            Spacer(minLength: 10)
            
            trailingView
        }
        .padding(.horizontal, theme.rowHPadding)
        .padding(.vertical, theme.rowVPadding)
        .contentShape(Rectangle())
    }
    
    @ViewBuilder
    private var trailingView: some View {
        switch trailing {
        case .none:
            EmptyView()
        case .chevron:
            Image(systemName: "chevron.right")
                .font(.system(size: theme.rowChevronSize, weight: .semibold))
                .foregroundStyle(FColor.iconTertiary)
                .accessibilityHidden(true)
        case .badge(let count):
            if count > 0 {
                Text("\(count)")
                    .font(FType.caption())
                    .foregroundStyle(FColor.accentForeground)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(FColor.accentBlue)
                    .clipShape(Capsule())
            }
        case .custom(let view):
            view
        }
    }
    
    private var itemBackground: some View {
        Group {
            if isSelected {
                // Selected state - always visible
                RoundedRectangle(cornerRadius: theme.rowCornerRadius, style: .continuous)
                    .fill(FColor.accentBlue.opacity(0.15))
            } else if Platform.isMac && isHovering {
                // Hover state on macOS
                RoundedRectangle(cornerRadius: theme.rowCornerRadius, style: .continuous)
                    .fill(FColor.bgCardAlt)
            } else if isPressed {
                // Pressed state on iOS
                RoundedRectangle(cornerRadius: theme.rowCornerRadius, style: .continuous)
                    .fill(FColor.bgCardAlt)
            } else {
                Color.clear
            }
        }
    }

    private var shouldCombineAccessibility: Bool {
        switch trailing {
        case .custom:
            return false
        case .none, .chevron, .badge:
            return true
        }
    }
}

// MARK: - Trailing Options

    /// Trailing content variants for `ListItemView`.
    public enum ListItemTrailing {
    case none
    case chevron
    case badge(Int)
    case custom(AnyView)
}

// MARK: - Convenience Initializers

extension ListItemView {
    /// Creates a list item with a system icon.
    ///
    /// - Parameters:
    ///   - systemIcon: SF Symbol name.
    ///   - title: Primary title text.
    ///   - subtitle: Optional subtitle text.
    ///   - trailing: Trailing content configuration.
    ///   - isSelected: Whether the item is selected.
    ///   - action: Optional action when tapped.
    public init(
        systemIcon: String,
        title: String,
        subtitle: String? = nil,
        trailing: ListItemTrailing = .none,
        isSelected: Bool = false,
        action: (() -> Void)? = nil
    ) {
        self.init(
            icon: AnyView(Image(systemName: systemIcon)),
            title: title,
            subtitle: subtitle,
            trailing: trailing,
            isSelected: isSelected,
            action: action
        )
    }
}
