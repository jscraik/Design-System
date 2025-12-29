import XCTest
import SwiftUI
@testable import ChatUISwift

/**
 * Tests for development tools functionality
 * 
 * Validates that debugging tools, performance monitoring, and documentation
 * generation work correctly in the development environment.
 */

@available(macOS 13.0, *)
final class DevelopmentToolsTests: XCTestCase {
    
    override func setUp() {
        super.setUp()
        // Enable debug mode for testing
        DebugConfig.isEnabled = true
    }
    
    override func tearDown() {
        // Reset debug configuration
        DebugConfig.isEnabled = false
        DebugConfig.showStateInspector = false
        DebugConfig.logStateChanges = false
        DebugConfig.showPerformanceMetrics = false
        DebugConfig.highlightRedraws = false
        
        DebugConsole.shared.clear()
        super.tearDown()
    }
    
    // MARK: - Debug Configuration Tests
    
    func testDebugConfigurationDefaults() {
        // Debug should be enabled in DEBUG builds
        #if DEBUG
        XCTAssertTrue(DebugConfig.isEnabled)
        #else
        XCTAssertFalse(DebugConfig.isEnabled)
        #endif
        
        // Other settings should default to false
        XCTAssertFalse(DebugConfig.showStateInspector)
        XCTAssertFalse(DebugConfig.logStateChanges)
        XCTAssertFalse(DebugConfig.showPerformanceMetrics)
        XCTAssertFalse(DebugConfig.highlightRedraws)
    }
    
    func testDebugConfigurationToggling() {
        // Test enabling debug features
        DebugConfig.showStateInspector = true
        DebugConfig.logStateChanges = true
        DebugConfig.showPerformanceMetrics = true
        DebugConfig.highlightRedraws = true
        
        XCTAssertTrue(DebugConfig.showStateInspector)
        XCTAssertTrue(DebugConfig.logStateChanges)
        XCTAssertTrue(DebugConfig.showPerformanceMetrics)
        XCTAssertTrue(DebugConfig.highlightRedraws)
    }
    
    // MARK: - Debug Console Tests
    
    func testDebugConsoleLogging() {
        let console = DebugConsole.shared
        console.clear()
        
        // Test logging different levels
        console.log("Test info message", level: .info, component: "TestComponent")
        console.log("Test warning message", level: .warning, component: "TestComponent")
        console.log("Test error message", level: .error, component: "TestComponent")
        
        XCTAssertEqual(console.logs.count, 3)
        
        let infoLog = console.logs[0]
        XCTAssertEqual(infoLog.message, "Test info message")
        XCTAssertEqual(infoLog.level, .info)
        XCTAssertEqual(infoLog.component, "TestComponent")
        
        let warningLog = console.logs[1]
        XCTAssertEqual(warningLog.level, .warning)
        
        let errorLog = console.logs[2]
        XCTAssertEqual(errorLog.level, .error)
    }
    
    func testDebugConsoleLogLimit() {
        let console = DebugConsole.shared
        console.clear()
        
        // Add more than 100 logs
        for i in 0..<150 {
            console.log("Log message \(i)", level: .info)
        }
        
        // Should keep only last 100
        XCTAssertEqual(console.logs.count, 100)
        
        // First log should be message 50 (0-49 removed)
        XCTAssertEqual(console.logs.first?.message, "Log message 50")
        XCTAssertEqual(console.logs.last?.message, "Log message 149")
    }
    
    func testGlobalDebugFunctions() {
        let console = DebugConsole.shared
        console.clear()
        
        // Test global debug functions
        debugLog("Info message", component: "TestComponent")
        debugWarning("Warning message", component: "TestComponent")
        debugError("Error message", component: "TestComponent")
        debugInfo("Another info message", component: "TestComponent")
        
        XCTAssertEqual(console.logs.count, 4)
        XCTAssertEqual(console.logs[0].level, .info)
        XCTAssertEqual(console.logs[1].level, .warning)
        XCTAssertEqual(console.logs[2].level, .error)
        XCTAssertEqual(console.logs[3].level, .info)
    }
    
    // MARK: - Performance Monitoring Tests
    
    func testPreviewPerformanceConfig() {
        // Test default configuration
        #if DEBUG
        XCTAssertTrue(PreviewPerformanceConfig.isEnabled)
        #else
        XCTAssertFalse(PreviewPerformanceConfig.isEnabled)
        #endif
        
        XCTAssertTrue(PreviewPerformanceConfig.showMetricsOverlay)
        XCTAssertTrue(PreviewPerformanceConfig.trackMemoryUsage)
        XCTAssertTrue(PreviewPerformanceConfig.logSlowPreviews)
        XCTAssertEqual(PreviewPerformanceConfig.slowPreviewThreshold, 0.016, accuracy: 0.001)
        XCTAssertEqual(PreviewPerformanceConfig.memoryWarningThreshold, 100.0, accuracy: 0.1)
    }
    
