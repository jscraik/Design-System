import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { EventEmitter } from "node:events";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as publisher from "./publisher.js";
const tempRoots = [];
let originalHome;
let bunxPath;
describe("publishSkill (process stub)", () => {
    beforeEach(() => {
        originalHome = process.env.HOME;
        const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "pub-home-"));
        process.env.HOME = tempHome;
        tempRoots.push(tempHome);
        bunxPath = path.join(tempHome, ".bun", "bin", "bunx");
        fs.mkdirSync(path.dirname(bunxPath), { recursive: true });
        fs.writeFileSync(bunxPath, "#!/bin/sh\necho bunx\n");
        fs.chmodSync(bunxPath, 0o755);
    });
    afterEach(() => {
        vi.restoreAllMocks();
        if (originalHome)
            process.env.HOME = originalHome;
        for (const dir of tempRoots.splice(0)) {
            if (fs.existsSync(dir))
                fs.rmSync(dir, { recursive: true, force: true });
        }
    });
    it("performs publish when bunx is available and saves hash", async () => {
        const skillPath = makeSkillDir();
        mockSpawnSuccess();
        const result = await publisher.publishSkill({
            skillPath,
            slug: "demo-skill",
            latestVersion: "1.0.0",
            bump: "patch",
        });
        expect(result.skipped).toBe(false);
        expect(result.version).toBe("1.0.1");
    });
    it("skips publish when hash unchanged", async () => {
        const skillPath = makeSkillDir();
        mockSpawnSuccess();
        await publisher.publishSkill({
            skillPath,
            slug: "demo-skill",
            latestVersion: "1.0.0",
            bump: "patch",
        });
        const second = await publisher.publishSkill({
            skillPath,
            slug: "demo-skill",
            latestVersion: "1.0.1",
            bump: "patch",
        });
        expect(second.skipped).toBe(true);
    });
});
function makeSkillDir() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pub-skill-"));
    tempRoots.push(dir);
    fs.writeFileSync(path.join(dir, "SKILL.md"), "# Demo\n");
    return dir;
}
function mockSpawnSuccess() {
    vi.spyOn(childProcess, "spawn").mockImplementation(() => {
        const emitter = new EventEmitter();
        process.nextTick(() => emitter.emit("close", 0));
        return emitter;
    });
}
