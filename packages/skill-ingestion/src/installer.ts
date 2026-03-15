import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { computeSkillHash } from "./hash.js";
import type { InstallDestination, OriginMetadata } from "./types.js";

export type InstallOptions = {
  slug: string;
  version?: string | null;
  source?: string;
  strictSingleSkill?: boolean;
};

export type InstallResult = {
  selectedId?: string;
  installPaths: string[];
};

const DEFAULT_SOURCE = "clawdhub";

// ─── SECURITY HELPERS ─────────────────────────────────────────────────────────

/**
 * Validates that a resolved `candidate` path is strictly inside `base`.
 * Throws if the resolved path escapes the base directory (path traversal guard).
 */
function assertWithinBase(base: string, candidate: string, label: string): void {
  const resolvedBase = path.resolve(base);
  const resolvedCandidate = fs.realpathSync.native(
    // realpathSync needs the path to exist; use resolve for pre-existence checks
    candidate,
  );
  if (!resolvedCandidate.startsWith(resolvedBase + path.sep) && resolvedCandidate !== resolvedBase) {
    throw new Error(
      `Security: ${label} path "${candidate}" escapes allowed base "${resolvedBase}".`,
    );
  }
}

/**
 * Same as assertWithinBase but works before the path exists on disk
 * (uses path.resolve rather than realpathSync).
 */
function assertWithinBaseResolved(base: string, candidate: string, label: string): void {
  const resolvedBase = path.resolve(base);
  const resolvedCandidate = path.resolve(candidate);
  if (
    !resolvedCandidate.startsWith(resolvedBase + path.sep) &&
    resolvedCandidate !== resolvedBase
  ) {
    throw new Error(
      `Security: ${label} path "${candidate}" escapes allowed base "${resolvedBase}".`,
    );
  }
}

/** Slug must be a simple identifier — no slashes, dots, or shell metacharacters. */
const SAFE_SLUG_RE = /^[\w][\w.-]{0,127}$/;
function validateSlug(slug: string): string {
  if (!SAFE_SLUG_RE.test(slug)) {
    throw new Error(
      `Security: slug "${slug}" contains invalid characters. Only alphanumeric, hyphens, underscores, and dots are allowed.`,
    );
  }
  return slug;
}

/** Zip path must be an absolute, existing file. */
function validateZipPath(zipPath: string): string {
  const resolved = path.resolve(zipPath);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    throw new Error(`Security: zipPath "${zipPath}" is not a valid existing file.`);
  }
  return resolved;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

export async function installSkillFromZip(
  zipPath: string,
  destinations: InstallDestination[],
  options: InstallOptions,
): Promise<InstallResult> {
  if (destinations.length === 0) {
    throw new Error("At least one install destination is required.");
  }

  const safeSlug = validateSlug(options.slug);
  const safeZipPath = validateZipPath(zipPath);

  const tempExtract = fs.mkdtempSync(path.join(os.tmpdir(), "skill-extract-"));
  try {
    await unzip(safeZipPath, tempExtract);
    const skillRoot = findSkillRoot(tempExtract, options.strictSingleSkill ?? true);
    const origin = buildOrigin({ ...options, slug: safeSlug });

    const installPaths: string[] = [];
    for (const destination of destinations) {
      const safeRoot = path.resolve(destination.rootPath);
      fs.mkdirSync(safeRoot, { recursive: true });
      const finalPath = uniqueDestinationPath(safeRoot, safeSlug);
      // finalPath is already validated inside uniqueDestinationPath
      if (fs.existsSync(finalPath)) {
        fs.rmSync(finalPath, { recursive: true, force: true });
      }
      fs.cpSync(skillRoot, finalPath, { recursive: true });
      writeOrigin(finalPath, origin);
      installPaths.push(finalPath);
    }

    const selected = destinations[0];
    return {
      selectedId: `${selected.storageKey}-${safeSlug}`,
      installPaths,
    };
  } finally {
    fs.rmSync(tempExtract, { recursive: true, force: true });
  }
}

export function findSkillRoot(rootDir: string, strictSingleSkill: boolean): string {
  const resolvedRoot = path.resolve(rootDir);

  const direct = path.join(resolvedRoot, "SKILL.md");
  if (fs.existsSync(direct)) return resolvedRoot;

  const children = fs
    .readdirSync(resolvedRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const candidates = children
    .map((entry) => path.join(resolvedRoot, entry.name))
    // Guard: candidate must stay inside rootDir (symlink escape prevention)
    .filter((dir) => {
      try {
        assertWithinBaseResolved(resolvedRoot, dir, "skill-root candidate");
        return fs.existsSync(path.join(dir, "SKILL.md"));
      } catch {
        return false;
      }
    });

  if (candidates.length === 1) return candidates[0];
  if (strictSingleSkill) {
    throw new Error("Zip did not contain a single skill root with SKILL.md.");
  }
  return candidates[0] ?? resolvedRoot;
}

export function writeOrigin(destination: string, origin: OriginMetadata) {
  const dir = path.join(destination, ".clawdhub");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "origin.json"), JSON.stringify(origin, null, 2), "utf8");
}

export function buildOrigin(options: InstallOptions): OriginMetadata {
  return {
    slug: options.slug,
    version: options.version ?? null,
    source: options.source ?? DEFAULT_SOURCE,
    installedAt: Math.floor(Date.now() / 1000),
  };
}

/**
 * Builds a unique destination path for slug within base.
 *
 * Security hardening vs original:
 * - slug is pre-validated by validateSlug() before this is called
 * - resolvedBase is computed once to prevent TOCTOU races
 * - candidate is asserted within base before being returned
 * - loop count is capped to prevent DoS via infinite collision
 */
export function uniqueDestinationPath(base: string, slug: string): string {
  const resolvedBase = path.resolve(base);
  let candidate = path.join(resolvedBase, slug);
  let suffix = 1;
  const MAX_SUFFIX = 1000;

  while (fs.existsSync(candidate)) {
    if (suffix > MAX_SUFFIX) {
      throw new Error(
        `uniqueDestinationPath: could not find a free slot for slug "${slug}" after ${MAX_SUFFIX} attempts.`,
      );
    }
    candidate = path.join(resolvedBase, `${slug}-${suffix}`);
    suffix += 1;
  }

  // Final guard: resolved candidate must be inside base
  assertWithinBaseResolved(resolvedBase, candidate, "install destination");
  return candidate;
}

export function deleteSkill(paths: string[]) {
  for (const p of paths) {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
}

export function publishStateDirectory(): string {
  const dir = path.join(os.homedir(), ".config", "astudio", "skill-ingestion", "publish-state");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function loadPublishHash(slug: string): string | null {
  const file = path.join(publishStateDirectory(), `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as { hash?: string };
    return parsed.hash ?? null;
  } catch {
    return null;
  }
}

export function savePublishHash(slug: string, skillPath: string) {
  const hash = computeSkillHash(skillPath);
  const file = path.join(publishStateDirectory(), `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify({ hash, savedAt: Date.now() }, null, 2), "utf8");
}

function unzip(zipPath: string, destination: string): Promise<void> {
  // zipPath and destination are both resolved absolute paths at this point.
  return new Promise((resolve, reject) => {
    const proc = childProcess.spawn("/usr/bin/ditto", ["-x", "-k", zipPath, destination]);
    const stderr: Buffer[] = [];
    proc.stderr.on("data", (chunk) => stderr.push(chunk));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`ditto failed (${code}): ${Buffer.concat(stderr).toString()}`));
    });
  });
}
