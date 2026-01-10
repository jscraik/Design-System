import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Visual variants for `AlertView`.
public enum AlertVariant {
    case `default`
    case destructive
}

/// Renders an alert container with optional icon and styled content.
///
/// ### Discussion
/// Use `AlertTitle` and `AlertDescription` inside `AlertView` to structure
/// alert content consistently.
///
/// - Example:
/// ```swift
/// AlertView(variant: .destructive, icon: Image(systemName: "exclamationmark.triangle")) {
///     AlertTitle("Error")
///     AlertDescription("Something went wrong.")
/// }
/// ```
public struct AlertView<Content: View>: View {
    private let variant: AlertVariant
    private let icon: Image?
    private let content: Content

    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme

    /// Creates an alert view.
    ///
    /// - Parameters:
    ///   - variant: Visual variant for the alert (default: `.default`).
    ///   - icon: Optional leading icon.
    ///   - content: Alert content builder.
    public init(
        variant: AlertVariant = .default,
        icon: Image? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.variant = variant
        self.icon = icon
        self.content = content()
    }

    /// The content and behavior of this view.
    public var body: some View {
        HStack(alignment: .top, spacing: FSpacing.s12) {
            if let icon {
                icon
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(iconColor)
                    .accessibilityHidden(true)
            }
            VStack(alignment: .leading, spacing: FSpacing.s4) {
                content
            }
        }
        .padding(.horizontal, FSpacing.s16)
        .padding(.vertical, FSpacing.s12)
        .background(backgroundColor)
        .overlay(
            RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous)
                .stroke(borderColor, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous))
        .accessibilityElement(children: .combine)
    }

    private var backgroundColor: Color {
        switch variant {
        case .default:
            return FColor.bgCard
        case .destructive:
            return FColor.accentRed.opacity(0.12)
        }
    }

    private var borderColor: Color {
        switch variant {
        case .default:
            return FColor.divider.opacity(scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight)
        case .destructive:
            return FColor.accentRed.opacity(0.5)
        }
    }

    private var iconColor: Color {
        switch variant {
        case .default:
            return FColor.iconSecondary
        case .destructive:
            return FColor.accentRed
        }
    }
}

/// Renders a title for an alert.
public struct AlertTitle: View {
    private let text: String

    /// Creates an alert title.
    ///
    /// - Parameter text: Title text.
    public init(_ text: String) {
        self.text = text
    }

    /// The content and behavior of this view.
    public var body: some View {
        Text(text)
            .font(FType.rowTitle())
            .foregroundStyle(FColor.textPrimary)
    }
}

/// Renders a description for an alert.
public struct AlertDescription: View {
    private let text: String

    /// Creates an alert description.
    ///
    /// - Parameter text: Description text.
    public init(_ text: String) {
        self.text = text
    }

    /// The content and behavior of this view.
    public var body: some View {
        Text(text)
            .font(FType.caption())
            .foregroundStyle(FColor.textTertiary)
            .fixedSize(horizontal: false, vertical: true)
    }
}
