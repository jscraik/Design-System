import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildOrigin,
  deleteSkill,
  findSkillRoot,
  uniqueDestinationPath,
  writeOrigin,
} from "./installer.js";

const tempRoots: string[] = [];

describe("installer utilities", () => {
  afterEach(() => {
    for (const dir of tempRoots.splice(0)) {
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("finds direct SKILL.md at root", () => {
    const dir = mkSkillDir({ nested: false });
    const root = findSkillRoot(dir, true);
    expect(root).toBe(dir);
  });

  it("finds nested SKILL.md when only one child exists", () => {
    const dir = mkSkillDir({ nested: true });
    const root = findSkillRoot(dir, true);
    expect(root).toBe(path.join(dir, "inner"));
  });

  it("writeOrigin creates .clawdhub/origin.json", () => {
    const dir = mkSkillDir({ nested: false });
    const origin = buildOrigin({ slug: "demo", version: "1.0.0", source: "test" });
    writeOrigin(dir, origin);
    const content = fs.readFileSync(path.join(dir, ".clawdhub", "origin.json"), "utf8");
    const parsed = JSON.parse(content);
    expect(parsed.slug).toBe("demo");
    expect(parsed.version).toBe("1.0.0");
    expect(parsed.source).toBe("test");
  });

  it("uniqueDestinationPath appends suffix when needed", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dest-"));
    tempRoots.push(dir);
    const first = uniqueDestinationPath(dir, "demo");
    fs.mkdirSync(first, { recursive: true });
    const second = uniqueDestinationPath(dir, "demo");
    expect(second).not.toBe(first);
    expect(second.endsWith("demo-1")).toBe(true);
  });

  it("deleteSkill removes paths if they exist", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "del-"));
    tempRoots.push(dir);
    const target = path.join(dir, "skill");
    fs.mkdirSync(target);
    deleteSkill([target]);
    expect(fs.existsSync(target)).toBe(false);
  });
});

function mkSkillDir({ nested }: { nested: boolean }): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-src-"));
  tempRoots.push(root);
  const base = nested ? path.join(root, "inner") : root;
  fs.mkdirSync(base, { recursive: true });
  fs.writeFileSync(path.join(base, "SKILL.md"), "# Title\nBody\n");
  return root;
}
