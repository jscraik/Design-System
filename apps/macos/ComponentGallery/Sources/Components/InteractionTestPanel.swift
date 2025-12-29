//
//  InteractionTestPanel.swift
//  ComponentGallery
//
//  Created on 29-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct InteractionTestPanel: View {
    private enum Defaults {
        static let textInput = "Sample input"
        static let toggleOn = true
        static let selectedOption = "Blue"
        static let selectedNav = "home"
    }

    @State private var textInput = Defaults.textInput
    @State private var toggleOn = Defaults.toggleOn
    @State private var selectedOption = Defaults.selectedOption
    @State private var selectedNav = Defaults.selectedNav
    @State private var actionCount = 0

    private let options = ["Green", "Blue", "Orange", "Red"]

    var body: some View {
        SettingsCardView {
            VStack(alignment: .leading, spacing: FSpacing.s16) {
                header

                SettingsDivider()

                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Group {
                        Text("Input")
                            .font(FType.sectionTitle())
                            .foregroundStyle(FColor.textPrimary)

                        InputView(text: $textInput, placeholder: "Enter text")
                            .accessibilityLabel("Interaction test input")
                            .accessibilityIdentifier("interaction.input")
                    }

                    Group {
                        Text("Toggle")
                            .font(FType.sectionTitle())
                            .foregroundStyle(FColor.textPrimary)

                        SettingToggleView(
                            icon: AnyView(Image(systemName: "bolt.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "Enable advanced mode",
                            subtitle: "Toggles a boolean state",
                            isOn: $toggleOn
                        )
                        .accessibilityIdentifier("interaction.toggle")
                    }

                    Group {
                        Text("Dropdown")
                            .font(FType.sectionTitle())
                            .foregroundStyle(FColor.textPrimary)

                        SettingDropdownView(
                            icon: AnyView(Image(systemName: "paintbrush.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "Accent color",
                            subtitle: "Deterministic selection",
                            options: options,
                            selection: $selectedOption
                        )
                        .accessibilityIdentifier("interaction.dropdown")
                    }

                    Group {
                        Text("Selection")
                            .font(FType.sectionTitle())
                            .foregroundStyle(FColor.textPrimary)

                        SettingsCardView {
                            VStack(spacing: 0) {
                                ListItemView(
                                    icon: AnyView(Image(systemName: "house.fill").foregroundStyle(FColor.iconSecondary)),
                                    title: "Home",
                                    isSelected: selectedNav == "home",
                                    action: { selectedNav = "home" }
                                )
                                .accessibilityIdentifier("interaction.nav.home")
                                SettingsDivider()
                                ListItemView(
                                    icon: AnyView(Image(systemName: "doc.text.fill").foregroundStyle(FColor.iconSecondary)),
                                    title: "Docs",
                                    isSelected: selectedNav == "docs",
                                    action: { selectedNav = "docs" }
                                )
                                .accessibilityIdentifier("interaction.nav.docs")
                                SettingsDivider()
                                ListItemView(
                                    icon: AnyView(Image(systemName: "gearshape.fill").foregroundStyle(FColor.iconSecondary)),
                                    title: "Settings",
                                    isSelected: selectedNav == "settings",
                                    action: { selectedNav = "settings" }
                                )
                                .accessibilityIdentifier("interaction.nav.settings")
                            }
                        }
                    }

                    Group {
                        Text("Actions")
                            .font(FType.sectionTitle())
                            .foregroundStyle(FColor.textPrimary)

                        HStack(spacing: FSpacing.s12) {
                            ChatUIButton("Run Action") {
                                actionCount += 1
                            }
                            .accessibilityIdentifier("interaction.action.run")

                            ChatUIButton("Reset") {
                                resetState()
                            }
                            .accessibilityLabel("Reset interaction states")
                            .accessibilityIdentifier("interaction.action.reset")
                        }

                        Text("Action count: \(actionCount)")
                            .font(FType.caption())
                            .foregroundStyle(FColor.textSecondary)
                            .accessibilityIdentifier("interaction.action.count")
                    }
                }
                .padding(FSpacing.s16)
            }
        }
    }

    private var header: some View {
        HStack(alignment: .center, spacing: FSpacing.s12) {
            Image(systemName: "hand.tap.fill")
                .font(.system(size: 22))
                .foregroundStyle(FColor.accentBlue)

            VStack(alignment: .leading, spacing: FSpacing.s4) {
                Text("Interaction Harness")
                    .font(FType.title())
                    .foregroundStyle(FColor.textPrimary)

                Text("Manual regression checks for inputs, toggles, dropdowns, and selection")
                    .font(FType.caption())
                    .foregroundStyle(FColor.textSecondary)
            }

            Spacer()
        }
        .padding(FSpacing.s16)
    }

    private func resetState() {
        textInput = Defaults.textInput
        toggleOn = Defaults.toggleOn
        selectedOption = Defaults.selectedOption
        selectedNav = Defaults.selectedNav
        actionCount = 0
    }
}
