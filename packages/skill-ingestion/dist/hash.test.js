import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { computeSkillHash } from "./hash.js";
describe("computeSkillHash", () => {
    it("produces deterministic hash ignoring hidden folders", () => {
        const temp = fs.mkdtempSync(path.join(os.tmpdir(), "skill-hash-"));
        const skillRoot = path.join(temp, "skill");
        fs.mkdirSync(skillRoot, { recursive: true });
        fs.writeFileSync(path.join(skillRoot, "SKILL.md"), "# Title\n");
        fs.mkdirSync(path.join(skillRoot, ".git"));
        fs.writeFileSync(path.join(skillRoot, ".git", "ignoreme"), "ignored");
        const first = computeSkillHash(skillRoot);
        const second = computeSkillHash(skillRoot);
        expect(first).toBe(second);
    });
});
