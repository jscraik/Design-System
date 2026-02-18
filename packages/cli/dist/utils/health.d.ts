import type { CliArgs } from "../types.js";
export declare function checkPnpm(execAllowed: boolean): Promise<{
    name: string;
    status: "ok" | "warn" | "error";
    details: string;
}>;
export declare function checkMcp(opts: CliArgs): Promise<{
    name: string;
    status: "ok" | "warn" | "error";
    details: string;
} | null>;
export declare function doctor(opts: CliArgs): Promise<number>;
//# sourceMappingURL=health.d.ts.map