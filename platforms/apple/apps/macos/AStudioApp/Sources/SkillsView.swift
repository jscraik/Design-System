import SwiftUI
import AppKit
import CryptoKit
import Foundation
import Compression
import os

private let skillsLogger = Logger(subsystem: "AStudioApp", category: "SkillsView")

struct SkillsView: View {
    @State private var state: LoadState = .idle
    @State private var slugInput: String = ""
    @State private var checksumInput: String = ""
    @State private var versionInput: String = ""
    @State private var platformSelection: SkillPlatform = .codex
    @State private var isInstalling = false
    @State private var installMessage: String?
    @State private var installError: String?
    @State private var validationMessage: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            header
            Divider()
            content
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .task {
            await load()
        }
        .refreshable {
            await load()
        }
    }

    @ViewBuilder
    private var header: some View {
        HStack {
            Text("Skills")
                .font(.title)
                .bold()
            Spacer()
            installControls
            Button {
                Task { await load() }
            } label: {
                Label("Reload", systemImage: "arrow.clockwise")
            }
            .buttonStyle(.bordered)
        }
        .padding()
    }

    @ViewBuilder
    private var installControls: some View {
        HStack(spacing: 8) {
            Picker("Platform", selection: $platformSelection) {
                ForEach(SkillPlatform.allCases, id: \.self) { platform in
                    Text(platform.rawValue).tag(platform)
                }
            }
            .pickerStyle(.menu)
            .frame(width: 150)

            TextField("Slug", text: $slugInput)
                .textFieldStyle(.roundedBorder)
                .frame(width: 160)
            TextField("Version (optional)", text: $versionInput)
                .textFieldStyle(.roundedBorder)
                .frame(width: 160)
            TextField("Checksum (required)", text: $checksumInput)
                .textFieldStyle(.roundedBorder)
                .frame(width: 200)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
            Button {
                if let paste = NSPasteboard.general.string(forType: .string) {
                    checksumInput = paste.trimmingCharacters(in: .whitespacesAndNewlines)
                }
            } label: {
                Image(systemName: "doc.on.clipboard")
            }
            .help("Paste checksum from clipboard")
            .buttonStyle(.borderless)
            Button {
                Task { await installSkill() }
            } label: {
                if isInstalling {
                    ProgressView()
                        .controlSize(.small)
                } else {
                    Label("Install/Update", systemImage: "square.and.arrow.down")
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(!canInstall)
        }
    }

    private var canInstall: Bool {
        !slugInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        checksumInputIsValid &&
        !isInstalling
    }

    @ViewBuilder
    private var content: some View {
        switch state {
        case .idle, .loading:
            ProgressView("Loading skills…")
                .padding()
        case .failed(let message):
            VStack(alignment: .leading, spacing: 8) {
                Label("Unable to load skills", systemImage: "exclamationmark.triangle")
                    .font(.headline)
                Text(message)
                    .foregroundStyle(.secondary)
                Button {
                    Task { await load() }
                } label: {
                    Text("Retry")
                }
                .buttonStyle(.bordered)
            }
            .padding()
        case .loaded(let model):
            SkillsListView(model: model, installMessage: $installMessage, installError: $installError)
        }
    }

    private func load() async {
        await MainActor.run { state = .loading }
        do {
            let model = try await SkillsModelLoader().load()
            await MainActor.run {
                withAnimation {
                    state = .loaded(model)
                    installMessage = nil
                    installError = nil
                }
            }
        } catch {
            skillsLogger.error("Skill load failed: \(String(describing: error))")
            await MainActor.run {
                state = .failed(error.localizedDescription)
            }
        }
    }

    private var checksumInputIsValid: Bool {
        let trimmed = checksumInput.trimmingCharacters(in: .whitespacesAndNewlines)
        let hexSet = CharacterSet(charactersIn: "0123456789abcdefABCDEF")
        return trimmed.count == 64 && trimmed.unicodeScalars.allSatisfy { hexSet.contains($0) }
    }

    private func installSkill() async {
        guard !slugInput.isEmpty, !checksumInput.isEmpty else { return }
        guard checksumInputIsValid else {
            validationMessage = "Checksum must be 64 hex characters."
            return
        }
        validationMessage = nil
        isInstalling = true
        installMessage = nil
        installError = nil
        do {
            try await SkillsInstaller().install(
                slug: slugInput,
                version: versionInput.isEmpty ? nil : versionInput,
                platform: platformSelection,
                checksum: checksumInput
            )
            await load()
            await MainActor.run {
                installMessage = "Installed \(slugInput) to \(platformSelection.rawValue)."
            }
        } catch {
            skillsLogger.error("Install failed: \(String(describing: error))")
            await MainActor.run {
                installError = error.localizedDescription
            }
        }
        isInstalling = false
    }
}

private enum LoadState {
    case idle
    case loading
    case failed(String)
    case loaded(SkillsModel)
}

// MARK: - List + Detail

private struct SkillsListView: View {
    let model: SkillsModel
    @Binding var installMessage: String?
    @Binding var installError: String?
    @State private var selection: Skill?

    var body: some View {
        NavigationSplitView {
            List(model.skills, selection: $selection) { skill in
                VStack(alignment: .leading, spacing: 4) {
                    Text(skill.displayName)
                        .font(.headline)
                    Text(skill.description)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    HStack(spacing: 8) {
                        Label(skill.platformLabel, systemImage: "desktopcomputer")
                            .font(.caption)
                        Text(skill.folderPath)
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                    }
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("Installed")
        } detail: {
            if let selection {
                SkillDetailView(skill: selection)
            } else {
                VStack(alignment: .leading, spacing: 8) {
                    if let installError {
                        Label(installError, systemImage: "exclamationmark.triangle")
                            .foregroundStyle(.red)
                    }
                    if let validationMessage {
                        Label(validationMessage, systemImage: "exclamationmark.triangle")
                            .foregroundStyle(.orange)
                    }
                    if let installMessage {
                        Label(installMessage, systemImage: "checkmark.circle")
                            .foregroundStyle(.green)
                    }
                    Text("Select a skill to view details")
                        .foregroundStyle(.secondary)
                }
                .padding()
            }
        }
    }
}

private struct SkillDetailView: View {
    let skill: Skill

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text(skill.displayName)
                    .font(.largeTitle.bold())
                Text(skill.folderPath)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                Divider()
                Text(skill.markdown)
                    .font(.body.monospaced())
                    .textSelection(.enabled)
            }
            .padding()
        }
        .navigationTitle(skill.displayName)
    }
}

