#!/usr/bin/env node
/**
 * Component Generator
 * Usage: node scripts/new-component.mjs ComponentName [category]
 * 
 * Categories:
 *   - primitive (default) -> packages/ui/src/app/components/ui/
 *   - chat -> packages/ui/src/app/components/
 *   - template -> packages/ui/src/templates/
 *   - page -> packages/ui/src/app/pages/
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const [,, name, category = "primitive"] = process.argv;

if (!name) {
  console.error("Usage: node scripts/new-component.mjs ComponentName [category]");
  console.error("Categories: primitive, chat, template, page");
  process.exit(1);
}

const kebabCase = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

const paths = {
  primitive: `packages/ui/src/app/components/ui/${kebabCase}.tsx`,
  chat: `packages/ui/src/app/components/${name}.tsx`,
  template: `packages/ui/src/templates/${name}.tsx`,
  page: `packages/ui/src/app/pages/${name}.tsx`,
};

const storyPaths = {
  primitive: `packages/ui/src/app/components/ui/${kebabCase}.stories.tsx`,
  chat: `packages/ui/src/app/components/${name}.stories.tsx`,
  template: `packages/ui/src/templates/${name}.stories.tsx`,
  page: `packages/ui/src/app/pages/${name}.stories.tsx`,
};

const componentPath = paths[category];
const storyPath = storyPaths[category];

if (!componentPath) {
  console.error(`Unknown category: ${category}`);
  process.exit(1);
}

const fullComponentPath = join(rootDir, componentPath);
const fullStoryPath = join(rootDir, storyPath);

if (existsSync(fullComponentPath)) {
  console.error(`Component already exists: ${componentPath}`);
  process.exit(1);
}

// Component template
const componentTemplate = category === "primitive" ? `import * as React from "react";
import { cn } from "./utils";

export interface ${name}Props {
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * ${name} - A reusable UI component
 * 
 * @example
 * \`\`\`tsx
 * <${name} onClick={() => console.log('clicked')}>
 *   Content
 * </${name}>
 * \`\`\`
 */
export function ${name}({ 
  className, 
  children, 
  onClick,
  disabled = false,
}: ${name}Props) {
  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

${name}.displayName = "${name}";
` : `import * as React from "react";

export interface ${name}Props {
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
}

/**
 * ${name} component
 * 
 * @example
 * \`\`\`tsx
 * <${name}>Content</${name}>
 * \`\`\`
 */
export function ${name}({ className, children }: ${name}Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

${name}.displayName = "${name}";
`;

// Story template
const storyTemplate = `import type { Meta, StoryObj } from "@storybook/react";
import { ${name} } from "./${category === "primitive" ? kebabCase : name}";

const meta: Meta<typeof ${name}> = {
  title: "${category === "primitive" ? "UI" : category === "chat" ? "ChatUI" : category === "template" ? "Templates" : "Pages"}/${name}",
  component: ${name},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ${name}>;

export const Default: Story = {
  args: {
    children: "Hello ${name}",
  },
};
`;

// Create directories if needed
mkdirSync(dirname(fullComponentPath), { recursive: true });

// Write files
writeFileSync(fullComponentPath, componentTemplate);
writeFileSync(fullStoryPath, storyTemplate);

console.log(`✅ Created component: ${componentPath}`);
console.log(`✅ Created story: ${storyPath}`);
console.log(`\nNext steps:`);
console.log(`1. Edit the component: ${componentPath}`);
console.log(`2. Add to exports in packages/ui/src/index.ts`);
console.log(`3. Run: pnpm storybook:dev`);
