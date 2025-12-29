import XCTest
import SwiftUI
@testable import ChatUIMCP

final class WidgetRendererTests: XCTestCase {
    
    func testCardWidgetRendering() {
        // Create card widget data
        let widgetData = WidgetData(
            type: .card,
            title: "Test Card",
            content: "Card content",
            items: nil,
            metadata: nil
        )
        
        // Create renderer
        let renderer = WidgetRenderer(widgetData: widgetData)
        
        // Verify renderer is created
        XCTAssertNotNil(renderer)
    }
    
    func testListWidgetRendering() {
        // Create list widget data
        let items = [
            WidgetItem(id: "1", title: "Item 1", subtitle: "Subtitle 1", icon: "star", action: nil),
            WidgetItem(id: "2", title: "Item 2", subtitle: "Subtitle 2", icon: "heart", action: "action2"),
            WidgetItem(id: "3", title: "Item 3", subtitle: nil, icon: nil, action: nil)
        ]
        
        let widgetData = WidgetData(
            type: .list,
            title: nil,
            content: nil,
            items: items,
            metadata: nil
        )
        
        // Create renderer
        let renderer = WidgetRenderer(widgetData: widgetData)
        
        // Verify renderer is created
        XCTAssertNotNil(renderer)
    }
    
    func testChartWidgetRendering() {
        // Create chart widget data
        let widgetData = WidgetData(
            type: .chart,
            title: "Chart Title",
            content: nil,
            items: nil,
            metadata: nil
        )
        
        // Create renderer
        let renderer = WidgetRenderer(widgetData: widgetData)
        
        // Verify renderer is created
        XCTAssertNotNil(renderer)
    }
    
    func testTableWidgetRendering() {
        // Create table widget data
        let items = [
            WidgetItem(id: "1", title: "Row 1", subtitle: "Value 1", icon: nil, action: nil),
            WidgetItem(id: "2", title: "Row 2", subtitle: "Value 2", icon: nil, action: nil)
        ]
        
        let widgetData = WidgetData(
            type: .table,
            title: "Table Title",
            content: nil,
            items: items,
            metadata: nil
        )
        
        // Create renderer
        let renderer = WidgetRenderer(widgetData: widgetData)
        
        // Verify renderer is created
        XCTAssertNotNil(renderer)
    }
    
    func testCustomWidgetRendering() {
        // Create custom widget data
        let widgetData = WidgetData(
            type: .custom,
            title: "Custom Widget",
            content: "Custom content",
            items: nil,
            metadata: nil
        )
        
        // Create renderer
        let renderer = WidgetRenderer(widgetData: widgetData)
        
        // Verify renderer is created
        XCTAssertNotNil(renderer)
    }
    
    func testWidgetWithMetadata() {
        // Create widget data with metadata
        let metadata: [String: AnyCodable] = [
            "key1": AnyCodable("value1"),
            "key2": AnyCodable(42),
            "key3": AnyCodable(true)
        ]
        
        let widgetData = WidgetData(
            type: .card,
            title: "Widget with Metadata",
            content: nil,
            items: nil,
            metadata: metadata
        )
        
        // Create renderer
        let renderer = WidgetRenderer(widgetData: widgetData)
        
        // Verify renderer is created
        XCTAssertNotNil(renderer)
    }
    
    func testEmptyListWidget() {
        // Create list widget with no items
        let widgetData = WidgetData(
            type: .list,
            title: "Empty List",
            content: nil,
            items: [],
            metadata: nil
        )
        
        // Create renderer
        let renderer = WidgetRenderer(widgetData: widgetData)
        
        // Verify renderer is created
        XCTAssertNotNil(renderer)
    }
    
    func testWidgetItemWithAllProperties() {
        // Create widget item with all properties
        let item = WidgetItem(
            id: "test-id",
            title: "Test Title",
            subtitle: "Test Subtitle",
            icon: "star.fill",
            action: "test_action"
        )
        
        // Verify properties
        XCTAssertEqual(item.id, "test-id")
        XCTAssertEqual(item.title, "Test Title")
        XCTAssertEqual(item.subtitle, "Test Subtitle")
        XCTAssertEqual(item.icon, "star.fill")
        XCTAssertEqual(item.action, "test_action")
    }
    
    func testWidgetItemWithMinimalProperties() {
        // Create widget item with minimal properties
        let item = WidgetItem(
            id: "test-id",
            title: "Test Title",
            subtitle: nil,
            icon: nil,
            action: nil
        )
        
        // Verify properties
        XCTAssertEqual(item.id, "test-id")
        XCTAssertEqual(item.title, "Test Title")
        XCTAssertNil(item.subtitle)
        XCTAssertNil(item.icon)
        XCTAssertNil(item.action)
    }

    func testStructuredResultRendering() {
        let result = MCPToolCallResult(
            content: [],
            structuredContent: [
                "title": AnyCodable("Structured Widget"),
                "count": AnyCodable(3)
            ],
            isError: nil,
            _meta: nil
        )

        let renderer = WidgetRenderer(result: result)
        XCTAssertNotNil(renderer)
    }
}