// MARK: - Model + Loader

private struct Skill: Identifiable, Hashable {
    let id: String
    let displayName: String
    let description: String
    let folderPath: String
    let markdown: String
    let platform: SkillPlatform

    var platformLabel: String {
        platform.rawValue
    }
}

private struct SkillsModel {
    let skills: [Skill]
}

private enum SkillPlatform: String {
    case codex = "Codex"
    case claude = "Claude Code"
    case opencode = "OpenCode"
    case copilot = "GitHub Copilot"

    static var allCases: [SkillPlatform] { [.codex, .claude, .opencode, .copilot] }

    var storageKey: String {
        switch self {
        case .codex: return "codex"
        case .claude: return "claude"
        case .opencode: return "opencode"
        case .copilot: return "copilot"
        }
    }

    var relativePath: String {
        switch self {
        case .codex: return ".codex/skills/public"
        case .claude: return ".claude/skills"
        case .opencode: return ".config/opencode/skill"
        case .copilot: return ".copilot/skills"
        }
    }

    var rootURL: URL {
        FileManager.default.homeDirectoryForCurrentUser.appending(path: relativePath)
    }

    var cliArgument: String {
        switch self {
        case .codex: return "codex"
        case .claude: return "claude"
        case .opencode: return "opencode"
        case .copilot: return "copilot"
        }
    }
}

private struct SkillsModelLoader {
    func load() async throws -> SkillsModel {
        let platforms: [SkillPlatform] = [.codex, .claude, .opencode, .copilot]
        var collected: [Skill] = []

        for platform in platforms {
            let skills = try scanSkills(at: platform.rootURL, platform: platform)
            collected.append(contentsOf: skills)
        }

        collected.sort { $0.displayName.localizedCaseInsensitiveCompare($1.displayName) == .orderedAscending }
        return SkillsModel(skills: collected)
    }

