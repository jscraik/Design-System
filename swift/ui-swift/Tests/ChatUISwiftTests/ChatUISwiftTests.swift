import XCTest
import SwiftUI
@testable import ChatUISwift

final class ChatUISwiftTests: XCTestCase {
    
    func testDesignTokensExist() throws {
        // Test that design tokens are accessible
        XCTAssertNotNil(DesignTokens.Colors.Background.primary)
        XCTAssertNotNil(DesignTokens.Colors.Text.primary)
        XCTAssertNotNil(DesignTokens.Colors.Accent.blue)
        
        // Test typography tokens
        XCTAssertGreaterThan(DesignTokens.Typography.Heading1.size, 0)
        XCTAssertGreaterThan(DesignTokens.Typography.Body.size, 0)
        
        // Test spacing tokens
        XCTAssertFalse(DesignTokens.Spacing.scale.isEmpty)
        XCTAssertGreaterThan(DesignTokens.Spacing.md, 0)
    }
    
    func testColorHexInitializer() throws {
        // Test hex color initialization
        let whiteColor = Color(hex: "#FFFFFF")
        let blackColor = Color(hex: "#000000")
        let blueColor = Color(hex: "#0285FF")
        
        // These should not crash and should create valid colors
        XCTAssertNotNil(whiteColor)
        XCTAssertNotNil(blackColor)
        XCTAssertNotNil(blueColor)
    }
    
    func testPackageInitialization() throws {
        // Test that package initialization doesn't crash
        XCTAssertNoThrow(ChatUISwift.initialize())
        
        // Test package metadata
        XCTAssertEqual(ChatUISwift.name, "ChatUISwift")
        XCTAssertEqual(ChatUISwift.version, "1.0.0")
    }
    
    func testChatUIButtonAccessibilityLabelResolution() throws {
        XCTAssertEqual(
            ChatUIButton<Text>.resolveAccessibilityLabel(explicit: "Save", fallback: "Fallback"),
            "Save"
        )
        XCTAssertEqual(
            ChatUIButton<Text>.resolveAccessibilityLabel(explicit: "  ", fallback: "Fallback"),
            "Fallback"
        )
        XCTAssertNil(
            ChatUIButton<Text>.resolveAccessibilityLabel(explicit: nil, fallback: "   ")
        )
    }
    
    func testChatUIInputAccessibilityLabelResolution() throws {
        XCTAssertEqual(
            ChatUIInput.resolveAccessibilityLabel(explicit: "Email", placeholder: "Enter email"),
            "Email"
        )
        XCTAssertEqual(
            ChatUIInput.resolveAccessibilityLabel(explicit: "  ", placeholder: "Enter email"),
            "Enter email"
        )
        XCTAssertNil(
            ChatUIInput.resolveAccessibilityLabel(explicit: nil, placeholder: "   ")
        )
    }
    
    func testChatUIInputSubmitLabelInitializer() throws {
        let input = ChatUIInput(
            text: .constant(""),
            placeholder: "Search",
            submitLabel: .search
        )
        XCTAssertNotNil(input)
    }
    
