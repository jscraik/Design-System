type ValidationError = {
    code: string;
    message: string;
    suggestion: string;
};
type ValidationResult = {
    errors: ValidationError[];
};
export declare function validateTokens(): Promise<ValidationResult>;
export type { ValidationError };
//# sourceMappingURL=token-validator.d.ts.map