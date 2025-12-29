//
//  InteractionHarnessUITests.swift
//  ComponentGalleryUITests
//
//  Created on 29-12-2025.
//

import XCTest

final class InteractionHarnessUITests: XCTestCase {
    private let app = XCUIApplication()

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launch()
    }

    func testInteractionHarnessBasics() {
        let input = app.textFields["interaction.input"]
        XCTAssertTrue(input.waitForExistence(timeout: 5))
        input.tap()
        input.typeText(" updated")

        let toggle = app.switches["interaction.toggle"]
        if toggle.exists {
            toggle.tap()
        }

        let dropdown = app.buttons["interaction.dropdown"]
        if dropdown.exists {
            dropdown.tap()
        }

        let navHome = app.buttons["interaction.nav.home"]
        if navHome.exists {
            navHome.tap()
        }

        let runButton = app.buttons["interaction.action.run"]
        if runButton.exists {
            runButton.tap()
        }

        let resetButton = app.buttons["interaction.action.reset"]
        if resetButton.exists {
            resetButton.tap()
        }
    }
}
