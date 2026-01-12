import os from "node:os";
import path from "node:path";
export const skillPlatformMeta = {
    codex: { storageKey: "codex", relativePath: ".codex/skills/public" },
    claude: { storageKey: "claude", relativePath: ".claude/skills" },
    opencode: { storageKey: "opencode", relativePath: ".config/opencode/skill" },
    copilot: { storageKey: "copilot", relativePath: ".copilot/skills" },
};
export function platformRootPath(platform, baseDir = os.homedir()) {
    const info = skillPlatformMeta[platform];
    return path.join(baseDir, info.relativePath);
}
export function platformStorageKey(platform) {
    return skillPlatformMeta[platform].storageKey;
}
//# sourceMappingURL=types.js.map