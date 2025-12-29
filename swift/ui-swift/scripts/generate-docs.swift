#!/usr/bin/env swift

import Foundation

/**
 * Swift Documentation Generator for ChatUISwift Components
 * 
 * This script analyzes Swift source files and generates comprehensive documentation
 * including component APIs, usage examples, and accessibility features.
 */

struct ComponentDocumentation {
    let name: String
    let description: String
    let properties: [PropertyDoc]
    let methods: [MethodDoc]
    let examples: [ExampleDoc]
    let accessibility: AccessibilityDoc?
    let filePath: String
}

struct PropertyDoc {
    let name: String
    let type: String
    let description: String
    let defaultValue: String?
    let isRequired: Bool
}

struct MethodDoc {
    let name: String
    let signature: String
    let description: String
    let parameters: [ParameterDoc]
    let returnType: String?
}

struct ParameterDoc {
    let name: String
    let type: String
    let description: String
}

struct ExampleDoc {
    let title: String
    let code: String
    let description: String
}

struct AccessibilityDoc {
    let features: [String]
    let voiceOverSupport: String
    let keyboardNavigation: String
    let highContrast: String
}

class DocumentationGenerator {
    private let sourcePath: String
    private let outputPath: String
    
    init(sourcePath: String, outputPath: String) {
        self.sourcePath = sourcePath
        self.outputPath = outputPath
    }
    
    func generate() throws {
        print("📚 Generating component documentation...")
        
        let components = try analyzeComponents()
        let markdown = generateMarkdown(for: components)
        
        try writeDocumentation(markdown)
        
        print("✅ Documentation generated at \(outputPath)")
        print("   Components documented: \(components.count)")
    }
    
    private func analyzeComponents() throws -> [ComponentDocumentation] {
        let fileManager = FileManager.default
        let componentsPath = "\(sourcePath)/Sources/ChatUISwift/Components"
        
        guard fileManager.fileExists(atPath: componentsPath) else {
            throw DocumentationError.componentsDirectoryNotFound(componentsPath)
        }
        
        let files = try fileManager.contentsOfDirectory(atPath: componentsPath)
        let swiftFiles = files.filter { $0.hasSuffix(".swift") }
        
        var components: [ComponentDocumentation] = []
        
        for file in swiftFiles {
            let filePath = "\(componentsPath)/\(file)"
            if let component = try analyzeComponent(at: filePath) {
                components.append(component)
            }
        }
        
        return components.sorted { $0.name < $1.name }
    }
    
    private func analyzeComponent(at filePath: String) throws -> ComponentDocumentation? {
        let content = try String(contentsOfFile: filePath, encoding: .utf8)
        let lines = content.components(separatedBy: .newlines)
        
        // Extract component name from file
        let fileName = URL(fileURLWithPath: filePath).lastPathComponent
        let componentName = String(fileName.dropLast(6)) // Remove ".swift"
        
        // Parse component structure
        let properties = extractProperties(from: lines)
        let methods = extractMethods(from: lines)
        let examples = extractExamples(from: lines)
        let accessibility = extractAccessibility(from: lines)
        let description = extractDescription(from: lines, componentName: componentName)
        
        return ComponentDocumentation(
            name: componentName,
            description: description,
            properties: properties,
            methods: methods,
            examples: examples,
            accessibility: accessibility,
            filePath: filePath
        )
    }
    
    private func extractProperties(from lines: [String]) -> [PropertyDoc] {
        var properties: [PropertyDoc] = []
        
        for (index, line) in lines.enumerated() {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            
            // Look for property declarations
            if trimmed.contains("@State") || trimmed.contains("@Binding") || trimmed.contains("let ") || trimmed.contains("var ") {
                if let property = parseProperty(line: trimmed, context: Array(lines[max(0, index-2)...min(lines.count-1, index+2)])) {
                    properties.append(property)
                }
            }
        }
        
        return properties
    }
    
    private func extractMethods(from lines: [String]) -> [MethodDoc] {
        var methods: [MethodDoc] = []
        
        for (index, line) in lines.enumerated() {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            
            // Look for function declarations
            if trimmed.contains("func ") && trimmed.contains("(") {
                if let method = parseMethod(line: trimmed, context: Array(lines[max(0, index-2)...min(lines.count-1, index+5)])) {
                    methods.append(method)
                }
            }
        }
        
        return methods
    }
    
    private func extractExamples(from lines: [String]) -> [ExampleDoc] {
        var examples: [ExampleDoc] = []
        
        // Look for #Preview blocks
        var inPreview = false
        var previewLines: [String] = []
        var previewTitle = "Basic Usage"
        
        for line in lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            
            if trimmed.contains("#Preview") {
                inPreview = true
                previewLines = []
                
                // Extract title from preview
                if let titleMatch = trimmed.range(of: "\"([^\"]+)\"", options: .regularExpression) {
                    previewTitle = String(trimmed[titleMatch]).replacingOccurrences(of: "\"", with: "")
                }
                continue
            }
            
            if inPreview {
                if trimmed == "}" && previewLines.count > 0 {
                    let code = previewLines.joined(separator: "\n")
                    examples.append(ExampleDoc(
                        title: previewTitle,
                        code: code,
                        description: "SwiftUI preview example showing \(previewTitle.lowercased())"
                    ))
                    inPreview = false
                    previewTitle = "Basic Usage"
                } else {
                    previewLines.append(line)
                }
            }
        }
        
