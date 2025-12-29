//
//  FoundationGallery.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIThemes

struct FoundationGallery: View {
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            // Colors Section
            GallerySection(title: "Colors", subtitle: "Semantic color tokens from ChatUIFoundation") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    ColorGroup(title: "Surface Colors", colors: [
                        ("bgApp", FColor.bgApp, "Window background"),
                        ("bgCard", FColor.bgCard, "Card background"),
                        ("bgCardAlt", FColor.bgCardAlt, "Hover/pressed overlay")
                    ])
                    
                    ColorGroup(title: "Text Colors", colors: [
                        ("textPrimary", FColor.textPrimary, "Primary text"),
                        ("textSecondary", FColor.textSecondary, "Secondary text"),
                        ("textTertiary", FColor.textTertiary, "Tertiary text")
                    ])
                    
                    ColorGroup(title: "Icon Colors", colors: [
                        ("iconPrimary", FColor.iconPrimary, "Primary icons"),
                        ("iconSecondary", FColor.iconSecondary, "Secondary icons"),
                        ("iconTertiary", FColor.iconTertiary, "Tertiary icons")
                    ])
                    
                    ColorGroup(title: "Accent Colors", colors: [
                        ("accentGreen", FColor.accentGreen, "Success/positive"),
                        ("accentBlue", FColor.accentBlue, "Info/primary"),
                        ("accentOrange", FColor.accentOrange, "Warning"),
                        ("accentRed", FColor.accentRed, "Error/destructive"),
                        ("accentPurple", FColor.accentPurple, "Special")
                    ])
                    
                    ColorGroup(title: "Divider", colors: [
                        ("divider", FColor.divider, "Borders and dividers")
                    ])
                }
            }
            
            // Typography Section
            GallerySection(title: "Typography", subtitle: "Typography styles from ChatUIFoundation") {
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    TypographyExample(name: "title()", font: FType.title(), text: "Section Title - 16pt Semibold")
                    TypographyExample(name: "sectionTitle()", font: FType.sectionTitle(), text: "Subsection Title - 13pt Semibold")
                    TypographyExample(name: "rowTitle()", font: FType.rowTitle(), text: "Row Title - 14pt Regular")
                    TypographyExample(name: "rowValue()", font: FType.rowValue(), text: "Row Value - 14pt Regular")
                    TypographyExample(name: "caption()", font: FType.caption(), text: "Caption Text - 12pt Regular")
                    TypographyExample(name: "footnote()", font: FType.footnote(), text: "Footnote Text - 12pt Regular")
                    
                    Divider()
                    
                    VStack(alignment: .leading, spacing: FSpacing.s8) {
                        Text("Tracking Constants")
                            .font(FType.sectionTitle())
                            .foregroundStyle(FColor.textPrimary)
                        
                        HStack {
                            Text("trackingRow():")
                                .font(FType.caption())
                                .foregroundStyle(FColor.textSecondary)
                            Text("\(FType.trackingRow(), specifier: "%.1f")pt")
                                .font(FType.caption())
                                .foregroundStyle(FColor.textPrimary)
                        }
                        
                        HStack {
                            Text("trackingCaption():")
                                .font(FType.caption())
                                .foregroundStyle(FColor.textSecondary)
                            Text("\(FType.trackingCaption(), specifier: "%.1f")pt")
                                .font(FType.caption())
                                .foregroundStyle(FColor.textPrimary)
                        }
                    }
                }
            }
            
            // Spacing Section
            GallerySection(title: "Spacing", subtitle: "Spacing scale from ChatUIFoundation") {
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    SpacingExample(name: "s2", value: FSpacing.s2)
                    SpacingExample(name: "s4", value: FSpacing.s4)
                    SpacingExample(name: "s8", value: FSpacing.s8)
                    SpacingExample(name: "s12", value: FSpacing.s12)
                    SpacingExample(name: "s16", value: FSpacing.s16)
                    SpacingExample(name: "s24", value: FSpacing.s24)
                    SpacingExample(name: "s32", value: FSpacing.s32)
                }
            }
            
            // Platform Section
            GallerySection(title: "Platform Detection", subtitle: "Platform utilities from ChatUIFoundation") {
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    PlatformInfo(label: "Platform.isMac", value: Platform.isMac)
                    PlatformInfo(label: "Platform.isVisionOS", value: Platform.isVisionOS)
                    PlatformInfo(label: "Platform.isIOS", value: Platform.isIOS)
                }
            }
        }
    }
}

// MARK: - Helper Views

struct ColorGroup: View {
    let title: String
    let colors: [(String, Color, String)]
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s8) {
            Text(title)
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)
            
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 150))], spacing: FSpacing.s12) {
                ForEach(colors, id: \.0) { name, color, description in
                    ColorSwatch(name: name, color: color, description: description)
                }
            }
        }
    }
}

struct ColorSwatch: View {
    let name: String
    let color: Color
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s8) {
            RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius)
                .fill(color)
                .frame(height: 60)
                .overlay(
                    RoundedRectangle(cornerRadius: ChatGPTTheme.rowCornerRadius)
                        .stroke(FColor.divider, lineWidth: 1)
                )
            
            VStack(alignment: .leading, spacing: FSpacing.s2) {
                Text(name)
                    .font(FType.rowTitle())
                    .foregroundStyle(FColor.textPrimary)
                
                Text(description)
                    .font(FType.caption())
                    .foregroundStyle(FColor.textTertiary)
            }
        }
    }
}

struct TypographyExample: View {
    let name: String
    let font: Font
    let text: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s4) {
            Text(name)
                .font(FType.caption())
                .foregroundStyle(FColor.textTertiary)
            
            Text(text)
                .font(font)
                .foregroundStyle(FColor.textPrimary)
        }
    }
}

struct SpacingExample: View {
    let name: String
    let value: Double
    
    var body: some View {
        HStack(spacing: FSpacing.s12) {
            Text(name)
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textPrimary)
                .frame(width: 60, alignment: .leading)
            
            Text("\(Int(value))pt")
                .font(FType.caption())
                .foregroundStyle(FColor.textSecondary)
                .frame(width: 50, alignment: .leading)
            
            Rectangle()
                .fill(FColor.accentBlue)
                .frame(width: CGFloat(value), height: 20)
                .cornerRadius(4)
        }
    }
}

struct PlatformInfo: View {
    let label: String
    let value: Bool
    
    var body: some View {
        HStack {
            Text(label)
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textPrimary)
            
            Spacer()
            
            Text(value ? "true" : "false")
                .font(FType.rowValue())
                .foregroundStyle(value ? FColor.accentGreen : FColor.textSecondary)
        }
        .padding(FSpacing.s12)
        .background(FColor.bgCard)
        .cornerRadius(ChatGPTTheme.rowCornerRadius)
    }
}