    private func scanSkills(at root: URL, platform: SkillPlatform) throws -> [Skill] {
        let fm = FileManager.default
        guard fm.fileExists(atPath: root.path) else { return [] }

        let entries = try fm.contentsOfDirectory(at: root, includingPropertiesForKeys: [.isDirectoryKey], options: [.skipsHiddenFiles])
        var skills: [Skill] = []

        for entry in entries {
            let values = try entry.resourceValues(forKeys: [.isDirectoryKey])
            guard values.isDirectory == true else { continue }
            let skillFile = entry.appending(path: "SKILL.md")
            guard fm.fileExists(atPath: skillFile.path) else { continue }
            let markdown = (try? String(contentsOf: skillFile, encoding: .utf8)) ?? ""
            let meta = parseMetadata(markdown)
            let skill = Skill(
                id: "\(platform.storageKey)-\(entry.lastPathComponent)",
                displayName: meta.name ?? entry.lastPathComponent,
                description: meta.description ?? "No description available.",
                folderPath: entry.path,
                markdown: stripFrontmatter(markdown),
                platform: platform
            )
            skills.append(skill)
        }
        return skills
    }

    private func parseMetadata(_ markdown: String) -> (name: String?, description: String?) {
        let lines = markdown.split(separator: "\n", omittingEmptySubsequences: false)
        var name: String?
        var description: String?

        if lines.first?.trimmingCharacters(in: .whitespacesAndNewlines) == "---" {
            for line in lines.dropFirst() {
                let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
                if trimmed == "---" { break }
                let parts = trimmed.split(separator: ":", maxSplits: 1, omittingEmptySubsequences: false)
                guard parts.count == 2 else { continue }
                let key = parts[0].trimmingCharacters(in: .whitespacesAndNewlines)
                let value = parts[1].trimmingCharacters(in: .whitespacesAndNewlines).trimmingCharacters(in: CharacterSet(charactersIn: "\"'"))
                if key == "name" { name = value }
                if key == "description" { description = value }
            }
        }

        if name == nil || description == nil {
            // fallback to first heading and first paragraph
            var foundHeading: String?
            for line in lines {
                let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
                if foundHeading == nil, trimmed.hasPrefix("# ") {
                    foundHeading = String(trimmed.dropFirst(2))
                    continue
                }
                if description == nil, !trimmed.isEmpty, !trimmed.hasPrefix("#") {
                    description = trimmed
                    break
                }
            }
            if name == nil { name = foundHeading }
        }

        return (name, description)
    }

