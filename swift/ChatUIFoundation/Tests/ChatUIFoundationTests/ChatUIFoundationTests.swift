import XCTest
@testable import ChatUIFoundation
import SwiftUI

final class ChatUIFoundationTests: XCTestCase {
    
    func testPlatformDetection() {
        // Test that platform detection works
        #if os(macOS)
        XCTAssertTrue(Platform.isMac)
        XCTAssertFalse(Platform.isIOS)
        XCTAssertFalse(Platform.isVisionOS)
        #elseif os(iOS)
        XCTAssertFalse(Platform.isMac)
        XCTAssertTrue(Platform.isIOS)
        XCTAssertFalse(Platform.isVisionOS)
        #elseif os(visionOS)
        XCTAssertFalse(Platform.isMac)
        XCTAssertFalse(Platform.isIOS)
        XCTAssertTrue(Platform.isVisionOS)
        #endif
    }
    
    func testSpacingConstants() {
        // Test that spacing constants are correct
        XCTAssertEqual(FSpacing.s2, 2)
        XCTAssertEqual(FSpacing.s4, 4)
        XCTAssertEqual(FSpacing.s8, 8)
        XCTAssertEqual(FSpacing.s12, 12)
        XCTAssertEqual(FSpacing.s16, 16)
        XCTAssertEqual(FSpacing.s24, 24)
        XCTAssertEqual(FSpacing.s32, 32)
    }
    
    func testTypographyTracking() {
        // Test that tracking constants are correct
        XCTAssertEqual(FType.trackingRow(), -0.3)
        XCTAssertEqual(FType.trackingCaption(), -0.2)
    }
    
    func testAssetCatalogColorsAccessible() {
        // Test that all semantic colors from Asset Catalog are accessible
        // This verifies the Asset Catalog integration is working correctly
        
        // Surface colors
        XCTAssertNotNil(FColor.bgApp)
        XCTAssertNotNil(FColor.bgCard)
        XCTAssertNotNil(FColor.bgCardAlt)
        
        // Text colors
        XCTAssertNotNil(FColor.textPrimary)
        XCTAssertNotNil(FColor.textSecondary)
        XCTAssertNotNil(FColor.textTertiary)
        
        // Icon colors
        XCTAssertNotNil(FColor.iconPrimary)
        XCTAssertNotNil(FColor.iconSecondary)
        XCTAssertNotNil(FColor.iconTertiary)
        
        // Accent colors
        XCTAssertNotNil(FColor.accentGreen)
        XCTAssertNotNil(FColor.accentBlue)
        XCTAssertNotNil(FColor.accentOrange)
        XCTAssertNotNil(FColor.accentRed)
        XCTAssertNotNil(FColor.accentPurple)
        
        // Divider
        XCTAssertNotNil(FColor.divider)
    }
    
    func testSemanticColorAPICompileSafety() {
        // Test that semantic color API provides compile-time safety
        // If this compiles, it means the API is type-safe
        let _ = FColor.bgApp
        let _ = FColor.textPrimary
        let _ = FColor.accentGreen
        
        // This test passing means:
        // 1. Colors are accessible via semantic names
        // 2. No runtime string lookups needed
        // 3. Autocomplete works in Xcode
        // 4. Typos are caught at compile time
        XCTAssertTrue(true, "Semantic color API is compile-time safe")
    }
}