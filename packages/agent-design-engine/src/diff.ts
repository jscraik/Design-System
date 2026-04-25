import path from "node:path";
import { buildRuleProvenance } from "./manifest.js";
import { parseDesignContract } from "./parser.js";
import type { DesignContract, DesignDiffResult, RuleSourceDigest } from "./types.js";

function jsonStable(value: unknown): string {
  return JSON.stringify(value, Object.keys(value as Record<string, unknown>).sort());
}

function changedDigests(before: RuleSourceDigest[], after: RuleSourceDigest[]): RuleSourceDigest[] {
  const beforeMap = new Map(before.map((entry) => [entry.path, entry.sha256]));
  return after.filter((entry) => beforeMap.get(entry.path) !== entry.sha256);
}

function compareContracts(
  before: DesignContract,
  after: DesignContract,
): DesignDiffResult["changes"] {
  const changes: DesignDiffResult["changes"] = [];
  if (before.schemaVersion !== after.schemaVersion) {
    changes.push({
      path: "schemaVersion",
      before: before.schemaVersion,
      after: after.schemaVersion,
      severity: "error",
    });
  }
  if (before.resolvedProfile !== after.resolvedProfile) {
    changes.push({
      path: "resolvedProfile",
      before: before.resolvedProfile,
      after: after.resolvedProfile,
      severity: "warn",
    });
  }
  if (jsonStable(before.tokens) !== jsonStable(after.tokens)) {
    changes.push({ path: "tokens", before: before.tokens, after: after.tokens, severity: "warn" });
  }
  if (jsonStable(before.components) !== jsonStable(after.components)) {
    changes.push({
      path: "components",
      before: before.components,
      after: after.components,
      severity: "warn",
    });
  }
  return changes;
}

export async function diffDesignContracts(
  beforeMarkdown: string,
  afterMarkdown: string,
  options: { rootDir?: string; beforeFilePath?: string; afterFilePath?: string } = {},
): Promise<DesignDiffResult> {
  const rootDir = path.resolve(options.rootDir ?? process.cwd());
  const provenance = await buildRuleProvenance(rootDir);
  const before = await parseDesignContract(beforeMarkdown, {
    rootDir,
    filePath: options.beforeFilePath ?? null,
    provenance,
  });
  const after = await parseDesignContract(afterMarkdown, {
    rootDir,
    filePath: options.afterFilePath ?? null,
    provenance,
  });
  const changes = compareContracts(before, after);
  return {
    kind: "astudio.design.diff.v1",
    before,
    after,
    changes,
    ruleContextDelta: {
      before: before.provenance,
      after: after.provenance,
      changedSourceDigests: changedDigests(
        before.provenance.ruleSourceDigests,
        after.provenance.ruleSourceDigests,
      ),
    },
    hasRegression: changes.some((change) => change.severity === "error"),
  };
}
