import type { Meta, StoryObj } from "@storybook/react";

import { TextLink } from "./TextLink";

/**
 * TextLink component - accessible anchor element with variant styling.
 *
 * ## Usage
 * ```tsx
 * import { TextLink } from "@design-studio/ui";
 *
 * <TextLink href="/docs">Read documentation</TextLink>
 * ```
 *
 * ## Accessibility
 * - External links (http/https) automatically open in new tab with security attributes
 * - When `target="_blank"`, always enforces `rel="noopener noreferrer"` to prevent tabnabbing
 * - Respects `aria-disabled`, `aria-invalid`, and `aria-required` for form contexts
 * - External icon has `aria-label="Opens in new tab"` for screen readers
 *
 * ## Security
 * - External links get `rel="noopener noreferrer"` automatically
 * - Disabled links have `href` removed to prevent navigation
 *
 * ## Keyboard Navigation
 * - Tab to focus - shows visible focus ring
 * - Enter activates - navigates to href
 * - Disabled links are skipped in tab order (via aria-disabled)
 */

const meta: Meta<typeof TextLink> = {
  title: "Components/UI/Base/TextLink",
  component: TextLink,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "An accessible text link component with variant styling, external link handling, and state support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "subtle", "inline", "nav", "destructive"],
      description: "Visual style variant",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Text size",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    href: {
      control: "text",
      description: "Link destination URL",
    },
    external: {
      control: "boolean",
      description: "Force external link behavior (opens in new tab)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showExternalIcon: {
      control: "boolean",
      description: "Show external link icon for external URLs",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disable the link (removes href, adds opacity)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    loading: {
      control: "boolean",
      description: "Loading state (visual indicator)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    error: {
      control: "boolean",
      description: "Error state (shows destructive styling)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextLink>;

export const Default: Story = {
  args: {
    href: "/docs",
    children: "Read documentation",
  },
};

export const Subtle: Story = {
  args: {
    href: "/about",
    variant: "subtle",
    children: "Learn more about us",
  },
};

export const Inline: Story = {
  args: {
    href: "/terms",
    variant: "inline",
    children: "View terms and conditions",
  },
};

export const Navigation: Story = {
  args: {
    href: "/dashboard",
    variant: "nav",
    children: "Go to dashboard",
  },
};

export const Destructive: Story = {
  args: {
    href: "/delete-account",
    variant: "destructive",
    children: "Delete account",
  },
};

export const Small: Story = {
  args: {
    href: "/read-more",
    size: "sm",
    children: "Read more",
  },
};

export const Large: Story = {
  args: {
    href: "/explore",
    size: "lg",
    children: "Explore all features",
  },
};

export const ExternalLink: Story = {
  args: {
    href: "https://example.com",
    external: true,
    showExternalIcon: true,
    children: "Visit external site",
  },
};

export const AutoExternal: Story = {
  args: {
    href: "https://openai.com",
    showExternalIcon: true,
    children: "OpenAI website",
  },
};

export const Disabled: Story = {
  args: {
    href: "/disabled-link",
    disabled: true,
    children: "This link is disabled",
  },
};

export const Loading: Story = {
  args: {
    href: "/loading",
    loading: true,
    children: "Loading content...",
  },
};

export const Error: Story = {
  args: {
    href: "/error-link",
    error: true,
    children: "Link has error",
  },
};

// Accessibility test story for keyboard navigation
export const KeyboardFocus: Story = {
  args: {
    href: "/focus-test",
    children: "Test keyboard focus (Tab to me)",
  },
  parameters: {
    layout: "centered",
  },
};

// Multiple links in a paragraph (inline usage)
export const InParagraph: Story = {
  render: () => (
    <p className="max-w-md text-foreground">
      This is a paragraph with{" "}
      <TextLink href="/embedded-link">an embedded link</TextLink> that flows
      naturally with the text. You can also have{" "}
      <TextLink href="/another-link" variant="subtle">
        another link
      </TextLink>{" "}
      with a different variant.
    </p>
  ),
};
