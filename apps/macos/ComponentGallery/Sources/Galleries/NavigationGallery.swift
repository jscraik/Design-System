//
//  NavigationGallery.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct NavigationGallery: View {
    @State private var selectedItem: String? = nil
    
    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            GallerySection(title: "ListItemView", subtitle: "Navigation list item component") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("List items for sidebar navigation")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    SettingsCardView {
                        VStack(spacing: 0) {
                            ListItemView(
                                icon: AnyView(Image(systemName: "house.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Home",
                                isSelected: selectedItem == "home",
                                action: { selectedItem = "home" }
                            )
                            
                            SettingsDivider()
                            
                            ListItemView(
                                icon: AnyView(Image(systemName: "folder.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Documents",
                                isSelected: selectedItem == "documents",
                                action: { selectedItem = "documents" }
                            )
                            
                            SettingsDivider()
                            
                            ListItemView(
                                icon: AnyView(Image(systemName: "star.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Favorites",
                                isSelected: selectedItem == "favorites",
                                action: { selectedItem = "favorites" }
                            )
                            
                            SettingsDivider()
                            
                            ListItemView(
                                icon: AnyView(Image(systemName: "gearshape.fill").foregroundStyle(FColor.iconSecondary)),
                                title: "Settings",
                                isSelected: selectedItem == "settings",
                                action: { selectedItem = "settings" }
                            )
                        }
                    }
                    
                    if let selected = selectedItem {
                        Text("Selected: \(selected)")
                            .font(FType.caption())
                            .foregroundStyle(FColor.textSecondary)
                    }
                }
            }
            
            GallerySection(title: "Navigation Example", subtitle: "Complete navigation pattern") {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Full navigation example with NavigationExampleView")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                    
                    NavigationExampleView()
                        .frame(height: 400)
                }
            }
        }
    }
}
