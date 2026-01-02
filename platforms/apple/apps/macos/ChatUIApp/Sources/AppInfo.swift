import Foundation

/// App metadata helpers sourced from the bundle.
enum AppInfo {
    /// Display name for window titles and UI chrome.
    static var displayName: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleDisplayName") as? String
            ?? Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String
            ?? "ChatUI"
    }

    /// Short version string with build number if available.
    static var versionString: String {
        let shortVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0.0.0"
        let buildVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "0"
        if shortVersion == buildVersion || buildVersion == "0" {
            return shortVersion
        }
        return "\(shortVersion) (\(buildVersion))"
    }
}
