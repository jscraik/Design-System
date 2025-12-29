//
//  ComponentGallery.swift
//  ChatUIPlayground
//
//  Created by Jamie Scott Craik on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct ComponentGallery: View {
    let section: PlaygroundSection

    var body: some View {
        switch section {
        case .buttons:
            ButtonsSection()
        case .inputs:
            InputsSection()
        case .settings:
            SettingsExampleView()
        case .navigation:
            NavigationExampleView()
        }
    }
}

private struct SectionHeaderView: View {
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

private struct ButtonsSection: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s24) {
                SectionHeaderView("Buttons", subtitle: "ChatUIButton variants and sizes")

                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("Variants")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)

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
                }

                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("Sizes")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)

                    HStack(spacing: FSpacing.s8) {
                        ChatUIButton("Small", variant: .default, size: .sm) {}
                        ChatUIButton("Default", variant: .default, size: .default) {}
                        ChatUIButton("Large", variant: .default, size: .lg) {}
                    }
                }

                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("Icon Buttons")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)

                    HStack(spacing: FSpacing.s8) {
                        ChatUIButton(
                            systemName: "heart.fill",
                            variant: .default,
                            size: .icon,
                            accessibilityLabel: "Favorite"
                        ) {}
                        ChatUIButton(
                            systemName: "trash",
                            variant: .destructive,
                            size: .icon,
                            accessibilityLabel: "Delete"
                        ) {}
                        ChatUIButton(
                            systemName: "square.and.arrow.up",
                            variant: .secondary,
                            size: .icon,
                            accessibilityLabel: "Share"
                        ) {}
                    }
                }
            }
            .padding(FSpacing.s24)
        }
        .background(FColor.bgApp)
    }
}

private struct InputsSection: View {
    @State private var defaultText = ""
    @State private var searchText = ""
    @State private var passwordText = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s24) {
                SectionHeaderView("Inputs", subtitle: "InputView variants and sizes")

                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("Variants")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)

                    InputView(
                        text: $defaultText,
                        placeholder: "Default input",
                        variant: .default
                    )

                    InputView(
                        text: $searchText,
                        placeholder: "Search...",
                        variant: .search,
                        submitLabel: .search
                    )

                    InputView(
                        text: $passwordText,
                        placeholder: "Password",
                        variant: .password,
                        submitLabel: .done
                    )
                }

                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("Sizes")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)

                    InputView(
                        text: .constant(""),
                        placeholder: "Small input",
                        size: .sm
                    )

                    InputView(
                        text: .constant(""),
                        placeholder: "Default input",
                        size: .default
                    )

                    InputView(
                        text: .constant(""),
                        placeholder: "Large input",
                        size: .lg
                    )
                }
            }
            .padding(FSpacing.s24)
        }
        .background(FColor.bgApp)
    }
}
