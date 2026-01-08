# Swift CI/CD Security Scanning Setup

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Overview and essential workflows for this area
- Non-scope: Deep API reference or internal design rationale
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [What's Been Created](#whats-been-created)
  - [1. SwiftLint Configuration (`.swiftlint.yml`)](#1-swiftlint-configuration-swiftlintyml)
  - [2. CodeQL Configuration (`.github/codeql-config.yml`)](#2-codeql-configuration-githubcodeql-configyml)
  - [3. GitHub Actions Workflow (`.github/workflows/swift-security.yml`)](#3-github-actions-workflow-githubworkflowsswift-securityyml)
  - [4. Security Test Suite](#4-security-test-suite)
  - [5. Documentation](#5-documentation)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
  - [1. Run Security Tests Locally](#1-run-security-tests-locally)
  - [2. Run SwiftLint Locally](#2-run-swiftlint-locally)
  - [3. Run CodeQL Locally](#3-run-codeql-locally)
- [CI/CD Integration](#cicd-integration)
  - [Automatic Triggers](#automatic-triggers)
  - [Security Gates](#security-gates)
  - [Viewing Results](#viewing-results)
- [Customization](#customization)
  - [Adjusting SwiftLint Rules](#adjusting-swiftlint-rules)
  - [Adjusting CodeQL Queries](#adjusting-codeql-queries)
  - [Adding Security Tests](#adding-security-tests)
- [Coverage Requirements](#coverage-requirements)
- [Troubleshooting](#troubleshooting)
  - [SwiftLint Not Found](#swiftlint-not-found)
  - [CodeQL Not Found](#codeql-not-found)
  - [Tests Failing Locally](#tests-failing-locally)
  - [Coverage Below Threshold](#coverage-below-threshold)
- [Next Steps](#next-steps)
- [Support](#support)
- [License](#license)


This document provides an overview of the complete security scanning setup for the Swift codebase, including all configuration files, workflows, and testing infrastructure.

## What's Been Created

### 1. SwiftLint Configuration (`.swiftlint.yml`)

**Location:** Root directory

**Features:**
- Security-focused rules enabled
- Custom rules for detecting:
  - Hardcoded credentials
  - Insecure URLs (HTTP vs HTTPS)
  - Print statements in production code
  - Insecure random functions
  - Sensitive data in UserDefaults
  - Weak cryptographic algorithms
  - SQL injection patterns
  - Dynamic code execution
- Strict error enforcement for force unwrap/try/cast
- Configured for GitHub Actions logging output

**Key Security Rules:**
```yaml
custom_rules:
  no_hardcoded_credentials:
    severity: error
  no_insecure_urls:
    severity: warning
  no_user_defaults_for_sensitive:
    severity: error
  no_weak_crypto:
    severity: error
```

### 2. CodeQL Configuration (`.github/codeql-config.yml`)

**Location:** `.github/`

**Features:**
- Swift-specific security queries enabled
- Scans Swift packages and apps
- Excludes test files from scanning
- Checks for:
  - Tainted flow vulnerabilities
  - Unsafe code patterns
  - Weak cryptography
  - Injection vulnerabilities
  - XSS vulnerabilities
  - Path traversal

**Query Suites:**
- `security-extended`
- `security-and-quality`

### 3. GitHub Actions Workflow (`.github/workflows/swift-security.yml`)

**Location:** `.github/workflows/`

**Triggers:**
- Pull requests (Swift code changes)
- Pushes to main/master
- Daily scheduled runs (2 AM UTC)
- Manual workflow dispatch

**Jobs:**

#### A. SwiftLint Security Analysis
- Caches SwiftLint installation
- Runs strict linting with security rules
- Generates JSON reports
- Comments on PRs with results
- Uploads artifacts (30-day retention)

#### B. CodeQL Security Analysis
- Initializes CodeQL for Swift
- Builds all Swift packages
- Runs automated security queries
- Uploads results to GitHub Security tab
- Supports security-and-quality query suite

#### C. Dependency Security Scan
- Installs Swift Package Audit
- Scans all Package.resolved files
- Generates dependency reports
- Checks for known vulnerabilities

#### D. Security Test Suite
- Runs all security-focused tests
- Enforces 80% coverage threshold
- Generates coverage reports (LCOV format)
- Uploads coverage artifacts

#### E. Security Gate
- Aggregates all job results
- Fails if ANY security check fails
- Generates summary in GitHub Actions UI
- Blocks merge on security failures

### 4. Security Test Suite

**Location:** `platforms/apple/swift/SecurityTests/`

**Test Files:**

#### A. `SecurityTestCase.swift`
Base class providing:
- Common assertion helpers:
  - `assertStringSanitized()`
  - `assertURLSecure()`
  - `assertNoSensitiveDataLogged()`
  - `assertInputValidated()`
- Test data generators:
  - `generateMaliciousStrings()`
  - `generateValidStrings()`
  - `generateEdgeCases()`

#### B. `InputValidationTests.swift`
Tests for:
- XSS prevention
- SQL injection prevention
- Path traversal prevention
- Email validation
- URL validation
- Numeric input validation
- Length validation
- File extension validation
- JSON validation

#### C. `AuthenticationTests.swift`
Tests for:
- Password hashing (salted, non-reversible)
- Password complexity requirements
- Secure token generation
- Token storage (Keychain vs UserDefaults)
- Session management and expiry
- Session invalidation
- Rate limiting on failed attempts
- Account lockout policies
- Keychain usage verification

#### D. `AuthorizationTests.swift`
Tests for:
- Role-based access control (RBAC)
- Resource ownership checks
- Privilege escalation prevention
- API endpoint protection
- Data isolation between users
- Sensitive data access control
- CSRF token validation
- State-changing operation protection

### 5. Documentation

#### A. `SECURITY_TESTING_GUIDE.md`
Comprehensive guide covering:
- Overview of security testing framework
- Running security tests locally
- Writing security tests
- CI/CD integration details
- Common testing patterns
- Best practices
- Common vulnerabilities and prevention

#### B. `SECURITY_SETUP_README.md` (this file)
Setup overview and quick reference

## File Structure

```
chatui/
├── .swiftlint.yml                           # Root SwiftLint config
├── .github/
│   ├── codeql-config.yml                    # CodeQL configuration
│   └── workflows/
│       └── swift-security.yml               # Security scanning workflow
└── platforms/apple/swift/
    ├── .swiftlint.yml                       # Package-specific SwiftLint
    ├── SecurityTests/
    │   ├── SecurityTestCase.swift           # Base test class
    │   ├── InputValidationTests.swift       # Input validation tests
    │   ├── AuthenticationTests.swift        # Authentication tests
    │   ├── AuthorizationTests.swift         # Authorization tests
    │   └── README.md                        # Test documentation
    └── SECURITY_TESTING_GUIDE.md            # Comprehensive guide
```

## Quick Start

### 1. Run Security Tests Locally

```bash
# Navigate to Swift packages
cd platforms/apple/swift

# Run all security tests
swift test --filter SecurityTest

# Run with coverage
swift test --enable-code-coverage --filter SecurityTest

# Run specific test category
swift test --filter InputValidationTests
```

### 2. Run SwiftLint Locally

```bash
# Install SwiftLint
brew install swiftlint

# Run from root
swiftlint lint --config .swiftlint.yml

# Run from Swift packages
cd platforms/apple/swift
swiftlint lint --strict
```

### 3. Run CodeQL Locally

```bash
# Install CodeQL CLI
brew install codeql

# Initialize database
codeql database create /path/to/db --language=swift

# Analyze
codeql database analyze /path/to/db \
  --format=sarif-latest \
  --output=results.sarif
```

## CI/CD Integration

### Automatic Triggers

The security workflow runs automatically on:

1. **Pull Requests** - When Swift files change
2. **Pushes to Main** - On every commit to main/master
3. **Scheduled** - Daily at 2 AM UTC
4. **Manual** - Via "workflow_dispatch" in GitHub Actions UI

### Security Gates

All these checks must pass before merge:

- ✅ SwiftLint (no errors, warnings acceptable)
- ✅ CodeQL (no critical/high vulnerabilities)
- ✅ Dependency Scan (no known vulnerabilities)
- ✅ Security Tests (≥80% coverage)

### Viewing Results

1. **GitHub Actions**: Check the "Swift Security Scanning" workflow
2. **Security Tab**: CodeQL results appear in repository Security tab
3. **PR Comments**: SwiftLint results auto-comment on PRs
4. **Artifacts**: Download detailed reports from workflow runs

## Customization

### Adjusting SwiftLint Rules

Edit `.swiftlint.yml`:

```yaml
# Change severity
custom_rules:
  no_print_in_production:
    severity: error  # Change from warning to error

# Disable specific rules in certain files
excluded:
  - "*/Debug*.swift"
```

### Adjusting CodeQL Queries

Edit `.github/codeql-config.yml`:

```yaml
# Add custom query packs
packs:
  my-custom-queries:
    path: .github/codeql/queries

# Exclude specific queries
query-filters:
  - exclude:
      id: swift/unused-parameter
```

### Adding Security Tests

Create new test file in `SecurityTests/`:

```swift
final class MySecurityTests: SecurityTestCase {
    func testMySecurityCheck() {
        // Your test here
        assertStringSanitized(userInput)
    }
}
```

## Coverage Requirements

Security tests must maintain ≥80% code coverage.

This is enforced in CI via:

```yaml
- name: Check Coverage Threshold
  run: |
    coverage=$(lcov --summary security-coverage.lcov | grep "lines" | awk '{print $2}' | sed 's/%//')
    if (( $(echo "$coverage < 80" | bc -l) )); then
      echo "Security test coverage (${coverage}%) below threshold (80%)"
      exit 1
    fi
```

## Troubleshooting

### SwiftLint Not Found

```bash
brew install swiftlint
```

### CodeQL Not Found

```bash
brew install codeql
```

### Tests Failing Locally

1. Ensure dependencies are built:
   ```bash
   swift build
   ```

2. Clean build if needed:
   ```bash
   swift package clean
   ```

3. Check test output:
   ```bash
   swift test --verbose
   ```

### Coverage Below Threshold

1. Run tests with coverage:
   ```bash
   swift test --enable-code-coverage
   ```

2. Generate report:
   ```bash
   xcrun llvm-cov report $(find . -name "*.profdata")
   ```

3. Add tests for uncovered paths

## Next Steps

1. **Review and Customize**
   - Adjust SwiftLint rules to your needs
   - Customize CodeQL configuration
   - Add security tests for your specific use cases

2. **Integrate with Development**
   - Add pre-commit hook for local testing
   - Set up GitHub branch protection
   - Configure security policy in repository settings

3. **Monitor and Improve**
   - Review security scan results regularly
   - Update dependencies to fix vulnerabilities
   - Add new security tests as features are added

4. **Train Team**
   - Share `SECURITY_TESTING_GUIDE.md` with team
   - Conduct security testing workshops
   - Make security testing part of PR review checklist

## Support

For questions or issues with the security setup:

1. Check `SECURITY_TESTING_GUIDE.md` for detailed documentation
2. Review workflow logs in GitHub Actions
3. Consult tool documentation:
   - [SwiftLint](https://github.com/realm/SwiftLint)
   - [CodeQL](https://codeql.github.com/docs/)
   - [Swift Package Audit](https://github.com/mintelt/swift-package-audit)

## License

This security setup is part of the ChatUI project and follows the same license terms.

## Risks and assumptions
- Assumptions: TBD (confirm)
- Failure modes and blast radius: TBD (confirm)
- Rollback or recovery guidance: TBD (confirm)

## Verify
- TBD: Add concrete verification steps and expected results.

