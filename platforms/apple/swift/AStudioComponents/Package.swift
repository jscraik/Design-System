// swift-tools-version: 5.9
// Version: 0.0.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "AStudioComponents",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
        .visionOS(.v1)
    ],
    products: [
        .library(
            name: "AStudioComponents",
            targets: ["AStudioComponents"]
        ),
    ],
    dependencies: [
        .package(path: "../AStudioFoundation"),
        .package(path: "../AStudioThemes"),
        .package(path: "../AStudioTestSupport"),
        .package(url: "https://github.com/toastersocks/SwiftCheck.git", from: "0.13.1")
    ],
    targets: [
        .target(
            name: "AStudioComponents",
            dependencies: ["AStudioFoundation", "AStudioThemes"]
        ),
        .testTarget(
            name: "AStudioComponentsTests",
            dependencies: ["AStudioComponents", "AStudioTestSupport", "SwiftCheck"]
        ),
    ]
)
