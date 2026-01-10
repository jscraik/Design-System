// swift-tools-version: 5.9
// Version: 0.0.0
import PackageDescription

let package = Package(
    name: "AStudioApp",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(
            name: "AStudioApp",
            targets: ["AStudioApp"]
        )
    ],
    dependencies: [
        .package(path: "../../../swift/AStudioFoundation"),
        .package(path: "../../../swift/AStudioComponents"),
        .package(path: "../../../swift/AStudioThemes"),
        .package(path: "../../../swift/AStudioShellChatGPT"),
        .package(path: "../../../swift/AStudioMCP"),
        .package(path: "../../../swift/AStudioSystemIntegration")
    ],
    targets: [
        .executableTarget(
            name: "AStudioApp",
            dependencies: [
                "AStudioFoundation",
                "AStudioComponents",
                "AStudioThemes",
                "AStudioShellChatGPT",
                "AStudioMCP",
                "AStudioSystemIntegration"
            ],
            path: "Sources",
            resources: [
                .process("Resources/Assets.xcassets")
            ]
        ),
        .testTarget(
            name: "AStudioAppTests",
            dependencies: ["AStudioApp"],
            path: "Tests"
        )
    ]
)