    func testPreviewMetrics() {
        let metrics = PreviewMetrics()
        
        // Test initial state
        XCTAssertEqual(metrics.renderCount, 0)
        XCTAssertEqual(metrics.currentFPS, 0, accuracy: 0.1)
        XCTAssertEqual(metrics.averageRenderTime, 0, accuracy: 0.001)
        XCTAssertEqual(metrics.memoryUsage, 0, accuracy: 0.1)
        XCTAssertEqual(metrics.stateUpdateCount, 0)
        
        // Test recording renders
        metrics.recordRender(duration: 0.016)
        metrics.recordRender(duration: 0.020)
        metrics.recordRender(duration: 0.012)
        
        XCTAssertEqual(metrics.renderCount, 3)
        XCTAssertGreaterThan(metrics.averageRenderTime, 0)
        
        // Test state updates
        metrics.recordStateUpdate()
        metrics.recordStateUpdate()
        
        XCTAssertEqual(metrics.stateUpdateCount, 2)
    }
    
    func testBenchmarkResult() {
        let result = BenchmarkResult(
            previewName: "TestPreview",
            iterations: 100,
            averageRenderTime: 0.010,
            minRenderTime: 0.008,
            maxRenderTime: 0.015,
            totalTime: 1.0
        )
        
        XCTAssertEqual(result.previewName, "TestPreview")
        XCTAssertEqual(result.iterations, 100)
        XCTAssertTrue(result.isPerformant) // 0.010 < 0.016
        XCTAssertEqual(result.performanceGrade, "A (Good)")
        
        // Test slow performance
        let slowResult = BenchmarkResult(
            previewName: "SlowPreview",
            iterations: 50,
            averageRenderTime: 0.040,
            minRenderTime: 0.030,
            maxRenderTime: 0.050,
            totalTime: 2.0
        )
        
        XCTAssertFalse(slowResult.isPerformant)
        XCTAssertEqual(slowResult.performanceGrade, "C (Slow)")
    }
    
    // MARK: - State Change Tracking Tests
    
    func testStateChangeTypes() {
        let initType = StateChangeType.initialization
        let updateType = StateChangeType.update
        let actionType = StateChangeType.userAction
        let systemType = StateChangeType.systemEvent
        let errorType = StateChangeType.error
        
        XCTAssertEqual(initType.rawValue, "INIT")
        XCTAssertEqual(updateType.rawValue, "UPDATE")
        XCTAssertEqual(actionType.rawValue, "ACTION")
        XCTAssertEqual(systemType.rawValue, "SYSTEM")
        XCTAssertEqual(errorType.rawValue, "ERROR")
        
        // Test colors are assigned
        XCTAssertNotEqual(initType.color, updateType.color)
        XCTAssertNotEqual(actionType.color, errorType.color)
    }
    
    // MARK: - View Modifier Tests
    
    func testDebugViewModifiers() {
        let testView = Text("Test")
        
        // Test that modifiers can be applied without crashing
        let debuggedView = testView
            .debugInspector(componentName: "TestView")
            .debugPerformance(componentName: "TestView")
            .debugRedraws()
            .debugComponent(name: "TestView")
        
        // Verify the view can be rendered (basic smoke test)
        let hostingController = NSHostingController(rootView: debuggedView)
        XCTAssertNotNil(hostingController.view)
    }
    
    // MARK: - Integration Tests
    
    func testDebugToolsIntegration() {
        // Enable all debug features
        DebugConfig.showStateInspector = true
        DebugConfig.logStateChanges = true
        DebugConfig.showPerformanceMetrics = true
        DebugConfig.highlightRedraws = true
        
        PreviewPerformanceConfig.showMetricsOverlay = true
        PreviewPerformanceConfig.trackMemoryUsage = true
        
        // Create a view with all debug features
        let testView = VStack {
            Text("Debug Test")
            Button("Test Button") { }
        }
        .debugComponent(name: "IntegrationTest")
        .previewPerformance(name: "IntegrationTest")
        
        // Verify the view can be rendered
        let hostingController = NSHostingController(rootView: testView)
        XCTAssertNotNil(hostingController.view)
        
        // Test logging
        debugLog("Integration test message", component: "IntegrationTest")
        XCTAssertGreaterThan(DebugConsole.shared.logs.count, 0)
    }
    
    // MARK: - Performance Tests
    
    func testPerformanceMonitoringOverhead() {
        // Measure performance impact of debug tools
        let testView = VStack {
            ForEach(0..<100, id: \.self) { i in
                Text("Item \(i)")
            }
        }
        
        // Measure without debug tools
        measure {
            let _ = NSHostingController(rootView: testView)
        }
        
        // Measure with debug tools (should not significantly impact performance)
        let debugView = testView.debugComponent(name: "PerformanceTest")
        
        measure {
            let _ = NSHostingController(rootView: debugView)
        }
    }
    
    // MARK: - Error Handling Tests
    
    func testDebugToolsWithDisabledConfig() {
        // Disable debug tools
        DebugConfig.isEnabled = false
        
        let console = DebugConsole.shared
        console.clear()
        
        // Logging should be ignored when disabled
        debugLog("This should be ignored")
        XCTAssertEqual(console.logs.count, 0)
        
        // Views should still render without debug features
        let testView = Text("Test").debugComponent(name: "DisabledTest")
        let hostingController = NSHostingController(rootView: testView)
        XCTAssertNotNil(hostingController.view)
    }
}