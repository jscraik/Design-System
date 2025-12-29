import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

/// Example view demonstrating all ChatUIShellChatGPT components
public struct ShellExampleView: View {
    @State private var selectedItem: String? = "Home"
    @State private var notificationsEnabled = true
    @State private var selectedTheme = "ChatGPT"
    
    public init() {}
    
    public var body: some View {
        RoundedAppContainer {
            AppShellView {
                // Sidebar content
                sidebarContent
            } detail: {
                // Detail content
                detailContent
            }
        }
        .chatUITheme(selectedTheme == "Default" ? .default : .chatgpt)
        .frame(width: 1000, height: 700)
    }
    
    private var sidebarContent: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            // Sidebar header
            Text("ChatUI Shell")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)
                .padding(.horizontal, FSpacing.s16)
                .padding(.top, FSpacing.s24)
            
            // Navigation items
            VStack(spacing: 0) {
                ListItemView(
                    icon: AnyView(Image(systemName: "house.fill")),
                    title: "Home",
                    isSelected: selectedItem == "Home"
                ) {
                    selectedItem = "Home"
                }
                
                ListItemView(
                    icon: AnyView(Image(systemName: "message.fill")),
                    title: "Messages",
                    isSelected: selectedItem == "Messages"
                ) {
                    selectedItem = "Messages"
                }
                
                ListItemView(
                    icon: AnyView(Image(systemName: "gear")),
                    title: "Settings",
                    isSelected: selectedItem == "Settings"
                ) {
                    selectedItem = "Settings"
                }
            }
            .padding(.horizontal, FSpacing.s8)
            
            Spacer()
            
            // Sidebar footer
            Text("Shell Example v1.0")
                .font(FType.caption())
                .foregroundStyle(FColor.textTertiary)
                .padding(.horizontal, FSpacing.s16)
                .padding(.bottom, FSpacing.s16)
        }
    }
    
    private var detailContent: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: FSpacing.s24) {
                // Header
                VStack(alignment: .leading, spacing: FSpacing.s8) {
                    Text(selectedItem ?? "Home")
                        .font(FType.title())
                        .foregroundStyle(FColor.textPrimary)
                    
                    Text("Demonstrating ChatUIShellChatGPT components")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textSecondary)
                }
                
                // Example settings card
                SettingsCardView {
                    VStack(spacing: 0) {
                        SettingToggleView(
                            icon: AnyView(Image(systemName: "bell.fill")),
                            title: "Notifications",
                            subtitle: "Receive alerts and updates",
                            isOn: $notificationsEnabled
                        )
                        
                        SettingsDivider()
                        
                        SettingDropdownView(
                            icon: AnyView(Image(systemName: "paintbrush.fill")),
                            title: "Theme",
                            subtitle: "Choose your appearance",
                            options: ["ChatGPT", "Default"],
                            selection: $selectedTheme
                        )
                    }
                }
                
                // Component showcase
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    Text("Shell Components")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                    
                    SettingsCardView {
                        VStack(alignment: .leading, spacing: FSpacing.s12) {
                            componentInfo(
                                title: "VisualEffectView",
                                description: "macOS vibrancy with iOS/visionOS fallback"
                            )
                            
                            SettingsDivider()
                            
                            componentInfo(
                                title: "RoundedAppContainer",
                                description: "ChatGPT-style clipping, borders, and shadows"
                            )
                            
                            SettingsDivider()
                            
                            componentInfo(
                                title: "AppShellView",
                                description: "NavigationSplitView with configurable sidebar (280-400pt)"
                            )
                        }
                        .padding(FSpacing.s16)
                    }
                }
            }
            .padding(FSpacing.s24)
        }
    }
    
    private func componentInfo(title: String, description: String) -> some View {
        VStack(alignment: .leading, spacing: FSpacing.s4) {
            Text(title)
                .font(FType.rowTitle())
                .foregroundStyle(FColor.textPrimary)
            
            Text(description)
                .font(FType.caption())
                .foregroundStyle(FColor.textSecondary)
        }
    }
}

// MARK: - SwiftUI Previews

struct ShellExampleView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ShellExampleView()
                .previewDisplayName("Light Mode")
                .environment(\.colorScheme, .light)
            
            ShellExampleView()
                .previewDisplayName("Dark Mode")
                .environment(\.colorScheme, .dark)
            
            ShellExampleView()
                .previewDisplayName("macOS")
                .frame(width: 1000, height: 700)
        }
    }
}
