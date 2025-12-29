//
//  PreviewScenarios.swift
//  ChatUIPlayground
//
//  Created by Jamie Scott Craik on 28-12-2025.
//

import SwiftUI
import ChatUIFoundation

/// Lightweight helper for consistent preview layout.
public struct PreviewScenarios<Content: View>: View {
    private let title: String
    private let content: () -> Content

    public init(_ title: String, @ViewBuilder content: @escaping () -> Content) {
        self.title = title
        self.content = content
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s16) {
            Text(title)
                .font(FType.sectionTitle())
                .foregroundStyle(FColor.textPrimary)
            content()
        }
        .padding(FSpacing.s16)
        .background(FColor.bgApp)
    }
}
