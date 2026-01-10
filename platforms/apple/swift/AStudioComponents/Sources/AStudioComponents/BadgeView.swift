import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Visual variants for `BadgeView`.
public enum BadgeVariant {
    case `default`
    case secondary
    case destructive
    case outline
}

/// Renders a badge with visual variants.
///
/// ### Discussion
/// Use `BadgeView` to display short status or metadata labels.
/// Renders a badge with visual variants.
///
/// ### Discussion
/// Use `BadgeView` to display short status or metadata labels.
///
/// - Example:
/// ```swift
/// BadgeView("Beta", variant: .secondary)
/// ```
public struct BadgeView<Content: View>: View {
    private let variant: BadgeVariant
    private let content: Content

    @Environment(\.colorScheme) private var scheme
    @Environment(\.chatUITheme) private var theme

    /// Creates a badge view.
    ///
    /// - Parameters:
    ///   - variant: Visual variant for the badge (default: `.default`).
    ///   - content: Badge content builder.
    public init(
        variant: BadgeVariant = .default,
        @ViewBuilder content: () -> Content
    ) {
        self.variant = variant
        self.content = content()
    }

    /// The content and behavior of this view.
    public var body: some View {
        content
            .font(FType.caption())
            .foregroundStyle(foregroundColor)
            .padding(.horizontal, FSpacing.s8)
            .padding(.vertical, FSpacing.s2)
            .background(backgroundColor)
            .overlay(borderOverlay)
            .clipShape(RoundedRectangle(cornerRadius: theme.pillCornerRadius, style: .continuous))
            .lineLimit(1)
            .accessibilityElement(children: .combine)
    }

    private var backgroundColor: Color {
        switch variant {
        case .default:
            return FColor.accentBlue
        case .secondary:
            return FColor.bgCard
        case .destructive:
            return FColor.accentRed
        case .outline:
            return Color.clear
        }
    }

    private var foregroundColor: Color {
        switch variant {
        case .default, .destructive:
            return FColor.accentForeground
        case .secondary, .outline:
            return FColor.textPrimary
        }
    }

    private var borderOverlay: some View {
        Group {
            if variant == .outline {
                RoundedRectangle(cornerRadius: theme.pillCornerRadius, style: .continuous)
                    .stroke(
                        FColor.divider.opacity(
                            scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight
                        ),
                        lineWidth: 1
                    )
            } else {
                EmptyView()
            }
        }
    }
}

public extension BadgeView where Content == Text {
    /// Creates a badge from a string.
    ///
    /// - Parameters:
    ///   - text: Badge text.
    ///   - variant: Visual variant for the badge (default: `.default`).
    init(_ text: String, variant: BadgeVariant = .default) {
        self.init(variant: variant) {
            Text(text)
        }
    }
}
