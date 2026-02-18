import { COMMAND_SCHEMA, TOOL_NAME } from "../constants.js";
import type { CliArgs, JsonEnvelope, JsonError, JsonValue } from "../types.js";
import { getToolVersion } from "./env.js";

function nowIso(): string {
  return new Date().toISOString();
}

export function outputJson(envelope: JsonEnvelope): void {
  process.stdout.write(`${JSON.stringify(envelope)}\n`);
}

export function outputPlain(lines: string[]): void {
  process.stdout.write(`${lines.join("\n")}\n`);
}

function formatPlainValue(value: JsonValue): string {
  return JSON.stringify(value);
}

export function outputPlainRecord(record: Record<string, JsonValue | undefined>): void {
  const lines = Object.entries(record)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${formatPlainValue(value as JsonValue)}`);
  outputPlain(lines);
}

export function emitSkillResults(
  argv: CliArgs,
  results: Array<{ slug: string; displayName: string; summary?: string; latestVersion?: string }>,
): void {
  if (argv.json) {
    outputJson(
      createEnvelope("skills.search", "success", {
        items: results.map((r) => ({
          slug: r.slug,
          name: r.displayName,
          summary: r.summary ?? null,
          version: r.latestVersion ?? null,
        })),
      }),
    );
    return;
  }
  const lines = results.map(
    (r) =>
      `${r.slug.padEnd(24, " ")} ${r.displayName}${
        r.latestVersion ? ` (v${r.latestVersion})` : ""
      }${r.summary ? ` — ${r.summary}` : ""}`,
  );
  outputPlain(lines);
}

export function emitSkillInstall(argv: CliArgs, paths: string[], platform: string): void {
  if (argv.json) {
    outputJson(createEnvelope("skills.install", "success", { platform, paths }));
    return;
  }
  outputPlain(["Installed to:", ...paths.map((p) => `- ${p}`)]);
}

export function emitPublishResult(
  argv: CliArgs,
  result: { version: string; skipped: boolean; command?: string[] },
  slug: string,
): void {
  if (argv.json) {
    outputJson(
      createEnvelope("skills.publish", "success", {
        slug,
        version: result.version,
        skipped: result.skipped,
        command: result.command ?? null,
      }),
    );
    return;
  }
  if (result.skipped) {
    outputPlain([`No changes detected for ${slug}; publish skipped.`]);
  } else if (result.command) {
    outputPlain([`[dry-run] ${result.command.join(" ")}`]);
  } else {
    outputPlain([`Published ${slug} v${result.version}`]);
  }
}

export function createEnvelope(
  summary: string,
  status: JsonEnvelope["status"],
  data: Record<string, JsonValue>,
  errors: JsonError[] = [],
): JsonEnvelope {
  return {
    schema: COMMAND_SCHEMA,
    meta: { tool: TOOL_NAME, version: getToolVersion(), timestamp: nowIso() },
    summary,
    status,
    data,
    errors,
  };
}
