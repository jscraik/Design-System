//
//  GalleryStateTests.swift
//  ComponentGalleryTests
//
//  Created on 29-12-2025.
//

import XCTest
@testable import ComponentGallery

final class GalleryStateTests: XCTestCase {
    func testDefaults() {
        let state = GalleryState()
        XCTAssertEqual(state.selectedCategory, .foundation)
        XCTAssertEqual(state.searchQuery, "")
        XCTAssertNil(state.colorSchemeOverride)
        XCTAssertFalse(state.sideBySideMode)
        XCTAssertFalse(state.showAccessibilityPanel)
        XCTAssertFalse(state.highContrastMode)
        XCTAssertFalse(state.reducedMotionMode)
    }

    func testToggleColorSchemeCycles() {
        let state = GalleryState()
        XCTAssertNil(state.colorSchemeOverride)

        state.toggleColorScheme()
        XCTAssertEqual(state.colorSchemeOverride, .dark)

        state.toggleColorScheme()
        XCTAssertEqual(state.colorSchemeOverride, .light)

        state.toggleColorScheme()
        XCTAssertNil(state.colorSchemeOverride)
    }

    func testToggleSideBySideFlips() {
        let state = GalleryState()
        XCTAssertFalse(state.sideBySideMode)

        state.toggleSideBySide()
        XCTAssertTrue(state.sideBySideMode)

        state.toggleSideBySide()
        XCTAssertFalse(state.sideBySideMode)
    }
}
