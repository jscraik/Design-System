import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { computeSkillHash } from "./hash.js";
const DEFAULT_SOURCE = "clawdhub";
export async function installSkillFromZip(zipPath, destinations, options) {
    if (destinations.length === 0) {
        throw new Error("At least one install destination is required.");
    }
    const tempExtract = fs.mkdtempSync(path.join(os.tmpdir(), "skill-extract-"));
    try {
        await unzip(zipPath, tempExtract);
        const skillRoot = findSkillRoot(tempExtract, options.strictSingleSkill ?? true);
        const origin = buildOrigin(options);
        const installPaths = [];
        for (const destination of destinations) {
            fs.mkdirSync(destination.rootPath, { recursive: true });
            const finalPath = uniqueDestinationPath(destination.rootPath, options.slug);
            if (fs.existsSync(finalPath)) {
                fs.rmSync(finalPath, { recursive: true, force: true });
            }
            fs.cpSync(skillRoot, finalPath, { recursive: true });
            writeOrigin(finalPath, origin);
            installPaths.push(finalPath);
        }
        const selected = destinations[0];
        return {
            selectedId: `${selected.storageKey}-${options.slug}`,
            installPaths,
        };
    }
    finally {
        fs.rmSync(tempExtract, { recursive: true, force: true });
    }
}
export function findSkillRoot(rootDir, strictSingleSkill) {
    const direct = path.join(rootDir, "SKILL.md");
    if (fs.existsSync(direct))
        return rootDir;
    const children = fs
        .readdirSync(rootDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory());
    const candidates = children
        .map((entry) => path.join(rootDir, entry.name))
        .filter((dir) => fs.existsSync(path.join(dir, "SKILL.md")));
    if (candidates.length === 1)
        return candidates[0];
    if (strictSingleSkill) {
        throw new Error("Zip did not contain a single skill root with SKILL.md.");
    }
    return candidates[0] ?? rootDir;
}
export function writeOrigin(destination, origin) {
    const dir = path.join(destination, ".clawdhub");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "origin.json"), JSON.stringify(origin, null, 2), "utf8");
}
export function buildOrigin(options) {
    return {
        slug: options.slug,
        version: options.version ?? null,
        source: options.source ?? DEFAULT_SOURCE,
        installedAt: Math.floor(Date.now() / 1000),
    };
}
export function uniqueDestinationPath(base, slug) {
    let candidate = path.join(base, slug);
    let suffix = 1;
    while (fs.existsSync(candidate)) {
        candidate = path.join(base, `${slug}-${suffix}`);
        suffix += 1;
    }
    return candidate;
}
export function deleteSkill(paths) {
    for (const p of paths) {
        if (fs.existsSync(p)) {
            fs.rmSync(p, { recursive: true, force: true });
        }
    }
}
export function publishStateDirectory() {
    const dir = path.join(os.homedir(), ".config", "astudio", "skill-ingestion", "publish-state");
    fs.mkdirSync(dir, { recursive: true });
    return dir;
}
export function loadPublishHash(slug) {
    const file = path.join(publishStateDirectory(), `${slug}.json`);
    if (!fs.existsSync(file))
        return null;
    try {
        const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
        return parsed.hash ?? null;
    }
    catch {
        return null;
    }
}
export function savePublishHash(slug, skillPath) {
    const hash = computeSkillHash(skillPath);
    const file = path.join(publishStateDirectory(), `${slug}.json`);
    fs.writeFileSync(file, JSON.stringify({ hash, savedAt: Date.now() }, null, 2), "utf8");
}
function unzip(zipPath, destination) {
    return new Promise((resolve, reject) => {
        const proc = childProcess.spawn("/usr/bin/ditto", ["-x", "-k", zipPath, destination]);
        const stderr = [];
        proc.stderr.on("data", (chunk) => stderr.push(chunk));
        proc.on("error", reject);
        proc.on("close", (code) => {
            if (code === 0)
                return resolve();
            reject(new Error(`ditto failed (${code}): ${Buffer.concat(stderr).toString()}`));
        });
    });
}
//# sourceMappingURL=installer.js.map