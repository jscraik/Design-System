//
//  ContentView.swift
//  ChatUIPlayground
//
//  Created by Jamie Scott Craik on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIShellChatGPT

struct ContentView: View {
    @State private var selectedSection: PlaygroundSection = .settings

    var body: some View {
        ZStack {
            FColor.bgApp

            RoundedAppContainer {
                AppShellView {
                    SidebarView(selection: $selectedSection)
                } detail: {
                    ComponentGallery(section: selectedSection)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
            .padding(FSpacing.s12)
        }
    }
}

private struct SidebarView: View {
    @Binding var selection: PlaygroundSection

    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s12) {
            Text("ChatUIPlayground")
                .font(FType.title())
                .foregroundStyle(FColor.textPrimary)
                .padding(.horizontal, FSpacing.s8)
                .padding(.top, FSpacing.s12)

            VStack(spacing: FSpacing.s4) {
                ForEach(PlaygroundSection.allCases) { section in
                    ListItemView(
                        systemIcon: section.systemImage,
                        title: section.title,
                        isSelected: selection == section
                    ) {
                        selection = section
                    }
                }
            }
            .padding(.horizontal, FSpacing.s8)

            Spacer()
        }
        .padding(.bottom, FSpacing.s12)
    }
}

enum PlaygroundSection: String, CaseIterable, Identifiable {
    case buttons
    case inputs
    case settings
    case navigation

    var id: String { rawValue }

    var title: String {
        switch self {
        case .buttons:
            return "Buttons"
        case .inputs:
            return "Inputs"
        case .settings:
            return "Settings"
        case .navigation:
            return "Navigation"
        }
    }

    var systemImage: String {
        switch self {
        case .buttons:
            return "button.programmable"
        case .inputs:
            return "textfield"
        case .settings:
            return "gearshape"
        case .navigation:
            return "sidebar.left"
        }
    }
}

#Preview {
    ContentView()
        .frame(width: 1000, height: 700)
}
