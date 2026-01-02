import SwiftUI
import ChatUIFoundation
import ChatUIThemes

/// Renders the foundations showcase for color, spacing, typography, and iconography.
public struct FoundationsShowcaseView: View {
    /// Creates a foundations showcase view.
    public init() {}

    /// The content and behavior of this view.
    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s24) {
                VStack(alignment: .leading, spacing: FSpacing.s8) {
                    Text("Foundations")
                        .font(FType.title())
                        .foregroundStyle(FColor.textPrimary)
                    Text("Apps SDK UI foundation tokens across color, spacing, typography, and icons.")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textSecondary)
                }

                ColorPaletteShowcaseView()
                SpacingShowcaseView()
                TypographyShowcaseView()
                IconographyShowcaseView()
            }
            .padding(FSpacing.s24)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}
