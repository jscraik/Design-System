import Foundation
import SwiftUI

/// Top-level sections displayed in the app sidebar.
enum AppSection: String, CaseIterable, Identifiable, Sendable {
    case chat
    case templates
    case tools
    case settings

    var id: String { rawValue }

    var title: String {
        switch self {
        case .chat:
            return "Chat"
        case .templates:
            return "Templates"
        case .tools:
            return "Tools"
        case .settings:
            return "Settings"
        }
    }

    var systemImage: String {
        switch self {
        case .chat:
            return "bubble.left.and.bubble.right"
        case .templates:
            return "square.grid.2x2"
        case .tools:
            return "hammer"
        case .settings:
            return "gearshape"
        }
    }
}

/// Theme styles supported by the app.
enum ThemeStyle: String, CaseIterable, Identifiable, Sendable {
    case chatgpt
    case `default`

    var id: String { rawValue }

    var title: String {
        switch self {
        case .chatgpt:
            return "ChatGPT"
        case .default:
            return "Default"
        }
    }
}

/// Serialized snapshot of app state for persistence.
struct AppStateSnapshot: Codable, Sendable {
    let selectedSectionRawValue: String
    let mcpBaseURLString: String
    let themeStyleRawValue: String
}

/// Observable application state used across the UI.
@MainActor
final class AppState: ObservableObject {
    @Published var selectedSection: AppSection = .chat
    @Published var mcpBaseURLString: String = "http://localhost:8787"
    @Published var themeStyle: ThemeStyle = .chatgpt

    /// Creates a serializable snapshot of the current state.
    func snapshot() -> AppStateSnapshot {
        AppStateSnapshot(
            selectedSectionRawValue: selectedSection.rawValue,
            mcpBaseURLString: mcpBaseURLString,
            themeStyleRawValue: themeStyle.rawValue
        )
    }

    /// Applies a previously captured snapshot to the current state.
    /// - Parameter snapshot: The snapshot to restore.
    func apply(snapshot: AppStateSnapshot) {
        if let section = AppSection(rawValue: snapshot.selectedSectionRawValue) {
            selectedSection = section
        }
        mcpBaseURLString = snapshot.mcpBaseURLString
        themeStyle = ThemeStyle(rawValue: snapshot.themeStyleRawValue) ?? .chatgpt
    }
}
