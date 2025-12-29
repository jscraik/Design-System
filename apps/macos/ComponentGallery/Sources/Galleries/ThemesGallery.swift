//
//  ThemesGallery.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct ThemesGallery: View {
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            GallerySection(title: "ChatGPT Theme", subtitle: "Pixel-perfect ChatGPT styling constants") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    ThemeConstant(name: "appCornerRadius", value: "\(Int(ChatGPTTheme.appCornerRadius))pt")
                    ThemeConstant(name: "cardCornerRadius", value: "\(Int(ChatGPTTheme.cardCornerRadius))pt")
                    ThemeConstant(name: "rowCornerRadius", value: "\(Int(ChatGPTTheme.rowCornerRadius))pt")
                    ThemeConstant(name: "pillCornerRadius", value: "\(Int(ChatGPTTheme.pillCornerRadius))pt")
                    
                    Divider()
                    
                    ThemeConstant(name: "appShadowOpacity", value: String(format: "%.2f", ChatGPTTheme.appShadowOpacity))
                    ThemeConstant(name: "appShadowRadius", value: "\(Int(ChatGPTTheme.appShadowRadius))pt")
                    ThemeConstant(name: "appShadowYOffset", value: "\(Int(ChatGPTTheme.appShadowYOffset))pt")
                    
                    Divider()
                    
                    ThemeConstant(name: "cardBorderOpacityLight", value: String(format: "%.2f", ChatGPTTheme.cardBorderOpacityLight))
                    ThemeConstant(name: "cardBorderOpacityDark", value: String(format: "%.2f", ChatGPTTheme.cardBorderOpacityDark))
                    ThemeConstant(name: "dividerOpacityLight", value: String(format: "%.2f", ChatGPTTheme.dividerOpacityLight))
                    ThemeConstant(name: "dividerOpacityDark", value: String(format: "%.2f", ChatGPTTheme.dividerOpacityDark))
                    
                    Divider()
                    
                    ThemeConstant(name: "rowHPadding", value: "\(Int(ChatGPTTheme.rowHPadding))pt")
                    ThemeConstant(name: "rowVPadding", value: "\(Int(ChatGPTTheme.rowVPadding))pt")
                    ThemeConstant(name: "rowIconSize", value: "\(Int(ChatGPTTheme.rowIconSize))pt")
                    ThemeConstant(name: "rowChevronSize", value: "\(Int(ChatGPTTheme.rowChevronSize))pt")
                }
            }
            
            GallerySection(title: "Theme in Action", subtitle: "Components using ChatGPT theme") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("All components use ChatGPTTheme constants")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            SettingRowView(
                                icon: AnyView(Image(systemName: "paintbrush.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Themed Row",
                                subtitle: "Uses ChatGPTTheme metrics",
                                trailing: .chevron
                            )
                            
                            SettingsDivider()
                            
                            SettingRowView(
                                icon: AnyView(Image(systemName: "star.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Another Row",
                                subtitle: "Consistent spacing and sizing",
                                trailing: .text("Value")
                            )
                        }
                    }
                    
                    Text("Card corner radius: \(Int(ChatGPTTheme.cardCornerRadius))pt")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                    
                    Text("Row corner radius: \(Int(ChatGPTTheme.rowCornerRadius))pt")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                }
            }
        }
    }
}

struct ThemeConstant: View {
    let name: String
    let value: String
    
    var body: some View {
        HStack {
            Text(name)
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textPrimary)
            
            Spacer()
            
            Text(value)
                .font(FType.rowValue())
                .foregroundStyle(FColor.textSecondary)
        }
        .padding(FSpacing.s12)
        .background(FColor.bgCard)
        .cornerRadius(ChatGPTTheme.rowCornerRadius)
    }
}
