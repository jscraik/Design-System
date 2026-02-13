import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
export function parseBooleanEnv(value) {
    if (!value)
        return undefined;
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "on"].includes(normalized))
        return true;
    if (["0", "false", "no", "off"].includes(normalized))
        return false;
    return undefined;
}
export function getToolVersion() {
    try {
        const packageUrl = new URL("../package.json", import.meta.url);
        const packagePath = fileURLToPath(packageUrl);
        const raw = fs.readFileSync(packagePath, "utf8");
        const parsed = JSON.parse(raw);
        return parsed.version ?? "0.0.0";
    }
    catch {
        return "0.0.0";
    }
}
export function shouldColor(opts) {
    const colorPref = parseBooleanEnv(process.env.ASTUDIO_COLOR);
    if (opts.noColor)
        return false;
    if (opts.json || opts.plain)
        return false;
    if (process.env.NO_COLOR)
        return false;
    if (process.env.TERM === "dumb")
        return false;
    if (colorPref === false)
        return false;
    if (colorPref === true)
        return true;
    if (!process.stdout.isTTY)
        return false;
    return true;
}
export function baseEnv(opts) {
    const env = { ...process.env };
    if (!shouldColor(opts)) {
        env.NO_COLOR = "1";
        env.FORCE_COLOR = "0";
    }
    else if (parseBooleanEnv(process.env.ASTUDIO_COLOR) === true) {
        env.FORCE_COLOR = "1";
    }
    return env;
}
export function resolveCwd(opts) {
    if (opts.cwd)
        return path.resolve(opts.cwd);
    if (process.env.ASTUDIO_CWD)
        return path.resolve(process.env.ASTUDIO_CWD);
    return process.cwd();
}
export function resolvePnpmCommand() {
    return process.env.ASTUDIO_PNPM?.trim() || "pnpm";
}
function nowIso() {
    return new Date().toISOString();
}
//# sourceMappingURL=env.js.map