        return examples
    }
    
    private func extractAccessibility(from lines: [String]) -> AccessibilityDoc? {
        var features: [String] = []
        var voiceOverSupport = "Standard SwiftUI accessibility"
        var keyboardNavigation = "Standard SwiftUI keyboard navigation"
        var highContrast = "Adapts to system high contrast settings"
        
        for line in lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            
            if trimmed.contains("accessibilityLabel") {
                features.append("Custom accessibility labels")
            }
            if trimmed.contains("accessibilityHint") {
                features.append("Accessibility hints for complex interactions")
            }
            if trimmed.contains("accessibilityFocusRing") {
                features.append("Custom focus ring styling")
                keyboardNavigation = "Enhanced keyboard navigation with custom focus rings"
            }
            if trimmed.contains("accessibilityHighContrast") {
                features.append("High contrast mode support")
                highContrast = "Enhanced high contrast support with custom styling"
            }
            if trimmed.contains("VoiceOver") {
                voiceOverSupport = "Enhanced VoiceOver support with custom announcements"
            }
        }
        
        if features.isEmpty {
            return nil
        }
        
        return AccessibilityDoc(
            features: features,
            voiceOverSupport: voiceOverSupport,
            keyboardNavigation: keyboardNavigation,
            highContrast: highContrast
        )
    }
    
    private func extractDescription(from lines: [String], componentName: String) -> String {
        // Look for documentation comments above the struct/class declaration
        for (index, line) in lines.enumerated() {
            if line.contains("struct \(componentName)") || line.contains("class \(componentName)") {
                // Look backwards for documentation comments
                var docLines: [String] = []
                for i in stride(from: index - 1, through: 0, by: -1) {
                    let prevLine = lines[i].trimmingCharacters(in: .whitespaces)
                    if prevLine.hasPrefix("///") {
                        let docText = prevLine.dropFirst(3).trimmingCharacters(in: .whitespaces)
                        docLines.insert(String(docText), at: 0)
                    } else if prevLine.hasPrefix("/**") || prevLine.hasPrefix("*/") {
                        continue
                    } else if !prevLine.isEmpty {
                        break
                    }
                }
                
                if !docLines.isEmpty {
                    return docLines.joined(separator: " ")
                }
                break
            }
        }
        
        return "A SwiftUI component that provides \(componentName.lowercased()) functionality with design token integration."
    }
    
    private func parseProperty(line: String, context: [String]) -> PropertyDoc? {
        // Simple property parsing - can be enhanced
        let components = line.components(separatedBy: " ")
        guard components.count >= 3 else { return nil }
        
        var name = ""
        var type = ""
        var isRequired = true
        var defaultValue: String? = nil
        
        // Extract property name and type
        for (index, component) in components.enumerated() {
            if component == "let" || component == "var" {
                if index + 1 < components.count {
                    let nameType = components[index + 1]
                    if nameType.contains(":") {
                        let parts = nameType.components(separatedBy: ":")
                        name = parts[0]
                        type = parts.count > 1 ? parts[1] : "Unknown"
                    } else {
                        name = nameType
                    }
                }
                break
            }
        }
        
        // Check for default value
        if line.contains("=") {
            isRequired = false
            if let equalIndex = line.firstIndex(of: "=") {
                defaultValue = String(line[line.index(after: equalIndex)...]).trimmingCharacters(in: .whitespaces)
            }
        }
        
        // Extract description from context
        let description = extractPropertyDescription(from: context, propertyName: name)
        
        return PropertyDoc(
            name: name,
            type: type.trimmingCharacters(in: .whitespaces),
            description: description,
            defaultValue: defaultValue,
            isRequired: isRequired
        )
    }
    
    private func parseMethod(line: String, context: [String]) -> MethodDoc? {
        // Simple method parsing - can be enhanced
        guard let funcRange = line.range(of: "func ") else { return nil }
        
        let afterFunc = String(line[funcRange.upperBound...])
        guard let parenIndex = afterFunc.firstIndex(of: "(") else { return nil }
        
        let methodName = String(afterFunc[..<parenIndex])
        let signature = line.trimmingCharacters(in: .whitespaces)
        
        // Extract return type
        var returnType: String? = nil
        if line.contains("->") {
            if let arrowRange = line.range(of: "->") {
                returnType = String(line[arrowRange.upperBound...]).trimmingCharacters(in: .whitespaces)
                if returnType?.hasSuffix("{") == true {
                    returnType = String(returnType!.dropLast()).trimmingCharacters(in: .whitespaces)
                }
            }
        }
        
        let description = extractMethodDescription(from: context, methodName: methodName)
        
        return MethodDoc(
            name: methodName,
            signature: signature,
            description: description,
            parameters: [], // Could be enhanced to parse parameters
            returnType: returnType
        )
    }
    
    private func extractPropertyDescription(from context: [String], propertyName: String) -> String {
        // Look for documentation comments above the property
        for line in context.reversed() {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            if trimmed.hasPrefix("///") {
                let docText = trimmed.dropFirst(3).trimmingCharacters(in: .whitespaces)
                if !docText.isEmpty {
                    return String(docText)
                }
            }
        }
        
        return "Property for configuring \(propertyName)"
    }
    
    private func extractMethodDescription(from context: [String], methodName: String) -> String {
        // Look for documentation comments above the method
        for line in context.reversed() {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            if trimmed.hasPrefix("///") {
                let docText = trimmed.dropFirst(3).trimmingCharacters(in: .whitespaces)
                if !docText.isEmpty {
                    return String(docText)
                }
            }
        }
        
        return "Method for \(methodName) functionality"
    }
    
    private func generateMarkdown(for components: [ComponentDocumentation]) -> String {
        var markdown = """
        # ChatUISwift Component Documentation
        
        Generated on \(ISO8601DateFormatter().string(from: Date()))
        
        This documentation provides comprehensive information about all SwiftUI components in the ChatUISwift package, including their APIs, usage examples, and accessibility features.
        
        ## Table of Contents
        
        """
        
        // Generate table of contents
        for component in components {
            markdown += "- [\(component.name)](#\(component.name.lowercased()))\n"
        }
        
        markdown += "\n---\n\n"
        
        // Generate component documentation
        for component in components {
            markdown += generateComponentMarkdown(component)
            markdown += "\n---\n\n"
        }
        
        return markdown
    }
    
    private func generateComponentMarkdown(_ component: ComponentDocumentation) -> String {
        var markdown = """
        ## \(component.name)
        
        \(component.description)
        
        **File:** `\(component.filePath.replacingOccurrences(of: sourcePath + "/", with: ""))`
        
        """
        
        // Properties section
        if !component.properties.isEmpty {
            markdown += "### Properties\n\n"
            markdown += "| Name | Type | Required | Default | Description |\n"
            markdown += "|------|------|----------|---------|-------------|\n"
            
            for property in component.properties {
                let required = property.isRequired ? "✅" : "❌"
                let defaultValue = property.defaultValue ?? "—"
                markdown += "| `\(property.name)` | `\(property.type)` | \(required) | `\(defaultValue)` | \(property.description) |\n"
            }
            markdown += "\n"
        }
        
        // Methods section
        if !component.methods.isEmpty {
            markdown += "### Methods\n\n"
            
            for method in component.methods {
                markdown += "#### `\(method.name)`\n\n"
                markdown += "\(method.description)\n\n"
                markdown += "```swift\n\(method.signature)\n```\n\n"
                
                if let returnType = method.returnType {
                    markdown += "**Returns:** `\(returnType)`\n\n"
                }
            }
        }
        
        // Examples section
        if !component.examples.isEmpty {
            markdown += "### Usage Examples\n\n"
            
            for example in component.examples {
                markdown += "#### \(example.title)\n\n"
                markdown += "\(example.description)\n\n"
                markdown += "```swift\n\(example.code)\n```\n\n"
            }
        }
        
        // Accessibility section
        if let accessibility = component.accessibility {
            markdown += "### Accessibility\n\n"
            markdown += "This component includes the following accessibility features:\n\n"
            
            for feature in accessibility.features {
                markdown += "- \(feature)\n"
            }
            
            markdown += "\n"
            markdown += "**VoiceOver Support:** \(accessibility.voiceOverSupport)\n\n"
            markdown += "**Keyboard Navigation:** \(accessibility.keyboardNavigation)\n\n"
            markdown += "**High Contrast:** \(accessibility.highContrast)\n\n"
        }
        
        return markdown
    }
    
    private func writeDocumentation(_ content: String) throws {
        let url = URL(fileURLWithPath: outputPath)
        try content.write(to: url, atomically: true, encoding: .utf8)
    }
}

enum DocumentationError: Error, LocalizedError {
    case componentsDirectoryNotFound(String)
    case fileReadError(String)
    case fileWriteError(String)
    
    var errorDescription: String? {
        switch self {
        case .componentsDirectoryNotFound(let path):
            return "Components directory not found at: \(path)"
        case .fileReadError(let path):
            return "Failed to read file at: \(path)"
        case .fileWriteError(let path):
            return "Failed to write file at: \(path)"
        }
    }
}

// CLI interface
func main() {
    let arguments = CommandLine.arguments
    
    if arguments.count < 3 {
        print("Usage: swift generate-docs.swift <source-path> <output-path>")
        print("Example: swift generate-docs.swift . docs/components.md")
        exit(1)
    }
    
    let sourcePath = arguments[1]
    let outputPath = arguments[2]
    
    do {
        let generator = DocumentationGenerator(sourcePath: sourcePath, outputPath: outputPath)
        try generator.generate()
    } catch {
        print("❌ Documentation generation failed: \(error.localizedDescription)")
        exit(1)
    }
}

main()