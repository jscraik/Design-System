import { readFile } from "node:fs/promises";
import path from "node:path";
import { DesignEngineError, type DesignTokenContract, type DesignTokenRole } from "./types.js";

const themeSourcePath = "packages/ui/src/styles/theme.css";
const aliasMapSourcePath = "packages/tokens/src/alias-map.ts";
const dtcgSourcePath = "packages/tokens/src/tokens/index.dtcg.json";
const designSourcePath = "DESIGN.md";
const professionalContractSourcePath = "docs/design-system/PROFESSIONAL_UI_CONTRACT.md";

const tokenSourceRefs = [
  themeSourcePath,
  aliasMapSourcePath,
  dtcgSourcePath,
  designSourcePath,
  professionalContractSourcePath,
];
const requiredAliasCategories = ["background", "text", "border", "accent", "interactive"] as const;
const requiredColorModes = ["light", "dark", "highContrast"] as const;

const semanticRoles: DesignTokenRole[] = [
  {
    role: "surface.background",
    cssVariable: "--background",
    useFor: ["Page and app surface backgrounds."],
    avoidFor: ["Cards, popovers, and nested panels that need their own surface role."],
  },
  {
    role: "surface.card",
    cssVariable: "--card",
    useFor: ["Cards, panels, and repeated item containers."],
    avoidFor: ["Page-level backgrounds."],
  },
  {
    role: "surface.muted",
    cssVariable: "--muted",
    useFor: ["Subtle grouped regions and low-emphasis backgrounds."],
    avoidFor: ["Primary page backgrounds or emphasis states."],
  },
  {
    role: "text.primary",
    cssVariable: "--foreground",
    useFor: ["Primary headings, labels, and body text."],
    avoidFor: ["Muted metadata or disabled text."],
  },
  {
    role: "text.secondary",
    cssVariable: "--text-secondary",
    useFor: ["Descriptions, secondary labels, and supporting copy."],
    avoidFor: ["Critical status text that needs a status role."],
  },
  {
    role: "text.muted",
    cssVariable: "--text-tertiary",
    useFor: ["Captions, placeholders, and low-emphasis metadata."],
    avoidFor: ["Primary content or actionable labels."],
  },
  {
    role: "border.default",
    cssVariable: "--border",
    useFor: ["Default component, row, and panel borders."],
    avoidFor: ["Focus indicators or high-emphasis separators."],
  },
  {
    role: "border.strong",
    cssVariable: "--border-strong",
    useFor: ["High-emphasis separators and selected container borders."],
    avoidFor: ["Default low-emphasis dividers."],
  },
  {
    role: "focus.ring",
    cssVariable: "--ring",
    useFor: ["Keyboard focus outlines and focus-visible affordances."],
    avoidFor: ["Static borders or decorative glows."],
  },
  {
    role: "accent.primary",
    cssVariable: "--interactive",
    useFor: ["Primary actions, selected states, and interactive emphasis."],
    avoidFor: ["Destructive, success, or warning statuses."],
  },
  {
    role: "status.success",
    cssVariable: "--status-success",
    useFor: ["Successful completion and positive status indicators."],
    avoidFor: ["Primary brand accents."],
  },
  {
    role: "status.error",
    cssVariable: "--status-error",
    useFor: ["Errors, destructive status, and failed validation."],
    avoidFor: ["Non-destructive emphasis."],
  },
  {
    role: "status.warning",
    cssVariable: "--status-warning",
    useFor: ["Warnings and attention states that are not errors."],
    avoidFor: ["Destructive states."],
  },
];

/**
 * Reads the token source file at the given path and returns its UTF-8 contents.
 *
 * @param rootDir - Root directory used to resolve `sourcePath`.
 * @param sourcePath - Relative path to the token source file.
 * @param signal - Optional AbortSignal that, when aborted, causes an `AbortError` to be thrown.
 * @returns The file contents as a UTF-8 string.
 * @throws AbortError if `signal` is aborted during the read.
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_MISSING` and exit code `2` when the file is missing or unreadable.
 */
