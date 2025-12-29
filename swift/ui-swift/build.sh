#!/bin/bash

# Build script for ChatUISwift package
# This script provides common development tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Change to package directory
cd "$(dirname "$0")"

case "$1" in
    "build")
        print_status "Building ChatUISwift package..."
        swift build
        
        # Generate documentation if in development mode
        if [ "${CHATUI_DEV_MODE:-false}" = "true" ]; then
            print_status "Generating component documentation..."
            if [ -f "scripts/generate-docs.swift" ]; then
                swift scripts/generate-docs.swift . docs/components.md
                print_status "Documentation generated at docs/components.md"
            else
                print_warning "Documentation generator not found, skipping..."
            fi
        fi
        
        print_status "Build completed successfully!"
        ;;
    "dev")
        print_status "Starting development mode with tools..."
        export CHATUI_DEV_MODE=true
        export CHATUI_PERFORMANCE_MONITORING=true
        
        # Generate initial documentation
        if [ -f "scripts/generate-docs.swift" ]; then
            print_status "Generating initial documentation..."
            swift scripts/generate-docs.swift . docs/components.md
        fi
        
        print_status "Development mode enabled!"
        print_status "  - Documentation generation: ✅"
        print_status "  - Performance monitoring: ✅"
        print_status "  - Debug tools: ✅"
        print_status ""
        print_status "Start token hot reload with: cd ../tokens && pnpm dev:hot-reload"
        print_status "Open playground: ./build.sh playground"
        ;;
    "docs")
        print_status "Generating component documentation..."
        if [ -f "scripts/generate-docs.swift" ]; then
            swift scripts/generate-docs.swift . docs/components.md
            print_status "Documentation generated at docs/components.md"
        else
            print_error "Documentation generator not found at scripts/generate-docs.swift"
            exit 1
        fi
        ;;
    "test")
        print_status "Running tests for ChatUISwift package..."
        swift test
        print_status "Tests completed successfully!"
        ;;
    "clean")
        print_status "Cleaning build artifacts..."
        swift package clean
        print_status "Clean completed!"
        ;;
    "playground")
        print_status "Opening playground app in Xcode..."
        open ../../apps/macos/ChatUIPlayground/ChatUIPlayground.xcodeproj
        ;;
    "package")
        print_status "Opening Swift package in Xcode..."
        open Package.swift
        ;;
    "help"|"")
        echo "ChatUISwift Build Script"
        echo ""
        echo "Usage: ./build.sh [command]"
        echo ""
        echo "Commands:"
        echo "  build      Build the Swift package"
        echo "  dev        Start development mode with tools"
        echo "  docs       Generate component documentation"
        echo "  test       Run package tests"
        echo "  clean      Clean build artifacts"
        echo "  playground Open playground app in Xcode"
        echo "  package    Open Swift package in Xcode"
        echo "  help       Show this help message"
        echo ""
        ;;
    *)
        print_error "Unknown command: $1"
        print_status "Run './build.sh help' for available commands"
        exit 1
        ;;
esac