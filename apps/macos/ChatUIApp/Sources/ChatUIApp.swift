import SwiftUI
import ChatUISystemIntegration

@main
struct ChatUIApp: App {
    @StateObject private var appState = AppState()
    private let lifecycleManager = AppLifecycleManager()

    var body: some Scene {
        WindowGroup {
            ContentView(lifecycleManager: lifecycleManager)
                .environmentObject(appState)
                .frame(minWidth: 980, minHeight: 680)
        }
        .commands {
            AppCommands(appState: appState)
        }
    }
}

struct AppCommands: Commands {
    @ObservedObject var appState: AppState

    var body: some Commands {
        CommandGroup(after: .appInfo) {
            Button("New Chat") {
                appState.selectedSection = .chat
            }
            .keyboardShortcut("n", modifiers: .command)

            Button("Open Tools") {
                appState.selectedSection = .tools
            }
            .keyboardShortcut("t", modifiers: .command)

            Button("Open Settings") {
                appState.selectedSection = .settings
            }
            .keyboardShortcut(",", modifiers: .command)
        }
    }
}