async function readTokenSource(
  rootDir: string,
  sourcePath: string,
  signal?: AbortSignal,
): Promise<string> {
  signal?.throwIfAborted();
  try {
    return await readFile(path.join(rootDir, sourcePath), { encoding: "utf8", signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    throw new DesignEngineError(`Token contract source is missing or unreadable: ${sourcePath}`, {
      code: "E_DESIGN_TOKEN_CONTRACT_MISSING",
      exitCode: 2,
    });
  }
}

/**
 * Create a DesignEngineError indicating a token contract source is missing an expected element.
 *
 * @param sourcePath - The relative path to the source file that is missing the expectation
 * @param expectation - A short description of the expected element or content that is missing
 * @returns A DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS` and exitCode `2`
 */
function tokenContractAmbiguous(sourcePath: string, expectation: string): DesignEngineError {
  return new DesignEngineError(`Token contract source ${sourcePath} is missing ${expectation}.`, {
    code: "E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS",
    exitCode: 2,
  });
}

/**
 * Removes CSS block comments and strips `//` line comments while preserving leading whitespace.
 *
 * @param content - The CSS (or CSS-like) text to clean
 * @returns The input text with `/* ... *\/` block comments removed and `//` line comments stripped, preserving leading whitespace and non-comment content
 */
function stripCssComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
}

/**
 * Remove JavaScript/TypeScript line (`// ...`) and block (`/* ... *\/`) comments while preserving quoted and template-literal content.
 *
 * Preserves newlines from removed comments so original line positions remain aligned and keeps escaped quotes inside string/template literals intact.
 *
 * @param content - Source JavaScript/TypeScript text to strip comments from
 * @returns The input text with `//` and `/* */` comments removed while leaving quoted and template-literal content unchanged
 */
function stripJsTsComments(content: string): string {
  let result = "";
  let quote: "'" | '"' | "`" | undefined;
  let escaped = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const next = content[index + 1];

    if (escaped) {
      result += character;
      escaped = false;
      continue;
    }
    if (quote) {
      result += character;
      if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = undefined;
      }
      continue;
    }
    if (character === "'" || character === '"' || character === "`") {
      quote = character;
      result += character;
      continue;
    }
    if (character === "/" && next === "/") {
      while (index < content.length && content[index] !== "\n") {
        index += 1;
      }
      result += "\n";
      continue;
    }
    if (character === "/" && next === "*") {
      index += 2;
      while (index < content.length && !(content[index] === "*" && content[index + 1] === "/")) {
        if (content[index] === "\n") {
          result += "\n";
        }
        index += 1;
      }
      index += 1;
      continue;
    }

    result += character;
  }

  return result;
}

/**
 * Verifies the theme CSS file declares the expected runtime CSS variables for all semantic roles.
 *
 * @param rootDir - Root directory containing the theme CSS source
 * @param signal - Optional AbortSignal to cancel the check
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS` if a required runtime CSS variable is missing
 */
async function assertThemeSource(rootDir: string, signal?: AbortSignal): Promise<void> {
  const content = stripCssComments(await readTokenSource(rootDir, themeSourcePath, signal));
  signal?.throwIfAborted();

  for (const role of semanticRoles) {
    if (role.cssVariable && !content.includes(`${role.cssVariable}:`)) {
      throw tokenContractAmbiguous(
        themeSourcePath,
        `${role.role} runtime CSS variable ${role.cssVariable}`,
      );
    }
  }
}

/**
 * Validates the alias-map source contains an exported `tokenAliasMap` and per-category `buildModeMap` entries.
 *
 * @param rootDir - Project root directory containing the alias map source
 * @param signal - Optional AbortSignal to cancel the validation
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_MISSING` if the alias-map file is missing or unreadable
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS` if the file is missing the expected `tokenAliasMap` export or required category `buildModeMap` entries
 */
async function assertAliasMapSource(rootDir: string, signal?: AbortSignal): Promise<void> {
  const content = stripJsTsComments(await readTokenSource(rootDir, aliasMapSourcePath, signal));
  signal?.throwIfAborted();

  if (!/\bexport\s+const\s+tokenAliasMap\b/.test(content)) {
    throw tokenContractAmbiguous(aliasMapSourcePath, "exported tokenAliasMap");
  }

  for (const category of requiredAliasCategories) {
    if (!content.includes(`${category}: buildModeMap("${category}")`)) {
      throw tokenContractAmbiguous(aliasMapSourcePath, `${category} color alias mapping`);
    }
  }
}