    func testChatUIButtonStyleMappings() throws {
        // Test font size mappings for all sizes
        XCTAssertEqual(ChatUIButton<Text>.fontSize(for: .default), DesignTokens.Typography.Body.size)
        XCTAssertEqual(ChatUIButton<Text>.fontSize(for: .sm), DesignTokens.Typography.BodySmall.size)
        XCTAssertEqual(ChatUIButton<Text>.fontSize(for: .lg), DesignTokens.Typography.Heading3.size)
        XCTAssertEqual(ChatUIButton<Text>.fontSize(for: .icon), DesignTokens.Typography.Body.size)
        
        // Test font weight mappings for all sizes
        XCTAssertEqual(ChatUIButton<Text>.fontWeight(for: .default), DesignTokens.Typography.Body.weight)
        XCTAssertEqual(ChatUIButton<Text>.fontWeight(for: .sm), DesignTokens.Typography.BodySmall.weight)
        XCTAssertEqual(ChatUIButton<Text>.fontWeight(for: .lg), DesignTokens.Typography.Heading3.weight)
        XCTAssertEqual(ChatUIButton<Text>.fontWeight(for: .icon), DesignTokens.Typography.Body.weight)
        
        // Test padding mappings for all sizes
        let defaultPadding = ChatUIButton<Text>.paddingInsets(for: .default)
        XCTAssertEqual(defaultPadding.top, DesignTokens.Spacing.xs)
        XCTAssertEqual(defaultPadding.leading, DesignTokens.Spacing.sm)
        XCTAssertEqual(defaultPadding.bottom, DesignTokens.Spacing.xs)
        XCTAssertEqual(defaultPadding.trailing, DesignTokens.Spacing.sm)
        
        let smallPadding = ChatUIButton<Text>.paddingInsets(for: .sm)
        XCTAssertEqual(smallPadding.top, DesignTokens.Spacing.xxs)
        XCTAssertEqual(smallPadding.leading, DesignTokens.Spacing.smXs)
        XCTAssertEqual(smallPadding.bottom, DesignTokens.Spacing.xxs)
        XCTAssertEqual(smallPadding.trailing, DesignTokens.Spacing.smXs)
        
        let largePadding = ChatUIButton<Text>.paddingInsets(for: .lg)
        XCTAssertEqual(largePadding.top, DesignTokens.Spacing.smXs)
        XCTAssertEqual(largePadding.leading, DesignTokens.Spacing.mdSm)
        XCTAssertEqual(largePadding.bottom, DesignTokens.Spacing.smXs)
        XCTAssertEqual(largePadding.trailing, DesignTokens.Spacing.mdSm)
        
        let iconPadding = ChatUIButton<Text>.paddingInsets(for: .icon)
        XCTAssertEqual(iconPadding.top, DesignTokens.Spacing.xs)
        XCTAssertEqual(iconPadding.leading, DesignTokens.Spacing.xs)
        XCTAssertEqual(iconPadding.bottom, DesignTokens.Spacing.xs)
        XCTAssertEqual(iconPadding.trailing, DesignTokens.Spacing.xs)
    }
    
    func testChatUIButtonColorTokenMappings() throws {
        // Test background token mappings for all variants
        XCTAssertEqual(
            ChatUIButtonStyle.backgroundToken(for: .default, isPressed: false, prefersHighContrast: false),
            .accentBlue
        )
        XCTAssertEqual(
            ChatUIButtonStyle.backgroundToken(for: .destructive, isPressed: false, prefersHighContrast: false),
            .accentRed
        )
        XCTAssertEqual(
            ChatUIButtonStyle.backgroundToken(for: .outline, isPressed: false, prefersHighContrast: false),
            .clear
        )
        XCTAssertEqual(
            ChatUIButtonStyle.backgroundToken(for: .secondary, isPressed: false, prefersHighContrast: false),
            .backgroundSecondary
        )
        XCTAssertEqual(
            ChatUIButtonStyle.backgroundToken(for: .ghost, isPressed: false, prefersHighContrast: false),
            .clear
        )
        XCTAssertEqual(
            ChatUIButtonStyle.backgroundToken(for: .ghost, isPressed: true, prefersHighContrast: false),
            .backgroundSecondary
        )
        XCTAssertEqual(
            ChatUIButtonStyle.backgroundToken(for: .link, isPressed: false, prefersHighContrast: false),
            .clear
        )
        
        // Test foreground token mappings for all variants
        XCTAssertEqual(
            ChatUIButtonStyle.foregroundToken(for: .default, prefersHighContrast: false),
            .textOnAccent
        )
        XCTAssertEqual(
            ChatUIButtonStyle.foregroundToken(for: .destructive, prefersHighContrast: false),
            .textOnAccent
        )
        XCTAssertEqual(
            ChatUIButtonStyle.foregroundToken(for: .outline, prefersHighContrast: false),
            .accentBlue
        )
        XCTAssertEqual(
            ChatUIButtonStyle.foregroundToken(for: .secondary, prefersHighContrast: false),
            .textPrimary
        )
        XCTAssertEqual(
            ChatUIButtonStyle.foregroundToken(for: .ghost, prefersHighContrast: false),
            .textPrimary
        )
        XCTAssertEqual(
            ChatUIButtonStyle.foregroundToken(for: .link, prefersHighContrast: false),
            .accentBlue
        )
        
        // Test border token mappings
        XCTAssertEqual(
            ChatUIButtonStyle.borderToken(for: .outline, prefersHighContrast: false),
            .borderAccentBlue
        )
        XCTAssertEqual(
            ChatUIButtonStyle.borderToken(for: .default, prefersHighContrast: false),
            .clear
        )
        
        // Test high contrast mappings
        XCTAssertEqual(
            ChatUIButtonStyle.backgroundToken(for: .default, isPressed: false, prefersHighContrast: true),
            .highContrastBackground
        )
        XCTAssertEqual(
            ChatUIButtonStyle.foregroundToken(for: .default, prefersHighContrast: true),
            .highContrastText
        )
        XCTAssertEqual(
            ChatUIButtonStyle.borderToken(for: .outline, prefersHighContrast: true),
            .highContrastBorder
        )
    }
    
