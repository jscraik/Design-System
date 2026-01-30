import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";

import { Button } from "../Button";
import { Label } from "../Label";
import { IconEye, IconEyeOff, IconSearch } from "../../../../icons";

import { Input } from "./Input";

/**
 * Input component for text entry.
 *
 * Inputs are used to collect user data through text fields.
 * They support various types, states, and can be combined with labels and icons.
 *
 * ## Usage
 * ```tsx
 * import { Input } from "@design-studio/ui";
 *
 * <Input type="email" placeholder="Enter your email" />
 * ```
 *
 * ## Accessibility
 * - Always pair inputs with labels using `htmlFor`
 * - Use `aria-describedby` for error messages
 * - Disabled inputs are properly announced
 */
const meta: Meta<typeof Input> = {
  title: "Components/UI/Base/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A text input component for collecting user data.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
      description: "The type of input",
      table: {
        defaultValue: { summary: "text" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
  },
  args: {
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    className: "w-64",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "hello@example.com",
    className: "w-64",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@example.com",
    className: "w-64",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
    className: "w-64",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0",
    className: "w-32",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
    className: "w-64",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input paired with a label for accessibility.",
      },
    },
  },
};

export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-helper">Email</Label>
      <Input
        type="email"
        id="email-helper"
        placeholder="Email"
        aria-describedby="email-description"
        {...args}
      />
      <p id="email-description" className="text-sm text-muted-foreground">
        We'll never share your email with anyone else.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input with helper text using aria-describedby.",
      },
    },
  },
};

export const WithError: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email-error">Email</Label>
      <Input
        type="email"
        id="email-error"
        placeholder="Email"
        aria-invalid="true"
        aria-describedby="email-error-message"
        className="border-destructive focus-visible:ring-destructive"
        {...args}
      />
      <p id="email-error-message" className="text-sm text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input in error state with error message.",
      },
    },
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="relative w-64">
      <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input type="search" placeholder="Search..." className="pl-8" {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input with a leading icon.",
      },
    },
  },
};

export const WithButton: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="email" placeholder="Email" {...args} />
      <Button type="submit">Subscribe</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Input combined with a button for form submission.",
      },
    },
  },
};

export const PasswordToggle: Story = {
  render: function PasswordToggleInput(args) {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative w-64">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          className="pr-10"
          {...args}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <IconEyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <IconEye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Password input with visibility toggle.",
      },
    },
  },
};

// Interaction tests
export const TypeInteraction: Story = {
  args: {
    placeholder: "Type here...",
    className: "w-64",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    // Test initial state
    await expect(input).toBeInTheDocument();
    await expect(input).toBeEnabled();

    // Test typing
    await userEvent.type(input, "Hello, World!");
    await expect(input).toHaveValue("Hello, World!");

    // Verify onChange was called
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const FocusBlurInteraction: Story = {
  args: {
    placeholder: "Focus me...",
    className: "w-64",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    // Test focus
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await expect(args.onFocus).toHaveBeenCalled();

    // Test blur
    await userEvent.tab();
    await expect(input).not.toHaveFocus();
    await expect(args.onBlur).toHaveBeenCalled();
  },
};

export const ClearInput: Story = {
  args: {
    defaultValue: "Clear me",
    className: "w-64",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    // Verify initial value
    await expect(input).toHaveValue("Clear me");

    // Clear the input
    await userEvent.clear(input);
    await expect(input).toHaveValue("");
  },
};
