import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders the color token palette in grouped sections.
public struct ColorPaletteShowcaseView: View {
    private struct ColorToken: Identifiable {
        let id: String
        let name: String
        let color: Color
    }

    private struct ColorSection: Identifiable {
        let id: String
        let title: String
        let tokens: [ColorToken]
        let darkSurface: Bool
    }

    private let sections: [ColorSection] = [
        ColorSection(
            id: "bg-light",
            title: "Background / Light",
            tokens: [
                ColorToken(id: "bg-light-primary", name: "primary", color: DesignTokens.Colors.Background.lightPrimary),
                ColorToken(id: "bg-light-secondary", name: "secondary", color: DesignTokens.Colors.Background.lightSecondary),
                ColorToken(id: "bg-light-tertiary", name: "tertiary", color: DesignTokens.Colors.Background.lightTertiary)
            ],
            darkSurface: false
        ),
        ColorSection(
            id: "bg-dark",
            title: "Background / Dark",
            tokens: [
                ColorToken(id: "bg-dark-primary", name: "primary", color: DesignTokens.Colors.Background.darkPrimary),
                ColorToken(id: "bg-dark-secondary", name: "secondary", color: DesignTokens.Colors.Background.darkSecondary),
                ColorToken(id: "bg-dark-tertiary", name: "tertiary", color: DesignTokens.Colors.Background.darkTertiary)
            ],
            darkSurface: true
        ),
        ColorSection(
            id: "text-light",
            title: "Text / Light",
            tokens: [
                ColorToken(id: "text-light-primary", name: "primary", color: DesignTokens.Colors.Text.lightPrimary),
                ColorToken(id: "text-light-secondary", name: "secondary", color: DesignTokens.Colors.Text.lightSecondary),
                ColorToken(id: "text-light-tertiary", name: "tertiary", color: DesignTokens.Colors.Text.lightTertiary),
                ColorToken(id: "text-light-inverted", name: "inverted", color: DesignTokens.Colors.Text.lightInverted)
            ],
            darkSurface: false
        ),
        ColorSection(
            id: "text-dark",
            title: "Text / Dark",
            tokens: [
                ColorToken(id: "text-dark-primary", name: "primary", color: DesignTokens.Colors.Text.darkPrimary),
                ColorToken(id: "text-dark-secondary", name: "secondary", color: DesignTokens.Colors.Text.darkSecondary),
                ColorToken(id: "text-dark-tertiary", name: "tertiary", color: DesignTokens.Colors.Text.darkTertiary),
                ColorToken(id: "text-dark-inverted", name: "inverted", color: DesignTokens.Colors.Text.darkInverted)
            ],
            darkSurface: true
        ),
        ColorSection(
            id: "icon-light",
            title: "Icon / Light",
            tokens: [
                ColorToken(id: "icon-light-primary", name: "primary", color: DesignTokens.Colors.Icon.lightPrimary),
                ColorToken(id: "icon-light-secondary", name: "secondary", color: DesignTokens.Colors.Icon.lightSecondary),
                ColorToken(id: "icon-light-tertiary", name: "tertiary", color: DesignTokens.Colors.Icon.lightTertiary),
                ColorToken(id: "icon-light-inverted", name: "inverted", color: DesignTokens.Colors.Icon.lightInverted)
            ],
            darkSurface: false
        ),
        ColorSection(
            id: "icon-dark",
            title: "Icon / Dark",
            tokens: [
                ColorToken(id: "icon-dark-primary", name: "primary", color: DesignTokens.Colors.Icon.darkPrimary),
                ColorToken(id: "icon-dark-secondary", name: "secondary", color: DesignTokens.Colors.Icon.darkSecondary),
                ColorToken(id: "icon-dark-tertiary", name: "tertiary", color: DesignTokens.Colors.Icon.darkTertiary),
                ColorToken(id: "icon-dark-inverted", name: "inverted", color: DesignTokens.Colors.Icon.darkInverted)
            ],
            darkSurface: true
        ),
        ColorSection(
            id: "accent-light",
            title: "Accents / Light",
            tokens: [
                ColorToken(id: "accent-light-blue", name: "blue", color: DesignTokens.Colors.Accent.lightBlue),
                ColorToken(id: "accent-light-red", name: "red", color: DesignTokens.Colors.Accent.lightRed),
                ColorToken(id: "accent-light-orange", name: "orange", color: DesignTokens.Colors.Accent.lightOrange),
                ColorToken(id: "accent-light-green", name: "green", color: DesignTokens.Colors.Accent.lightGreen),
                ColorToken(id: "accent-light-purple", name: "purple", color: DesignTokens.Colors.Accent.lightPurple)
            ],
            darkSurface: false
        ),
        ColorSection(
            id: "accent-dark",
            title: "Accents / Dark",
            tokens: [
                ColorToken(id: "accent-dark-blue", name: "blue", color: DesignTokens.Colors.Accent.darkBlue),
                ColorToken(id: "accent-dark-red", name: "red", color: DesignTokens.Colors.Accent.darkRed),
                ColorToken(id: "accent-dark-orange", name: "orange", color: DesignTokens.Colors.Accent.darkOrange),
                ColorToken(id: "accent-dark-green", name: "green", color: DesignTokens.Colors.Accent.darkGreen),
                ColorToken(id: "accent-dark-purple", name: "purple", color: DesignTokens.Colors.Accent.darkPurple)
            ],
            darkSurface: true
        )
    ]

    /// Creates a color palette showcase view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            Text("Colors")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)

            LazyVGrid(columns: [GridItem(.adaptive(minimum: 240), spacing: FSpacing.s12)], spacing: FSpacing.s12) {
                ForEach(sections) { section in
                    let surfaceColor = section.darkSurface
                        ? DesignTokens.Colors.Background.darkPrimary
                        : DesignTokens.Colors.Background.lightPrimary
                    let textColor = section.darkSurface
                        ? DesignTokens.Colors.Text.darkPrimary
                        : DesignTokens.Colors.Text.lightPrimary
                    let metaColor = section.darkSurface
                        ? DesignTokens.Colors.Text.darkSecondary
                        : DesignTokens.Colors.Text.lightSecondary
                    let borderColor = textColor.opacity(0.12)

                    VStack(alignment: .leading, spacing: FSpacing.s12) {
                        Text(section.title)
                            .font(FType.rowTitle())
                            .foregroundStyle(textColor)

                        ForEach(section.tokens) { token in
                            HStack(spacing: FSpacing.s8) {
                                RoundedRectangle(cornerRadius: 8, style: .continuous)
                                    .fill(token.color)
                                    .frame(width: 32, height: 32)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                                            .stroke(borderColor, lineWidth: 1)
                                    )

                                VStack(alignment: .leading, spacing: 2) {
                                    Text(token.name)
                                        .font(FType.rowTitle())
                                        .foregroundStyle(textColor)
                                    Text(token.id)
                                        .font(FType.caption())
                                        .foregroundStyle(metaColor)
                                }
                            }
                        }
                    }
                    .padding(FSpacing.s16)
                    .background(surfaceColor)
                    .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous)
                            .stroke(borderColor, lineWidth: 1)
                    )
                }
            }
        }
    }
}
