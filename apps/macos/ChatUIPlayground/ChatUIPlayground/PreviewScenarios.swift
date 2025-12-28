//
//  PreviewScenarios.swift
//  ChatUIPlayground
//
//  Created by Jamie Scott Craik on 28-12-2025.
//

import SwiftUI
import ChatUISwift

// MARK: - Preview Scenarios

/// Collection of realistic UI scenarios using ChatUISwift components
/// These can be used for testing and demonstration purposes

struct PreviewScenarios {

    // MARK: - Chat Message Scenario

    struct ChatMessageScenario: View {
        var body: some View {
            VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                ChatUICard(variant: .elevated) {
                    VStack(alignment: .leading, spacing: DesignTokens.Spacing.xs) {
                        HStack {
                            Image(systemName: "person.circle.fill")
                                .font(.system(size: 24))
                                .foregroundColor(DesignTokens.Colors.Accent.blue)
                            VStack(alignment: .leading, spacing: DesignTokens.Spacing.xxxs) {
                                Text("Assistant")
                                    .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                                Text("2 min ago")
                                    .font(.system(size: DesignTokens.Typography.Caption.size))
                                    .foregroundColor(DesignTokens.Colors.Text.tertiary)
                            }
                            Spacer()
                        }
                        Text("Hello! How can I help you today?")
                            .font(.system(size: DesignTokens.Typography.Body.size))
                            .foregroundColor(DesignTokens.Colors.Text.primary)
                    }
                }

                ChatUICard(variant: .default) {
                    HStack {
                        Spacer()
                        VStack(alignment: .trailing, spacing: DesignTokens.Spacing.xs) {
                            Text("I need help with SwiftUI")
                                .font(.system(size: DesignTokens.Typography.Body.size))
                                .foregroundColor(DesignTokens.Colors.Text.primary)
                            Text("1 min ago")
                                .font(.system(size: DesignTokens.Typography.Caption.size))
                                .foregroundColor(DesignTokens.Colors.Text.tertiary)
                        }
                        Spacer()
                    }
                }
            }
            .padding(DesignTokens.Spacing.sm)
        }
    }

    // MARK: - Form Scenario

    struct FormScenario: View {
        @State private var name = ""
        @State private var email = ""
        @State private var password = ""

        var body: some View {
            ChatUICard(variant: .elevated) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.mdSm) {
                    Text("Sign Up")
                        .font(.system(size: DesignTokens.Typography.Heading2.size, weight: DesignTokens.Typography.Heading2.weight))

                    VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                        Text("Name")
                            .font(.system(size: DesignTokens.Typography.BodySmall.size, weight: DesignTokens.Typography.BodySmall.emphasisWeight))
                        ChatUIInput(
                            text: $name,
                            placeholder: "Enter your name",
                            variant: .default
                        )
                    }

                    VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                        Text("Email")
                            .font(.system(size: DesignTokens.Typography.BodySmall.size, weight: DesignTokens.Typography.BodySmall.emphasisWeight))
                        ChatUIInput(
                            text: $email,
                            placeholder: "Enter your email",
                            variant: .default
                        )
                    }

                    VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                        Text("Password")
                            .font(.system(size: DesignTokens.Typography.BodySmall.size, weight: DesignTokens.Typography.BodySmall.emphasisWeight))
                        ChatUIInput(
                            text: $password,
                            placeholder: "Create a password",
                            variant: .password
                        )
                    }

                    HStack(spacing: DesignTokens.Spacing.smXs) {
                        ChatUIButton("Sign Up", variant: .default) {}
                        ChatUIButton("Cancel", variant: .ghost) {}
                    }
                }
            }
            .padding(DesignTokens.Spacing.sm)
        }
    }

    // MARK: - Search Bar Scenario

    struct SearchBarScenario: View {
        @State private var searchText = ""

        var body: some View {
            HStack(spacing: DesignTokens.Spacing.smXs) {
                ChatUIInput(
                    text: $searchText,
                    placeholder: "Search...",
                    variant: .search
                )
                ChatUIButton(
                    systemName: "magnifyingglass",
                    variant: .default,
                    size: .icon,
                    accessibilityLabel: "Search"
                ) {}
            }
            .padding(DesignTokens.Spacing.sm)
        }
    }

    // MARK: - Action Card Scenario

    struct ActionCardScenario: View {
        var body: some View {
            ChatUICard(variant: .elevated) {
                HStack(spacing: DesignTokens.Spacing.sm) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(DesignTokens.Colors.Accent.orange)

                    VStack(alignment: .leading, spacing: DesignTokens.Spacing.xxxs) {
                        Text("Action Required")
                            .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                        Text("Please review your account settings to ensure everything is up to date.")
                            .font(.system(size: DesignTokens.Typography.BodySmall.size))
                            .foregroundColor(DesignTokens.Colors.Text.secondary)
                    }

                    Spacer()

                    ChatUIButton("Review", variant: .default, size: .sm) {}
                }
            }
            .padding(DesignTokens.Spacing.sm)
        }
    }

    // MARK: - Confirmation Dialog Scenario

    struct ConfirmationDialogScenario: View {
        var body: some View {
            ChatUICard(variant: .elevated) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.mdSm) {
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(DesignTokens.Colors.Accent.green)
                        Text("Success")
                            .font(.system(size: DesignTokens.Typography.Heading2.size, weight: DesignTokens.Typography.Heading2.weight))
                        Spacer()
                    }

                    Text("Your changes have been saved successfully.")
                        .font(.system(size: DesignTokens.Typography.Body.size))
                        .foregroundColor(DesignTokens.Colors.Text.secondary)

                    HStack(spacing: DesignTokens.Spacing.smXs) {
                        ChatUIButton("OK", variant: .default) {}
                        ChatUIButton("View Details", variant: .outline) {}
                    }
                }
            }
            .frame(width: 400)
            .padding(DesignTokens.Spacing.sm)
        }
    }

    // MARK: - User Profile Scenario

    struct UserProfileScenario: View {
        var body: some View {
            ChatUICard(variant: .elevated) {
                HStack(spacing: DesignTokens.Spacing.sm) {
                    Image(systemName: "person.circle.fill")
                        .font(.system(size: 48))
                        .foregroundColor(DesignTokens.Colors.Accent.blue)

                    VStack(alignment: .leading, spacing: DesignTokens.Spacing.xxxs) {
                        Text("John Doe")
                            .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                        Text("Software Engineer")
                            .font(.system(size: DesignTokens.Typography.BodySmall.size))
                            .foregroundColor(DesignTokens.Colors.Text.secondary)
                        Text("john.doe@example.com")
                            .font(.system(size: DesignTokens.Typography.Caption.size))
                            .foregroundColor(DesignTokens.Colors.Text.tertiary)
                    }

                    Spacer()

                    VStack(spacing: DesignTokens.Spacing.xxs) {
                        ChatUIButton(
                            systemName: "pencil",
                            variant: .secondary,
                            size: .icon,
                            accessibilityLabel: "Edit profile"
                        ) {}
                        ChatUIButton(
                            systemName: "gear",
                            variant: .ghost,
                            size: .icon,
                            accessibilityLabel: "Profile settings"
                        ) {}
                    }
                }
            }
            .padding(DesignTokens.Spacing.sm)
        }
    }

    // MARK: - Stats Card Scenario

    struct StatsCardScenario: View {
        var body: some View {
            HStack(spacing: DesignTokens.Spacing.sm) {
                StatCard(
                    title: "Messages",
                    value: "1,234",
                    icon: "message.fill",
                    color: DesignTokens.Colors.Accent.blue
                )
                StatCard(
                    title: "Users",
                    value: "567",
                    icon: "person.fill",
                    color: DesignTokens.Colors.Accent.green
                )
                StatCard(
                    title: "Errors",
                    value: "12",
                    icon: "exclamationmark.triangle.fill",
                    color: DesignTokens.Colors.Accent.red
                )
            }
            .padding(DesignTokens.Spacing.sm)
        }
    }

    private struct StatCard: View {
        let title: String
        let value: String
        let icon: String
        let color: Color

        var body: some View {
            ChatUICard(variant: .elevated) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.xs) {
                    HStack {
                        Image(systemName: icon)
                            .foregroundColor(color)
                        Spacer()
                    }
                    Text(value)
                        .font(.system(size: DesignTokens.Typography.Heading1.size, weight: DesignTokens.Typography.Heading1.weight))
                        .foregroundColor(DesignTokens.Colors.Text.primary)
                    Text(title)
                        .font(.system(size: DesignTokens.Typography.BodySmall.size))
                        .foregroundColor(DesignTokens.Colors.Text.secondary)
                }
            }
        }
    }
}

