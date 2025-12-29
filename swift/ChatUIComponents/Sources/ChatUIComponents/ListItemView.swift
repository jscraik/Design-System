import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// A list item component optimized for sidebar navigation
/// Similar to SettingRowView but designed for navigation lists with selection state
public struct ListItemView: View {
    private let icon: AnyView?
    private let title: String
    private let subtitle: String?
    private let trailing: ListItemTrailing
    private let isSelected: Bool
    private let action: (() -> Void)?
    
    @Environment(\.colorScheme) private var scheme
    @State private var isHovering = false
    @State private var isPressed = false
    
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
        .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous))
        .padding(.horizontal, 6) // Inset for "floating" appearance
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }
    
    private var itemContent: some View {
        HStack(spacing: 12) {
            if let icon {
                icon
                    .frame(width: ChatGPTTheme.rowIconSize, height: ChatGPTTheme.rowIconSize)
                    .foregroundStyle(isSelected ? FColor.accentBlue : FColor.iconSecondary)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(FType.rowTitle())
                    .foregroundStyle(isSelected ? FColor.textPrimary : FColor.textPrimary)
                    .tracking(FType.trackingRow())
                    .fontWeight(isSelected ? .semibold : .regular)
                
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
        .padding(.horizontal, ChatGPTTheme.rowHPadding)
        .padding(.vertical, ChatGPTTheme.rowVPadding)
        .contentShape(Rectangle())
    }
    
    @ViewBuilder
    private var trailingView: some View {
        switch trailing {
        case .none:
            EmptyView()
        case .chevron:
            Image(systemName: "chevron.right")
                .font(.system(size: ChatGPTTheme.rowChevronSize, weight: .semibold))
                .foregroundStyle(FColor.iconTertiary)
        case .badge(let count):
            if count > 0 {
                Text("\(count)")
                    .font(FType.caption())
                    .foregroundStyle(Color.white)
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
                RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous)
                    .fill(FColor.accentBlue.opacity(0.15))
            } else if Platform.isMac && isHovering {
                // Hover state on macOS
                RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous)
                    .fill(FColor.bgCardAlt)
                    .opacity(scheme == .dark ? ChatGPTTheme.hoverOverlayOpacityDark : ChatGPTTheme.hoverOverlayOpacityLight)
            } else if isPressed {
                // Pressed state on iOS
                RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous)
                    .fill(FColor.bgCardAlt)
                    .opacity(scheme == .dark ? ChatGPTTheme.pressedOverlayOpacityDark : ChatGPTTheme.pressedOverlayOpacityLight)
            } else {
                Color.clear
            }
        }
    }
}

// MARK: - Trailing Options

public enum ListItemTrailing {
    case none
    case chevron
    case badge(Int)
    case custom(AnyView)
}

// MARK: - Convenience Initializers

extension ListItemView {
    /// Creates a list item with a system icon
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
