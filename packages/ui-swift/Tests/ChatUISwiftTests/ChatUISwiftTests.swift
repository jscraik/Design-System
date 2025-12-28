import XCTest
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
}