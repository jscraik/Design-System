//
//  AccessibilityTestPanel.swift
//  ComponentGallery
//
//  Created on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

struct AccessibilityTestPanel: View {
    @State private var focusOrderCompleted = false
    @State private var focusRingCompleted = false
    @State private var accessibleNamesCompleted = false
    @State private var voiceOverCompleted = false
    
    var completionPercentage: Int {
        let completed = [focusOrderCompleted, focusRingCompleted, accessibleNamesCompleted, voiceOverCompleted].filter { $0 }.count
        return (completed * 100) / 4
    }
    
    var body: some View {
        SettingsCardView {
            VStack(alignment: .leading, spacing: FSpacing.s16) {
                // Header
                HStack {
                    Image(systemName: "checkmark.shield.fill")
                        .font(.system(size: 24))
                        .foregroundStyle(FColor.accentBlue)
                    
                    VStack(alignment: .leading, spacing: FSpacing.s4) {
                        Text("Accessibility Testing Checklist")
                            .font(FType.title())
                            .foregroundStyle(FColor.textPrimary)
                        
                        Text("\(completionPercentage)% Complete")
                            .font(FType.caption())
                            .foregroundStyle(FColor.textSecondary)
                    }
                    
                    Spacer()
                }
                .padding(FSpacing.s16)
                
                SettingsDivider()
                
                // Checklist Items
                VStack(spacing: 0) {
                    AccessibilityCheckItem(
                        isCompleted: $focusOrderCompleted,
                        title: "Focus Order Test",
                        description: "Tab/Shift-Tab through all controls to verify logical focus order",
                        instruction: "Use Tab key to navigate forward, Shift-Tab to navigate backward"
                    )
                    
                    SettingsDivider()
                    
                    AccessibilityCheckItem(
                        isCompleted: $focusRingCompleted,
                        title: "Focus Ring Visibility",
                        description: "Focused inputs show visible focus ring (not color-only indication)",
                        instruction: "Tab to inputs and buttons - focus ring should be clearly visible"
                    )
                    
                    SettingsDivider()
                    
                    AccessibilityCheckItem(
                        isCompleted: $accessibleNamesCompleted,
                        title: "Accessible Names",
                        description: "Every interactive control has accessible name (especially icon-only)",
                        instruction: "Icon-only buttons should announce meaningful names, not just 'button'"
                    )
                    
                    SettingsDivider()
                    
                    AccessibilityCheckItem(
                        isCompleted: $voiceOverCompleted,
                        title: "VoiceOver Smoke Test",
                        description: "VoiceOver announces controls and content correctly",
                        instruction: "Toggle VoiceOver with ⌘F5, navigate with VO+Arrow keys"
                    )
                }
                
                // Overall Status
                if completionPercentage == 100 {
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundStyle(FColor.accentGreen)
                        
                        Text("All accessibility tests completed!")
                            .font(FType.rowTitle())
                            .foregroundStyle(FColor.accentGreen)
                    }
                    .padding(FSpacing.s16)
                    .background(FColor.accentGreen.opacity(0.1))
                    .cornerRadius(ChatGPTTheme.rowCornerRadius)
                    .padding(.horizontal, FSpacing.s16)
                    .padding(.bottom, FSpacing.s16)
                }
            }
        }
    }
}

struct AccessibilityCheckItem: View {
    @Binding var isCompleted: Bool
    let title: String
    let description: String
    let instruction: String
    
    var body: some View {
        Button(action: { isCompleted.toggle() }) {
            HStack(alignment: .top, spacing: FSpacing.s12) {
                // Checkbox
                ZStack {
                    RoundedRectangle(cornerRadius: 6)
                        .stroke(isCompleted ? FColor.accentGreen : FColor.divider, lineWidth: 2)
                        .frame(width: 24, height: 24)
                    
                    if isCompleted {
                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundStyle(FColor.accentGreen)
                    }
                }
                
                // Content
                VStack(alignment: .leading, spacing: FSpacing.s4) {
                    Text(title)
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)
                    
                    Text(description)
                        .font(FType.caption())
                        .foregroundStyle(FColor.textSecondary)
                    
                    Text("→ \(instruction)")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                        .italic()
                }
                
                Spacer()
            }
            .padding(FSpacing.s16)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}
