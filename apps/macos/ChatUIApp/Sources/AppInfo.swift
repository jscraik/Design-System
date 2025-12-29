import Foundation

enum AppInfo {
    static var displayName: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleDisplayName") as? String
            ?? Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String
            ?? "ChatUI"
    }

    static var versionString: String {
        let shortVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0.0.0"
        let buildVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "0"
        if shortVersion == buildVersion || buildVersion == "0" {
            return shortVersion
        }
        return "\(shortVersion) (\(buildVersion))"
    }
}