/**
 * Validates that the DTCG JSON source contains the expected `color` token groups and required modes.
 *
 * Reads and parses the DTCG JSON file and verifies it is an object with a `color` group containing each
 * required alias category, and for each category a non-empty object for each required color mode.
 *
 * @param rootDir - Project root directory containing the DTCG source
 * @param signal - Optional AbortSignal to cancel the operation
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS` if the file is missing required structure or groups
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_MISSING` if the source cannot be read
 */
async function assertDtcgSource(rootDir: string, signal?: AbortSignal): Promise<void> {
  const content = await readTokenSource(rootDir, dtcgSourcePath, signal);
  signal?.throwIfAborted();

  let parsed: unknown;
  try {
    parsed = JSON.parse(content) as unknown;
  } catch {
    throw tokenContractAmbiguous(dtcgSourcePath, "parseable DTCG JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw tokenContractAmbiguous(dtcgSourcePath, "DTCG token object");
  }

  const color = (parsed as { color?: unknown }).color;
  if (!color || typeof color !== "object" || Array.isArray(color)) {
    throw tokenContractAmbiguous(dtcgSourcePath, "color token group");
  }

  for (const category of requiredAliasCategories) {
    const group = (color as Record<string, unknown>)[category];
    if (!group || typeof group !== "object" || Array.isArray(group)) {
      throw tokenContractAmbiguous(dtcgSourcePath, `${category} token group`);
    }
    for (const mode of requiredColorModes) {
      const modeGroup = (group as Record<string, unknown>)[mode];
      if (
        !modeGroup ||
        typeof modeGroup !== "object" ||
        Array.isArray(modeGroup) ||
        Object.keys(modeGroup).length === 0
      ) {
        throw tokenContractAmbiguous(dtcgSourcePath, `${category} ${mode} token group`);
      }
    }
  }
}

/**
 * Validates that the two policy markdown files contain required token policy sections.
 *
 * @param rootDir - Path to the repository root containing the policy files
 * @param signal - Optional AbortSignal used to abort the validation
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS` if a required policy section is missing
 */
async function assertPolicySources(rootDir: string, signal?: AbortSignal): Promise<void> {
  const [designSource, professionalContractSource] = await Promise.all([
    readTokenSource(rootDir, designSourcePath, signal),
    readTokenSource(rootDir, professionalContractSourcePath, signal),
  ]);
  signal?.throwIfAborted();

  if (!designSource.includes("Token Notes")) {
    throw tokenContractAmbiguous(designSourcePath, "token policy section");
  }

  if (!professionalContractSource.includes("Token discipline")) {
    throw tokenContractAmbiguous(professionalContractSourcePath, "token discipline policy");
  }
}

/**
 * Builds a design token contract by validating required token sources found under the given root directory.
 *
 * @param rootDir - Base directory used to resolve and read the expected token source files
 * @returns A DesignTokenContract configured with mode `"semantic-only"`, derived `allowedRoles`, static `forbiddenTokenPatterns`, and the validated `sourceRefs`
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_MISSING` if a required source file is missing or unreadable
 * @throws DesignEngineError with code `E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS` if a source file is present but fails required structural or content checks
 * @throws AbortError if the provided `signal` is aborted before or during validation
 */
export async function buildDesignTokenContract(
  rootDir: string,
  signal?: AbortSignal,
): Promise<DesignTokenContract> {
  await Promise.all([
    assertThemeSource(rootDir, signal),
    assertAliasMapSource(rootDir, signal),
    assertDtcgSource(rootDir, signal),
    assertPolicySources(rootDir, signal),
  ]);

  return {
    mode: "semantic-only",
    allowedRoles: semanticRoles.map((role) => ({
      ...role,
      useFor: [...role.useFor],
      avoidFor: role.avoidFor ? [...role.avoidFor] : undefined,
    })),
    forbiddenTokenPatterns: [
      "raw hex colors in protected UI, for example #fff or #123456",
      "foundation CSS variables in protected UI, for example var(--foundation-*)",
      "Tailwind arbitrary color literals in protected UI, for example bg-[#123456]",
      "one-off rgb(), rgba(), hsl(), or hsla() color literals in protected UI",
    ],
    sourceRefs: [...tokenSourceRefs],
  };
}
