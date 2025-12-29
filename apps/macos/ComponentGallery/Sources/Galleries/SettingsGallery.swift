//
//  SettingsGallery.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct SettingsGallery: View {
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false
    @State private var selectedAccent = "Blue"
    @State private var selectedLanguage = "English"
    
    let accentOptions = ["Green", "Blue", "Orange", "Red", "Purple"]
    let languageOptions = ["English", "Spanish", "French", "German", "Japanese"]
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            // Settings Divider
            GallerySection(title: "SettingsDivider", subtitle: "1pt divider with scheme-dependent opacity") {
                VStack(spacing: FSpacing.s16) {
                    SettingsDivider()
                    
                    Text("Opacity: Light mode = 0.35, Dark mode = 0.25")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                }
            }
            
            // Settings Card View
            GallerySection(title: "SettingsCardView", subtitle: "Rounded container with border and background") {
                SettingsCardView {
                    VStack(spacing: 0) {
                        Text("Card Content")
                            .font(FType.rowTitle())
                            .foregroundStyle(FColor.textPrimary)
                            .padding(FSpacing.s16)
                        
                        SettingsDivider()
                        
                        Text("More content inside the card")
                            .font(FType.caption())
                            .foregroundStyle(FColor.textSecondary)
                            .padding(FSpacing.s16)
                    }
                }
            }
            
            // Setting Row View
            GallerySection(title: "SettingRowView", subtitle: "Core primitive with all trailing options") {
                SettingsCardView {
                    VStack(spacing: 0) {
                        SettingRowView(
                            icon: AnyView(Image(systemName: "bell.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "No Trailing",
                            subtitle: "Basic row with no trailing content",
                            trailing: .none
                        )
                        
                        SettingsDivider()
                        
                        SettingRowView(
                            icon: AnyView(Image(systemName: "folder.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "Chevron Trailing",
                            subtitle: "Indicates navigation",
                            trailing: .chevron,
                            action: { }
                        )
                        
                        SettingsDivider()
                        
                        SettingRowView(
                            icon: AnyView(Image(systemName: "paintbrush.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "Text Trailing",
                            subtitle: "Shows current value",
                            trailing: .text("Blue")
                        )
                        
                        SettingsDivider()
                        
                        SettingRowView(
                            icon: AnyView(Image(systemName: "star.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "Custom Trailing",
                            subtitle: "Custom view in trailing position",
                            trailing: .custom(AnyView(
                                Circle()
                                    .fill(FColor.accentGreen)
                                    .frame(width: 12, height: 12)
                            ))
                        )
                    }
                }
            }
            
            // Foundation Switch Style
            GallerySection(title: "FoundationSwitchStyle", subtitle: "Custom toggle style matching ChatGPT design") {
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Toggle("Switch Example", isOn: $notificationsEnabled)
                        .toggleStyle(FoundationSwitchStyle())
                    
                    Text("42x22pt capsule with 18pt circle thumb, smooth 0.15s animation")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                }
                .padding(FSpacing.s16)
                .background(FColor.bgCard)
                .cornerRadius(ChatGPTTheme.cardCornerRadius)
            }
            
            // Setting Toggle View
            GallerySection(title: "SettingToggleView", subtitle: "Composes SettingRowView with Toggle") {
                SettingsCardView {
                    VStack(spacing: 0) {
                        SettingToggleView(
                            icon: AnyView(Image(systemName: "bell.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "Notifications",
                            subtitle: "Receive push notifications",
                            isOn: $notificationsEnabled
                        )
                        
                        SettingsDivider()
                        
                        SettingToggleView(
                            icon: AnyView(Image(systemName: "moon.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "Dark Mode",
                            subtitle: "Use dark appearance",
                            isOn: $darkModeEnabled
                        )
                    }
                }
            }
            
            // Setting Dropdown View
            GallerySection(title: "SettingDropdownView", subtitle: "Composes SettingRowView with Menu") {
                SettingsCardView {
                    VStack(spacing: 0) {
                        SettingDropdownView(
                            icon: AnyView(Image(systemName: "paintbrush.fill").foregroundStyle(FColor.iconSecondary)),
                            title: "Accent Color",
                            subtitle: "Choose your preferred accent",
                            options: accentOptions,
                            selection: $selectedAccent
                        )
                        
                        SettingsDivider()
                        
                        SettingDropdownView(
                            icon: AnyView(Image(systemName: "globe").foregroundStyle(FColor.iconSecondary)),
                            title: "Language",
                            subtitle: "Select interface language",
                            options: languageOptions,
                            selection: $selectedLanguage
                        )
                    }
                }
            }
            
            // Complete Example
            GallerySection(title: "Complete Settings Example", subtitle: "All primitives composed together") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Settings")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            SettingToggleView(
                                icon: AnyView(Image(systemName: "bell.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Notifications",
                                subtitle: "Receive push notifications",
                                isOn: $notificationsEnabled
                            )
                            
                            SettingsDivider()
                            
                            SettingDropdownView(
                                icon: AnyView(Image(systemName: "paintbrush.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Accent Color",
                                subtitle: "Choose your preferred accent",
                                options: accentOptions,
                                selection: $selectedAccent
                            )
                            
                            SettingsDivider()
                            
                            SettingRowView(
                                icon: AnyView(Image(systemName: "person.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Account",
                                subtitle: "Manage your account settings",
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
