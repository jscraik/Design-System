//
//  ContentView.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct ContentView: View {
    @EnvironmentObject var galleryState: GalleryState
    
    var body: some View {
        NavigationSplitView {
            SidebarView()
                .frame(minWidth: 250, idealWidth: 280, maxWidth: 350)
        } detail: {
            if galleryState.sideBySideMode {
                SideBySideView()
            } else {
                DetailView()
            }
        }
        .navigationSplitViewStyle(.balanced)
    }
}

// MARK: - Sidebar View

struct SidebarView: View {
    @EnvironmentObject var galleryState: GalleryState
    
    var body: some View {
        List(selection: $galleryState.selectedCategory) {
            Section("Search") {
                TextField("Search components", text: $galleryState.searchQuery)
                    .textFieldStyle(.roundedBorder)
            }

            Section("Component Categories") {
                ForEach(ComponentCategory.allCases) { category in
                    NavigationLink(value: category) {
                        Label(category.rawValue, systemImage: category.icon)
                    }
                }
            }
            
            Section("Display Options") {
                Toggle("Side-by-Side Mode", isOn: $galleryState.sideBySideMode)
                Toggle("Accessibility Panel", isOn: $galleryState.showAccessibilityPanel)
                Toggle("High Contrast", isOn: $galleryState.highContrastMode)
                Toggle("Reduced Motion", isOn: $galleryState.reducedMotionMode)
            }
            
            Section("Color Scheme") {
                Picker("Mode", selection: $galleryState.colorSchemeOverride) {
                    Text("System").tag(nil as ColorScheme?)
                    Text("Light").tag(ColorScheme.light as ColorScheme?)
                    Text("Dark").tag(ColorScheme.dark as ColorScheme?)
                }
                .pickerStyle(.segmented)
            }
        }
        .listStyle(.sidebar)
        .navigationTitle("Component Gallery")
#if os(iOS)
        .searchable(text: $galleryState.searchQuery, placement: .navigationBarDrawer(displayMode: .always))
#endif
    }
}

// MARK: - Detail View

struct DetailView: View {
    @EnvironmentObject var galleryState: GalleryState
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s24) {
                // Header
                VStack(alignment: .leading, spacing: FSpacing.s8) {
                    Text(galleryState.selectedCategory.rawValue)
                        .font(FType.title())
                        .foregroundStyle(FColor.textPrimary)
                    
                    Text("Explore \(galleryState.selectedCategory.rawValue.lowercased()) components from the ChatUI library")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textSecondary)
                }
                .padding(.horizontal, FSpacing.s24)
                .padding(.top, FSpacing.s24)
                
                // Accessibility Panel
                if galleryState.showAccessibilityPanel {
                    AccessibilityTestPanel()
                        .padding(.horizontal, FSpacing.s24)
                }
                
                // Component Gallery
                componentGallery
                    .padding(.horizontal, FSpacing.s24)
                    .padding(.bottom, FSpacing.s24)
            }
        }
        .background(FColor.bgApp)
        .preferredColorScheme(galleryState.colorSchemeOverride)
    }
    
    @ViewBuilder
    private var componentGallery: some View {
        switch galleryState.selectedCategory {
        case .foundation:
            FoundationGallery()
        case .settings:
            SettingsGallery()
        case .buttons:
            ButtonsGallery()
        case .inputs:
            InputsGallery()
        case .navigation:
            NavigationGallery()
        case .themes:
            ThemesGallery()
        case .accessibility:
            AccessibilityGallery()
        }
    }
}

// MARK: - Side-by-Side View

struct SideBySideView: View {
    @EnvironmentObject var galleryState: GalleryState
    
    var body: some View {
        HStack(spacing: 0) {
            // Light Mode
            VStack(spacing: 0) {
                Text("Light Mode")
                    .font(FType.sectionTitle())
                    .foregroundStyle(FColor.textPrimary)
                    .padding(FSpacing.s12)
                    .frame(maxWidth: .infinity)
                    .background(FColor.bgCard)
                
                ScrollView {
                    componentGallery
                        .padding(FSpacing.s24)
                }
                .background(FColor.bgApp)
            }
            .preferredColorScheme(.light)
            
            Divider()
            
            // Dark Mode
            VStack(spacing: 0) {
                Text("Dark Mode")
                    .font(FType.sectionTitle())
                    .foregroundStyle(FColor.textPrimary)
                    .padding(FSpacing.s12)
                    .frame(maxWidth: .infinity)
                    .background(FColor.bgCard)
                
                ScrollView {
                    componentGallery
                        .padding(FSpacing.s24)
                }
                .background(FColor.bgApp)
            }
            .preferredColorScheme(.dark)
        }
    }
    
    @ViewBuilder
    private var componentGallery: some View {
        switch galleryState.selectedCategory {
        case .foundation:
            FoundationGallery()
        case .settings:
            SettingsGallery()
        case .buttons:
            ButtonsGallery()
        case .inputs:
            InputsGallery()
        case .navigation:
            NavigationGallery()
        case .themes:
            ThemesGallery()
        case .accessibility:
            AccessibilityGallery()
        }
    }
}