    private func stripFrontmatter(_ markdown: String) -> String {
        let lines = markdown.split(separator: "\n", omittingEmptySubsequences: false)
        guard lines.first?.trimmingCharacters(in: .whitespacesAndNewlines) == "---" else {
            return markdown.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        var index = 1
        while index < lines.count {
            if lines[index].trimmingCharacters(in: .whitespacesAndNewlines) == "---" {
                return lines[(index + 1)...].joined(separator: "\n").trimmingCharacters(in: .whitespacesAndNewlines)
            }
            index += 1
        }
        return markdown.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}

// MARK: - Installer that shells out to CLI with checksum enforcement

private struct SkillsInstaller {
    enum InstallError: LocalizedError {
        case cliNotFound
        case commandFailed(String)
        case badChecksum
        case downloadFailed
        case unzipFailed
        case skillNotFound

        var errorDescription: String? {
            switch self {
            case .cliNotFound:
                return "Unable to find astudio CLI. Build the CLI target first."
            case .commandFailed(let message):
                return message
            case .badChecksum:
                return "Downloaded archive checksum did not match."
            case .downloadFailed:
                return "Failed to download skill archive."
            case .unzipFailed:
                return "Failed to extract skill archive."
            case .skillNotFound:
                return "Skill archive did not contain a SKILL.md."
            }
        }
    }

    func install(slug: String, version: String?, platform: SkillPlatform, checksum: String) async throws {
        let url = buildDownloadURL(slug: slug, version: version)
        let (data, response) = try await URLSession.shared.data(from: url)
        guard (response as? HTTPURLResponse)?.statusCode ?? 500 < 400 else {
            throw InstallError.downloadFailed
        }
        guard sha256(data) == checksum.lowercased() else {
            throw InstallError.badChecksum
        }

        let tempRoot = try FileManager.default.url(
            for: .itemReplacementDirectory,
            in: .userDomainMask,
            appropriateFor: FileManager.default.temporaryDirectory,
            create: true
        )
        let zipURL = tempRoot.appending(path: "\(slug).zip")
        try data.write(to: zipURL)

        let extractURL = tempRoot.appending(path: "extract")
        try FileManager.default.createDirectory(at: extractURL, withIntermediateDirectories: true)
        try unzip(zipURL: zipURL, destination: extractURL)

        let skillRoot = try findSkillRoot(in: extractURL)
        let destinationRoot = platform.rootURL
        try FileManager.default.createDirectory(at: destinationRoot, withIntermediateDirectories: true)
        let finalURL = uniqueDestinationURL(base: destinationRoot, slug: slug)
        if FileManager.default.fileExists(atPath: finalURL.path) {
            try FileManager.default.removeItem(at: finalURL)
        }
        try FileManager.default.copyItem(at: skillRoot, to: finalURL)
        try writeOrigin(finalURL, slug: slug, version: version)

        try? FileManager.default.removeItem(at: tempRoot)
    }

    private func buildDownloadURL(slug: String, version: String?) -> URL {
        var components = URLComponents(string: "https://clawdhub.com/api/v1/download")!
        var items: [URLQueryItem] = [URLQueryItem(name: "slug", value: slug)]
        if let version, !version.isEmpty {
            items.append(URLQueryItem(name: "version", value: version))
        } else {
            items.append(URLQueryItem(name: "tag", value: "latest"))
        }
        components.queryItems = items
        return components.url!
    }

    private func unzip(zipURL: URL, destination: URL) throws {
        guard let archive = Archive(url: zipURL, accessMode: .read) else {
            throw InstallError.unzipFailed
        }

        for entry in archive {
            let entryPath = entry.path
            let destURL = destination.appending(path: entryPath)
            let standardized = destURL.standardizedFileURL
            guard standardized.path.hasPrefix(destination.standardizedFileURL.path) else {
                throw InstallError.unzipFailed
            }
            let parent = standardized.deletingLastPathComponent()
            try FileManager.default.createDirectory(at: parent, withIntermediateDirectories: true)
            try archive.extract(entry, to: standardized)
        }
    }

    private func findSkillRoot(in root: URL) throws -> URL {
        let direct = root.appending(path: "SKILL.md")
        if FileManager.default.fileExists(atPath: direct.path) {
            return root
        }
        let entries = try FileManager.default.contentsOfDirectory(
            at: root,
            includingPropertiesForKeys: [.isDirectoryKey],
            options: [.skipsHiddenFiles]
        )
        let candidates = entries.filter { url in
            (try? url.resourceValues(forKeys: [.isDirectoryKey]).isDirectory) == true &&
            FileManager.default.fileExists(atPath: url.appending(path: "SKILL.md").path)
        }
        if candidates.count == 1, let only = candidates.first {
            return only
        }
        throw InstallError.skillNotFound
    }

    private func uniqueDestinationURL(base: URL, slug: String) -> URL {
        var candidate = base.appending(path: slug)
        var suffix = 1
        while FileManager.default.fileExists(atPath: candidate.path) {
            candidate = base.appending(path: "\(slug)-\(suffix)")
            suffix += 1
        }
        return candidate
    }

    private func writeOrigin(_ destination: URL, slug: String, version: String?) throws {
        let originDir = destination.appending(path: ".clawdhub")
        try FileManager.default.createDirectory(at: originDir, withIntermediateDirectories: true)
        let payload: [String: Any] = [
            "slug": slug,
            "version": version ?? "latest",
            "source": "clawdhub",
            "installedAt": Int(Date().timeIntervalSince1970)
        ]
        let data = try JSONSerialization.data(withJSONObject: payload, options: [.prettyPrinted])
        try data.write(to: originDir.appending(path: "origin.json"), options: [.atomic])
    }

    private func sha256(_ data: Data) -> String {
        let hash = SHA256.hash(data: data)
        return hash.compactMap { String(format: "%02x", $0) }.joined()
    }
}

// MARK: - Previews

#Preview {
    SkillsView()
}
