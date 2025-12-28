//
//  ComponentGallery.swift
//  ChatUIPlayground
//
//  Created by Jamie Scott Craik on 28-12-2025.
//

import SwiftUI
import ChatUISwift

struct ComponentGallery: View {
    let selectedComponent: ComponentType

    var body: some View {
        ScrollView {
            VStack(spacing: DesignTokens.Spacing.md) {
                switch selectedComponent {
                case .button:
                    ButtonGallery()
                case .input:
                    InputGallery()
                case .card:
                    CardGallery()
                case .tokens:
                    TokensGallery()
                }
            }
            .padding(DesignTokens.Spacing.md)
        }
    }
}

// MARK: - Button Gallery

struct ButtonGallery: View {
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.md) {
            Text("Buttons")
                .font(.system(size: DesignTokens.Typography.Heading2.size, weight: DesignTokens.Typography.Heading2.weight))
                .padding(.bottom, DesignTokens.Spacing.smXs)

            // Variants
            GroupBox(label: Text("Variants")) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                    HStack(spacing: DesignTokens.Spacing.smXs) {
                        ChatUIButton("Default", variant: .default) {}
                        ChatUIButton("Destructive", variant: .destructive) {}
                        ChatUIButton("Outline", variant: .outline) {}
                    }
                    HStack(spacing: DesignTokens.Spacing.smXs) {
                        ChatUIButton("Secondary", variant: .secondary) {}
                        ChatUIButton("Ghost", variant: .ghost) {}
                        ChatUIButton("Link", variant: .link) {}
                    }
                }
                .padding(DesignTokens.Spacing.sm)
            }

            // Sizes
            GroupBox(label: Text("Sizes")) {
                HStack(spacing: DesignTokens.Spacing.smXs) {
                    ChatUIButton("Small", variant: .default, size: .sm) {}
                    ChatUIButton("Default", variant: .default, size: .default) {}
                    ChatUIButton("Large", variant: .default, size: .lg) {}
                }
                .padding(DesignTokens.Spacing.sm)
            }

            // Icon Buttons
            GroupBox(label: Text("Icon Buttons")) {
                HStack(spacing: DesignTokens.Spacing.smXs) {
                    ChatUIButton(systemName: "heart.fill", variant: .default, size: .icon) {}
                    ChatUIButton(systemName: "trash", variant: .destructive, size: .icon) {}
                    ChatUIButton(systemName: "square.and.arrow.up", variant: .secondary, size: .icon) {}
                }
                .padding(DesignTokens.Spacing.sm)
            }

            // Disabled State
            GroupBox(label: Text("Disabled State")) {
                HStack(spacing: DesignTokens.Spacing.smXs) {
                    ChatUIButton("Disabled", variant: .default, isDisabled: true) {}
                    ChatUIButton("Disabled", variant: .outline, isDisabled: true) {}
                    ChatUIButton(systemName: "heart", variant: .ghost, size: .icon, isDisabled: true) {}
                }
                .padding(DesignTokens.Spacing.sm)
            }
        }
    }
}

// MARK: - Input Gallery

struct InputGallery: View {
    @State private var defaultText = ""
    @State private var searchText = ""
    @State private var passwordText = ""
    @State private var disabledText = "Disabled input"

    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Typography.Body.lineHeight) {
            Text("Inputs")
                .font(.system(size: DesignTokens.Typography.Heading2.size, weight: DesignTokens.Typography.Heading2.weight))
                .padding(.bottom, DesignTokens.Spacing.smXs)

            // Variants
            GroupBox(label: Text("Variants")) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                    ChatUIInput(
                        text: $defaultText,
                        placeholder: "Default input",
                        variant: .default
                    )
                    ChatUIInput(
                        text: $searchText,
                        placeholder: "Search...",
                        variant: .search
                    )
                    ChatUIInput(
                        text: $passwordText,
                        placeholder: "Password",
                        variant: .password
                    )
                }
                .padding(DesignTokens.Spacing.sm)
            }

            // Sizes
            GroupBox(label: Text("Sizes")) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                    ChatUIInput(
                        text: .constant(""),
                        placeholder: "Small input",
                        size: .sm
                    )
                    ChatUIInput(
                        text: .constant(""),
                        placeholder: "Default input",
                        size: .default
                    )
                    ChatUIInput(
                        text: .constant(""),
                        placeholder: "Large input",
                        size: .lg
                    )
                }
                .padding(DesignTokens.Spacing.sm)
            }

            // Disabled State
            GroupBox(label: Text("Disabled State")) {
                ChatUIInput(
                    text: $disabledText,
                    placeholder: "Disabled",
                    isDisabled: true
                )
                .padding(DesignTokens.Spacing.sm)
            }
        }
    }
}

