import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders the typography token list with size and spacing metadata.
public struct TypographyShowcaseView: View {
    private struct TypographyToken: Identifiable {
        let id: String
        let title: String
        let size: CGFloat
        let lineHeight: CGFloat
        let weight: Font.Weight
        let tracking: CGFloat
    }

    private let tokens: [TypographyToken] = [
        TypographyToken(
            id: "heading1",
            title: "Heading 1",
            size: DesignTokens.Typography.Heading1.size,
            lineHeight: DesignTokens.Typography.Heading1.lineHeight,
            weight: DesignTokens.Typography.Heading1.weight,
            tracking: DesignTokens.Typography.Heading1.tracking
        ),
        TypographyToken(
            id: "heading2",
            title: "Heading 2",
            size: DesignTokens.Typography.Heading2.size,
            lineHeight: DesignTokens.Typography.Heading2.lineHeight,
            weight: DesignTokens.Typography.Heading2.weight,
            tracking: DesignTokens.Typography.Heading2.tracking
        ),
        TypographyToken(
            id: "heading3",
            title: "Heading 3",
            size: DesignTokens.Typography.Heading3.size,
            lineHeight: DesignTokens.Typography.Heading3.lineHeight,
            weight: DesignTokens.Typography.Heading3.weight,
            tracking: DesignTokens.Typography.Heading3.tracking
        ),
        TypographyToken(
            id: "body",
            title: "Body",
            size: DesignTokens.Typography.Body.size,
            lineHeight: DesignTokens.Typography.Body.lineHeight,
            weight: DesignTokens.Typography.Body.weight,
            tracking: DesignTokens.Typography.Body.tracking
        ),
        TypographyToken(
            id: "bodySmall",
            title: "Body Small",
            size: DesignTokens.Typography.BodySmall.size,
            lineHeight: DesignTokens.Typography.BodySmall.lineHeight,
            weight: DesignTokens.Typography.BodySmall.weight,
            tracking: DesignTokens.Typography.BodySmall.tracking
        ),
        TypographyToken(
            id: "caption",
            title: "Caption",
            size: DesignTokens.Typography.Caption.size,
            lineHeight: DesignTokens.Typography.Caption.lineHeight,
            weight: DesignTokens.Typography.Caption.weight,
            tracking: DesignTokens.Typography.Caption.tracking
        )
    ]

    /// Creates a typography showcase view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            Text("Typography")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)

            VStack(spacing: FSpacing.s12) {
                ForEach(tokens) { token in
                    VStack(alignment: .leading, spacing: FSpacing.s8) {
                        Text(token.title)
                            .font(.system(size: token.size, weight: token.weight))
                            .tracking(token.tracking)
                            .foregroundStyle(FColor.textPrimary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .lineSpacing(max(token.lineHeight - token.size, 0))

                        Text("size \(Int(token.size)) / weight \(token.weight) / line \(Int(token.lineHeight)) / tracking \(token.tracking)")
                            .font(FType.caption())
                            .foregroundStyle(FColor.textTertiary)
                    }
                    .padding(FSpacing.s16)
                    .background(FColor.bgCard)
                    .clipShape(RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous)
                            .stroke(FColor.divider.opacity(0.2), lineWidth: 1)
                    )
                }
            }
        }
    }
}
