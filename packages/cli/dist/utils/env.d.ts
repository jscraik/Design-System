import type { GlobalOptions } from "../types.js";
export declare function parseBooleanEnv(value?: string): boolean | undefined;
export declare function getToolVersion(): string;
export declare function shouldColor(opts: GlobalOptions): boolean;
export declare function baseEnv(opts: GlobalOptions): NodeJS.ProcessEnv;
export declare function resolveCwd(opts: GlobalOptions): string;
export declare function resolvePnpmCommand(): string;
//# sourceMappingURL=env.d.ts.map