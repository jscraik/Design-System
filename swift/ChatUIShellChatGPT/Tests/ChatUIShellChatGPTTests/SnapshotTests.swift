import SwiftUI
import XCTest
import ChatUITestSupport
import ChatUIThemes
@testable import ChatUIShellChatGPT

final class ChatUIShellChatGPTSnapshotTests: XCTestCase {
    @MainActor
    func testShellExampleLightChatGPT() throws {
        try SnapshotTestSupport.assertView(
            ShellExampleView(),
            size: CGSize(width: 1000, height: 700),
            colorScheme: .light,
            theme: .chatgpt,
            named: "shell_light_chatgpt"
        )
    }

    @MainActor
    func testShellExampleDarkChatGPT() throws {
        try SnapshotTestSupport.assertView(
            ShellExampleView(),
            size: CGSize(width: 1000, height: 700),
            colorScheme: .dark,
            theme: .chatgpt,
            named: "shell_dark_chatgpt"
        )
    }

    @MainActor
    func testShellExampleLightDefaultTheme() throws {
        try SnapshotTestSupport.assertView(
            ShellExampleView(),
            size: CGSize(width: 1000, height: 700),
            colorScheme: .light,
            theme: .default,
            named: "shell_light_default"
        )
    }

    @MainActor
    func testShellExampleHighContrast() throws {
        try SnapshotTestSupport.assertView(
            ShellExampleView(),
            size: CGSize(width: 1000, height: 700),
            colorScheme: .dark,
            theme: .chatgpt,
            accessibilityContrast: .increased,
            legibilityWeight: .bold,
            named: "shell_high_contrast"
        )
    }
}
