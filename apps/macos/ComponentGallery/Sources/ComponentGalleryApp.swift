//
//  ComponentGalleryApp.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes
import ChatUIShellChatGPT

#if os(macOS)
@main
struct ComponentGalleryApp: App {
    @StateObject private var galleryState = GalleryState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(galleryState)
                .frame(minWidth: 1200, minHeight: 800)
        }
        .windowStyle(.titleBar)
        .windowToolbarStyle(.unified)
        .commands {
            CommandGroup(replacing: .appInfo) {
                Button("About Component Gallery") {
                    // Show about window
                }
            }
            
            CommandGroup(after: .appSettings) {
                Divider()
                Button("Toggle Light/Dark Mode") {
                    galleryState.toggleColorScheme()
                }
                .keyboardShortcut("d", modifiers: [.command, .shift])
                
                Button("Toggle Side-by-Side Mode") {
                    galleryState.toggleSideBySide()
                }
                .keyboardShortcut("s", modifiers: [.command, .shift])
            }
            
            CommandGroup(after: .toolbar) {
                Button("Export Screenshot") {
                    galleryState.exportScreenshot()
                }
                .keyboardShortcut("e", modifiers: [.command, .shift])
            }
        }
    }
}
#endif

#if os(iOS)
@main
struct ComponentGalleryiOSApp: App {
    @StateObject private var galleryState = GalleryState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(galleryState)
        }
    }
}
#endif

// MARK: - Gallery State

class GalleryState: ObservableObject {
    @Published var selectedCategory: ComponentCategory = .foundation
    @Published var selectedComponent: String? = nil
    @Published var searchQuery: String = ""
    @Published var colorSchemeOverride: ColorScheme? = nil
    @Published var sideBySideMode: Bool = false
    @Published var showAccessibilityPanel: Bool = false
    @Published var highContrastMode: Bool = false
    @Published var reducedMotionMode: Bool = false
    
    func toggleColorScheme() {
        if colorSchemeOverride == nil {
            colorSchemeOverride = .dark
        } else if colorSchemeOverride == .dark {
            colorSchemeOverride = .light
        } else {
            colorSchemeOverride = nil
        }
    }
    
    func toggleSideBySide() {
        sideBySideMode.toggle()
    }
    
    func exportScreenshot() {
        // Trigger screenshot export
        NotificationCenter.default.post(name: .exportScreenshot, object: nil)
    }
}

extension Notification.Name {
    static let exportScreenshot = Notification.Name("exportScreenshot")
}

// MARK: - Component Categories

enum ComponentCategory: String, CaseIterable, Identifiable {
    case foundation = "Foundation"
    case settings = "Settings"
    case buttons = "Buttons"
    case inputs = "Inputs"
    case navigation = "Navigation"
    case themes = "Themes"
    case accessibility = "Accessibility"
    
    var id: String { rawValue }
    
    var icon: String {
        switch self {
        case .foundation: return "square.stack.3d.up"
        case .settings: return "gearshape"
        case .buttons: return "button.programmable"
        case .inputs: return "keyboard"
        case .navigation: return "arrow.triangle.turn.up.right.diamond"
        case .themes: return "paintpalette"
        case .accessibility: return "accessibility"
        }
    }
    
    var components: [String] {
        switch self {
        case .foundation:
            return ["Colors", "Typography", "Spacing", "Platform"]
        case .settings:
            return ["SettingsDivider", "SettingsCardView", "SettingRowView", "SettingToggleView", "SettingDropdownView", "FoundationSwitchStyle"]
        case .buttons:
            return ["ChatUIButton", "Button Variants", "Button Sizes", "Icon Buttons"]
        case .inputs:
            return ["InputView", "Text Input", "Search Input", "Input Sizes"]
        case .navigation:
            return ["ListItemView", "Navigation Example"]
        case .themes:
            return ["ChatGPT Theme", "Default Theme", "Theme Comparison"]
        case .accessibility:
            return ["Focus Management", "VoiceOver", "Keyboard Navigation", "High Contrast", "Reduced Motion"]
        }
    }
}
