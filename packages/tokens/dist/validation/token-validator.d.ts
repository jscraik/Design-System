type ValidationError = {
    code: string;
    message: string;
    suggestion: string;
};
type ValidationResult = {
    errors: ValidationError[];
};
type NonColorAliasCategory = "space" | "radius" | "size" | "shadow" | "type";
declare const NON_COLOR_ALIAS_VALUE_ALLOWLIST: Record<NonColorAliasCategory, ReadonlySet<string | number>>;
export declare function validateTokens(): Promise<ValidationResult>;
type NonColorAliasValueAllowlist = Readonly<{
    [K in keyof typeof NON_COLOR_ALIAS_VALUE_ALLOWLIST]: ReadonlySet<string>;
}>;
export type { ValidationError, NonColorAliasValueAllowlist };
/**
 * Read-only view of the non-color alias value allowlist.
 * The underlying configuration should only be modified within this module.
 */
export declare const NON_COLOR_ALIAS_VALUE_ALLOWLIST_READONLY: NonColorAliasValueAllowlist;
//# sourceMappingURL=token-validator.d.ts.map