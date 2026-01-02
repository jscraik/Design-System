import SnapshotTesting
import SwiftUI
import ChatUIThemes
#if canImport(XCTest)
import XCTest
#endif

/// Accessibility contrast variants for snapshot tests.
public enum SnapshotAccessibilityContrast {
    case standard
    case increased
}

/// Provides helpers for SnapshotTesting configuration and assertions.
public enum SnapshotTestSupport {
    /// Returns `true` when snapshot recording is enabled via environment.
    public static let isRecording: Bool = {
        let value = ProcessInfo.processInfo.environment["SNAPSHOT_RECORD"] ?? "0"
        return value == "1" || value.lowercased() == "true"
    }()

    /// Returns `true` when snapshot tests are enabled via environment.
    public static let isEnabled: Bool = {
        let value = ProcessInfo.processInfo.environment["SNAPSHOT_TESTS"] ?? "0"
        return isRecording || value == "1" || value.lowercased() == "true"
    }()

    /// Asserts a snapshot for a SwiftUI view with common configuration.
    /// - Parameters:
    ///   - view: The view under test.
    ///   - size: The snapshot size to render.
    ///   - colorScheme: The color scheme to apply.
    ///   - theme: The ChatUI theme to apply.
    ///   - accessibilityContrast: Optional contrast override (currently unused).
    ///   - reduceMotion: Optional reduce motion override (currently unused).
    ///   - legibilityWeight: Optional legibility weight to apply.
    ///   - dynamicTypeSize: Optional dynamic type size to apply.
    ///   - named: Optional snapshot name suffix.
    ///   - file: The file path for snapshot failure reporting.
    ///   - testName: The test name for snapshot failure reporting.
    ///   - line: The line number for snapshot failure reporting.
    /// - Throws: `XCTSkip` when snapshot tests are disabled.
    @MainActor
    public static func assertView<V: View>(
        _ view: V,
        size: CGSize,
        colorScheme: ColorScheme,
        theme: ChatUITheme = .chatgpt,
        accessibilityContrast: SnapshotAccessibilityContrast? = nil,
        reduceMotion: Bool? = nil,
        legibilityWeight: SwiftUI.LegibilityWeight? = nil,
        dynamicTypeSize: SwiftUI.DynamicTypeSize? = nil,
        named: String? = nil,
        file: StaticString = #filePath,
        testName: String = #function,
        line: UInt = #line
    ) throws {
        guard isEnabled else {
            #if canImport(XCTest)
            throw XCTSkip("Snapshot tests disabled. Set SNAPSHOT_TESTS=1 to run or SNAPSHOT_RECORD=1 to record.")
            #else
            return
            #endif
        }

        SnapshotTesting.isRecording = isRecording

        var configuredView: AnyView = AnyView(
            view
                .environment(\.colorScheme, colorScheme)
                .environment(\.chatUITheme, theme)
                .frame(width: size.width, height: size.height)
        )

        _ = accessibilityContrast
        _ = reduceMotion
        if let legibilityWeight {
            configuredView = AnyView(
                configuredView.environment(\.legibilityWeight, legibilityWeight)
            )
        }
        if let dynamicTypeSize {
            configuredView = AnyView(
                configuredView.environment(\.dynamicTypeSize, dynamicTypeSize)
            )
        }

        #if os(macOS)
        let hostingController = NSHostingController(rootView: configuredView)
        hostingController.view.frame = CGRect(origin: .zero, size: size)
        assertSnapshot(
            of: hostingController.view,
            as: .image(size: size),
            named: named,
            file: file,
            testName: testName,
            line: line
        )
        #else
        assertSnapshot(
            of: configuredView,
            as: .image(layout: .fixed(width: size.width, height: size.height)),
            named: named,
            file: file,
            testName: testName,
            line: line
        )
        #endif
    }
}
