//
//  ContentView.swift
//  ChatUIPlayground
//
//  Created by Jamie Scott Craik on 28-12-2025.
//

import SwiftUI
import ChatUISwift

struct ContentView: View {
    @State private var selectedComponent: ComponentType = .button

    var body: some View {
        NavigationSplitView {
            // Sidebar with component list
            List(ComponentType.allCases, id: \.self, selection: $selectedComponent) { component in
                Label(component.displayName, systemImage: component.systemImage)
                    .tag(component)
            }
            .navigationTitle("Components")
            .frame(minWidth: 200)
        } detail: {
            // Main content area
            ComponentGallery(selectedComponent: selectedComponent)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(DesignTokens.Colors.Background.primary)
        }
    }
}

enum ComponentType: String, CaseIterable {
    case button = "button"
    case input = "input"
    case card = "card"
    case tokens = "tokens"

    var displayName: String {
        switch self {
        case .button:
            return "Button"
        case .input:
            return "Input"
        case .card:
            return "Card"
        case .tokens:
            return "Design Tokens"
        }
    }

    var systemImage: String {
        switch self {
        case .button:
            return "button.programmable"
        case .input:
            return "textfield"
        case .card:
            return "rectangle"
        case .tokens:
            return "paintpalette"
        }
    }
}

#Preview {
    ContentView()
        .frame(width: 1000, height: 700)
}
