// swift-tools-version: 5.9
// Version: 0.0.0
import PackageDescription

let package = Package(
    name: "AStudioMCP",
    platforms: [
        .macOS(.v13),
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "AStudioMCP",
            targets: ["AStudioMCP"]
        )
    ],
    dependencies: [
        .package(path: "../AStudioFoundation"),
        .package(path: "../AStudioComponents")
    ],
    targets: [
        .target(
            name: "AStudioMCP",
            dependencies: [
                "AStudioFoundation",
                "AStudioComponents"
            ]
        ),
        .testTarget(
            name: "AStudioMCPTests",
            dependencies: ["AStudioMCP"]
        )
    ]
)
