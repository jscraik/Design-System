import Foundation
import SwiftUI

enum AppSection: String, CaseIterable, Identifiable {
    case chat
    case tools
    case settings

    var id: String { rawValue }

    var title: String {
        switch self {
        case .chat:
            return "Chat"
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
        case .tools:
            return "hammer"
        case .settings:
            return "gearshape"
        }
    }
}

enum ThemeStyle: String, CaseIterable, Identifiable {
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

struct AppStateSnapshot: Codable {
    let selectedSectionRawValue: String
    let mcpBaseURLString: String
    let themeStyleRawValue: String
}

final class AppState: ObservableObject {
    @Published var selectedSection: AppSection = .chat
    @Published var mcpBaseURLString: String = "http://localhost:8787"
    @Published var themeStyle: ThemeStyle = .chatgpt

    func snapshot() -> AppStateSnapshot {
        AppStateSnapshot(
            selectedSectionRawValue: selectedSection.rawValue,
            mcpBaseURLString: mcpBaseURLString,
            themeStyleRawValue: themeStyle.rawValue
        )
    }

    func apply(snapshot: AppStateSnapshot) {
        if let section = AppSection(rawValue: snapshot.selectedSectionRawValue) {
            selectedSection = section
        }
        mcpBaseURLString = snapshot.mcpBaseURLString
        themeStyle = ThemeStyle(rawValue: snapshot.themeStyleRawValue) ?? .chatgpt
    }
}
