import AppKit
import SwiftUI
import XCTest
@testable import ChatUISwift

final class ComponentRenderTests: XCTestCase {
    private func render<V: View>(_ view: V) {
        let hostingView = NSHostingView(rootView: view)
        hostingView.frame = NSRect(x: 0, y: 0, width: 400, height: 200)
        hostingView.layoutSubtreeIfNeeded()
        _ = hostingView.intrinsicContentSize
    }

    // MARK: - ChatUIButton Render Tests
    
    func testChatUIButtonRenders() throws {
        // Test basic text button
        XCTAssertNoThrow(render(ChatUIButton("Test") { }))
        
        // Test icon button
        XCTAssertNoThrow(render(ChatUIButton(systemName: "heart.fill", size: .icon) { }))
    }
    
    func testChatUIButtonVariantsRender() throws {
        // Test all button variants
        XCTAssertNoThrow(render(ChatUIButton("Default", variant: .default) { }))
        XCTAssertNoThrow(render(ChatUIButton("Destructive", variant: .destructive) { }))
        XCTAssertNoThrow(render(ChatUIButton("Outline", variant: .outline) { }))
        XCTAssertNoThrow(render(ChatUIButton("Secondary", variant: .secondary) { }))
        XCTAssertNoThrow(render(ChatUIButton("Ghost", variant: .ghost) { }))
        XCTAssertNoThrow(render(ChatUIButton("Link", variant: .link) { }))
    }
    
    func testChatUIButtonSizesRender() throws {
        // Test all button sizes
        XCTAssertNoThrow(render(ChatUIButton("Small", size: .sm) { }))
        XCTAssertNoThrow(render(ChatUIButton("Default", size: .default) { }))
        XCTAssertNoThrow(render(ChatUIButton("Large", size: .lg) { }))
        XCTAssertNoThrow(render(ChatUIButton(systemName: "star", size: .icon) { }))
    }
    
    func testChatUIButtonStatesRender() throws {
        // Test disabled state
        XCTAssertNoThrow(render(ChatUIButton("Disabled", isDisabled: true) { }))
        
        // Test with accessibility labels
        XCTAssertNoThrow(render(
            ChatUIButton("Save", accessibilityLabel: "Save document", accessibilityHint: "Saves the current document") { }
        ))
        
        // Test icon button with accessibility
        XCTAssertNoThrow(render(
            ChatUIButton(systemName: "trash", accessibilityLabel: "Delete", accessibilityHint: "Deletes the selected item") { }
        ))
    }

    // MARK: - ChatUIInput Render Tests
    
    func testChatUIInputRenders() throws {
        // Test basic input
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Name")))
        
        // Test search input
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Search", variant: .search)))
    }
    
    func testChatUIInputVariantsRender() throws {
        // Test all input variants
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Default", variant: .default)))
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Search", variant: .search)))
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Password", variant: .password)))
    }
    
    func testChatUIInputSizesRender() throws {
        // Test all input sizes
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Small", size: .sm)))
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Default", size: .default)))
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Large", size: .lg)))
    }
    
    func testChatUIInputStatesRender() throws {
        // Test disabled state
        XCTAssertNoThrow(render(ChatUIInput(text: .constant(""), placeholder: "Disabled", isDisabled: true)))
        
        // Test with accessibility labels
        XCTAssertNoThrow(render(
            ChatUIInput(
                text: .constant(""),
                placeholder: "Email",
                accessibilityLabel: "Email address",
                accessibilityHint: "Enter your email address"
            )
        ))
        
        // Test with submit label
        XCTAssertNoThrow(render(
            ChatUIInput(
                text: .constant(""),
                placeholder: "Search",
                submitLabel: .search,
                onSubmit: { }
            )
        ))
    }

    // MARK: - ChatUICard Render Tests
    
    func testChatUICardRenders() throws {
        // Test basic card
        XCTAssertNoThrow(
            render(
                ChatUICard(variant: .elevated) {
                    Text("Card")
                }
            )
        )
    }
    
    func testChatUICardVariantsRender() throws {
        // Test all card variants
        XCTAssertNoThrow(
            render(
                ChatUICard(variant: .default) {
                    Text("Default Card")
                }
            )
        )
        
        XCTAssertNoThrow(
            render(
                ChatUICard(variant: .elevated) {
                    Text("Elevated Card")
                }
            )
        )
        
        XCTAssertNoThrow(
            render(
                ChatUICard(variant: .outlined) {
                    Text("Outlined Card")
                }
            )
        )
    }
    
    func testChatUICardWithComplexContentRender() throws {
        // Test card with complex content
        XCTAssertNoThrow(
            render(
                ChatUICard {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Card Title")
                            .font(.headline)
                        Text("Card description with multiple lines of text that should wrap properly within the card container.")
                            .font(.body)
                        HStack {
                            ChatUIButton("Cancel", variant: .outline) { }
                            ChatUIButton("Save") { }
                        }
                    }
                }
            )
        )
    }
    
    // MARK: - Integration Tests
    
    func testComponentsTogetherRender() throws {
        // Test components working together
        XCTAssertNoThrow(
            render(
                VStack(spacing: 16) {
                    ChatUICard {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Login Form")
                                .font(.headline)
                            
                            ChatUIInput(
                                text: .constant(""),
                                placeholder: "Username",
                                accessibilityLabel: "Username"
                            )
                            
                            ChatUIInput(
                                text: .constant(""),
                                placeholder: "Password",
                                variant: .password,
                                accessibilityLabel: "Password"
                            )
                            
                            HStack {
                                ChatUIButton("Cancel", variant: .outline) { }
                                ChatUIButton("Login") { }
                            }
                        }
                    }
                }
                .padding()
            )
        )
    }
    
    func testAccessibilityFeaturesRender() throws {
        // Test components with accessibility features
        XCTAssertNoThrow(
            render(
                VStack(spacing: 16) {
                    // High contrast support
                    ChatUIButton("High Contrast Button") { }
                        .accessibilityHighContrast()
                    
                    // Focus ring support
                    ChatUIInput(text: .constant(""), placeholder: "Focus Ring Input")
                        .accessibilityFocusRing()
                    
                    // Card with accessibility
                    ChatUICard {
                        Text("Accessible Card Content")
                    }
                    .accessibilityElement(children: .contain)
                }
                .padding()
            )
        )
    }
    
    // MARK: - Dynamic Type Tests
    
    func testDynamicTypeRender() throws {
        // Test components with different dynamic type sizes
        let dynamicTypeSizes: [DynamicTypeSize] = [.small, .large, .xLarge, .accessibility1]
        
        for size in dynamicTypeSizes {
            XCTAssertNoThrow(
                render(
                    VStack {
                        ChatUIButton("Dynamic Type Button") { }
                        ChatUIInput(text: .constant(""), placeholder: "Dynamic Type Input")
                        ChatUICard {
                            Text("Dynamic Type Card")
                        }
                    }
                    .environment(\.dynamicTypeSize, size)
                )
            )
        }
    }
}
