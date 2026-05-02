import { readFile } from "node:fs/promises";
import path from "node:path";
import { DesignEngineError, type DesignTokenContract, type DesignTokenRole } from "./types.js";

const THEME_SOURCE_PATH = "packages/ui/src/styles/theme.css";
const ALIAS_MAP_SOURCE_PATH = "packages/tokens/src/alias-map.ts";
const DTCG_SOURCE_PATH = "packages/tokens/src/tokens/index.dtcg.json";

const TOKEN_SOURCE_REFS = [THEME_SOURCE_PATH, ALIAS_MAP_SOURCE_PATH, DTCG_SOURCE_PATH];

const SEMANTIC_ROLES: DesignTokenRole[] = [
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

function hasCssDeclaration(content: string, property: string): boolean {
  const stripped = content.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[{;])\\s*${escaped}\\s*:`, "m").test(stripped);
}

function assertSemanticRoleThemeTokens(content: string): void {
  for (const role of SEMANTIC_ROLES) {
    if (!role.cssVariable) {
      throw tokenContractAmbiguous(THEME_SOURCE_PATH, `${role.role} CSS variable reference`);
    }
    if (!hasCssDeclaration(content, role.cssVariable)) {
      throw tokenContractAmbiguous(
        THEME_SOURCE_PATH,
        `${role.role} backing token ${role.cssVariable}`,
      );
    }
  }
}

async function assertThemeSource(rootDir: string, signal?: AbortSignal): Promise<void> {
  const content = await readTokenSource(rootDir, THEME_SOURCE_PATH, signal);
  signal?.throwIfAborted();

  for (const cssVariable of ["--background", "--foreground", "--ring"]) {
    if (!hasCssDeclaration(content, cssVariable)) {
      throw tokenContractAmbiguous(THEME_SOURCE_PATH, `${cssVariable} CSS variable`);
    }
  }
  assertSemanticRoleThemeTokens(content);
}

async function assertAliasMapSource(rootDir: string, signal?: AbortSignal): Promise<void> {
  const content = await readTokenSource(rootDir, ALIAS_MAP_SOURCE_PATH, signal);
  signal?.throwIfAborted();

  if (!/\bexport\s+const\s+tokenAliasMap\b/.test(content)) {
    throw tokenContractAmbiguous(ALIAS_MAP_SOURCE_PATH, "exported tokenAliasMap");
  }

  for (const category of ["background", "text", "border", "accent", "interactive"]) {
    if (!content.includes(`${category}: buildModeMap("${category}")`)) {
      throw tokenContractAmbiguous(ALIAS_MAP_SOURCE_PATH, `${category} color alias mapping`);
    }
  }
}

async function assertDtcgSource(rootDir: string, signal?: AbortSignal): Promise<void> {
  const content = await readTokenSource(rootDir, DTCG_SOURCE_PATH, signal);
  signal?.throwIfAborted();

  let parsed: unknown;
  try {
    parsed = JSON.parse(content) as unknown;
  } catch {
    throw tokenContractAmbiguous(DTCG_SOURCE_PATH, "parseable DTCG JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw tokenContractAmbiguous(DTCG_SOURCE_PATH, "DTCG token object");
  }

  const color = (parsed as { color?: unknown }).color;
  if (!color || typeof color !== "object" || Array.isArray(color)) {
    throw tokenContractAmbiguous(DTCG_SOURCE_PATH, "color token group");
  }

  const background = (color as { background?: unknown }).background;
  if (!background || typeof background !== "object" || Array.isArray(background)) {
    throw tokenContractAmbiguous(DTCG_SOURCE_PATH, "background token group");
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
  ]);
  for (const sourceRef of TOKEN_SOURCE_REFS) {
    if (!sourceRef) {
      throw tokenContractAmbiguous("designTokenContract.sourceRefs", "non-empty source reference");
    }
  }

  return {
    mode: "semantic-only",
    allowedRoles: SEMANTIC_ROLES.map((role) => ({
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
    sourceRefs: [...TOKEN_SOURCE_REFS],
  };
}
