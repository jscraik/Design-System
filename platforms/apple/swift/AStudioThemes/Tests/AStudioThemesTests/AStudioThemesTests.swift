import XCTest
@testable import AStudioThemes

final class AStudioThemesTests: XCTestCase {
    
    func testChatGPTThemeConstants() {
        // Test that ChatGPT theme constants are correct
        XCTAssertEqual(ChatGPTTheme.appCornerRadius, 18)
        XCTAssertEqual(ChatGPTTheme.cardCornerRadius, 24)
        XCTAssertEqual(ChatGPTTheme.rowCornerRadius, 10)
        XCTAssertEqual(ChatGPTTheme.pillCornerRadius, 999)
        
        XCTAssertEqual(ChatGPTTheme.appShadowOpacity, 0.45)
        XCTAssertEqual(ChatGPTTheme.appShadowRadius, 30)
        XCTAssertEqual(ChatGPTTheme.appShadowYOffset, 18)
        
        XCTAssertEqual(ChatGPTTheme.rowHPadding, 16)
        XCTAssertEqual(ChatGPTTheme.rowVPadding, 12)
        XCTAssertEqual(ChatGPTTheme.rowIconSize, 24)
        XCTAssertEqual(ChatGPTTheme.rowChevronSize, 14)
    }
    
    func testDefaultThemeConstants() {
        // Test that Default theme constants are correct
        XCTAssertEqual(DefaultTheme.cardRadius, 8)
        XCTAssertEqual(DefaultTheme.buttonRadius, 6)
        XCTAssertEqual(DefaultTheme.inputRadius, 8)
        
        XCTAssertEqual(DefaultTheme.cardShadowRadius, 4)
        XCTAssertEqual(DefaultTheme.messageSpacing, 12)
        XCTAssertEqual(DefaultTheme.sectionSpacing, 20)
        XCTAssertEqual(DefaultTheme.containerPadding, 16)
    }
}
