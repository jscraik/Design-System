import path from "node:path";
import { buildRuleProvenance } from "./manifest.js";
import type { DesignContract, DesignFrontmatter, DesignSection, ParseOptions } from "./types.js";
import { DesignEngineError } from "./types.js";

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?/;
const SUPPORTED_PROFILES = new Set(["astudio-default@1"]);

function parseFrontmatterBlock(block: string): DesignFrontmatter {
  const raw: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^[ '"]|[ '"]$/g, "");
    raw[key] = value;
  }

  if (!raw.schemaVersion || !raw.brandProfile) {
    throw new DesignEngineError(
      "DESIGN.md frontmatter must include schemaVersion and brandProfile.",
      {
        code: "E_DESIGN_SCHEMA_INVALID",
        exitCode: 2,
      },
    );
  }

  return {
    schemaVersion: raw.schemaVersion,
    brandProfile: raw.brandProfile,
    raw,
  };
}

function parseSections(body: string, lineOffset = 0): DesignSection[] {
  const lines = body.split("\n");
  const sections: DesignSection[] = [];
  let current: DesignSection | null = null;

  lines.forEach((line, index) => {
    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (heading) {
      if (current) sections.push(current);
      current = {
        title: heading[2].trim(),
        level: heading[1].length,
        body: "",
        line: lineOffset + index + 1,
      };
      return;
    }

    if (current) {
      current.body = current.body ? `${current.body}\n${line}` : line;
    }
  });

  if (current) sections.push(current);
  return sections;
}

function parseTokenLines(body: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const line of body.split("\n")) {
    const tokenMatch = /(?:^|[\s`])(--[a-zA-Z0-9-]+)\s*[:=]\s*([#\w().,% -]+)/.exec(line);
    if (tokenMatch) {
      tokens[tokenMatch[1]] = tokenMatch[2].trim();
    }
  }
  return Object.fromEntries(Object.entries(tokens).sort(([a], [b]) => a.localeCompare(b)));
}

function parseComponentNames(body: string): string[] {
  const names = new Set<string>();
  for (const match of body.matchAll(/`([A-Z][A-Za-z0-9]+)`/g)) {
    const name = match[1];
    if (name.length > 2) names.add(name);
  }
  return [...names].sort();
}

function splitProfileVersion(profile: string): string {
  const [, version] = profile.split("@");
  return version ?? "unversioned";
}

function assertSupportedProfile(profile: string): void {
  if (SUPPORTED_PROFILES.has(profile)) return;
  const [name] = profile.split("@");
  const hasKnownName = [...SUPPORTED_PROFILES].some((entry) => entry.split("@")[0] === name);
  throw new DesignEngineError(`Unsupported design brand profile: ${profile}`, {
    code: hasKnownName ? "E_DESIGN_PROFILE_UNSUPPORTED" : "E_DESIGN_PROFILE_UNKNOWN",
    exitCode: hasKnownName ? 3 : 2,
  });
}

export function extractDesignBody(markdown: string): {
  frontmatter: DesignFrontmatter;
  body: string;
  bodyLineOffset: number;
} {
  const match = FRONTMATTER_PATTERN.exec(markdown);
  if (!match) {
    throw new DesignEngineError("DESIGN.md must start with YAML frontmatter.", {
      code: "E_DESIGN_SCHEMA_INVALID",
      exitCode: 2,
    });
  }
  return {
    frontmatter: parseFrontmatterBlock(match[1]),
    body: markdown.slice(match[0].length),
    bodyLineOffset: match[0].match(/\n/g)?.length ?? 0,
  };
}

export async function parseDesignContract(
  markdown: string,
  options: ParseOptions = {},
): Promise<DesignContract> {
  const rootDir = path.resolve(options.rootDir ?? process.cwd());
  const { frontmatter, body, bodyLineOffset } = extractDesignBody(markdown);

  if (options.ci && options.profileOverride) {
    throw new DesignEngineError("CI mode forbids DESIGN.md profile overrides.", {
      code: "E_DESIGN_PROFILE_OVERRIDE_FORBIDDEN",
      exitCode: 3,
    });
  }

  const resolvedProfile = options.profileOverride ?? frontmatter.brandProfile;
  if (!resolvedProfile) {
    throw new DesignEngineError("No design brand profile could be resolved.", {
      code: "E_DESIGN_PROFILE_UNKNOWN",
      exitCode: 2,
    });
  }
  assertSupportedProfile(resolvedProfile);

  const profileSource = options.profileOverride ? "cli-override" : "design-frontmatter";

  return {
    kind: "agent-design.normalizedModel.v1",
    filePath: options.filePath ? path.resolve(options.filePath) : null,
    schemaVersion: frontmatter.schemaVersion,
    brandProfile: frontmatter.brandProfile,
    resolvedProfile,
    profileSource,
    profileVersion: splitProfileVersion(resolvedProfile),
    sections: parseSections(body, bodyLineOffset),
    tokens: parseTokenLines(body),
    components: parseComponentNames(body),
    provenance: options.provenance ?? (await buildRuleProvenance(rootDir)),
  };
}
