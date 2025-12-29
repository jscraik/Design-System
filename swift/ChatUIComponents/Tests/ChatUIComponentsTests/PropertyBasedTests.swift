import SwiftUI
import XCTest
import SwiftCheck
@testable import ChatUIComponents

final class ChatUIComponentsPropertyTests: XCTestCase {
    private let optionalStringGen = Gen<String?>.one(of: [
        Gen.pure(nil),
        String.arbitrary.map(Optional.some)
    ])

    func testChatUIButtonAccessibilityLabelResolution() {
        property("ChatUIButton resolves explicit > fallback > nil") <- forAll(optionalStringGen, optionalStringGen) { explicit, fallback in
            let expected = Self.resolveLabel(explicit: explicit, fallback: fallback)
            return ChatUIButton<Text>.resolveAccessibilityLabel(explicit: explicit, fallback: fallback) == expected
        }
    }

    func testInputViewAccessibilityLabelResolution() {
        property("InputView uses placeholder when explicit is empty") <- forAll(optionalStringGen, String.arbitrary) { explicit, placeholder in
            let expected = Self.resolveLabel(explicit: explicit, fallback: placeholder)
            return InputView.resolveAccessibilityLabel(explicit: explicit, placeholder: placeholder) == expected
        }
    }

    private static func resolveLabel(explicit: String?, fallback: String?) -> String? {
        let trimmedExplicit = explicit?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmedExplicit, !trimmedExplicit.isEmpty {
            return trimmedExplicit
        }
        let trimmedFallback = fallback?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmedFallback, !trimmedFallback.isEmpty {
            return trimmedFallback
        }
        return nil
    }
}
