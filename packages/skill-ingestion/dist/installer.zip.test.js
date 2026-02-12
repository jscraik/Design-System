import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { installSkillFromZip } from "./installer.js";
const tempRoots = [];
describe("installSkillFromZip (integration)", () => {
    afterEach(() => {
        for (const dir of tempRoots.splice(0)) {
            if (fs.existsSync(dir))
                fs.rmSync(dir, { recursive: true, force: true });
        }
    });
    it("installs a zipped skill into destination with origin metadata", async () => {
        const { zipPath, slug } = makeZippedSkill();
        const destRoot = fs.mkdtempSync(path.join(os.tmpdir(), "skill-dest-"));
        tempRoots.push(destRoot);
        const result = await installSkillFromZip(zipPath, [{ rootPath: destRoot, storageKey: "codex" }], { slug, version: "1.0.0" });
        expect(result.selectedId).toBe("codex-demo-skill");
        const installPath = path.join(destRoot, "demo-skill");
        expect(fs.existsSync(path.join(installPath, "SKILL.md"))).toBe(true);
        const origin = path.join(installPath, ".clawdhub", "origin.json");
        expect(fs.existsSync(origin)).toBe(true);
        const parsed = JSON.parse(fs.readFileSync(origin, "utf8"));
        expect(parsed.slug).toBe("demo-skill");
    });
});
function makeZippedSkill() {
    const slug = "demo-skill";
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "skill-zip-"));
    tempRoots.push(tempRoot);
    const skillDir = path.join(tempRoot, slug);
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, "SKILL.md"), "# Demo Skill\nBody\n");
    const zipPath = path.join(tempRoot, `${slug}.zip`);
    const zip = childProcess.spawnSync("zip", ["-rq", zipPath, "."], { cwd: skillDir });
    if (zip.status !== 0) {
        throw new Error("zip utility not available for integration test");
    }
    return { zipPath, slug };
}
