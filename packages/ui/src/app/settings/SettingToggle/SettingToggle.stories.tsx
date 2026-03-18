import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";

import { IconMessaging, IconUserLock } from "../../../icons/ChatGPTIcons";

import { SettingToggle } from "./SettingToggle";

/**
 * SettingToggle is a reusable toggle switch component for settings.
 * Uses ChatGPT design system colors and supports optional icons.
 *
 * ## Usage
 * ```tsx
 * import { SettingToggle } from "@design-studio/ui";
 *
 * <SettingToggle
 *   checked={enabled}
 *   onCheckedChange={setEnabled}
 *   label="Enable notifications"
 *   description="Receive alerts for new messages"
 * />
 * ```
 */
const meta: Meta<typeof SettingToggle> = {
  title: "Components/Settings/Setting Toggle",
  component: SettingToggle,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the toggle is checked",
    },
    label: {
      control: "text",
      description: "The main label text",
    },
    description: {
      control: "text",
      description: "Optional description text below the toggle",
    },
    onCheckedChange: {
      description: "Callback when toggle state changes",
    },
  },
  args: {
    onCheckedChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SettingToggle>;

export const Default: Story = {
  args: {
    checked: false,
    label: "Enable feature",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    label: "Enabled feature",
  },
};

export const WithDescription: Story = {
  args: {
    checked: true,
    label: "Notifications",
    description: "Receive alerts for new messages and updates",
  },
};

export const WithIcon: Story = {
  args: {
    checked: true,
    icon: <IconMessaging className="size-4 text-[var(--text-secondary)]" />,
    label: "Push Notifications",
    description: "Get notified about important events",
  },
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <SettingToggle
        checked={checked}
        onCheckedChange={setChecked}
        icon={<IconUserLock className="size-4 text-[var(--text-secondary)]" />}
        label="Two-factor authentication"
        description="Add an extra layer of security to your account"
      />
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <SettingToggle checked={false} onCheckedChange={fn()} label="Unchecked" />
      <SettingToggle checked={true} onCheckedChange={fn()} label="Checked" />
      <SettingToggle
        checked={true}
        onCheckedChange={fn()}
        label="With Description"
        description="Additional context provided here"
      />
      <SettingToggle
        checked={true}
        onCheckedChange={fn()}
        icon={<IconMessaging className="size-4 text-[var(--text-secondary)]" />}
        label="With Icon"
        description="Icon on the left side"
      />
    </div>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickToToggle: Story = {
  args: {
    checked: false,
    label: "Notifications",
    onCheckedChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Toggle is initially unchecked", async () => {
      const toggle = canvas.getByRole("switch", { name: /notifications/i });
      expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    await userEvent.step("Click toggle to check it", async () => {
      const toggle = canvas.getByRole("switch", { name: /notifications/i });
      await userEvent.click(toggle);
      expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    });
  },
};

export const KeyboardToggle: Story = {
  args: {
    checked: false,
    label: "Push Notifications",
    onCheckedChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Tab to focus the toggle", async () => {
      await userEvent.tab();
      const toggle = canvas.getByRole("switch", { name: /push notifications/i });
      expect(toggle).toHaveFocus();
    });

    await userEvent.step("Press Space to activate", async () => {
      await userEvent.keyboard(" ");
      expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    });
  },
};

export const LabelVisible: Story = {
  args: {
    checked: true,
    label: "Two-factor authentication",
    description: "Adds an extra layer of security",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Label text is rendered", () => {
      expect(canvas.getByText("Two-factor authentication")).toBeInTheDocument();
    });

    await userEvent.step("Description text is rendered", () => {
      expect(canvas.getByText("Adds an extra layer of security")).toBeInTheDocument();
    });

    await userEvent.step("Toggle reflects checked state", () => {
      const toggle = canvas.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });
  },
};
