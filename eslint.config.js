import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";

import noDarkOnlyTokensRule from "./packages/ui/eslint-rules-no-dark-only-tokens.js";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "apps/storybook/storybook-static/**",
      "**/*.mdx",
      "scripts/new-component.mjs",
      "**/.*/**",
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
      "@chatui-dark-only-tokens": noDarkOnlyTokensRule,
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
      // Prevent dark-only token usage (media mode)
      "@chatui-dark-only-tokens/no-dark-only-tokens": [
        "error",
        {
          // Optional: allow specific patterns if needed
          allowedPatterns: [],
        },
      ],
    },
  },
  {
    files: ["**/*.stories.*"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
  {
    files: ["**/*.mjs", "**/*.cjs", "apps/mcp/**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-require-imports": "off",
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
];
