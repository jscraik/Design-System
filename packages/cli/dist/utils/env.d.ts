import type { GlobalOptions } from "../types.js";
import { type TraceContext } from "./trace.js";
export declare function parseBooleanEnv(value?: string): boolean | undefined;
export declare function getToolVersion(): string;
export declare function shouldColor(opts: GlobalOptions): boolean;
export declare function baseEnv(opts: GlobalOptions, traceContext?: TraceContext): NodeJS.ProcessEnv;
export declare function resolveCwd(opts: GlobalOptions): string;
export declare function resolvePnpmCommand(): string;
/**
 * Get environment variables for propagating trace context to child processes
 */
export declare function getTraceEnv(context: TraceContext): Record<string, string>;
//# sourceMappingURL=env.d.ts.map