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
        print_status "Build completed successfully!"
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