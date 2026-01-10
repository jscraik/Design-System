// swift-tools-version: 5.9
// Version: 0.0.0
import PackageDescription

let package = Package(
    name: "AStudioSystemIntegration",
    platforms: [
        .macOS(.v13),
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "AStudioSystemIntegration",
            targets: ["AStudioSystemIntegration"]
        )
    ],
    dependencies: [
        // CryptoKit is part of the standard library on supported platforms
        // No external dependencies needed
    ],
    targets: [
        .target(
            name: "AStudioSystemIntegration",
            dependencies: [],
            linkerSettings: [
                .linkedFramework("CryptoKit")
            ]
        ),
        .testTarget(
            name: "AStudioSystemIntegrationTests",
            dependencies: ["AStudioSystemIntegration"]
        )
    ]
)
