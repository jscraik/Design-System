/**
 * Typography tokens for web usage. Sizes, line heights, and tracking are numeric values.
 *
 * ## Font families
 * - `fontFamily`: UI / body text — SF Pro Text, system-ui fallback chain.
 * - `fontDisplay`: Hero headings and marketing copy — SF Pro Display.
 *   Wire via `--font-display` CSS variable or `font-display` Tailwind class.
 *   On macOS/iOS, SF Pro Display activates automatically for sizes ≥ 20px.
 */
export declare const typographyTokens: {
    readonly fontFamily: "SF Pro Text";
    readonly fontDisplay: "SF Pro Display";
    readonly hero: {
        readonly size: 40;
        readonly lineHeight: 48;
        readonly paragraphSpacing: 32;
        readonly weight: 600;
        readonly tracking: -0.1;
    };
    readonly h1: {
        readonly size: 36;
        readonly lineHeight: 42;
        readonly paragraphSpacing: 24;
        readonly weight: 600;
        readonly tracking: -0.1;
    };
    readonly h2: {
        readonly size: 24;
        readonly lineHeight: 28;
        readonly paragraphSpacing: 24;
        readonly weight: 600;
        readonly tracking: -0.25;
    };
    readonly h3: {
        readonly size: 18;
        readonly lineHeight: 26;
        readonly paragraphSpacing: 16;
        readonly weight: 600;
        readonly tracking: -0.45;
    };
    readonly h4: {
        readonly size: 16;
        readonly lineHeight: 24;
        readonly paragraphSpacing: 16;
        readonly weight: 600;
        readonly tracking: -0.4;
    };
    readonly h5: {
        readonly size: 14;
        readonly lineHeight: 20;
        readonly paragraphSpacing: 12;
        readonly weight: 600;
        readonly tracking: -0.3;
    };
    readonly h6: {
        readonly size: 12;
        readonly lineHeight: 18;
        readonly paragraphSpacing: 12;
        readonly weight: 600;
        readonly tracking: -0.1;
    };
    readonly paragraphLg: {
        readonly size: 18;
        readonly lineHeight: 26;
        readonly paragraphSpacing: 16;
        readonly weight: 400;
        readonly emphasisWeight: 600;
        readonly tracking: -0.4;
    };
    readonly paragraphMd: {
        readonly size: 16;
        readonly lineHeight: 24;
        readonly paragraphSpacing: 12;
        readonly weight: 400;
        readonly emphasisWeight: 600;
        readonly tracking: -0.4;
    };
    readonly paragraphSm: {
        readonly size: 14;
        readonly lineHeight: 20;
        readonly paragraphSpacing: 8;
        readonly weight: 400;
        readonly emphasisWeight: 600;
        readonly tracking: -0.3;
    };
    readonly heading1: {
        readonly size: 36;
        readonly lineHeight: 42;
        readonly weight: 600;
        readonly tracking: -0.1;
    };
    readonly heading2: {
        readonly size: 24;
        readonly lineHeight: 28;
        readonly weight: 600;
        readonly tracking: -0.25;
    };
    readonly heading3: {
        readonly size: 18;
        readonly lineHeight: 26;
        readonly weight: 600;
        readonly tracking: -0.45;
    };
    readonly body: {
        readonly size: 16;
        readonly lineHeight: 24;
        readonly weight: 400;
        readonly emphasisWeight: 600;
        readonly tracking: -0.4;
    };
    readonly bodySmall: {
        readonly size: 14;
        readonly lineHeight: 20;
        readonly weight: 400;
        readonly emphasisWeight: 600;
        readonly tracking: -0.3;
    };
    readonly caption: {
        readonly size: 12;
        readonly lineHeight: 18;
        readonly paragraphSpacing: 8;
        readonly weight: 400;
        readonly emphasisWeight: 600;
        readonly tracking: -0.1;
    };
    readonly cardTitle: {
        readonly size: 18;
        readonly lineHeight: 26;
        readonly weight: 500;
        readonly tracking: -0.43;
    };
    readonly listTitle: {
        readonly size: 16;
        readonly lineHeight: 24;
        readonly weight: 400;
        readonly tracking: -0.4;
    };
    readonly listSubtitle: {
        readonly size: 14;
        readonly lineHeight: 20;
        readonly weight: 400;
        readonly tracking: -0.18;
    };
    readonly buttonLabel: {
        readonly size: 16;
        readonly lineHeight: 24;
        readonly weight: 500;
        readonly tracking: -0.24;
    };
    readonly buttonLabelSmall: {
        readonly size: 14;
        readonly lineHeight: 20;
        readonly weight: 600;
        readonly tracking: -0.3;
    };
};
//# sourceMappingURL=typography.d.ts.map