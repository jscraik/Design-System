import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RuleManifest, RuleProvenance, RuleSourceDigest } from "./types.js";
import { DesignEngineError } from "./types.js";

const MANIFEST_RELATIVE_PATH = "rules/agent-design.rules.v1.json";

function packageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

export function manifestPath(): string {
  return path.join(packageRoot(), MANIFEST_RELATIVE_PATH);
}

export async function loadRuleManifest(): Promise<RuleManifest> {
  const raw = await readFile(manifestPath(), "utf8");
  const parsed = JSON.parse(raw) as RuleManifest;
  if (
    parsed.schemaVersion !== "agent-design.rules.v1" ||
    typeof parsed.ruleManifestVersion !== "string" ||
    typeof parsed.rulePackVersion !== "string" ||
    !Array.isArray(parsed.sources) ||
    !Array.isArray(parsed.rules)
  ) {
    throw new DesignEngineError("Invalid agent design rule manifest.", {
      code: "E_DESIGN_MANIFEST_INVALID",
      exitCode: 3,
    });
  }

  const sourceSet = new Set(parsed.sources);
  for (const rule of parsed.rules) {
    if (!sourceSet.has(rule.sourcePath)) {
      throw new DesignEngineError(`Rule ${rule.id} references an unknown source.`, {
        code: "E_DESIGN_SCHEMA_INVALID",
        exitCode: 2,
      });
    }
  }

  return parsed;
}

export async function computeRuleSourceDigests(
  rootDir: string,
  manifest: RuleManifest,
): Promise<RuleSourceDigest[]> {
  const digests: RuleSourceDigest[] = [];
  for (const sourcePath of manifest.sources) {
    const absolutePath = path.join(rootDir, sourcePath);
    let content = "";
    try {
      content = await readFile(absolutePath, "utf8");
    } catch {
      throw new DesignEngineError(`Required rule source is missing or unreadable: ${sourcePath}`, {
        code: "E_DESIGN_SCHEMA_INVALID",
        exitCode: 2,
      });
    }

    digests.push({
      path: sourcePath,
      sha256: createHash("sha256").update(content).digest("hex"),
    });
  }
  return digests;
}

export async function buildRuleProvenance(rootDir: string): Promise<RuleProvenance> {
  const manifest = await loadRuleManifest();
  return {
    ruleManifestVersion: manifest.ruleManifestVersion,
    rulePackVersion: manifest.rulePackVersion,
    ruleSourceDigests: await computeRuleSourceDigests(rootDir, manifest),
  };
}
