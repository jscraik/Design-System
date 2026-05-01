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

function tokenContractAmbiguous(sourcePath: string, expectation: string): DesignEngineError {
  return new DesignEngineError(`Token contract source ${sourcePath} is missing ${expectation}.`, {
    code: "E_DESIGN_TOKEN_CONTRACT_AMBIGUOUS",
    exitCode: 2,
  });
}

function stripCssComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
}

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
