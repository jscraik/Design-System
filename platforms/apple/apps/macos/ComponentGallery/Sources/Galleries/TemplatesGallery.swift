//
//  TemplatesGallery.swift
//  ComponentGallery
//
//  Created on 30-12-2025.
//

import SwiftUI
import AStudioFoundation
import AStudioComponents
import AStudioThemes

/// Gallery of template layouts and previews.
struct TemplatesGallery: View {
    @State private var selectedTemplate: TemplateID = TemplateRegistry.templates.first?.id ?? .compose

    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            GallerySection(title: "Templates", subtitle: "SwiftUI template previews from TemplateRegistry") {
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
                            .padding(.vertical, 4)
                            .tag(template.id)
                        }
                    }
                    .listStyle(.sidebar)
                    .frame(minWidth: 220, idealWidth: 260, maxWidth: 320)

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
                                RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous)
                                    .fill(FColor.bgCard)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous)
                                            .stroke(FColor.divider.opacity(0.2), lineWidth: 1)
                                    )

                                template.makeView()
                                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                            }
                        } else {
                            Text("Select a template to preview.")
                                .font(FType.rowTitle())
                                .foregroundStyle(FColor.textSecondary)
                                .frame(maxWidth: .infinity, maxHeight: .infinity)
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
                .frame(height: 520)
            }
        }
    }
}
