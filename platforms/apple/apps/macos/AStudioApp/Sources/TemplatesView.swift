import SwiftUI
import AStudioFoundation
import AStudioComponents

/// Template gallery view for browsing UI shell templates.
struct TemplatesView: View {
    @Environment(\.chatUITheme) private var theme
    @Environment(\.colorScheme) private var scheme
    @State private var selectedTemplate: TemplateID = TemplateRegistry.templates.first?.id ?? .compose

    var body: some View {
        HStack(spacing: FSpacing.s16) {
            List(selection: $selectedTemplate) {
                ForEach(TemplateRegistry.templates) { template in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(template.title)
                            .font(FType.sectionTitle())
                            .foregroundStyle(FColor.textPrimary)
                        Text(template.detail)
                            .font(FType.caption())
                            .foregroundStyle(FColor.textSecondary)
                    }
                    .padding(.vertical, 6)
                    .accessibilityElement(children: .combine)
                    .tag(template.id)
                }
            }
            .listStyle(.sidebar)
            .frame(minWidth: 220, idealWidth: 260, maxWidth: 320)

            Divider()

            VStack(alignment: .leading, spacing: FSpacing.s12) {
                if let template = TemplateRegistry.template(for: selectedTemplate) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(template.title)
                            .font(FType.title())
                            .foregroundStyle(FColor.textPrimary)
                        Text(template.detail)
                            .font(FType.caption())
                            .foregroundStyle(FColor.textSecondary)
                    }

                    ZStack {
                        RoundedRectangle(cornerRadius: theme.cardCornerRadius)
                            .fill(FColor.bgCard)
                            .overlay(
                                RoundedRectangle(cornerRadius: theme.cardCornerRadius)
                                    .stroke(
                                        FColor.divider.opacity(
                                            scheme == .dark ? theme.dividerOpacityDark : theme.dividerOpacityLight
                                        ),
                                        lineWidth: 1
                                    )
                            )

                        template.makeView()
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    }
                } else {
                    Text("No templates available.")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textSecondary)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .padding(FSpacing.s16)
        .navigationTitle("Templates")
        .navigationSubtitle("Reusable UI shells")
    }
}
