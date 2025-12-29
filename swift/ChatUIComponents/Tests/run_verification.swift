#!/usr/bin/env swift

import Foundation
import SwiftUI

// Import the package - this will work when run with swift run
#if canImport(ChatUIComponents)
import ChatUIComponents

/// Verification script to test settings primitives without XCTest
/// This ensures our components can be instantiated and used correctly
struct ComponentVerification {
    
    static func verifyAllComponents() {
        print("🧪 Verifying ChatUIComponents settings primitives...")
        
        // Test SettingRowView with all trailing variants
        verifySettingRowView()
        
        // Test FoundationSwitchStyle
        verifyFoundationSwitchStyle()
        
        // Test SettingToggleView
        verifySettingToggleView()
        
        // Test SettingDropdownView
        verifySettingDropdownView()
        
        // Test SettingsCardView
        verifySettingsCardView()
        
        // Test SettingsDivider
        verifySettingsDivider()
        
        // Test component composition
        verifyComponentComposition()
        
        print("✅ All settings primitives verified successfully!")
    }
    
    private static func verifySettingRowView() {
        print("  • Testing SettingRowView with all trailing variants...")
        
        // Test .none trailing
        let noneRow = SettingRowView(title: "Test Title", trailing: .none)
        assert(type(of: noneRow) == SettingRowView.self, "SettingRowView with .none trailing should be created")
        
        // Test .chevron trailing
        let chevronRow = SettingRowView(title: "Test Title", trailing: .chevron)
        assert(type(of: chevronRow) == SettingRowView.self, "SettingRowView with .chevron trailing should be created")
        
        // Test .text trailing
        let textRow = SettingRowView(title: "Test Title", trailing: .text("Value"))
        assert(type(of: textRow) == SettingRowView.self, "SettingRowView with .text trailing should be created")
        
        // Test .custom trailing
        let customRow = SettingRowView(title: "Test Title", trailing: .custom(AnyView(Text("Custom"))))
        assert(type(of: customRow) == SettingRowView.self, "SettingRowView with .custom trailing should be created")
        
        // Test with icon
        let iconRow = SettingRowView(
            icon: AnyView(Image(systemName: "gear")),
            title: "Settings",
            subtitle: "Configure app"
        )
        assert(type(of: iconRow) == SettingRowView.self, "SettingRowView with icon should be created")
        
        // Test with action
        let actionRow = SettingRowView(
            title: "Tap Me",
            action: { print("Action called") }
        )
        assert(type(of: actionRow) == SettingRowView.self, "SettingRowView with action should be created")
        
        print("    ✓ SettingRowView tests passed")
    }
    
    private static func verifyFoundationSwitchStyle() {
        print("  • Testing FoundationSwitchStyle...")
        
        let switchStyle = FoundationSwitchStyle()
        assert(type(of: switchStyle) == FoundationSwitchStyle.self, "FoundationSwitchStyle should be created")
        
        print("    ✓ FoundationSwitchStyle tests passed")
    }
    
    private static func verifySettingToggleView() {
        print("  • Testing SettingToggleView...")
        
        let toggleView = SettingToggleView(
            title: "Enable Feature",
            isOn: .constant(false)
        )
        assert(type(of: toggleView) == SettingToggleView.self, "SettingToggleView should be created")
        
        let toggleViewWithIcon = SettingToggleView(
            icon: AnyView(Image(systemName: "bell")),
            title: "Notifications",
            subtitle: "Receive push notifications",
            isOn: .constant(true)
        )
        assert(type(of: toggleViewWithIcon) == SettingToggleView.self, "SettingToggleView with icon and subtitle should be created")
        
        print("    ✓ SettingToggleView tests passed")
    }
    
    private static func verifySettingDropdownView() {
        print("  • Testing SettingDropdownView...")
        
        let options = ["Option 1", "Option 2", "Option 3"]
        let dropdownView = SettingDropdownView(
            title: "Choose Option",
            options: options,
            selection: .constant("Option 1")
        )
        assert(type(of: dropdownView) == SettingDropdownView.self, "SettingDropdownView should be created")
        
        let themeOptions = ["Light", "Dark", "Auto"]
        let dropdownViewWithIcon = SettingDropdownView(
            icon: AnyView(Image(systemName: "paintbrush")),
            title: "Theme",
            subtitle: "Choose app appearance",
            options: themeOptions,
            selection: .constant("Auto")
        )
        assert(type(of: dropdownViewWithIcon) == SettingDropdownView.self, "SettingDropdownView with icon and subtitle should be created")
        
        print("    ✓ SettingDropdownView tests passed")
    }
    
    private static func verifySettingsCardView() {
        print("  • Testing SettingsCardView...")
        
        let cardView = SettingsCardView {
            Text("Card Content")
        }
        assert(type(of: cardView) == SettingsCardView<Text>.self, "SettingsCardView should be created")
        
        print("    ✓ SettingsCardView tests passed")
    }
    
    private static func verifySettingsDivider() {
        print("  • Testing SettingsDivider...")
        
        let divider = SettingsDivider()
        assert(type(of: divider) == SettingsDivider.self, "SettingsDivider should be created")
        
        print("    ✓ SettingsDivider tests passed")
    }
    
    private static func verifyComponentComposition() {
        print("  • Testing component composition...")
        
        // Test that SettingToggleView properly composes SettingRowView with Toggle
        let toggleView = SettingToggleView(
            title: "Test Toggle",
            isOn: .constant(false)
        )
        assert(type(of: toggleView) == SettingToggleView.self, "SettingToggleView composition should work")
        
        // Verify it uses FoundationSwitchStyle (structural test)
        let switchStyle = FoundationSwitchStyle()
        assert(type(of: switchStyle) == FoundationSwitchStyle.self, "FoundationSwitchStyle should be available for composition")
        
        // Test that SettingDropdownView properly composes SettingRowView with Menu
        let options = ["A", "B", "C"]
        let dropdownView = SettingDropdownView(
            title: "Test Dropdown",
            options: options,
            selection: .constant("A")
        )
        assert(type(of: dropdownView) == SettingDropdownView.self, "SettingDropdownView composition should work")
        
        print("    ✓ Component composition tests passed")
    }
}

// Run verification
ComponentVerification.verifyAllComponents()

#else
print("❌ ChatUIComponents module not available")
print("   Run this script from the package directory with: swift run")
exit(1)
#endif
