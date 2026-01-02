import SwiftUI

/// Theme tokens used by ChatUI components and shells.
///
/// ### Discussion
/// Use a `ChatUITheme` value to customize component shape, spacing, and visual
/// surface treatments. Apply a theme via the `chatUITheme(_:)` view modifier.
public struct ChatUITheme: Equatable, Sendable {
    /// Surface rendering style for glass or solid treatments.
    public enum SurfaceStyle: Equatable, Sendable {
        /// Translucent glass-like surfaces.
        case glass
        /// Opaque, solid surfaces.
        case solid
    }

    /// Corner radius for the app shell.
    public var appCornerRadius: CGFloat
    /// Corner radius for cards.
    public var cardCornerRadius: CGFloat
    /// Corner radius for rows.
    public var rowCornerRadius: CGFloat
    /// Corner radius for pill-shaped elements.
    public var pillCornerRadius: CGFloat

    /// Corner radius for buttons.
    public var buttonCornerRadius: CGFloat
    /// Corner radius for input fields.
    public var inputCornerRadius: CGFloat

    /// Shadow opacity for the app shell.
    public var appShadowOpacity: Double
    /// Shadow blur radius for the app shell.
    public var appShadowRadius: CGFloat
    /// Shadow vertical offset for the app shell.
    public var appShadowYOffset: CGFloat

    /// App border opacity in light mode.
    public var appBorderOpacityLight: Double
    /// App border opacity in dark mode.
    public var appBorderOpacityDark: Double

    /// Card border opacity in light mode.
    public var cardBorderOpacityLight: Double
    /// Card border opacity in dark mode.
    public var cardBorderOpacityDark: Double

    /// Divider opacity in light mode.
    public var dividerOpacityLight: Double
    /// Divider opacity in dark mode.
    public var dividerOpacityDark: Double

    /// Horizontal padding for rows.
    public var rowHPadding: CGFloat
    /// Vertical padding for rows.
    public var rowVPadding: CGFloat
    /// Icon size for rows.
    public var rowIconSize: CGFloat
    /// Chevron size for rows.
    public var rowChevronSize: CGFloat

    /// Hover overlay opacity in light mode.
    public var hoverOverlayOpacityLight: Double
    /// Hover overlay opacity in dark mode.
    public var hoverOverlayOpacityDark: Double
    /// Pressed overlay opacity in light mode.
    public var pressedOverlayOpacityLight: Double
    /// Pressed overlay opacity in dark mode.
    public var pressedOverlayOpacityDark: Double

    /// Card background opacity in light mode.
    public var cardBackgroundOpacityLight: Double
    /// Card background opacity in dark mode.
    public var cardBackgroundOpacityDark: Double

    /// Surface style for glass or solid treatments.
    public var surfaceStyle: SurfaceStyle