    func testChatUIInputStyleMappings() throws {
        // Test font size mappings for all sizes
        XCTAssertEqual(ChatUITextFieldStyle.fontSize(for: .default), DesignTokens.Typography.Body.size)
        XCTAssertEqual(ChatUITextFieldStyle.fontSize(for: .sm), DesignTokens.Typography.BodySmall.size)
        XCTAssertEqual(ChatUITextFieldStyle.fontSize(for: .lg), DesignTokens.Typography.Heading3.size)
        
        // Test font weight mappings for all sizes
        XCTAssertEqual(ChatUITextFieldStyle.fontWeight(for: .default), DesignTokens.Typography.Body.weight)
        XCTAssertEqual(ChatUITextFieldStyle.fontWeight(for: .sm), DesignTokens.Typography.BodySmall.weight)
        XCTAssertEqual(ChatUITextFieldStyle.fontWeight(for: .lg), DesignTokens.Typography.Heading3.weight)
        
        // Test padding mappings for all sizes
        let defaultPadding = ChatUITextFieldStyle.paddingInsets(for: .default)
        XCTAssertEqual(defaultPadding.top, DesignTokens.Spacing.xs)
        XCTAssertEqual(defaultPadding.leading, DesignTokens.Spacing.smXs)
        XCTAssertEqual(defaultPadding.bottom, DesignTokens.Spacing.xs)
        XCTAssertEqual(defaultPadding.trailing, DesignTokens.Spacing.smXs)
        
        let smallPadding = ChatUITextFieldStyle.paddingInsets(for: .sm)
        XCTAssertEqual(smallPadding.top, DesignTokens.Spacing.xxs)
        XCTAssertEqual(smallPadding.leading, DesignTokens.Spacing.xs)
        XCTAssertEqual(smallPadding.bottom, DesignTokens.Spacing.xxs)
        XCTAssertEqual(smallPadding.trailing, DesignTokens.Spacing.xs)
        
        let largePadding = ChatUITextFieldStyle.paddingInsets(for: .lg)
        XCTAssertEqual(largePadding.top, DesignTokens.Spacing.smXs)
        XCTAssertEqual(largePadding.leading, DesignTokens.Spacing.sm)
        XCTAssertEqual(largePadding.bottom, DesignTokens.Spacing.smXs)
        XCTAssertEqual(largePadding.trailing, DesignTokens.Spacing.sm)
    }
    
