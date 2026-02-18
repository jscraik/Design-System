import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";

import { IconChevronRightMd, IconEmail, IconPlusLg, IconRefresh } from "../../../../icons";

import { Button } from "./fallback/Button";

/**
 * Button component following Apps SDK UI patterns.
 *
 * Buttons are used to trigger actions or navigate to new pages.
 * They support multiple variants, sizes, and states.
 *
 * ## Usage
 * ```tsx
 * import { Button } from "@design-studio/ui";
 *
 * <Button variant="default" size="default">
 *   Click me
 * </Button>
 * ```
 *
 * ## Accessibility
 * - All buttons have proper focus states
 * - Disabled buttons are properly announced to screen readers
 * - Icon-only buttons should include `aria-label`
 */
const meta: Meta<typeof Button> = {
  title: "Components/UI/Base/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A versatile button component with multiple variants and sizes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
      description: "The visual style of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    asChild: {
      control: "boolean",
      description: "Render as child element (for composition)",
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic stories
export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

// Size variations
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <IconRefresh className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </>
    ),
  },
};

// With icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <IconEmail className="mr-2 h-4 w-4" />
        Login with Email
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    size: "icon",
    "aria-label": "Add item",
    children: <IconPlusLg className="h-4 w-4" />,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: (
      <>
        Next
        <IconChevronRightMd className="ml-2 h-4 w-4" />
      </>
    ),
  },
};

// Showcase all variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available button variants displayed together.",
      },
    },
  },
};

// Showcase all sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Icon button">
        <IconPlusLg className="h-4 w-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available button sizes displayed together.",
      },
    },
  },
};

// Interaction test stories
export const ClickInteraction: Story = {
  args: {
    children: "Click me",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test initial state
    await expect(button).toBeInTheDocument();
    await expect(button).toBeEnabled();

    // Test click interaction
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    // Test accessibility
    await expect(button).toHaveAccessibleName("Click me");
  },
};

export const KeyboardNavigation: Story = {
  args: {
    children: "Keyboard accessible",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Test keyboard focus
    await userEvent.tab();
    await expect(button).toHaveFocus();

    // Test Enter key activation
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const DisabledState: Story = {
  args: {
    children: "Disabled button",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("disabled");
  },
};
