// swift-tools-version: 5.9
// Version: 0.0.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "AStudioShellChatGPT",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "AStudioShellChatGPT",
            targets: ["AStudioShellChatGPT"]
        ),
    ],
    dependencies: [
        .package(path: "../AStudioFoundation"),
        .package(path: "../AStudioComponents"),
        .package(path: "../AStudioThemes"),
        .package(path: "../AStudioTestSupport")
    ],
    targets: [
        .target(
            name: "AStudioShellChatGPT",
            dependencies: ["AStudioFoundation", "AStudioComponents", "AStudioThemes"]
        ),
        .testTarget(
            name: "AStudioShellChatGPTTests",
            dependencies: ["AStudioShellChatGPT", "AStudioTestSupport"]
        ),
    ]
)
