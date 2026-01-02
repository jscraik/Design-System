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
/// Entry point for the macOS Component Gallery app.
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
/// Entry point for the iOS Component Gallery app.
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

/// Shared state for the component gallery UI.
@MainActor
class GalleryState: ObservableObject {
    @Published var selectedCategory: ComponentCategory = .foundation
    @Published var searchQuery: String = ""
    @Published var colorSchemeOverride: ColorScheme? = nil
    @Published var sideBySideMode: Bool = false
    @Published var showAccessibilityPanel: Bool = false
    @Published var highContrastMode: Bool = false
    @Published var reducedMotionMode: Bool = false
    
    /// Cycles the color scheme override between system, dark, and light.
    func toggleColorScheme() {
        if colorSchemeOverride == nil {
            colorSchemeOverride = .dark
        } else if colorSchemeOverride == .dark {
            colorSchemeOverride = .light
        } else {
            colorSchemeOverride = nil
        }
    }
    
    /// Toggles side-by-side comparison mode.
    func toggleSideBySide() {
        sideBySideMode.toggle()
    }
    
    /// Emits a notification to export a screenshot.
    func exportScreenshot() {
        // Trigger screenshot export
        NotificationCenter.default.post(name: .exportScreenshot, object: nil)
    }
}

extension Notification.Name {
    /// Posted when a screenshot export is requested.
    static let exportScreenshot = Notification.Name("exportScreenshot")
}

// MARK: - Component Categories

/// Component categories available in the gallery.
enum ComponentCategory: String, CaseIterable, Identifiable, Sendable {
    case foundation = "Foundation"
    case settings = "Settings"
    case buttons = "Buttons"
    case inputs = "Inputs"
    case feedback = "Feedback"
    case dataDisplay = "Data Display"
    case templates = "Templates"
    case chatVariants = "Chat Variants"
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
        case .feedback: return "exclamationmark.bubble"
        case .dataDisplay: return "tablecells"
        case .templates: return "square.grid.2x2"
        case .chatVariants: return "bubble.left.and.bubble.right"
        case .navigation: return "arrow.triangle.turn.up.right.diamond"
        case .themes: return "paintpalette"
        case .accessibility: return "accessibility"
        }
    }
}
