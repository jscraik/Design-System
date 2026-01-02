// swift-tools-version: 5.9
// Version: 0.0.0
import PackageDescription

let package = Package(
    name: "ChatUISystemIntegration",
    platforms: [
        .macOS(.v13),
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "ChatUISystemIntegration",
            targets: ["ChatUISystemIntegration"]
        )
    ],
    dependencies: [
        // CryptoKit is part of the standard library on supported platforms
        // No external dependencies needed
    ],
    targets: [
        .target(
            name: "ChatUISystemIntegration",
            dependencies: [],
            linkerSettings: [
                .linkedFramework("CryptoKit")
            ]
        ),
        .testTarget(
            name: "ChatUISystemIntegrationTests",
            dependencies: ["ChatUISystemIntegration"]
        )
    ]
)
