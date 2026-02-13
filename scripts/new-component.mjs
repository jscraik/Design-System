#!/usr/bin/env node
/**
 * Component Generator
 * Usage: node scripts/new-component.mjs ComponentName [category]
 *
 * Categories:
 *   - primitive (default) -> packages/ui/src/components/ui/base/
 *   - chat -> packages/ui/src/app/chat/
 *   - template -> packages/ui/src/templates/
 *   - page -> packages/ui/src/storybook/pages/
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const [, , name, category = "primitive"] = process.argv;

if (!name) {
  console.error("Usage: node scripts/new-component.mjs ComponentName [category]");
  console.error("Categories: primitive, chat, template, page");
  process.exit(1);
}

const ACRONYMS = new Set(["OTP"]);
const toPascalCase = (value) => {
  const spaced = value.replace(/[_\\s-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced
    .split(" ")
    .filter(Boolean)
    .map((part) => {
      const upper = part.toUpperCase();
      if (ACRONYMS.has(upper)) {
        return upper;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
};

const componentName = toPascalCase(name);

const paths = {
  primitive: `packages/ui/src/components/ui/base/${componentName}/${componentName}.tsx`,
  chat: `packages/ui/src/app/chat/${componentName}/${componentName}.tsx`,
  template: `packages/ui/src/templates/${componentName}/${componentName}.tsx`,
  page: `packages/ui/src/storybook/pages/${componentName}/${componentName}.tsx`,
};

const storyPaths = {
  primitive: `packages/ui/src/components/ui/base/${componentName}/${componentName}.stories.tsx`,
  chat: `packages/ui/src/app/chat/${componentName}/${componentName}.stories.tsx`,
  template: `packages/ui/src/templates/${componentName}/${componentName}.stories.tsx`,
  page: `packages/ui/src/storybook/pages/${componentName}/${componentName}.stories.tsx`,
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
const componentTemplate =
  category === "primitive"
    ? `import * as React from "react";
import { cn } from "../../utils";

export interface ${componentName}Props {
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
 * ${componentName} - A reusable UI component
 * 
 * @example
 * \`\`\`tsx
 * <${componentName} onClick={() => console.log('clicked')}>
 *   Content
 * </${componentName}>
 * \`\`\`
 */
export function ${componentName}({ 
  className, 
  children, 
  onClick,
  disabled = false,
}: ${componentName}Props) {
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

${componentName}.displayName = "${componentName}";
`
    : `import * as React from "react";

export interface ${componentName}Props {
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
}

/**
 * ${componentName} component
 * 
 * @example
 * \`\`\`tsx
 * <${componentName}>Content</${componentName}>
 * \`\`\`
 */
export function ${componentName}({ className, children }: ${componentName}Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

${componentName}.displayName = "${componentName}";
`;

// Story template
const storyTemplate = `import type { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from "./${componentName}";

const meta: Meta<typeof ${componentName}> = {
  title: "${category === "primitive" ? "UI" : category === "chat" ? "ChatUI" : category === "template" ? "Templates" : "Pages"}/${componentName}",
  component: ${componentName},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {
    children: "Hello ${componentName}",
  },
};
`;

// Test template
const testTemplate =
  category === "primitive"
    ? `import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ${componentName} } from "./${componentName}";

describe("${componentName}", () => {
  it("renders without crashing", () => {
    render(<${componentName} />);
    expect(screen.getByRole("generic")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <${componentName} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<${componentName} onClick={handleClick} />);
    // Add click interaction test based on component implementation
  });

  it("renders children correctly", () => {
    render(<${componentName}>Test content</${componentName}>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
`
    : `import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ${componentName} } from "./${componentName}";

describe("${componentName}", () => {
  it("renders without crashing", () => {
    render(<${componentName}>Test content</${componentName}>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <${componentName} className="custom-class">Test</${componentName}>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
`;

// Create directories if needed
mkdirSync(dirname(fullComponentPath), { recursive: true });

// Write files
writeFileSync(fullComponentPath, componentTemplate);
writeFileSync(fullStoryPath, storyTemplate);

// Write test file
const testPath = fullComponentPath.replace(".tsx", ".test.tsx");
writeFileSync(testPath, testTemplate);

console.log(`✅ Created component: ${componentPath}`);
console.log(`✅ Created story: ${storyPath}`);
console.log(`✅ Created test: ${componentPath.replace(".tsx", ".test.tsx")}`);
console.log(`\nNext steps:`);
console.log(`1. Edit the component: ${componentPath}`);
console.log(`2. Add to exports in packages/ui/src/index.ts`);
console.log(`3. Run: pnpm storybook:dev`);
