import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Trailing content options for SettingRowView
public enum SettingTrailing {
    case none
    case chevron
    case text(String)
    case custom(AnyView)
}

/// Core primitive for settings rows with optional icon, title, subtitle, and trailing content
public struct SettingRowView: View {
    private let icon: AnyView?
    private let title: String
    private let subtitle: String?
    private let trailing: SettingTrailing
    private let action: (() -> Void)?
    
    @Environment(\.colorScheme) private var scheme
    @State private var isHovering = false
    @State private var isPressed = false
    
    public init(
        icon: AnyView? = nil,
        title: String,
        subtitle: String? = nil,
        trailing: SettingTrailing = .none,
        action: (() -> Void)? = nil
    ) {
        self.icon = icon
        self.title = title
        self.subtitle = subtitle
        self.trailing = trailing
        self.action = action
    }
    
    public var body: some View {
        Group {
            if let action {
                Button(action: action) {
                    rowContent
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
                rowContent
            }
        }
        .onHover { isHovering in
            if Platform.isMac {
                self.isHovering = isHovering
            }
        }
        .background(rowBackground)
        .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous))
        .padding(.horizontal, 6) // "inset hover" appearance
    }
    
    private var rowContent: some View {
        HStack(spacing: 12) {
            if let icon {
                icon
                    .frame(width: ChatGPTTheme.rowIconSize, height: ChatGPTTheme.rowIconSize)
                    .foregroundStyle(FColor.iconSecondary)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textPrimary)
                    .tracking(FType.trackingRow())
                
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
        case .text(let value):
            Text(value)
                .font(FType.rowValue())
                .foregroundStyle(FColor.textSecondary)
                .tracking(FType.trackingRow())
        case .custom(let view):
            view
        }
    }
    
    private var rowBackground: some View {
        Group {
            if isPressed {
                RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous)
                    .fill(FColor.bgCardAlt)
                    .opacity(scheme == .dark ? ChatGPTTheme.pressedOverlayOpacityDark : ChatGPTTheme.pressedOverlayOpacityLight)
            } else if Platform.isMac && isHovering {
                RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius, style: .continuous)
                    .fill(FColor.bgCardAlt)
                    .opacity(scheme == .dark ? ChatGPTTheme.hoverOverlayOpacityDark : ChatGPTTheme.hoverOverlayOpacityLight)
            } else {
                Color.clear
            }
        }
    }
}
