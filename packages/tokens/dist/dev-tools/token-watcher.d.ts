/**
 * Watches token source files and regenerates outputs on change.
 *
 * @example
 * const watcher = new TokenWatcher();
 * await watcher.start();
 * // Later: await watcher.stop();
 */
export declare class TokenWatcher {
    private watcher;
    private isGenerating;
    private pendingRegeneration;
    constructor();
    private loadTokens;
    /**
     * Validate color token format
     */
    private validateColorTokens;
    /**
     * Validate spacing tokens
     */
    private validateSpacingTokens;
    /**
     * Validate typography tokens
     */
    private validateTypographyTokens;
    /**
     * Validate all tokens
     */
    private validateTokens;
    /**
     * Format validation errors for console output
     */
    private formatValidationErrors;
    /**
     * Regenerate tokens with validation
     */
    private regenerateTokens;
    /**
     * Start watching token files
     */
    start(): Promise<void>;
    /**
     * Stop watching token files
     */
    stop(): Promise<void>;
    private runGeneration;
}
//# sourceMappingURL=token-watcher.d.ts.map