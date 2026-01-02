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

/// Gallery of input components.
struct InputsGallery: View {
    @State private var textInput = ""
    @State private var searchInput = ""
    @State private var emailInput = ""
    @State private var notesInput = ""
    @State private var selectedPlan = ""
    
    private let planOptions = [
        SelectOption(value: "starter", label: "Starter"),
        SelectOption(value: "pro", label: "Pro"),
        SelectOption(value: "enterprise", label: "Enterprise")
    ]
    
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
                        placeholder: "Search...",
                        variant: .search
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

            GallerySection(title: "TextareaView", subtitle: "Multiline input component") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Multiline input for longer content")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)

                    TextareaView(
                        text: $notesInput,
                        placeholder: "Write a note..."
                    )
                    .frame(height: 120)
                }
            }

            GallerySection(title: "SelectView", subtitle: "Menu-backed select control") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Select with placeholder and options")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)

                    SelectView(
                        selection: $selectedPlan,
                        options: planOptions,
                        placeholder: "Choose a plan"
                    )
                    .frame(maxWidth: 280)
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
