//
//  AccessibilityGallery.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import AStudioFoundation
import AStudioComponents
import AStudioThemes

/// Gallery of accessibility-related components and checks.
struct AccessibilityGallery: View {
    @State private var testInput = ""
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorSchemeContrast) private var colorSchemeContrast
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            GallerySection(title: "Interaction Harness", subtitle: "Manual regression checks for common interactions") {
                InteractionTestPanel()
            }

            GallerySection(title: "Focus Management", subtitle: "Keyboard navigation and focus order") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Press Tab to navigate forward, Shift-Tab to navigate backward")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    ChatUIButton("First Focusable") { }
                    
                    InputView(
                        text: $testInput,
                        placeholder: "Second focusable"
                    )
                    .accessibilityLabel("Test input field")
                    
                    ChatUIButton("Third Focusable") { }
                    
                    Text("Focus order should be logical and predictable")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
            }
            
            GallerySection(title: "Focus Rings", subtitle: "Visible focus indicators") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Focus rings should be clearly visible, not color-only")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    ChatUIButton("Button with Focus Ring") { }
                    .accessibilityFocusRing()
                    
                    InputView(
                        text: $testInput,
                        placeholder: "Input with focus ring"
                    )
                    .accessibilityFocusRing()
                    
                    Text("Focus ring color: Blue (\(FAccessibility.focusRingWidth)pt width)")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
            }
            
            GallerySection(title: "VoiceOver Support", subtitle: "Screen reader accessibility") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Toggle VoiceOver with ⌘F5 to test")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    ChatUIButton(
                        systemName: "heart.fill",
                        accessibilityLabel: "Add to favorites",
                        accessibilityHint: "Double-tap to add this item to your favorites"
                    ) { }
                    
                    ChatUIButton(
                        systemName: "trash",
                        accessibilityLabel: "Delete item",
                        accessibilityHint: "Double-tap to permanently delete this item"
                    ) { }
                    
                    Text("Icon-only buttons have descriptive labels")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
            }
            
            GallerySection(title: "High Contrast Mode", subtitle: "Enhanced visibility for accessibility") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("High contrast mode detected: \(colorSchemeContrast == .increased ? "Yes" : "No")")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    ChatUIButton("High Contrast Button") { }
                    .accessibilityHighContrast()
                    
                    InputView(
                        text: $testInput,
                        placeholder: "High contrast input"
                    )
                    .accessibilityHighContrast()
                    
                    Text("Components adapt to high contrast preferences")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
            }
            
            GallerySection(title: "Reduced Motion", subtitle: "Respecting motion preferences") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Reduced motion detected: \(reduceMotion ? "Yes" : "No")")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    Text("Animations respect reduced motion preferences")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                    
                    Text("When enabled, animations are minimized or removed")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
            }
            
            GallerySection(title: "Keyboard Navigation", subtitle: "Full keyboard support") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("All interactive elements are keyboard accessible")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            SettingRowView(
                                icon: AnyView(Image(systemName: "keyboard").foregroundStyle(FColor.iconSecondary)),
                                title: "Keyboard Accessible",
                                subtitle: "Tab to focus, Space/Enter to activate",
                                trailing: .chevron,
                                action: { }
                            )
                            
                            SettingsDivider()
                            
                            SettingRowView(
                                icon: AnyView(Image(systemName: "hand.tap").foregroundStyle(FColor.iconSecondary)),
                                title: "Mouse and Touch",
                                subtitle: "Also works with mouse and touch",
                                trailing: .chevron,
                                action: { }
                            )
                        }
                    }
                }
            }
        }
    }
}
