# Swift Security Testing - Quick Reference

Last updated: 2026-01-04

## Doc requirements
- Audience: Maintainers and security reviewers
- Scope: Security posture, guidance, and required practices
- Non-scope: Feature usage or product marketing
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Quick Commands](#quick-commands)
  - [Run All Security Checks](#run-all-security-checks)
  - [Run Individual Checks](#run-individual-checks)
- [CI/CD Security Gates](#cicd-security-gates)
- [File Locations](#file-locations)
- [Common Security Rules](#common-security-rules)
  - [Prohibited Patterns](#prohibited-patterns)
  - [Required Patterns](#required-patterns)
- [Test Structure](#test-structure)
- [Helper Methods](#helper-methods)
- [Coverage Threshold](#coverage-threshold)
- [Viewing Results](#viewing-results)
  - [Local](#local)
  - [CI/CD](#cicd)
- [Security Test Categories](#security-test-categories)
  - [1. Input Validation](#1-input-validation)
  - [2. Authentication](#2-authentication)
  - [3. Authorization](#3-authorization)
- [Common Vulnerabilities](#common-vulnerabilities)
- [Troubleshooting](#troubleshooting)
  - [SwiftLint fails](#swiftlint-fails)
  - [Tests fail](#tests-fail)
  - [Coverage low](#coverage-low)
- [Resources](#resources)
- [Best Practices](#best-practices)
- [Quick Checklist](#quick-checklist)


## Quick Commands

### Run All Security Checks
```bash
cd platforms/apple/swift
./scripts/run-security-tests.sh
```

### Run Individual Checks
```bash
# SwiftLint only
swiftlint lint --strict

# Security tests only
swift test --filter SecurityTest --enable-code-coverage

# Generate coverage report
xcrun llvm-cov report $(find . -name "*.profdata")
```

## CI/CD Security Gates

All must pass before merge:

1. ✅ SwiftLint - No errors
2. ✅ CodeQL - No critical/high vulnerabilities
3. ✅ Dependency Scan - No known vulnerabilities
4. ✅ Security Tests - ≥80% coverage

## File Locations

| File | Location |
|------|----------|
| Root SwiftLint | `.swiftlint.yml` |
| CodeQL Config | `.github/codeql-config.yml` |
| Security Workflow | `.github/workflows/swift-security.yml` |
| Security Tests | `platforms/apple/swift/SecurityTests/` |
| Testing Guide | `platforms/apple/swift/SECURITY_TESTING_GUIDE.md` |
| Setup Guide | `platforms/apple/swift/SECURITY_SETUP_README.md` |

## Common Security Rules

### Prohibited Patterns
- ❌ Force unwrapping: `value!`
- ❌ Force casting: `object as! Type`
- ❌ Force try: `try! function()`
- ❌ Hardcoded credentials
- ❌ HTTP URLs (use HTTPS)
- ❌ Sensitive data in UserDefaults
- ❌ Insecure random (use SystemRandomNumberGenerator)

### Required Patterns
- ✅ Proper error handling with do-catch
- ✅ Keychain for sensitive data
- ✅ HTTPS only for network calls
- ✅ Input validation and sanitization
- ✅ Password hashing (salted)

## Test Structure

```swift
final class MySecurityTests: SecurityTestCase {
    func testSecurityFeature() {
        // Arrange
        let input = generateMaliciousStrings().first!

        // Act
        let result = processInput(input)

        // Assert
        assertStringSanitized(result)
    }
}
```

## Helper Methods

```swift
// Assert input is sanitized
assertStringSanitized(input)

// Assert URL uses HTTPS
assertURLSecure(urlString)

// Assert no sensitive data in logs
assertNoSensitiveDataLogged(logMessage)

// Generate test data
let malicious = generateMaliciousStrings()
let valid = generateValidStrings()
let edgeCases = generateEdgeCases()
```

## Coverage Threshold

**Minimum**: 80%
**Target**: 95%
**Direction**: Upward only (ratchet)

## Viewing Results

### Local
```bash
# SwiftLint results
swiftlint lint --reporter json > swiftlint.json

# Coverage report
xcrun llvm-cov report $(find . -name "*.profdata")
```

### CI/CD
- GitHub Actions: "Swift Security Scanning" workflow
- Security Tab: CodeQL results
- PR Comments: SwiftLint auto-comments
- Artifacts: Download detailed reports

## Security Test Categories

### 1. Input Validation
- XSS prevention
- SQL injection prevention
- Path traversal prevention
- Email/URL validation

### 2. Authentication
- Password hashing
- Token generation
- Session management
- Rate limiting

### 3. Authorization
- Role-based access control
- Resource ownership
- Privilege escalation prevention
- CSRF protection

## Common Vulnerabilities

| Vulnerability | Prevention |
|---------------|------------|
| XSS | Sanitize all user input |
| SQL Injection | Use parameterized queries |
| Path Traversal | Validate and resolve paths |
| Hardcoded Secrets | Use environment variables/Keychain |
| Weak Crypto | Use SHA256+, bcrypt, Argon2 |
| Insecure Random | Use SystemRandomNumberGenerator |

## Troubleshooting

### SwiftLint fails
```bash
# View errors
swiftlint lint --verbose

# Auto-fix if possible
swiftlint lint --fix
```

### Tests fail
```bash
# Run with verbose output
swift test --verbose --filter SecurityTest

# Run specific test
swift test --filter testMySecurityTest
```

### Coverage low
```bash
# Generate detailed report
xcrun llvm-cov report \
  $(find . -name "*.profdata") \
  $(find . -name "*.swiftmodule" -path "*/.build/*")
```

## Resources

- Full Guide: `SECURITY_TESTING_GUIDE.md`
- Setup Guide: `SECURITY_SETUP_README.md`
- SwiftLint: https://github.com/realm/SwiftLint
- CodeQL: https://codeql.github.com/docs/

## Best Practices

1. Never trust user input
2. Always validate and sanitize
3. Use Keychain for sensitive data
4. Enforce HTTPS
5. Hash passwords properly
6. Implement rate limiting
7. Log security events (not sensitive data)
8. Follow principle of least privilege

## Quick Checklist

Before committing:
- [ ] Ran `./scripts/run-security-tests.sh`
- [ ] All SwiftLint checks pass
- [ ] All security tests pass
- [ ] Coverage ≥80%
- [ ] No hardcoded secrets
- [ ] No force unwraps in new code
- [ ] HTTPS only for URLs
- [ ] Sensitive data in Keychain

---

**Remember**: Security gates block merge on failure. No bypasses!

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

