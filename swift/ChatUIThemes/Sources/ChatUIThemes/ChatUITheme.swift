import SwiftUI

/// Theme tokens used by ChatUI components and shells.
public struct ChatUITheme: Equatable {
    public enum SurfaceStyle: Equatable {
        case glass
        case solid
    }

    public var appCornerRadius: CGFloat
    public var cardCornerRadius: CGFloat
    public var rowCornerRadius: CGFloat
    public var pillCornerRadius: CGFloat

    public var buttonCornerRadius: CGFloat
    public var inputCornerRadius: CGFloat

    public var appShadowOpacity: Double
    public var appShadowRadius: CGFloat
    public var appShadowYOffset: CGFloat

    public var appBorderOpacityLight: Double
    public var appBorderOpacityDark: Double

    public var cardBorderOpacityLight: Double
    public var cardBorderOpacityDark: Double

    public var dividerOpacityLight: Double
    public var dividerOpacityDark: Double

    public var rowHPadding: CGFloat
    public var rowVPadding: CGFloat
    public var rowIconSize: CGFloat
    public var rowChevronSize: CGFloat

    public var hoverOverlayOpacityLight: Double
    public var hoverOverlayOpacityDark: Double
    public var pressedOverlayOpacityLight: Double
    public var pressedOverlayOpacityDark: Double

    public var cardBackgroundOpacityLight: Double
    public var cardBackgroundOpacityDark: Double

    public var surfaceStyle: SurfaceStyle

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
    var chatUITheme: ChatUITheme {
        get { self[ChatUIThemeKey.self] }
        set { self[ChatUIThemeKey.self] = newValue }
    }
}

public extension View {
    func chatUITheme(_ theme: ChatUITheme) -> some View {
        environment(\.chatUITheme, theme)
    }
}