    /// Creates a theme from explicit design tokens.
    ///
    /// - Parameters:
    ///   - appCornerRadius: Corner radius for the app shell.
    ///   - cardCornerRadius: Corner radius for cards.
    ///   - rowCornerRadius: Corner radius for rows.
    ///   - pillCornerRadius: Corner radius for fully rounded pills.
    ///   - buttonCornerRadius: Corner radius for buttons.
    ///   - inputCornerRadius: Corner radius for input fields.
    ///   - appShadowOpacity: Shadow opacity for the app shell.
    ///   - appShadowRadius: Shadow blur radius for the app shell.
    ///   - appShadowYOffset: Shadow vertical offset for the app shell.
    ///   - appBorderOpacityLight: App border opacity in light mode.
    ///   - appBorderOpacityDark: App border opacity in dark mode.
    ///   - cardBorderOpacityLight: Card border opacity in light mode.
    ///   - cardBorderOpacityDark: Card border opacity in dark mode.
    ///   - dividerOpacityLight: Divider opacity in light mode.
    ///   - dividerOpacityDark: Divider opacity in dark mode.
    ///   - rowHPadding: Horizontal padding for rows.
    ///   - rowVPadding: Vertical padding for rows.
    ///   - rowIconSize: Icon size for rows.
    ///   - rowChevronSize: Chevron size for rows.
    ///   - hoverOverlayOpacityLight: Hover overlay opacity in light mode.
    ///   - hoverOverlayOpacityDark: Hover overlay opacity in dark mode.
    ///   - pressedOverlayOpacityLight: Pressed overlay opacity in light mode.
    ///   - pressedOverlayOpacityDark: Pressed overlay opacity in dark mode.
    ///   - cardBackgroundOpacityLight: Card background opacity in light mode.
    ///   - cardBackgroundOpacityDark: Card background opacity in dark mode.
    ///   - surfaceStyle: Surface style for glass or solid treatments.
    public init(
        appCornerRadius: CGFloat,
        cardCornerRadius: CGFloat,
        rowCornerRadius: CGFloat,
        pillCornerRadius: CGFloat,
        buttonCornerRadius: CGFloat,
        inputCornerRadius: CGFloat,
        appShadowOpacity: Double,
        appShadowRadius: CGFloat,
        appShadowYOffset: CGFloat,
        appBorderOpacityLight: Double,
        appBorderOpacityDark: Double,
        cardBorderOpacityLight: Double,
        cardBorderOpacityDark: Double,
        dividerOpacityLight: Double,
        dividerOpacityDark: Double,
        rowHPadding: CGFloat,
        rowVPadding: CGFloat,
        rowIconSize: CGFloat,
        rowChevronSize: CGFloat,
        hoverOverlayOpacityLight: Double,
        hoverOverlayOpacityDark: Double,
        pressedOverlayOpacityLight: Double,
        pressedOverlayOpacityDark: Double,
        cardBackgroundOpacityLight: Double,
        cardBackgroundOpacityDark: Double,
        surfaceStyle: SurfaceStyle
    ) {
        self.appCornerRadius = appCornerRadius
        self.cardCornerRadius = cardCornerRadius
        self.rowCornerRadius = rowCornerRadius
        self.pillCornerRadius = pillCornerRadius
        self.buttonCornerRadius = buttonCornerRadius
        self.inputCornerRadius = inputCornerRadius
        self.appShadowOpacity = appShadowOpacity
        self.appShadowRadius = appShadowRadius
        self.appShadowYOffset = appShadowYOffset
        self.appBorderOpacityLight = appBorderOpacityLight
        self.appBorderOpacityDark = appBorderOpacityDark
        self.cardBorderOpacityLight = cardBorderOpacityLight
        self.cardBorderOpacityDark = cardBorderOpacityDark
        self.dividerOpacityLight = dividerOpacityLight
        self.dividerOpacityDark = dividerOpacityDark
        self.rowHPadding = rowHPadding
        self.rowVPadding = rowVPadding
        self.rowIconSize = rowIconSize
        self.rowChevronSize = rowChevronSize
        self.hoverOverlayOpacityLight = hoverOverlayOpacityLight
        self.hoverOverlayOpacityDark = hoverOverlayOpacityDark
        self.pressedOverlayOpacityLight = pressedOverlayOpacityLight
        self.pressedOverlayOpacityDark = pressedOverlayOpacityDark
        self.cardBackgroundOpacityLight = cardBackgroundOpacityLight
        self.cardBackgroundOpacityDark = cardBackgroundOpacityDark
        self.surfaceStyle = surfaceStyle
    }
}

