import { readFile } from "fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tokenAliasMap } from "../alias-map.js";
const CONTRAST_PAIRS = [
    { background: "background.primary", text: "text.primary", min: 4.5 },
    { background: "background.secondary", text: "text.primary", min: 4.5 },
    { background: "background.tertiary", text: "text.secondary", min: 4.5 },
];
function resolveDtcgPath() {
    try {
        const url = new URL("../tokens/index.dtcg.json", import.meta.url);
        if (url.protocol === "file:") {
            return fileURLToPath(url);
        }
    }
    catch {
        // fall through to cwd-based resolution
    }
    return resolve(process.cwd(), "src/tokens/index.dtcg.json");
}
async function loadDtcgTokens() {
    const dtcgPath = resolveDtcgPath();
    const raw = await readFile(dtcgPath, "utf8");
    return JSON.parse(raw);
}
function resolvePath(root, path) {
    const parts = path.split(".");
    let current = root;
    for (const part of parts) {
        if (!current || typeof current !== "object") {
            return null;
        }
        current = current[part];
    }
    return current ?? null;
}
function isTokenGroup(value) {
    if (!value || typeof value !== "object")
        return false;
    return Object.values(value).some((entry) => {
        if (!entry || typeof entry !== "object")
            return false;
        return "value" in entry;
    });
}
function collectModeKeys(value) {
    return Object.keys(value).sort();
}
function validateModeCompleteness(root) {
    const errors = [];
    const categories = ["background", "text", "icon", "border", "accent", "interactive"];
    for (const category of categories) {
        const light = root.color?.[category]?.light ?? {};
        const dark = root.color?.[category]?.dark ?? {};
        const lightKeys = collectModeKeys(light);
        const darkKeys = collectModeKeys(dark);
        const missingInDark = lightKeys.filter((key) => !darkKeys.includes(key));
        const missingInLight = darkKeys.filter((key) => !lightKeys.includes(key));
        if (missingInDark.length > 0 || missingInLight.length > 0) {
            errors.push({
                code: "TOKEN_MODE_MISSING",
                message: `Color mode mismatch in '${category}'.`,
                suggestion: `Ensure light and dark mode tokens have matching keys. Missing dark: ${missingInDark.join(", ") || "none"}. Missing light: ${missingInLight.join(", ") || "none"}.`,
            });
        }
    }
    return errors;
}
function validateAliasMap(root, aliasMap) {
    const errors = [];
    const colorCategories = Object.entries(aliasMap.color);
    for (const [category, mapping] of colorCategories) {
        for (const [tokenName, modes] of Object.entries(mapping)) {
            for (const [mode, value] of Object.entries(modes)) {
                if ("value" in value) {
                    errors.push({
                        code: "TOKEN_ALIAS_RAW_VALUE",
                        message: `Alias '${category}.${tokenName}.${mode}' uses a raw value instead of a token path.`,
                        suggestion: "Replace raw values with a brand token path reference in packages/tokens/src/alias-map.ts.",
                    });
                    continue;
                }
                if ("path" in value) {
                    const token = resolvePath(root, value.path);
                    if (!token || token.value === undefined) {
                        errors.push({
                            code: "TOKEN_ALIAS_MISSING",
                            message: `Alias '${category}.${tokenName}.${mode}' references missing path '${value.path}'.`,
                            suggestion: "Update the alias map or add the missing token to the DTCG source.",
                        });
                    }
                }
            }
        }
    }
    const nonModeCategories = [
        ["space", aliasMap.space],
        ["radius", aliasMap.radius],
        ["shadow", aliasMap.shadow],
        ["size", aliasMap.size],
        ["type", aliasMap.type],
    ];
    for (const [category, mapping] of nonModeCategories) {
        for (const [tokenName, value] of Object.entries(mapping)) {
            if ("path" in value && value.path) {
                const token = resolvePath(root, value.path);
                if (!token || token.value === undefined) {
                    if (category === "type" && isTokenGroup(token)) {
                        continue;
                    }
                    errors.push({
                        code: "TOKEN_ALIAS_MISSING",
                        message: `Alias '${category}.${tokenName}' references missing path '${value.path}'.`,
                        suggestion: "Update the alias map or add the missing token to the DTCG source.",
                    });
                }
            }
        }
    }
    return errors;
}
function validateAliasCoverage(root, aliasMap) {
    const errors = [];
    const categories = ["background", "text", "icon", "border", "accent", "interactive"];
    for (const category of categories) {
        const lightKeys = Object.keys(root.color?.[category]?.light ?? {});
        const aliasKeys = Object.keys(aliasMap.color[category] ?? {});
        const missing = lightKeys.filter((key) => !aliasKeys.includes(key));
        if (missing.length > 0) {
            errors.push({
                code: "TOKEN_ALIAS_VALUE_MISSING",
                message: `Alias map missing ${category} tokens: ${missing.join(", ")}.`,
                suggestion: "Update packages/tokens/src/alias-map.ts to cover all tokens.",
            });
        }
    }
    return errors;
}
function hexToRgb(hex) {
    const clean = hex.replace("#", "").trim();
    if (clean.length !== 6)
        return null;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
}
function relativeLuminance({ r, g, b }) {
    const [rs, gs, bs] = [r, g, b].map((value) => {
        const normalized = value / 255;
        return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function contrastRatio(foreground, background) {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);
    if (!fg || !bg)
        return null;
    const l1 = relativeLuminance(fg);
    const l2 = relativeLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}
function resolveAliasColor(root, category, tokenName, mode, aliasMap) {
    const alias = aliasMap.color[category]?.[tokenName]?.[mode];
    if (!alias)
        return null;
    if ("value" in alias && typeof alias.value === "string") {
        return alias.value;
    }
    if ("path" in alias) {
        const token = resolvePath(root, alias.path);
        if (token && typeof token.value === "string") {
            return token.value;
        }
    }
    return null;
}
function validateContrast(root, aliasMap) {
    const errors = [];
    const modes = ["light", "dark"];
    for (const pair of CONTRAST_PAIRS) {
        const [backgroundCategory, backgroundToken] = pair.background.split(".");
        const [textCategory, textToken] = pair.text.split(".");
        for (const mode of modes) {
            const background = resolveAliasColor(root, backgroundCategory, backgroundToken, mode, aliasMap);
            const text = resolveAliasColor(root, textCategory, textToken, mode, aliasMap);
            if (!background || !text) {
                continue;
            }
            const ratio = contrastRatio(text, background);
            if (ratio !== null && ratio < pair.min) {
                errors.push({
                    code: "TOKEN_CONTRAST_FAIL",
                    message: `Contrast ratio ${ratio.toFixed(2)} for ${pair.text} on ${pair.background} (${mode}) is below ${pair.min}.`,
                    suggestion: "Adjust token values or update the contrast pair thresholds.",
                });
            }
        }
    }
    return errors;
}
export async function validateTokens() {
    const root = await loadDtcgTokens();
    const errors = [
        ...validateModeCompleteness(root),
        ...validateAliasMap(root, tokenAliasMap),
        ...validateAliasCoverage(root, tokenAliasMap),
        ...validateContrast(root, tokenAliasMap),
    ];
    return { errors };
}