    func testChatUIInputColorTokenMappings() throws {
        // Test background token mappings for all variants
        XCTAssertEqual(
            ChatUITextFieldStyle.backgroundToken(for: .default, prefersHighContrast: false),
            .backgroundSecondary
        )
        XCTAssertEqual(
            ChatUITextFieldStyle.backgroundToken(for: .password, prefersHighContrast: false),
            .backgroundSecondary
        )
        XCTAssertEqual(
            ChatUITextFieldStyle.backgroundToken(for: .search, prefersHighContrast: false),
            .backgroundTertiary
        )
        
        // Test border token mappings
        XCTAssertEqual(
            ChatUITextFieldStyle.borderToken(isFocused: true, prefersHighContrast: false),
            .focusRing
        )
        XCTAssertEqual(
            ChatUITextFieldStyle.borderToken(isFocused: false, prefersHighContrast: false),
            .backgroundTertiary
        )
        
        // Test high contrast mappings
        XCTAssertEqual(
            ChatUITextFieldStyle.backgroundToken(for: .default, prefersHighContrast: true),
            .highContrastBackground
        )
        XCTAssertEqual(
            ChatUITextFieldStyle.borderToken(isFocused: true, prefersHighContrast: true),
            .highContrastBorder
        )
        XCTAssertEqual(
            ChatUITextFieldStyle.borderToken(isFocused: false, prefersHighContrast: true),
            .highContrastBorder
        )
    }
    
    func testChatUICardStyleMappings() throws {
        // Test background token mappings for all variants
        XCTAssertEqual(
            ChatUICard<Text>.backgroundToken(for: .default, prefersHighContrast: false),
            .backgroundPrimary
        )
        XCTAssertEqual(
            ChatUICard<Text>.backgroundToken(for: .elevated, prefersHighContrast: false),
            .backgroundPrimary
        )
        XCTAssertEqual(
            ChatUICard<Text>.backgroundToken(for: .outlined, prefersHighContrast: false),
            .backgroundPrimary
        )
        
        // Test border token mappings for all variants
        XCTAssertEqual(
            ChatUICard<Text>.borderToken(for: .default, prefersHighContrast: false),
            .clear
        )
        XCTAssertEqual(
            ChatUICard<Text>.borderToken(for: .elevated, prefersHighContrast: false),
            .clear
        )
        XCTAssertEqual(
            ChatUICard<Text>.borderToken(for: .outlined, prefersHighContrast: false),
            .borderTertiary
        )
        
        // Test shadow token mappings for all variants
        XCTAssertEqual(
            ChatUICard<Text>.shadowToken(for: .default, prefersHighContrast: false),
            .clear
        )
        XCTAssertEqual(
            ChatUICard<Text>.shadowToken(for: .elevated, prefersHighContrast: false),
            .shadow
        )
        XCTAssertEqual(
            ChatUICard<Text>.shadowToken(for: .outlined, prefersHighContrast: false),
            .clear
        )
        
        // Test high contrast mappings
        XCTAssertEqual(
            ChatUICard<Text>.backgroundToken(for: .default, prefersHighContrast: true),
            .highContrastBackground
        )
        XCTAssertEqual(
            ChatUICard<Text>.borderToken(for: .outlined, prefersHighContrast: true),
            .highContrastBorder
        )
        XCTAssertEqual(
            ChatUICard<Text>.borderToken(for: .default, prefersHighContrast: true),
            .clear
        )
        XCTAssertEqual(
            ChatUICard<Text>.shadowToken(for: .elevated, prefersHighContrast: true),
            .clear
        )
    }
    
    func testDynamicTypeScaling() throws {
        // Test dynamic type scaling for buttons
        XCTAssertEqual(ChatUIButton<Text>.dynamicTypeScale(for: .large), 1.0)
        XCTAssertEqual(ChatUIButton<Text>.dynamicTypeScale(for: .xSmall), 0.9)
        XCTAssertEqual(ChatUIButton<Text>.dynamicTypeScale(for: .accessibility5), 1.7)
        
        // Test scaled font size calculation
        let baseSize: CGFloat = 16
        let scaledSize = ChatUIButton<Text>.scaledFontSize(baseSize, dynamicTypeSize: .xLarge)
        XCTAssertEqual(scaledSize, baseSize * 1.05)
        
        // Test dynamic type scaling for inputs
        XCTAssertEqual(ChatUIInput.dynamicTypeScale(for: .large), 1.0)
        XCTAssertEqual(ChatUIInput.dynamicTypeScale(for: .accessibility1), 1.3)
        
        let inputScaledSize = ChatUIInput.scaledFontSize(baseSize, dynamicTypeSize: .xxLarge)
        XCTAssertEqual(inputScaledSize, baseSize * 1.1)
    }
}
