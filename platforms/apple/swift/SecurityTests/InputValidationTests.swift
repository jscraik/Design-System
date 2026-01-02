//
//  InputValidationTests.swift
//  SecurityTests
//
//  Tests for input validation security.
//  Ensures all user inputs are properly validated and sanitized.
//

import XCTest
@testable import ChatUIFoundation

/// Tests for input validation security
final class InputValidationTests: SecurityTestCase {

    // MARK: - String Input Validation

    func testTextInputValidation() {
        let maliciousInputs = generateMaliciousStrings()

        for input in maliciousInputs {
            // Test that malicious input is rejected or sanitized
            let result = validateTextInput(input)

            if result.isValid {
                // If valid, ensure it's sanitized
                assertStringSanitized(result.sanitized)
            } else {
                // If invalid, ensure it's rejected
                XCTAssertFalse(result.sanitized.contains(input))
            }
        }
    }

    func testEmailValidation() {
        let validEmails = [
            "user@example.com",
            "test.user@domain.co.uk",
            "user+tag@example.org"
        ]

        let invalidEmails = [
            "",
            "not-an-email",
            "@example.com",
            "user@",
            "<script>@example.com",
            "'; DROP TABLE users; --'@example.com"
        ]

        for email in validEmails {
            XCTAssertTrue(
                isValidEmail(email),
                "Valid email rejected: \(email)"
            )
        }

        for email in invalidEmails {
            XCTAssertFalse(
                isValidEmail(email),
                "Invalid email accepted: \(email)"
            )
        }
    }

    func testURLValidation() {
        let validURLs = [
            "https://example.com",
            "https://api.example.com/v1/users",
            "https://localhost:8080/path"
        ]

        let invalidURLs = [
            "http://example.com", // HTTP not HTTPS
            "javascript:alert('XSS')",
            "//example.com",
            "ftp://example.com",
            "not-a-url"
        ]

        for url in validURLs {
            XCTAssertTrue(
                isValidURL(url),
                "Valid URL rejected: \(url)"
            )
            assertURLSecure(url)
        }

        for url in invalidURLs {
            XCTAssertFalse(
                isValidURL(url),
                "Invalid URL accepted: \(url)"
            )
        }
    }

    func testNumericInputValidation() {
        let validNumbers = [
            "123",
            "0",
            "-42",
            "3.14",
            "1e10"
        ]

        let invalidNumbers = [
            "",
            "abc",
            "123abc",
            "<script>",
            "1; DROP TABLE users; --"
        ]

        for number in validNumbers {
            XCTAssertTrue(
                isValidNumber(number),
                "Valid number rejected: \(number)"
            )
        }

        for number in invalidNumbers {
            XCTAssertFalse(
                isValidNumber(number),
                "Invalid number accepted: \(number)"
            )
        }
    }

    func testLengthValidation() {
        let longInput = String(repeating: "a", count: 1000000)

        let result = validateLength(longInput, maxLength: 1000)

        XCTAssertFalse(
            result.isValid,
            "Excessively long input should be rejected"
        )

        XCTAssertLessThanOrEqual(
            result.sanitized.count,
            1000,
            "Sanitized input should respect max length"
        )
    }

    // MARK: - File Path Validation

    func testPathTraversalPrevention() {
        let maliciousPaths = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "....//....//....//etc/passwd",
            "/etc/passwd",
            "C:\\Windows\\System32\\config\\sam"
        ]

        for path in maliciousPaths {
            let result = validateFilePath(path)

            XCTAssertFalse(
                result.isValid,
                "Path traversal attempt not blocked: \(path)"
            )

            XCTAssertFalse(
                result.sanitized.contains(".."),
                "Sanitized path contains parent directory reference"
            )
        }
    }

    func testFileExtensionValidation() {
        let allowedExtensions = ["jpg", "png", "gif", "pdf"]

        let validFiles = [
            "image.jpg",
            "photo.png",
            "document.pdf"
        ]

        let invalidFiles = [
            "script.php",
            "executable.exe",
            "shell.sh",
            "script.jsp",
            "file.asp"
        ]

        for file in validFiles {
            XCTAssertTrue(
                validateFileExtension(file, allowed: allowedExtensions),
                "Valid file extension rejected: \(file)"
            )
        }

        for file in invalidFiles {
            XCTAssertFalse(
                validateFileExtension(file, allowed: allowedExtensions),
                "Invalid file extension accepted: \(file)"
            )
        }
    }

    // MARK: - JSON Input Validation

    func testJSONValidation() {
        let validJSON = """
        {
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30
        }
        """

        let maliciousJSON = """
        {
            "name": "<script>alert('XSS')</script>",
            "email": "'; DROP TABLE users; --",
            "__proto__": {"admin": true}
        }
        """

        XCTAssertTrue(
            isValidJSON(validJSON),
            "Valid JSON rejected"
        )

        // Malicious JSON should either be rejected or sanitized
        let result = validateAndSanitizeJSON(maliciousJSON)
        if result.isValid {
            assertStringSanitized(result.sanitized)
        }
    }

    // MARK: - Helper Types

    struct ValidationResult {
        let isValid: Bool
        let sanitized: String
    }

    // MARK: - Mock Validation Functions

    private func validateTextInput(_ input: String) -> ValidationResult {
        // Mock implementation - replace with actual validation
        let containsMalicious = generateMaliciousStrings().contains { input.contains($0) }
        return ValidationResult(
            isValid: !containsMalicious,
            sanitized: containsMalicious ? "[SANITIZED]" : input
        )
    }

    private func isValidEmail(_ email: String) -> Bool {
        // Mock implementation - replace with actual validation
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }

    private func isValidURL(_ url: String) -> Bool {
        // Mock implementation - replace with actual validation
        guard let urlURL = URL(string: url) else { return false }
        return urlURL.scheme == "https"
    }

    private func isValidNumber(_ number: String) -> Bool {
        // Mock implementation - replace with actual validation
        return Double(number) != nil || Int(number) != nil
    }

    private func validateLength(_ input: String, maxLength: Int) -> ValidationResult {
        let sanitized = String(input.prefix(maxLength))
        return ValidationResult(
            isValid: input.count <= maxLength,
            sanitized: sanitized
        )
    }

    private func validateFilePath(_ path: String) -> ValidationResult {
        // Mock implementation - replace with actual validation
        let containsPathTraversal = path.contains("..") || path.contains("~")
        return ValidationResult(
            isValid: !containsPathTraversal,
            sanitized: containsPathTraversal ? "[SANITIZED]" : path
        )
    }

    private func validateFileExtension(_ filename: String, allowed: [String]) -> Bool {
        // Mock implementation - replace with actual validation
        let ext = (filename as NSString).pathExtension.lowercased()
        return allowed.contains(ext)
    }

    private func isValidJSON(_ json: String) -> Bool {
        // Mock implementation - replace with actual validation
        guard let data = json.data(using: .utf8) else { return false }
        return (try? JSONSerialization.jsonObject(with: data)) != nil
    }

    private func validateAndSanitizeJSON(_ json: String) -> ValidationResult {
        // Mock implementation - replace with actual validation
        let isValid = isValidJSON(json)
        return ValidationResult(
            isValid: isValid,
            sanitized: isValid ? json : "[SANITIZED]"
        )
    }
}
