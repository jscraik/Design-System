//
//  GallerySection.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIThemes

struct GallerySection<Content: View>: View {
    @EnvironmentObject private var galleryState: GalleryState
    let title: String
    let subtitle: String?
    @ViewBuilder let content: () -> Content
    
    init(title: String, subtitle: String? = nil, @ViewBuilder content: @escaping () -> Content) {
        self.title = title
        self.subtitle = subtitle
        self.content = content
    }
    
    var body: some View {
        if shouldDisplaySection {
            VStack(alignment: .leading, spacing: FSpacing.s12) {
                VStack(alignment: .leading, spacing: FSpacing.s4) {
                    Text(title)
                        .font(FType.title())
                        .foregroundStyle(FColor.textPrimary)
                    
                    if let subtitle = subtitle {
                        Text(subtitle)
                            .font(FType.caption())
                            .foregroundStyle(FColor.textTertiary)
                    }
                }
                
                content()
            }
            .padding(FSpacing.s16)
            .background(FColor.bgCard)
            .cornerRadius(ChatGPTTheme.cardCornerRadius)
            .overlay(
                RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius)
                    .stroke(FColor.divider.opacity(0.2), lineWidth: 1)
            )
        }
    }
    
    private var shouldDisplaySection: Bool {
        let query = galleryState.searchQuery.trimmingCharacters(in: .whitespacesAndNewlines)
        if query.isEmpty { return true }
        let lowercasedQuery = query.lowercased()
        if title.lowercased().contains(lowercasedQuery) { return true }
        if let subtitle, subtitle.lowercased().contains(lowercasedQuery) { return true }
        return false
    }
}
