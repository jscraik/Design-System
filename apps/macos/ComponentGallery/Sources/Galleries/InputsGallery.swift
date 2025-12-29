//
//  InputsGallery.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct InputsGallery: View {
    @State private var textInput = ""
    @State private var searchInput = ""
    @State private var emailInput = ""
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            GallerySection(title: "InputView", subtitle: "Text input component from ChatUIComponents") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Basic text input")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    InputView(
                        text: $textInput,
                        placeholder: "Enter text here"
                    )
                }
            }
            
            GallerySection(title: "Search Input", subtitle: "Input with search styling") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Search-style input with icon")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    InputView(
                        text: $searchInput,
                        placeholder: "Search..."
                    )
                }
            }
            
            GallerySection(title: "Input with Accessibility", subtitle: "Accessible input with labels and hints") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Input with accessibility labels for VoiceOver")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    InputView(
                        text: $emailInput,
                        placeholder: "email@example.com"
                    )
                    .accessibilityLabel("Email address")
                    .accessibilityHint("Enter your email address")
                }
            }
            
            GallerySection(title: "Focus Management", subtitle: "Keyboard navigation and focus rings") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Tab through inputs to see focus rings")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    InputView(
                        text: $textInput,
                        placeholder: "First input"
                    )
                    .accessibilityFocusRing()
                    
                    InputView(
                        text: $searchInput,
                        placeholder: "Second input"
                    )
                    .accessibilityFocusRing()
                    
                    InputView(
                        text: $emailInput,
                        placeholder: "Third input"
                    )
                    .accessibilityFocusRing()
                }
            }
        }
    }
}
