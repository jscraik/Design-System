//
//  ButtonsGallery.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct ButtonsGallery: View {
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            GallerySection(title: "ChatUIButton", subtitle: "Button component from ChatUIComponents") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Basic button with text label")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    ChatUIButton("Click Me") { }
                }
            }
            
            GallerySection(title: "Button with Icon", subtitle: "Icon-only button variant") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Icon-only buttons with accessibility labels")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    HStack(spacing: FSpacing.s12) {
                        ChatUIButton(
                            systemName: "heart.fill",
                            accessibilityLabel: "Favorite"
                        ) { }
                        
                        ChatUIButton(
                            systemName: "trash",
                            accessibilityLabel: "Delete"
                        ) { }
                        
                        ChatUIButton(
                            systemName: "square.and.arrow.up",
                            accessibilityLabel: "Share"
                        ) { }
                    }
                }
            }
            
            GallerySection(title: "Platform-Specific Behavior", subtitle: "macOS hover effects") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Hover over buttons to see macOS-specific hover effects")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    HStack(spacing: FSpacing.s12) {
                        ChatUIButton("Hover Me") { }
                        
                        ChatUIButton("And Me") { }
                    }
                    
                    Text("Platform.isMac: \(Platform.isMac ? "true" : "false")")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
            }
        }
    }
}
