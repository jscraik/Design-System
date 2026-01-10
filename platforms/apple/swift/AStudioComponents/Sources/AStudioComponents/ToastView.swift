import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Visual variants for `ToastView`.
public enum ToastVariant {
    case `default`
    case success
    case warning
    case error
    case info
}

/// Placement options for toast containers.
public enum ToastPosition {
    case topLeading
    case top
    case topTrailing
    case bottomLeading
    case bottom
    case bottomTrailing

    var alignment: Alignment {
        switch self {
        case .topLeading:
            return .topLeading
        case .top:
            return .top
        case .topTrailing:
            return .topTrailing
        case .bottomLeading:
            return .bottomLeading
        case .bottom:
            return .bottom
        case .bottomTrailing:
            return .bottomTrailing
        }
    }

    var stackAlignment: HorizontalAlignment {
        switch self {
        case .topLeading, .bottomLeading:
            return .leading
        case .top, .bottom:
            return .center
        case .topTrailing, .bottomTrailing:
            return .trailing
        }
    }

    var isBottom: Bool {
        switch self {
        case .bottomLeading, .bottom, .bottomTrailing:
            return true
        case .topLeading, .top, .topTrailing:
            return false
        }
    }
}

/// Renders a toast notification.
///
/// ### Discussion
/// The toast auto-dismisses after `duration` seconds when `duration` is greater than zero.
///
/// - Example:
/// ```swift
/// ToastView(isPresented: $showToast, variant: .success, title: "Saved")
/// ```
public struct ToastView: View {
    private let variant: ToastVariant
    private let title: String?
    private let description: String?
    private let icon: Image?
    private let action: AnyView?
    private let duration: TimeInterval
    private let onClose: (() -> Void)?

    @Binding private var isPresented: Bool

    @Environment(\.chatUITheme) private var theme

    /// Creates a toast view.
    ///
    /// - Parameters:
    ///   - isPresented: Binding controlling presentation.
    ///   - variant: Visual variant (default: `.default`).
    ///   - title: Optional title text.
    ///   - description: Optional description text.
    ///   - icon: Optional leading icon.
    ///   - action: Optional trailing action view.
    ///   - duration: Auto-dismiss duration in seconds (default: `5.0`).
    ///   - onClose: Optional callback invoked when dismissing.
    public init(
        isPresented: Binding<Bool>,
        variant: ToastVariant = .default,
        title: String? = nil,
        description: String? = nil,
        icon: Image? = nil,
        action: AnyView? = nil,
        duration: TimeInterval = 5.0,
        onClose: (() -> Void)? = nil
    ) {
        self._isPresented = isPresented
        self.variant = variant
        self.title = title
        self.description = description
        self.icon = icon
        self.action = action
        self.duration = duration
        self.onClose = onClose
    }

    /// The content and behavior of this view.
    public var body: some View {
        if isPresented {
            HStack(alignment: .top, spacing: FSpacing.s12) {
                if let icon {
                    icon
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(iconColor)
                        .accessibilityHidden(true)
                }

                VStack(alignment: .leading, spacing: FSpacing.s4) {
                    if let title {
                        Text(title)
                            .font(FType.rowTitle())
                            .foregroundStyle(FColor.textPrimary)
                    }
                    if let description {
                        Text(description)
                            .font(FType.caption())
                            .foregroundStyle(FColor.textSecondary)
                    }
                }

                Spacer(minLength: FSpacing.s12)

                if let action {
                    action
                }

                ChatUIButton(
                    systemName: "xmark",
                    variant: .ghost,
                    size: .icon,
                    accessibilityLabel: "Dismiss",
                    accessibilityHint: "Dismiss notification"
                ) {
                    dismiss()
                }
            }
            .padding(FSpacing.s12)
            .background(backgroundColor)
            .overlay(
                RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous)
                    .stroke(borderColor, lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous))
            .shadow(color: FColor.bgCardAlt.opacity(0.3), radius: 10, x: 0, y: 6)
            .accessibilityElement(children: .combine)
            .onAppear {
                guard duration > 0 else { return }
                DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
                    dismiss()
                }
            }
        }
    }

    private var backgroundColor: Color {
        switch variant {
        case .default:
            return FColor.bgCard
        case .success:
            return FColor.accentGreen.opacity(0.12)
        case .warning:
            return FColor.accentOrange.opacity(0.12)
        case .error:
            return FColor.accentRed.opacity(0.12)
        case .info:
            return FColor.accentBlue.opacity(0.12)
        }
    }

    private var borderColor: Color {
        switch variant {
        case .default:
            return FColor.divider.opacity(0.6)
        case .success:
            return FColor.accentGreen.opacity(0.5)
        case .warning:
            return FColor.accentOrange.opacity(0.5)
        case .error:
            return FColor.accentRed.opacity(0.5)
        case .info:
            return FColor.accentBlue.opacity(0.5)
        }
    }

    private var iconColor: Color {
        switch variant {
        case .default:
            return FColor.iconSecondary
        case .success:
            return FColor.accentGreen
        case .warning:
            return FColor.accentOrange
        case .error:
            return FColor.accentRed
        case .info:
            return FColor.accentBlue
        }
    }

    private func dismiss() {
        onClose?()
        isPresented = false
    }
}

/// Renders a container for stacking toast views.
///
/// - Example:
/// ```swift
/// ToastContainerView {
///     ToastView(isPresented: $showToast, title: "Updated")
/// }
/// ```
public struct ToastContainerView<Content: View>: View {
    private let position: ToastPosition
    private let content: Content

    /// Creates a toast container.
    ///
    /// - Parameters:
    ///   - position: Placement for the stack (default: `.bottomTrailing`).
    ///   - content: Toast content builder.
    public init(
        position: ToastPosition = .bottomTrailing,
        @ViewBuilder content: () -> Content
    ) {
        self.position = position
        self.content = content()
    }

    /// The content and behavior of this view.
    public var body: some View {
        ZStack(alignment: position.alignment) {
            VStack(alignment: position.stackAlignment, spacing: FSpacing.s8) {
                if position.isBottom {
                    Spacer()
                }
                content
                if !position.isBottom {
                    Spacer()
                }
            }
            .padding(FSpacing.s16)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .allowsHitTesting(true)
    }
}
