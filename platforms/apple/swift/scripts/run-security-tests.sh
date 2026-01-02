#!/bin/bash

# Swift Security Testing Script
# Runs all security checks locally before committing

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SWIFT_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

echo "🔒 Swift Security Testing"
echo "========================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "OK" ]; then
        echo -e "${GREEN}✓${NC} $message"
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠${NC} $message"
    else
        echo -e "${RED}✗${NC} $message"
    fi
}

# Check if SwiftLint is installed
check_swiftlint() {
    echo "1️⃣  Checking SwiftLint..."
    if command -v swiftlint &> /dev/null; then
        print_status "OK" "SwiftLint is installed"
        swiftlint version
    else
        print_status "FAIL" "SwiftLint is not installed"
        echo "   Install with: brew install swiftlint"
        exit 1
    fi
    echo ""
}

# Run SwiftLint
run_swiftlint() {
    echo "2️⃣  Running SwiftLint..."
    cd "$PROJECT_ROOT"

    if swiftlint lint --config .swiftlint.yml --strict; then
        print_status "OK" "SwiftLint passed"
    else
        print_status "FAIL" "SwiftLint failed"
        echo "   Fix issues before committing"
        exit 1
    fi
    echo ""
}

# Run package-specific SwiftLint
run_swiftlint_packages() {
    echo "3️⃣  Running SwiftLint on Swift packages..."
    cd "$SWIFT_DIR"

    if swiftlint lint --config .swiftlint.yml --strict; then
        print_status "OK" "Package SwiftLint passed"
    else
        print_status "WARN" "Package SwiftLint found issues"
    fi
    echo ""
}

# Run security tests
run_security_tests() {
    echo "4️⃣  Running security tests..."
    cd "$SWIFT_DIR"

    # Check if security tests directory exists
    if [ ! -d "SecurityTests" ]; then
        print_status "WARN" "Security tests not found"
        echo "   Skipping security tests"
        echo ""
        return
    fi

    # Run tests with coverage
    if swift test --enable-code-coverage --filter SecurityTest; then
        print_status "OK" "Security tests passed"
    else
        print_status "FAIL" "Security tests failed"
        echo "   Fix failing tests before committing"
        exit 1
    fi
    echo ""
}

# Generate coverage report
generate_coverage() {
    echo "5️⃣  Generating coverage report..."
    cd "$SWIFT_DIR"

    # Find profdata file
    PROFDATA=$(find . -name "*.profdata" | head -1)
    if [ -z "$PROFDATA" ]; then
        print_status "WARN" "No coverage data found"
        echo ""
        return
    fi

    # Find swiftmodule files
    SWIFTMODULES=$(find .build -name "*.swiftmodule" -path "*/.build/*" | tr '\n' ' ')

    # Generate text report
    if xcrun llvm-cov report $PROFDATA $SWIFTMODULES > security-coverage.txt 2>/dev/null; then
        print_status "OK" "Coverage report generated: security-coverage.txt"

        # Extract coverage percentage
        COVERAGE=$(grep "TOTAL" security-coverage.txt | awk '{print $NF}' | sed 's/%//')
        echo "   Total coverage: ${COVERAGE}%"

        # Check threshold
        if (( $(echo "$COVERAGE < 80" | bc -l 2>/dev/null || echo 0) )); then
            print_status "WARN" "Coverage below 80% threshold"
        else
            print_status "OK" "Coverage meets 80% threshold"
        fi
    else
        print_status "WARN" "Could not generate coverage report"
    fi

    # Generate LCOV report
    if xcrun llvm-cov export $PROFDATA $SWIFTMODULES --format=lcov > security-coverage.lcov 2>/dev/null; then
        print_status "OK" "LCOV report generated: security-coverage.lcov"
    fi

    echo ""
}

# Check for common security issues
security_audit() {
    echo "6️⃣  Running security audit..."

    local issues=0

    # Check for hardcoded secrets
    if grep -r "password.*=.*\"" "$SWIFT_DIR"/Sources --include="*.swift" | grep -v "// *password" > /dev/null 2>&1; then
        print_status "WARN" "Possible hardcoded passwords found"
        ((issues++))
    fi

    # Check for insecure URLs
    if grep -r "URL(.*http://" "$SWIFT_DIR"/Sources --include="*.swift" > /dev/null 2>&1; then
        print_status "WARN" "Insecure HTTP URLs found"
        ((issues++))
    fi

    # Check for force unwrapping
    FORCE_UNWRAPS=$(grep -r "!" "$SWIFT_DIR"/Sources --include="*.swift" | wc -l | xargs)
    if [ "$FORCE_UNWRAPS" -gt 0 ]; then
        print_status "WARN" "Found $FORCE_UNWRAPS force unwraps"
        ((issues++))
    fi

    # Check for UserDefaults usage with sensitive keys
    if grep -r "UserDefaults.*password\|UserDefaults.*token\|UserDefaults.*secret\|UserDefaults.*credential" "$SWIFT_DIR"/Sources --include="*.swift" > /dev/null 2>&1; then
        print_status "WARN" "Possible sensitive data in UserDefaults"
        ((issues++))
    fi

    if [ $issues -eq 0 ]; then
        print_status "OK" "No security issues found"
    else
        print_status "WARN" "Found $issues potential security issues"
    fi

    echo ""
}

# Main execution
main() {
    check_swiftlint
    run_swiftlint
    run_swiftlint_packages
    run_security_tests
    generate_coverage
    security_audit

    echo "========================"
    echo "✅ Security checks complete!"
    echo ""
    echo "Next steps:"
    echo "  - Review any warnings above"
    echo "  - Fix any failures before committing"
    echo "  - Check coverage reports in: $SWIFT_DIR"
    echo ""
    echo "CI will run:"
    echo "  - SwiftLint (blocks merge on errors)"
    echo "  - CodeQL security analysis"
    echo "  - Dependency vulnerability scan"
    echo "  - Security tests (≥80% coverage required)"
}

# Run main function
main