// MARK: - Previews

private struct PreviewScenarioContainer<Content: View>: View {
    let width: CGFloat?
    let height: CGFloat?
    let content: Content

    init(width: CGFloat? = nil, height: CGFloat? = nil, @ViewBuilder content: () -> Content) {
        self.width = width
        self.height = height
        self.content = content()
    }

    var body: some View {
        content
            .frame(width: width, height: height)
            .padding(DesignTokens.Spacing.sm)
            .background(DesignTokens.Colors.Background.secondary)
    }
}

#Preview("Chat Messages") {
    PreviewScenarioContainer(width: 500, height: 300) {
        PreviewScenarios.ChatMessageScenario()
    }
}

#Preview("Form") {
    PreviewScenarioContainer(width: 450) {
        PreviewScenarios.FormScenario()
    }
}

#Preview("Search Bar") {
    PreviewScenarioContainer(width: 500) {
        PreviewScenarios.SearchBarScenario()
    }
}

#Preview("Action Card") {
    PreviewScenarioContainer(width: 500) {
        PreviewScenarios.ActionCardScenario()
    }
}

#Preview("Confirmation Dialog") {
    PreviewScenarioContainer {
        PreviewScenarios.ConfirmationDialogScenario()
    }
}

#Preview("User Profile") {
    PreviewScenarioContainer(width: 450) {
        PreviewScenarios.UserProfileScenario()
    }
}

#Preview("Stats Cards") {
    PreviewScenarioContainer(width: 800) {
        PreviewScenarios.StatsCardScenario()
    }
}

#Preview("Form - High Contrast") {
    PreviewScenarioContainer(width: 450) {
        PreviewScenarios.FormScenario()
    }
    .environment(\.accessibilityContrast, .increased)
}

#Preview("Form - Dynamic Type") {
    PreviewScenarioContainer(width: 450) {
        PreviewScenarios.FormScenario()
    }
    .environment(\.dynamicTypeSize, .accessibility3)
}

#Preview("Form - Dark Mode") {
    PreviewScenarioContainer(width: 450) {
        PreviewScenarios.FormScenario()
    }
    .environment(\.colorScheme, .dark)
}
