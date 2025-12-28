//
//  ChatUIPlaygroundApp.swift
//  ChatUIPlayground
//
//  Created by Jamie Scott Craik on 28-12-2025.
//

import SwiftUI
import ChatUISwift

@main
struct ChatUIPlaygroundApp: App {

    init() {
        // Initialize the ChatUISwift package
        ChatUISwift.initialize()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .frame(minWidth: 800, minHeight: 600)
        }
        .windowStyle(.titleBar)
        .windowToolbarStyle(.unified)
    }
}
