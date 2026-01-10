import SwiftUI
import AStudioFoundation
import AStudioThemes

/// Renders icon sizes and the full icon catalog.
public struct IconographyShowcaseView: View {
    private let iconSizes: [CGFloat] = [16, 20, 24, 32]
    private let sampleIcons: [ChatGPTIcon] = [.search, .compose, .plusLg]

    /// Creates an iconography showcase view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            Text("Iconography")
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)

            VStack(alignment: .leading, spacing: FSpacing.s12) {
                Text("Icon Sizes")
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textPrimary)

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 160), spacing: FSpacing.s12)], spacing: FSpacing.s12) {
                    ForEach(iconSizes, id: \.self) { size in
                        VStack(alignment: .leading, spacing: FSpacing.s8) {
                            HStack {
                                Text("\(Int(size))pt")
                                    .font(FType.sectionTitle())
                                Spacer()
                                Text("size-\(Int(size))")
                                    .font(FType.caption())
                                    .foregroundStyle(FColor.textTertiary)
                            }

                            HStack(spacing: FSpacing.s8) {
                                ForEach(sampleIcons, id: \.self) { icon in
                                    ChatGPTIconView(icon, size: size, color: FColor.iconPrimary)
                                }
                            }
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

            VStack(alignment: .leading, spacing: FSpacing.s12) {
                Text("All Icons")
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textPrimary)

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: FSpacing.s8)], spacing: FSpacing.s8) {
                    ForEach(ChatGPTIcon.allCases) { icon in
                        VStack(spacing: FSpacing.s4) {
                            ChatGPTIconView(icon, size: 24, color: FColor.iconSecondary)
                            Text(icon.rawValue)
                                .font(FType.caption())
                                .foregroundStyle(FColor.textTertiary)
                                .lineLimit(1)
                        }
                        .padding(FSpacing.s8)
                        .frame(maxWidth: .infinity)
                        .background(FColor.bgCard)
                        .clipShape(RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: theme.cardCornerRadius, style: .continuous)
                                .stroke(FColor.divider.opacity(0.1), lineWidth: 1)
                        )
                    }
                }
            }
        }
    }

    @Environment(\.chatUITheme) private var theme
}