// MARK: - Card Gallery

struct CardGallery: View {
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.md) {
            Text("Cards")
                .font(.system(size: DesignTokens.Typography.Heading2.size, weight: DesignTokens.Typography.Heading2.weight))
                .padding(.bottom, DesignTokens.Spacing.smXs)

            // Variants
            GroupBox(label: Text("Variants")) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                    ChatUICard(variant: .default) {
                        VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                            Text("Default Card")
                                .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                            Text("This is a default card variant with no elevation or border.")
                                .font(.system(size: DesignTokens.Typography.Body.size))
                                .foregroundColor(DesignTokens.Colors.Text.secondary)
                        }
                    }

                    ChatUICard(variant: .elevated) {
                        VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                            Text("Elevated Card")
                                .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                            Text("This card has elevation with a subtle shadow effect.")
                                .font(.system(size: DesignTokens.Typography.Body.size))
                                .foregroundColor(DesignTokens.Colors.Text.secondary)
                        }
                    }

                    ChatUICard(variant: .outlined) {
                        VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                            Text("Outlined Card")
                                .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                            Text("This card has a visible border.")
                                .font(.system(size: DesignTokens.Typography.Body.size))
                                .foregroundColor(DesignTokens.Colors.Text.secondary)
                        }
                    }
                }
                .padding(DesignTokens.Spacing.sm)
            }

            // Card with Actions
            GroupBox(label: Text("Card with Actions")) {
                ChatUICard(variant: .elevated) {
                    VStack(alignment: .leading, spacing: DesignTokens.Spacing.mdSm) {
                        HStack {
                            Image(systemName: "doc.fill")
                                .font(.system(size: 32))
                                .foregroundColor(DesignTokens.Colors.Accent.blue)
                            VStack(alignment: .leading, spacing: DesignTokens.Spacing.xxxs) {
                                Text("Document")
                                    .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                                Text("Last edited 2 hours ago")
                                    .font(.system(size: DesignTokens.Typography.BodySmall.size))
                                    .foregroundColor(DesignTokens.Colors.Text.tertiary)
                            }
                            Spacer()
                        }
                        HStack(spacing: DesignTokens.Spacing.smXs) {
                            ChatUIButton("Open", variant: .default, size: .sm) {}
                            ChatUIButton("Share", variant: .secondary, size: .sm) {}
                        }
                    }
                }
                .padding(DesignTokens.Spacing.sm)
            }
        }
    }
}

// MARK: - Design Tokens Gallery

