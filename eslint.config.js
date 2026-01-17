import js from "@eslint/js";
import complexity from "eslint-plugin-complexity";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

import noConsoleInProductionRule from "./packages/ui/eslint-rules-no-console-in-production.js";
import noDarkOnlyTokensRule from "./packages/ui/eslint-rules-no-dark-only-tokens.js";
import noDeprecatedImportsRule from "./packages/ui/eslint-rules-no-deprecated-imports.js";
import noLucideDirectImportsRule from "./packages/ui/eslint-rules-no-lucide-direct-imports.js";
import noRawTokensRule from "./packages/ui/eslint-rules-no-raw-tokens.js";
import noWindowOpenaiDirectAccessRule from "./packages/ui/eslint-rules-no-window-openai-direct-access.js";
import appsSdkFirstRule from "./packages/ui/eslint-rules-apps-sdk-first.js";
import radixFallbackOnlyRule from "./packages/ui/eslint-rules-radix-fallback-only.js";
import uiSubpathImportsRule from "./packages/ui/eslint-rules-ui-subpath-imports.js";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "platforms/web/apps/storybook/storybook-static/**",
      "**/*.mdx",
      "scripts/new-component.mjs",
      "**/.*/**",
      "_temp/**",
      "**/_temp_import/**",
      "**/docs/examples/**",
      "**/src/**/generated/**",
      "pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      sonarjs,
      complexity,
      "@astudio-dark-only-tokens": noDarkOnlyTokensRule,
      "@astudio-ui-subpaths": uiSubpathImportsRule,
      "@astudio-no-lucide-direct-imports": noLucideDirectImportsRule,
      "@astudio-no-raw-tokens": noRawTokensRule,
      "@astudio-no-console": noConsoleInProductionRule,
      "@astudio-no-window-openai": noWindowOpenaiDirectAccessRule,
      "@astudio-no-deprecated": noDeprecatedImportsRule,
      "@astudio-apps-sdk-first": appsSdkFirstRule,
      "@astudio-radix-fallback": radixFallbackOnlyRule,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/order": ["warn", { "newlines-between": "always" }],
      "jsx-a11y/control-has-associated-label": [
        "error",
        {
          labelAttributes: ["aria-label", "aria-labelledby", "title"],
          controlComponents: ["IconButton", "Button"],
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      // Prevent accidental coupling to archived Figma export bundles.
      // `_temp/**` is kept as a reference only and must never be imported by product code.
      "no-restricted-imports": [
        "error",
        {
          patterns: ["**/_temp/**", "_temp/**"],
          paths: [
            {
              name: "@astudio/ui/dev",
              message:
                "Dev-only export. Use @astudio/ui/* or @astudio/ui/experimental outside local harnesses.",
            },
          ],
        },
      ],
      // Complexity rules (warnings initially, can be escalated to errors)
      "sonarjs/cognitive-complexity": ["warn", 25],
      complexity: ["warn", 15],
      "sonarjs/max-switch-cases": ["warn", 15],
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-identical-expressions": "error",
      // Prevent dark-only token usage (media mode)
      "@astudio-dark-only-tokens/no-dark-only-tokens": [
        "error",
        {
          // Optional: allow specific patterns if needed
          allowedPatterns: [],
        },
      ],
      // Enforce UI package subpath imports
      "@astudio-ui-subpaths/ui-subpath-imports": "error",
      // Enforce icon imports through canonical icon system
      "@astudio-no-lucide-direct-imports/no-lucide-direct-imports": [
        "warn",
        {
          // Allow lucide-react in these patterns (e.g., reference/template code)
          allowInPatterns: [
            "**/node_modules/**",
            "**/_temp/**",
            "**/_temp_import/**",
            "**/packages/widgets/**",
          ],
        },
      ],
      // Prevent console statements in production
      "@astudio-no-console/no-console-in-production": [
        "warn",
        {
          // Allow console methods in these contexts
          allow: [],
        },
      ],
      // Prevent direct window.openai access (use runtime host abstraction)
      "@astudio-no-window-openai/no-window-openai-direct-access": [
        "error",
        {
          // Allow window.openai access in these patterns
          allowInPatterns: [
            "**/node_modules/**",
            "**/*.test.*",
            "**/*.spec.*",
            "**/packages/runtime/**",
            "**/packages/widgets/**",
            "**/platforms/mcp/**",
          ],
        },
      ],
      // Prevent imports from deprecated/archived paths
      "@astudio-no-deprecated/no-deprecated-imports": [
        "error",
        {
          deprecatedPatterns: ["**/_temp/**", "**/_temp_import/**"],
          deprecatedPaths: ["@astudio/ui/dev"],
          customMessages: {
            "@astudio/ui/dev":
              "Dev-only export. Use @astudio/ui/* or @astudio/ui/experimental outside local harnesses.",
          },
        },
      ],
      // Restrict Radix primitives to fallback components
      "@astudio-radix-fallback/radix-fallback-only": "error",
      // Prefer Apps SDK UI re-exports where available
      "@astudio-apps-sdk-first/apps-sdk-first": [
        "error",
        {
          allowInPatterns: [
            "**/packages/ui/src/components/**",
            "**/packages/ui/src/templates/**",
            "**/packages/ui/src/design-system/**",
            "**/packages/ui/src/storybook/**",
            "**/packages/ui/src/app/**",
          ],
        },
      ],
    },
  },
  {
    files: ["packages/ui/src/components/**/*.{ts,tsx}"],
    ignores: ["**/*.stories.*", "**/*.test.*", "**/dev/**"],
    rules: {
      "@astudio-no-raw-tokens/no-raw-tokens": "error",
    },
  },
  {
    files: ["**/*.stories.*"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      // Allow higher complexity for stories
      "sonarjs/cognitive-complexity": ["off"],
      "sonarjs/no-duplicate-string": ["off"],
    },
  },
  {
    files: [
      "packages/ui/src/app/**/*.tsx",
      "packages/ui/src/components/**/*.tsx",
      "packages/ui/src/design-system/**/*.tsx",
      "packages/ui/src/fixtures/**/*.tsx",
      "packages/ui/src/storybook/**/*.tsx",
      "packages/widgets/src/widgets/**/*.tsx",
    ],
    rules: {
      "sonarjs/no-duplicate-string": "off",
    },
  },
  {
    files: ["packages/ui/src/templates/**/*.{ts,tsx}"],
    rules: {
      "sonarjs/cognitive-complexity": "off",
      complexity: "off",
      "sonarjs/no-duplicate-string": "off",
    },
  },
  {
    files: ["packages/ui/src/app/chat/**/*.{ts,tsx}"],
    rules: {
      "sonarjs/no-duplicate-string": "off",
    },
  },
  {
    files: [
      "**/*.config.{js,jsx,ts,tsx,mjs,cjs}",
      "**/vite.config.{js,jsx,ts,tsx,mjs,cjs}",
      "**/tailwind.preset.ts",
      "packages/tokens/src/dev-tools/**/*.{js,jsx,ts,tsx,mjs,cjs}",
      "platforms/mcp/**/*.{js,jsx,ts,tsx,mjs,cjs}",
      "packages/cloudflare-template/**/*.{js,jsx,ts,tsx,mjs,cjs}",
      "packages/ui/eslint-rules-*.js",
    ],
    rules: {
      "sonarjs/cognitive-complexity": "off",
      complexity: "off",
      "sonarjs/no-duplicate-string": "off",
    },
  },
  {
    files: [
      "packages/ui/src/components/ui/data-display/Chart/Chart.tsx",
      "packages/ui/src/components/ui/navigation/ModeSelector/ModeSelector.tsx",
      "packages/ui/src/components/ui/navigation/ModelSelector/ModelSelector.tsx",
    ],
    rules: {
      "sonarjs/cognitive-complexity": "off",
      complexity: "off",
    },
  },
  // Allow higher complexity for tests
  {
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx,mjs,cjs}"],
    rules: {
      "sonarjs/cognitive-complexity": ["off"],
      complexity: ["off"],
      "sonarjs/no-duplicate-string": ["off"],
    },
  },
  {
    files: ["**/*.mjs", "**/*.cjs", "platforms/mcp/**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Buffer: "readonly",
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx,mjs,cjs}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly",
        jest: "readonly",
        console: "readonly",
        process: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-case-declarations": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["packages/widgets/src/shared/widget-registry.ts"],
    languageOptions: {
      globals: {
        require: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["packages/tokens/tests/token-validation.test.ts"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-case-declarations": "off",
    },
  },
  {
    files: [
      "platforms/web/apps/storybook/**/*.{js,jsx,ts,tsx}",
      "platforms/web/apps/web/src/pages/TemplateWidgetPage.tsx",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["**/_temp/**", "_temp/**"],
        },
      ],
      // Allow @astudio/ui/dev imports in these specific files
      "@astudio-no-deprecated/no-deprecated-imports": [
        "error",
        {
          deprecatedPatterns: ["**/_temp/**", "**/_temp_import/**"],
          deprecatedPaths: [], // Don't flag @astudio/ui/dev here
          customMessages: {},
        },
      ],
    },
  },
];
