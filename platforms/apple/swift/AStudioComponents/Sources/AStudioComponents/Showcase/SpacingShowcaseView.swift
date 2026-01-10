import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders the spacing token grid with size labels.
public struct SpacingShowcaseView: View {
    private let spacingValues: [CGFloat] = [
        DesignTokens.Spacing.none,
        DesignTokens.Spacing.xxxs,
        DesignTokens.Spacing.xxs,
        DesignTokens.Spacing.xs,
        DesignTokens.Spacing.smXs,
        DesignTokens.Spacing.sm,
        DesignTokens.Spacing.mdSm,
        DesignTokens.Spacing.md,
        DesignTokens.Spacing.lgMd,
        DesignTokens.Spacing.lg,
        DesignTokens.Spacing.xl,
        DesignTokens.Spacing.xxl
    ]

    /// Creates a spacing showcase view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            Text("Spacing")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)

            LazyVGrid(columns: [GridItem(.adaptive(minimum: 140), spacing: FSpacing.s12)], spacing: FSpacing.s12) {
                ForEach(spacingValues, id: \.self) { value in
                    VStack(alignment: .leading, spacing: FSpacing.s8) {
                        Text("\(Int(value))pt")
                            .font(FType.sectionTitle())
                            .foregroundStyle(FColor.textPrimary)

                        RoundedRectangle(cornerRadius: 6, style: .continuous)
                            .fill(FColor.accentBlue.opacity(0.3))
                            .frame(width: min(value, 160), height: 8)

                        Text("space-\(Int(value))")
                            .font(FType.caption())
                            .foregroundStyle(FColor.textTertiary)
                    }
                    .padding(FSpacing.s16)
                    .frame(maxWidth: .infinity, alignment: .leading)
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
