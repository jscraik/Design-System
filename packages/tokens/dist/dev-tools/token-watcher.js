import { spawn } from "child_process";
import { join } from "path";
import { pathToFileURL } from "url";
import chokidar from "chokidar";
/**
 * Watches token source files and regenerates outputs on change.
 *
 * @example
 * const watcher = new TokenWatcher();
 * await watcher.start();
 * // Later: await watcher.stop();
 */
export class TokenWatcher {
    watcher = null;
    isGenerating = false;
    pendingRegeneration = false;
    constructor() { }
    async loadTokens() {
        const cacheBuster = `?v=${Date.now()}`;
        const colorsUrl = pathToFileURL(join(process.cwd(), "src/colors.ts")).href + cacheBuster;
        const spacingUrl = pathToFileURL(join(process.cwd(), "src/spacing.ts")).href + cacheBuster;
        const typographyUrl = pathToFileURL(join(process.cwd(), "src/typography.ts")).href + cacheBuster;
        const [colorsModule, spacingModule, typographyModule] = await Promise.all([
            import(colorsUrl),
            import(spacingUrl),
            import(typographyUrl),
        ]);
        return {
            colorTokens: colorsModule.colorTokens,
            spacingScale: spacingModule.spacingScale,
            typographyTokens: typographyModule.typographyTokens,
        };
    }
    /**
     * Validate color token format
     */
    validateColorTokens(tokens) {
        const errors = [];
        const hexPattern = /^#[0-9A-Fa-f]{6}$/;
        // Validate background colors
        Object.entries(tokens.colorTokens.background.light).forEach(([key, value]) => {
            if (!hexPattern.test(value)) {
                errors.push({
                    field: `colorTokens.background.light.${key}`,
                    message: `Invalid hex color: ${value}`,
                    suggestion: "Use format #RRGGBB (e.g., #FFFFFF)",
                });
            }
        });
        Object.entries(tokens.colorTokens.background.dark).forEach(([key, value]) => {
            if (!hexPattern.test(value)) {
                errors.push({
                    field: `colorTokens.background.dark.${key}`,
                    message: `Invalid hex color: ${value}`,
                    suggestion: "Use format #RRGGBB (e.g., #000000)",
                });
            }
        });
        // Validate text colors
        Object.entries(tokens.colorTokens.text.light).forEach(([key, value]) => {
            if (!hexPattern.test(value)) {
                errors.push({
                    field: `colorTokens.text.light.${key}`,
                    message: `Invalid hex color: ${value}`,
                    suggestion: "Use format #RRGGBB",
                });
            }
        });
        Object.entries(tokens.colorTokens.text.dark).forEach(([key, value]) => {
            if (!hexPattern.test(value)) {
                errors.push({
                    field: `colorTokens.text.dark.${key}`,
                    message: `Invalid hex color: ${value}`,
                    suggestion: "Use format #RRGGBB",
                });
            }
        });
        // Validate icon colors
        Object.entries(tokens.colorTokens.icon.light).forEach(([key, value]) => {
            if (!hexPattern.test(value)) {
                errors.push({
                    field: `colorTokens.icon.light.${key}`,
                    message: `Invalid hex color: ${value}`,
                    suggestion: "Use format #RRGGBB",
                });
            }
        });
        Object.entries(tokens.colorTokens.icon.dark).forEach(([key, value]) => {
            if (!hexPattern.test(value)) {
                errors.push({
                    field: `colorTokens.icon.dark.${key}`,
                    message: `Invalid hex color: ${value}`,
                    suggestion: "Use format #RRGGBB",
                });
            }
        });
        // Validate accent colors
        Object.entries(tokens.colorTokens.accent.light).forEach(([key, value]) => {
            if (!hexPattern.test(value)) {
                errors.push({
                    field: `colorTokens.accent.light.${key}`,
                    message: `Invalid hex color: ${value}`,
                    suggestion: "Use format #RRGGBB",
                });
            }
        });
        Object.entries(tokens.colorTokens.accent.dark).forEach(([key, value]) => {
            if (!hexPattern.test(value)) {
                errors.push({
                    field: `colorTokens.accent.dark.${key}`,
                    message: `Invalid hex color: ${value}`,
                    suggestion: "Use format #RRGGBB",
                });
            }
        });
        return errors;
    }
    /**
     * Validate spacing tokens
     */
    validateSpacingTokens(tokens) {
        const errors = [];
        tokens.spacingScale.forEach((value, index) => {
            if (typeof value !== "number" || value < 0) {
                errors.push({
                    field: `spacingScale[${index}]`,
                    message: `Invalid spacing value: ${value}`,
                    suggestion: "Spacing values must be non-negative numbers",
                });
            }
        });
        // Check if spacing scale is in descending order
        for (let i = 0; i < tokens.spacingScale.length - 1; i++) {
            if (tokens.spacingScale[i] < tokens.spacingScale[i + 1]) {
                errors.push({
                    field: "spacingScale",
                    message: "Spacing scale should be in descending order",
                    suggestion: `Value at index ${i} (${tokens.spacingScale[i]}) is less than value at index ${i + 1} (${tokens.spacingScale[i + 1]})`,
                });
            }
        }
        return errors;
    }
    /**
     * Validate typography tokens
     */
    validateTypographyTokens(tokens) {
        const errors = [];
        Object.entries(tokens.typographyTokens).forEach(([key, value]) => {
            if (key === "fontFamily") {
                if (typeof value !== "string" || value.trim() === "") {
                    errors.push({
                        field: "typographyTokens.fontFamily",
                        message: "Font family must be a non-empty string",
                        suggestion: 'Provide a valid font family name (e.g., "SF Pro")',
                    });
                }
                return;
            }
            const token = value;
            if (typeof token.size !== "number" || token.size <= 0) {
                errors.push({
                    field: `typographyTokens.${key}.size`,
                    message: `Invalid font size: ${token.size}`,
                    suggestion: "Font size must be a positive number",
                });
            }
            if (typeof token.lineHeight !== "number" || token.lineHeight <= 0) {
                errors.push({
                    field: `typographyTokens.${key}.lineHeight`,
                    message: `Invalid line height: ${token.lineHeight}`,
                    suggestion: "Line height must be a positive number",
                });
            }
            if (typeof token.weight !== "number" || token.weight < 100 || token.weight > 900) {
                errors.push({
                    field: `typographyTokens.${key}.weight`,
                    message: `Invalid font weight: ${token.weight}`,
                    suggestion: "Font weight must be between 100 and 900",
                });
            }
            if (token.emphasisWeight !== undefined) {
                if (typeof token.emphasisWeight !== "number" ||
                    token.emphasisWeight < 100 ||
                    token.emphasisWeight > 900) {
                    errors.push({
                        field: `typographyTokens.${key}.emphasisWeight`,
                        message: `Invalid emphasis weight: ${token.emphasisWeight}`,
                        suggestion: "Emphasis weight must be between 100 and 900",
                    });
                }
            }
            if (typeof token.tracking !== "number") {
                errors.push({
                    field: `typographyTokens.${key}.tracking`,
                    message: `Invalid tracking: ${token.tracking}`,
                    suggestion: "Tracking must be a number",
                });
            }
        });
        return errors;
    }
    /**
     * Validate all tokens
     */
    async validateTokens() {
        const tokens = await this.loadTokens();
        return [
            ...this.validateColorTokens(tokens),
            ...this.validateSpacingTokens(tokens),
            ...this.validateTypographyTokens(tokens),
        ];
    }
    /**
     * Format validation errors for console output
     */
    formatValidationErrors(errors) {
        let output = "\n❌ Token validation failed:\n\n";
        errors.forEach((error, index) => {
            output += `${index + 1}. ${error.field}\n`;
            output += `   ${error.message}\n`;
            if (error.suggestion) {
                output += `   💡 ${error.suggestion}\n`;
            }
            output += "\n";
        });
        return output;
    }
    /**
     * Regenerate tokens with validation
     */
    async regenerateTokens() {
        if (this.isGenerating) {
            this.pendingRegeneration = true;
            return;
        }
        this.isGenerating = true;
        try {
            console.log("\n🔄 Validating tokens...");
            // Validate tokens
            const errors = await this.validateTokens();
            if (errors.length > 0) {
                console.error(this.formatValidationErrors(errors));
                console.log("⚠️  Fix validation errors before tokens can be regenerated\n");
                return;
            }
            console.log("✅ Token validation passed");
            console.log("🔨 Generating outputs...");
            // Generate all outputs
            await this.runGeneration();
            console.log("✨ Token generation complete! Web previews will refresh automatically.\n");
        }
        catch (error) {
            console.error("\n❌ Token generation failed:");
            console.error(error);
            console.log("");
        }
        finally {
            this.isGenerating = false;
            // If another change happened during generation, regenerate
            if (this.pendingRegeneration) {
                this.pendingRegeneration = false;
                setTimeout(() => this.regenerateTokens(), 100);
            }
        }
    }
    /**
     * Start watching token files
     */
    async start() {
        const tokenFiles = [
            join(process.cwd(), "src/colors.ts"),
            join(process.cwd(), "src/spacing.ts"),
            join(process.cwd(), "src/typography.ts"),
        ];
        console.log("👀 Token watcher started");
        console.log("   Watching:");
        tokenFiles.forEach((file) => console.log(`   - ${file}`));
        console.log("\n💡 Edit token files to see instant updates in web previews\n");
        // Initial generation
        await this.regenerateTokens();
        // Watch for changes
        this.watcher = chokidar.watch(tokenFiles, {
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 100,
                pollInterval: 50,
            },
        });
        this.watcher.on("change", (path) => {
            console.log(`\n📝 Token file changed: ${path}`);
            this.regenerateTokens();
        });
        this.watcher.on("error", (error) => {
            console.error("❌ Watcher error:", error);
        });
    }
    /**
     * Stop watching token files
     */
    async stop() {
        if (this.watcher) {
            await this.watcher.close();
            this.watcher = null;
            console.log("\n👋 Token watcher stopped\n");
        }
    }
    runGeneration() {
        return new Promise((resolve, reject) => {
            const child = spawn("pnpm", ["generate"], {
                cwd: process.cwd(),
                stdio: "inherit",
            });
            child.on("error", reject);
            child.on("close", (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`Token generation failed with exit code ${code}`));
                }
            });
        });
    }
}
// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
    const watcher = new TokenWatcher();
    // Handle graceful shutdown
    process.on("SIGINT", async () => {
        await watcher.stop();
        process.exit(0);
    });
    process.on("SIGTERM", async () => {
        await watcher.stop();
        process.exit(0);
    });
    // Start watching
    watcher.start().catch((error) => {
        console.error("Failed to start token watcher:", error);
        process.exit(1);
    });
}
