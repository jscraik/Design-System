import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { computeSkillHash } from "./hash.js";
import { loadPublishHash, savePublishHash } from "./installer.js";
export function bumpVersion(current, bump) {
    const parts = current.split(".").map((p) => Number.parseInt(p, 10));
    if (parts.length !== 3 || parts.some(Number.isNaN))
        return null;
    let [maj, min, patch] = parts;
    if (bump === "major") {
        maj += 1;
        min = 0;
        patch = 0;
    }
    else if (bump === "minor") {
        min += 1;
        patch = 0;
    }
    else {
        patch += 1;
    }
    return `${maj}.${min}.${patch}`;
}
export function resolveBunxPath() {
    const candidates = [
        path.join(os.homedir(), ".bun", "bin", "bunx"),
        "/opt/homebrew/bin/bunx",
        "/usr/local/bin/bunx",
        "/usr/bin/bunx",
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).mode & 0o111) {
            return candidate;
        }
    }
    return null;
}
export async function publishSkill(options) {
    const { skillPath, slug } = options;
    const existingHash = loadPublishHash(slug);
    const currentHash = computeSkillHash(skillPath);
    if (existingHash && existingHash === currentHash && !options.dryRun) {
        return { version: options.latestVersion ?? "unknown", skipped: true };
    }
    const targetVersion = bumpVersion(options.latestVersion ?? "0.0.0", options.bump ?? "patch") ?? "1.0.0";
    const bunx = resolveBunxPath();
    const args = [
        "clawdhub@latest",
        "publish",
        skillPath,
        "--version",
        targetVersion,
    ];
    if (options.changelog?.trim()) {
        args.push("--changelog", options.changelog.trim());
    }
    const cleanedTags = (options.tags ?? [])
        .map((t) => t.trim())
        .filter(Boolean);
    if (cleanedTags.length > 0) {
        args.push("--tags", cleanedTags.join(","));
    }
    if (options.dryRun) {
        return { version: targetVersion, skipped: true, command: ["bunx", ...args] };
    }
    if (!bunx) {
        throw new Error("bunx not found; install Bun to publish.");
    }
    await execProcess(bunx, args, { cwd: options.cwd, env: options.env });
    savePublishHash(slug, skillPath);
    return { version: targetVersion, skipped: false };
}
function execProcess(executable, args, opts) {
    return new Promise((resolve, reject) => {
        const proc = childProcess.spawn(executable, args, {
            cwd: opts?.cwd,
            env: { ...process.env, ...opts?.env },
            stdio: "inherit",
        });
        proc.on("error", reject);
        proc.on("close", (code) => {
            if (code === 0)
                return resolve();
            reject(new Error(`${executable} exited with code ${code}`));
        });
    });
}
//# sourceMappingURL=publisher.js.map