public extension ChatUITheme {
    /// ChatGPT-style theme preset.
    static let chatgpt = ChatUITheme(
        appCornerRadius: ChatGPTTheme.appCornerRadius,
        cardCornerRadius: ChatGPTTheme.cardCornerRadius,
        rowCornerRadius: ChatGPTTheme.rowCornerRadius,
        pillCornerRadius: ChatGPTTheme.pillCornerRadius,
        buttonCornerRadius: 8,
        inputCornerRadius: 10,
        appShadowOpacity: ChatGPTTheme.appShadowOpacity,
        appShadowRadius: ChatGPTTheme.appShadowRadius,
        appShadowYOffset: ChatGPTTheme.appShadowYOffset,
        appBorderOpacityLight: 0.2,
        appBorderOpacityDark: 0.16,
        cardBorderOpacityLight: ChatGPTTheme.cardBorderOpacityLight,
        cardBorderOpacityDark: ChatGPTTheme.cardBorderOpacityDark,
        dividerOpacityLight: ChatGPTTheme.dividerOpacityLight,
        dividerOpacityDark: ChatGPTTheme.dividerOpacityDark,
        rowHPadding: ChatGPTTheme.rowHPadding,
        rowVPadding: ChatGPTTheme.rowVPadding,
        rowIconSize: ChatGPTTheme.rowIconSize,
        rowChevronSize: ChatGPTTheme.rowChevronSize,
        hoverOverlayOpacityLight: ChatGPTTheme.hoverOverlayOpacityLight,
        hoverOverlayOpacityDark: ChatGPTTheme.hoverOverlayOpacityDark,
        pressedOverlayOpacityLight: ChatGPTTheme.pressedOverlayOpacityLight,
        pressedOverlayOpacityDark: ChatGPTTheme.pressedOverlayOpacityDark,
        cardBackgroundOpacityLight: 0.92,
        cardBackgroundOpacityDark: 0.86,
        surfaceStyle: .glass
    )

    /// Native macOS-style theme preset.
    static let `default` = ChatUITheme(
        appCornerRadius: DefaultTheme.appCornerRadius,
        cardCornerRadius: DefaultTheme.cardCornerRadius,
        rowCornerRadius: DefaultTheme.rowCornerRadius,
        pillCornerRadius: DefaultTheme.pillCornerRadius,
        buttonCornerRadius: DefaultTheme.buttonRadius,
        inputCornerRadius: DefaultTheme.inputRadius,
        appShadowOpacity: DefaultTheme.appShadowOpacity,
        appShadowRadius: DefaultTheme.appShadowRadius,
        appShadowYOffset: DefaultTheme.appShadowYOffset,
        appBorderOpacityLight: DefaultTheme.appBorderOpacityLight,
        appBorderOpacityDark: DefaultTheme.appBorderOpacityDark,
        cardBorderOpacityLight: DefaultTheme.cardBorderOpacityLight,
        cardBorderOpacityDark: DefaultTheme.cardBorderOpacityDark,
        dividerOpacityLight: DefaultTheme.dividerOpacityLight,
        dividerOpacityDark: DefaultTheme.dividerOpacityDark,
        rowHPadding: DefaultTheme.rowHPadding,
        rowVPadding: DefaultTheme.rowVPadding,
        rowIconSize: DefaultTheme.rowIconSize,
        rowChevronSize: DefaultTheme.rowChevronSize,
        hoverOverlayOpacityLight: DefaultTheme.hoverOverlayOpacityLight,
        hoverOverlayOpacityDark: DefaultTheme.hoverOverlayOpacityDark,
        pressedOverlayOpacityLight: DefaultTheme.pressedOverlayOpacityLight,
        pressedOverlayOpacityDark: DefaultTheme.pressedOverlayOpacityDark,
        cardBackgroundOpacityLight: 1.0,
        cardBackgroundOpacityDark: 1.0,
        surfaceStyle: .solid
    )
}

private struct ChatUIThemeKey: EnvironmentKey {
    static let defaultValue: ChatUITheme = .chatgpt
}

public extension EnvironmentValues {
    /// Current ChatUI theme for the view hierarchy.
    var chatUITheme: ChatUITheme {
        get { self[ChatUIThemeKey.self] }
        set { self[ChatUIThemeKey.self] = newValue }
    }
}

public extension View {
    /// Sets the ChatUI theme for this view hierarchy.
    ///
    /// - Parameter theme: The theme to apply.
    /// - Returns: A view with the theme applied in the environment.
    func chatUITheme(_ theme: ChatUITheme) -> some View {
        environment(\.chatUITheme, theme)
    }
}
