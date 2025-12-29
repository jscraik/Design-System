// swift-tools-version: 5.9
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
    dependencies: [],
    targets: [
        .target(
            name: "ChatUISystemIntegration",
            dependencies: []
        ),
        .testTarget(
            name: "ChatUISystemIntegrationTests",
            dependencies: ["ChatUISystemIntegration"]
        )
    ]
)
