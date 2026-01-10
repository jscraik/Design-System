// swift-tools-version: 5.9
// Version: 0.0.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "AStudioThemes",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "AStudioThemes",
            targets: ["AStudioThemes"]
        ),
    ],
    dependencies: [
        .package(path: "../AStudioFoundation")
    ],
    targets: [
        .target(
            name: "AStudioThemes",
            dependencies: ["AStudioFoundation"]
        ),
        .testTarget(
            name: "AStudioThemesTests",
            dependencies: ["AStudioThemes"]
        ),
    ]
)