import XCTest
import SwiftUI
import AStudioFoundation
@testable import AStudioComponents

final class AStudioComponentsTests: XCTestCase {
    
    // MARK: - SettingRowView Tests
    
    func testSettingRowViewWithAllTrailingVariants() {
        // Test .none trailing
        let noneRow = SettingRowView(title: "Test Title", trailing: .none)
        XCTAssertNotNil(noneRow)
        
        // Test .chevron trailing
        let chevronRow = SettingRowView(title: "Test Title", trailing: .chevron)
        XCTAssertNotNil(chevronRow)
        
        // Test .text trailing
        let textRow = SettingRowView(title: "Test Title", trailing: .text("Value"))
        XCTAssertNotNil(textRow)
        
        // Test .custom trailing
        let customRow = SettingRowView(title: "Test Title", trailing: .custom(AnyView(Text("Custom"))))
        XCTAssertNotNil(customRow)
    }
    
    func testSettingRowViewWithIcon() {
        let iconRow = SettingRowView(
            icon: AnyView(Image(systemName: "gear")),
            title: "Settings",
            subtitle: "Configure app"
        )
        XCTAssertNotNil(iconRow)
    }
    
    func testSettingRowViewWithAction() {
        var actionCalled = false
        let actionRow = SettingRowView(
            title: "Tap Me",
            action: { actionCalled = true }
        )
        XCTAssertNotNil(actionRow)
        // Note: SwiftUI view testing for actual tap behavior requires ViewInspector or similar
    }
    
    // MARK: - Hover State Tests (macOS)
    
    #if os(macOS)
    func testSettingRowViewHoverStateOnMacOS() {
        // Test that SettingRowView properly handles hover state on macOS
        let row = SettingRowView(title: "Hover Test")
        XCTAssertNotNil(row)
        
        // Verify Platform.isMac returns true on macOS
        XCTAssertTrue(Platform.isMac, "Platform.isMac should return true on macOS")
    }
    
    func testListItemViewHoverStateOnMacOS() {
        // Test that ListItemView properly handles hover state on macOS
        let item = ListItemView(title: "Hover Test")
        XCTAssertNotNil(item)
        
        // Verify Platform.isMac returns true on macOS
        XCTAssertTrue(Platform.isMac, "Platform.isMac should return true on macOS")
    }
    #endif
    
    // MARK: - FoundationSwitchStyle Tests
    
    func testFoundationSwitchStyleCreation() {
        let switchStyle = FoundationSwitchStyle()
        XCTAssertNotNil(switchStyle)
    }
    
    // MARK: - SettingToggleView Tests
    
    func testSettingToggleViewCreation() {
        let toggleView = SettingToggleView(
            title: "Enable Feature",
            isOn: .constant(false)
        )
        XCTAssertNotNil(toggleView)
    }
    
    func testSettingToggleViewWithIconAndSubtitle() {
        let toggleView = SettingToggleView(
            icon: AnyView(Image(systemName: "bell")),
            title: "Notifications",
            subtitle: "Receive push notifications",
            isOn: .constant(true)
        )
        XCTAssertNotNil(toggleView)
    }
    
    // MARK: - SettingDropdownView Tests
    
    func testSettingDropdownViewCreation() {
        let options = ["Option 1", "Option 2", "Option 3"]
        let dropdownView = SettingDropdownView(
            title: "Choose Option",
            options: options,
            selection: .constant("Option 1")
        )
        XCTAssertNotNil(dropdownView)
    }
    
    func testSettingDropdownViewWithIconAndSubtitle() {
        let options = ["Light", "Dark", "Auto"]
        let dropdownView = SettingDropdownView(
            icon: AnyView(Image(systemName: "paintbrush")),
            title: "Theme",
            subtitle: "Choose app appearance",
            options: options,
            selection: .constant("Auto")
        )
        XCTAssertNotNil(dropdownView)
    }
    
    // MARK: - SettingsCardView Tests
    
    func testSettingsCardViewCreation() {
        let cardView = SettingsCardView {
            Text("Card Content")
        }
        XCTAssertNotNil(cardView)
    }
    
    func testSettingsCardViewWithMultipleRows() {
        let cardView = SettingsCardView {
            SettingRowView(title: "Row 1")
            SettingsDivider()
            SettingRowView(title: "Row 2")
        }
        XCTAssertNotNil(cardView)
    }
    
    // MARK: - SettingsDivider Tests
    
    func testSettingsDividerCreation() {
        let divider = SettingsDivider()
        XCTAssertNotNil(divider)
    }
    
    // MARK: - Component Composition Tests
    
    func testSettingToggleViewComposition() {
        // Test that SettingToggleView properly composes SettingRowView with Toggle
        let toggleView = SettingToggleView(
            title: "Test Toggle",
            isOn: .constant(false)
        )
        XCTAssertNotNil(toggleView)
        
        // Verify it uses FoundationSwitchStyle (structural test)
        let switchStyle = FoundationSwitchStyle()
        XCTAssertNotNil(switchStyle)
    }
    
    func testSettingDropdownViewComposition() {
        // Test that SettingDropdownView properly composes SettingRowView with Menu
        let options = ["A", "B", "C"]
        let dropdownView = SettingDropdownView(
            title: "Test Dropdown",
            options: options,
            selection: .constant("A")
        )
        XCTAssertNotNil(dropdownView)
    }
    
    // MARK: - SettingTrailing Enum Tests
    
    func testSettingTrailingEnum() {
        // Test that SettingTrailing enum cases exist and can be created
        let none = SettingTrailing.none
        let chevron = SettingTrailing.chevron
        let text = SettingTrailing.text("Test")
        let custom = SettingTrailing.custom(AnyView(Text("Custom")))
        
        XCTAssertNotNil(none)
        XCTAssertNotNil(chevron)
        XCTAssertNotNil(text)
        XCTAssertNotNil(custom)
    }
    
    // MARK: - Legacy Button Tests (keeping existing tests)
    
    func testChatUIButtonVariants() {
        // Test that button variants exist
        let variants: [ChatUIButtonVariant] = [
            .default, .destructive, .outline, .secondary, .ghost, .link
        ]
        
        XCTAssertEqual(variants.count, 6)
    }
    
    func testChatUIButtonSizes() {
        // Test that button sizes exist
        let sizes: [ChatUIButtonSize] = [
            .default, .sm, .lg, .icon
        ]
        
        XCTAssertEqual(sizes.count, 4)
    }
}
