import XCTest
@testable import AStudioApp

@MainActor
final class AStudioAppTests: XCTestCase {
    func testAppStateSnapshotRoundTrip() throws {
        let state = AppState()
        state.selectedSection = .tools
        state.mcpBaseURLString = "http://localhost:8787"
        state.themeStyle = .default

        let snapshot = state.snapshot()

        let restored = AppState()
        restored.apply(snapshot: snapshot)

        XCTAssertEqual(restored.selectedSection, .tools)
        XCTAssertEqual(restored.mcpBaseURLString, "http://localhost:8787")
        XCTAssertEqual(restored.themeStyle, .default)
    }
}
