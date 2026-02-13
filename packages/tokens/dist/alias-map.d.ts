type AliasPath = {
    path: string;
};
type AliasValue = AliasPath | {
    value: string | number;
};
type ModeAlias = {
    light: AliasValue;
    dark: AliasValue;
    highContrast: AliasValue;
};
type ColorAliasMap = {
    [token: string]: ModeAlias;
};
export type TokenAliasMap = {
    color: {
        background: ColorAliasMap;
        text: ColorAliasMap;
        icon: ColorAliasMap;
        border: ColorAliasMap;
        accent: ColorAliasMap;
        interactive: ColorAliasMap;
    };
    space: Record<string, AliasValue>;
    radius: Record<string, AliasValue>;
    shadow: Record<string, AliasValue>;
    size: Record<string, AliasValue>;
    type: Record<string, AliasValue>;
    motion: Record<string, AliasValue>;
};
export declare const tokenAliasMap: TokenAliasMap;
export {};
//# sourceMappingURL=alias-map.d.ts.map