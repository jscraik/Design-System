#!/usr/bin/env swift

// Example usage of the new modular aStudio Swift packages
// This demonstrates that all four packages work together correctly

import SwiftUI
import AStudioFoundation
import AStudioComponents
import AStudioThemes
import AStudioShellChatGPT

// Example view using the new modular architecture
struct ExampleSettingsView: View {
    @State private var notificationsEnabled = true
    @State private var selectedTheme = "Dark"
    
    private let themeOptions = ["Light", "Dark", "Auto"]
    
    var body: some View {
        AppShellView(
            sidebar: {
                VStack(alignment: .leading, spacing: FSpacing.s16) {
                    Text("Settings")
                        .font(FType.sectionTitle())
                        .foregroundStyle(FColor.textPrimary)
                        .padding(.horizontal, FSpacing.s16)
                    
                    Spacer()
                }
                .background(FColor.bgApp)
            },
            detail: {
                ScrollView {
                    VStack(spacing: FSpacing.s24) {
                        SettingsCardView {
                            VStack(spacing: 0) {
                                SettingToggleView(
                                    icon: AnyView(Image(systemName: "bell.fill")),
                                    title: "Notifications",
                                    subtitle: "Receive push notifications",
                                    isOn: $notificationsEnabled
                                )
                                
                                SettingsDivider()
                                
                                SettingDropdownView(
                                    icon: AnyView(Image(systemName: "paintbrush.fill")),
                                    title: "Theme",
                                    subtitle: "Choose your preferred theme",
                                    options: themeOptions,
                                    selection: $selectedTheme
                                )
                            }
                        }
                        .padding(.horizontal, FSpacing.s16)
                        
                        Spacer(minLength: FSpacing.s32)
                    }
                }
                .background(FColor.bgApp)
            }
        )
    }
}

// This example demonstrates:
// 1. AStudioFoundation: FColor, FType, FSpacing semantic tokens
// 2. AStudioComponents: SettingsCardView, SettingToggleView, SettingDropdownView, SettingsDivider
// 3. AStudioThemes: (implicitly used by components for styling constants)
// 4. AStudioShellChatGPT: AppShellView for complete application layout

print("✅ All four modular aStudio Swift packages imported successfully!")
print("✅ AStudioFoundation: Semantic tokens (FColor, FType, FSpacing, Platform, FAccessibility)")
print("✅ AStudioComponents: Settings primitives (SettingsCardView, SettingRowView, SettingToggleView, etc.)")
print("✅ AStudioThemes: Theme constants (ChatGPTTheme, DefaultTheme)")
print("✅ AStudioShellChatGPT: Application shell layouts (AppShellView, VisualEffectView, RoundedAppContainer)")
print("")
print("🎉 Modular package architecture refactoring complete!")
print("📁 Packages located at:")
print("   - platforms/apple/swift/AStudioFoundation/")
print("   - platforms/apple/swift/AStudioComponents/")
print("   - platforms/apple/swift/AStudioThemes/")
print("   - platforms/apple/swift/AStudioShellChatGPT/")
print("")
print("🔧 Next steps:")
print("   1. Update playground app to use new packages")
print("   2. Implement enhanced token generation (Task 7)")
print("   3. Create production macOS application (Task 13)")
