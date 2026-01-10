import SwiftUI
import XCTest
import AStudioFoundation
import AStudioTestSupport
import AStudioThemes
@testable import AStudioComponents

final class AStudioComponentsSnapshotTests: XCTestCase {
    @MainActor
    func testSettingsExampleLightChatGPT() throws {
        try SnapshotTestSupport.assertView(
            SettingsExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .light,
            theme: .chatgpt,
            named: "settings_light_chatgpt"
        )
    }

    @MainActor
    func testSettingsExampleDarkChatGPT() throws {
        try SnapshotTestSupport.assertView(
            SettingsExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .dark,
            theme: .chatgpt,
            named: "settings_dark_chatgpt"
        )
    }

    @MainActor
    func testSettingsExampleLightDefaultTheme() throws {
        try SnapshotTestSupport.assertView(
            SettingsExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .light,
            theme: .default,
            named: "settings_light_default"
        )
    }

    @MainActor
    func testSettingsExampleDarkDefaultTheme() throws {
        try SnapshotTestSupport.assertView(
            SettingsExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .dark,
            theme: .default,
            named: "settings_dark_default"
        )
    }

    @MainActor
    func testSettingsExampleHighContrast() throws {
        try SnapshotTestSupport.assertView(
            SettingsExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .dark,
            theme: .chatgpt,
            accessibilityContrast: .increased,
            legibilityWeight: .bold,
            named: "settings_high_contrast"
        )
    }

    @MainActor
    func testSettingsExampleReducedMotion() throws {
        try SnapshotTestSupport.assertView(
            SettingsExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .dark,
            theme: .chatgpt,
            reduceMotion: true,
            named: "settings_reduce_motion"
        )
    }

    @MainActor
    func testNavigationExampleLightChatGPT() throws {
        try SnapshotTestSupport.assertView(
            NavigationExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .light,
            theme: .chatgpt,
            named: "navigation_light_chatgpt"
        )
    }

    @MainActor
    func testNavigationExampleDarkChatGPT() throws {
        try SnapshotTestSupport.assertView(
            NavigationExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .dark,
            theme: .chatgpt,
            named: "navigation_dark_chatgpt"
        )
    }

    @MainActor
    func testNavigationExampleLightDefaultTheme() throws {
        try SnapshotTestSupport.assertView(
            NavigationExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .light,
            theme: .default,
            named: "navigation_light_default"
        )
    }

    @MainActor
    func testNavigationExampleDarkDefaultTheme() throws {
        try SnapshotTestSupport.assertView(
            NavigationExampleView(),
            size: CGSize(width: 720, height: 760),
            colorScheme: .dark,
            theme: .default,
            named: "navigation_dark_default"
        )
    }

    @MainActor
    func testComponentsShowcaseLightChatGPT() throws {
        try SnapshotTestSupport.assertView(
            ComponentShowcaseView(),
            size: CGSize(width: 820, height: 900),
            colorScheme: .light,
            theme: .chatgpt,
            named: "components_showcase_light_chatgpt"
        )
    }

    @MainActor
    func testComponentsShowcaseDarkDefaultTheme() throws {
        try SnapshotTestSupport.assertView(
            ComponentShowcaseView(),
            size: CGSize(width: 820, height: 900),
            colorScheme: .dark,
            theme: .default,
            named: "components_showcase_dark_default"
        )
    }

    // MARK: - ComposeView Snapshot Tests

    @MainActor
    func testComposeViewLightChatGPT() throws {
        try SnapshotTestSupport.assertView(
            ComposeView(),
            size: CGSize(width: 800, height: 1000),
            colorScheme: .light,
            theme: .chatgpt,
            named: "compose_light_chatgpt"
        )
    }

    @MainActor
    func testComposeViewDarkChatGPT() throws {
        try SnapshotTestSupport.assertView(
            ComposeView(),
            size: CGSize(width: 800, height: 1000),
            colorScheme: .dark,
            theme: .chatgpt,
            named: "compose_dark_chatgpt"
        )
    }

    @MainActor
    func testComposeViewLightDefaultTheme() throws {
        try SnapshotTestSupport.assertView(
            ComposeView(),
            size: CGSize(width: 800, height: 1000),
            colorScheme: .light,
            theme: .default,
            named: "compose_light_default"
        )
    }

    @MainActor
    func testComposeViewDarkDefaultTheme() throws {
        try SnapshotTestSupport.assertView(
            ComposeView(),
            size: CGSize(width: 800, height: 1000),
            colorScheme: .dark,
            theme: .default,
            named: "compose_dark_default"
        )
    }

    @MainActor
    func testComposeViewHighContrast() throws {
        try SnapshotTestSupport.assertView(
            ComposeView(),
            size: CGSize(width: 800, height: 1000),
            colorScheme: .dark,
            theme: .chatgpt,
            accessibilityContrast: .increased,
            legibilityWeight: .bold,
            named: "compose_high_contrast"
        )
    }
}

private struct SnapshotSectionHeader: View {
    let title: String
    let subtitle: String?

    init(_ title: String, subtitle: String? = nil) {
        self.title = title
        self.subtitle = subtitle
    }

    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s4) {
            Text(title)
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)
            if let subtitle {
                Text(subtitle)
                    .font(FType.caption())
                    .foregroundStyle(FColor.textSecondary)
            }
        }
    }
}

private struct ComponentShowcaseView: View {
    @State private var defaultText = "Hello"
    @State private var searchText = "Search"
    @State private var passwordText = "Password"

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s24) {
                SnapshotSectionHeader("Buttons", subtitle: "Variants and sizes")

                SettingsCardView {
                    VStack(alignment: .leading, spacing: FSpacing.s16) {
                        HStack(spacing: FSpacing.s8) {
                            ChatUIButton("Default", variant: .default) {}
                            ChatUIButton("Destructive", variant: .destructive) {}
                            ChatUIButton("Outline", variant: .outline) {}
                        }

                        HStack(spacing: FSpacing.s8) {
                            ChatUIButton("Secondary", variant: .secondary) {}
                            ChatUIButton("Ghost", variant: .ghost) {}
                            ChatUIButton("Link", variant: .link) {}
                        }

                        SettingsDivider()

                        HStack(spacing: FSpacing.s8) {
                            ChatUIButton("Small", variant: .default, size: .sm) {}
                            ChatUIButton("Default", variant: .default, size: .default) {}
                            ChatUIButton("Large", variant: .default, size: .lg) {}
                        }
                    }
                    .padding(FSpacing.s16)
                }

                SnapshotSectionHeader("Inputs", subtitle: "Variants")

                SettingsCardView {
                    VStack(alignment: .leading, spacing: FSpacing.s12) {
                        InputView(text: $defaultText, placeholder: "Default input")
                        InputView(text: $searchText, placeholder: "Search...", variant: .search)
                        InputView(text: $passwordText, placeholder: "Password", variant: .password)
                    }
                    .padding(FSpacing.s16)
                }

                SnapshotSectionHeader("Navigation", subtitle: "List items")

                SettingsCardView {
                    VStack(spacing: 0) {
                        ListItemView(systemIcon: "tray", title: "Inbox", trailing: .badge(5), isSelected: true)
                        SettingsDivider()
                        ListItemView(systemIcon: "paperplane", title: "Sent")
                        SettingsDivider()
                        ListItemView(systemIcon: "trash", title: "Trash")
                    }
                }
            }
            .frame(maxWidth: 720, alignment: .leading)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(FSpacing.s24)
        }
    }
}
