import type { GlobalOptions, RunResult } from "../types.js";
export declare function runPnpm(opts: GlobalOptions, args: string[], overrides?: {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}): Promise<RunResult>;
export declare function runCommandCapture(command: string, args: string[]): Promise<{
    code: number;
    stdout: string;
    stderr: string;
}>;
export declare function emitResult(opts: GlobalOptions, result: RunResult, summary: string): void;
export declare function handleRun(opts: Record<string, unknown>, args: string[], summary: string, target?: string): Promise<number>;
//# sourceMappingURL=exec.d.ts.map