//
//  ContentView.swift
//  ChatUIPlayground
//
//  Created by Jamie Scott Craik on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents

struct ContentView: View {
    @State private var selectedSection: PlaygroundSection = .settings

    var body: some View {
        NavigationSplitView {
            List(PlaygroundSection.allCases, selection: $selectedSection) { section in
                Label(section.title, systemImage: section.systemImage)
                    .tag(section)
            }
            .navigationTitle("ChatUI Playground")
            .frame(minWidth: 220)
        } detail: {
            ComponentGallery(section: selectedSection)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(FColor.bgApp)
        }
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
