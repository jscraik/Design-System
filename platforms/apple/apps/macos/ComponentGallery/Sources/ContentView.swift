//
//  ContentView.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import AStudioFoundation
import AStudioComponents
import AStudioThemes
#if os(macOS)
import AppKit
#endif

/// Root navigation container for the component gallery.
struct ContentView: View {
    @EnvironmentObject var galleryState: GalleryState
#if os(macOS)
    @State private var showingScreenshotError = false
    @State private var screenshotErrorMessage: String?
#endif
    
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
        .environment(\.accessibilityReduceMotion, galleryState.reducedMotionMode)
        .environment(\.colorSchemeContrast, galleryState.highContrastMode ? .increased : .standard)
#if os(macOS)
        .onReceive(NotificationCenter.default.publisher(for: .exportScreenshot)) { _ in
            exportScreenshot()
        }
        .alert("Unable to Export Screenshot", isPresented: $showingScreenshotError) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(screenshotErrorMessage ?? "Unknown error.")
        }
#endif
    }
}

#if os(macOS)
private extension ContentView {
    @MainActor
    func exportScreenshot() {
        guard let window = NSApp.keyWindow else {
            screenshotErrorMessage = "No active window to capture."
            showingScreenshotError = true
            return
        }
        guard let contentView = window.contentView else {
            screenshotErrorMessage = "Window content is unavailable."
            showingScreenshotError = true
            return
        }
        guard let rep = contentView.bitmapImageRepForCachingDisplay(in: contentView.bounds) else {
            screenshotErrorMessage = "Unable to create image buffer."
            showingScreenshotError = true
            return
        }

        contentView.cacheDisplay(in: contentView.bounds, to: rep)
        guard let data = rep.representation(using: .png, properties: [:]) else {
            screenshotErrorMessage = "Unable to encode PNG."
            showingScreenshotError = true
            return
        }

        let panel = NSSavePanel()
        panel.allowedContentTypes = [.png]
        panel.canCreateDirectories = true
        panel.nameFieldStringValue = "component-gallery-\(Self.timestampString()).png"

        panel.begin { response in
            guard response == .OK, let url = panel.url else { return }
            do {
                try data.write(to: url, options: .atomic)
            } catch {
                screenshotErrorMessage = error.localizedDescription
                showingScreenshotError = true
            }
        }
    }

    static func timestampString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyyMMdd-HHmmss"
        return formatter.string(from: Date())
    }
}
#endif

// MARK: - Sidebar View

/// Sidebar navigation and display controls.
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

/// Detail view that hosts the selected component gallery.
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
                    
                    Text("Explore \(galleryState.selectedCategory.rawValue.lowercased()) components from the aStudio library")
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
        case .feedback:
            FeedbackGallery()
        case .dataDisplay:
            DataDisplayGallery()
        case .templates:
            TemplatesGallery()
        case .chatVariants:
            ChatVariantsGallery()
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

/// Side-by-side comparison view for light/dark modes.
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
        case .feedback:
            FeedbackGallery()
        case .dataDisplay:
            DataDisplayGallery()
        case .templates:
            TemplatesGallery()
        case .chatVariants:
            ChatVariantsGallery()
        case .navigation:
            NavigationGallery()
        case .themes:
            ThemesGallery()
        case .accessibility:
            AccessibilityGallery()
        }
    }
}