struct TokensGallery: View {
    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.md) {
            Text("Design Tokens")
                .font(.system(size: DesignTokens.Typography.Heading2.size, weight: DesignTokens.Typography.Heading2.weight))
                .padding(.bottom, DesignTokens.Spacing.smXs)

            // Colors
            GroupBox(label: Text("Colors")) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.smXs) {
                    Text("Background")
                        .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                    HStack(spacing: DesignTokens.Spacing.xs) {
                        ColorSwatch(color: DesignTokens.Colors.Background.primary, name: "Primary")
                        ColorSwatch(color: DesignTokens.Colors.Background.secondary, name: "Secondary")
                        ColorSwatch(color: DesignTokens.Colors.Background.tertiary, name: "Tertiary")
                    }

                    Text("Text")
                        .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                        .padding(.top, DesignTokens.Spacing.smXs)
                    HStack(spacing: DesignTokens.Spacing.xs) {
                        ColorSwatch(color: DesignTokens.Colors.Text.primary, name: "Primary")
                        ColorSwatch(color: DesignTokens.Colors.Text.secondary, name: "Secondary")
                        ColorSwatch(color: DesignTokens.Colors.Text.tertiary, name: "Tertiary")
                    }

                    Text("Accent")
                        .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                        .padding(.top, DesignTokens.Spacing.smXs)
                    HStack(spacing: DesignTokens.Spacing.xs) {
                        ColorSwatch(color: DesignTokens.Colors.Accent.blue, name: "Blue")
                        ColorSwatch(color: DesignTokens.Colors.Accent.red, name: "Red")
                        ColorSwatch(color: DesignTokens.Colors.Accent.orange, name: "Orange")
                        ColorSwatch(color: DesignTokens.Colors.Accent.green, name: "Green")
                    }
                }
                .padding(DesignTokens.Spacing.sm)
            }

            // Typography
            GroupBox(label: Text("Typography")) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.xs) {
                    Text("Heading 1")
                        .font(.system(size: DesignTokens.Typography.Heading1.size, weight: DesignTokens.Typography.Heading1.weight))
                    Text("Heading 2")
                        .font(.system(size: DesignTokens.Typography.Heading2.size, weight: DesignTokens.Typography.Heading2.weight))
                    Text("Heading 3")
                        .font(.system(size: DesignTokens.Typography.Heading3.size, weight: DesignTokens.Typography.Heading3.weight))
                    Text("Body text - The quick brown fox jumps over the lazy dog.")
                        .font(.system(size: DesignTokens.Typography.Body.size, weight: DesignTokens.Typography.Body.weight))
                    Text("Body small text - Used for secondary information.")
                        .font(.system(size: DesignTokens.Typography.BodySmall.size, weight: DesignTokens.Typography.BodySmall.weight))
                    Text("Caption text - Used for labels and captions.")
                        .font(.system(size: DesignTokens.Typography.Caption.size, weight: DesignTokens.Typography.Caption.weight))
                }
                .padding(DesignTokens.Spacing.sm)
            }

            // Spacing
            GroupBox(label: Text("Spacing Scale")) {
                VStack(alignment: .leading, spacing: DesignTokens.Spacing.xxs) {
                    ForEach(DesignTokens.Spacing.scale, id: \.self) { space in
                        HStack {
                            Text("\(Int(space))pt")
                                .font(.system(size: DesignTokens.Typography.BodySmall.size))
                                .frame(width: 60, alignment: .leading)
                            Rectangle()
                                .fill(DesignTokens.Colors.Accent.blue)
                                .frame(width: CGFloat(space), height: 16)
                        }
                    }
                }
                .padding(DesignTokens.Spacing.sm)
            }
        }
    }
}

// MARK: - Color Swatch Component

struct ColorSwatch: View {
    let color: Color
    let name: String

    var body: some View {
        VStack(spacing: DesignTokens.Spacing.xxxs) {
            RoundedRectangle(cornerRadius: DesignTokens.CornerRadius.small)
                .fill(color)
                .frame(width: 48, height: 48)
                .overlay(
                    RoundedRectangle(cornerRadius: DesignTokens.CornerRadius.small)
                        .stroke(Color.black.opacity(0.1), lineWidth: 1)
                )
            Text(name)
                .font(.system(size: DesignTokens.Typography.Caption.size))
                .foregroundColor(DesignTokens.Colors.Text.secondary)
        }
    }
}

#Preview {
    ComponentGallery(selectedComponent: .button)
        .frame(width: 800, height: 600)
}
