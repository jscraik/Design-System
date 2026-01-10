import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useState } from "react";

import { IconMessaging, IconUserLock } from "../../../icons/ChatGPTIcons";

import { SettingToggle } from "./SettingToggle";

/**
 * SettingToggle is a reusable toggle switch component for settings.
 * Uses ChatGPT design system colors and supports optional icons.
 *
 * ## Usage
 * ```tsx
 * import { SettingToggle } from "@astudio/ui";
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
    icon: <IconMessaging className="size-4 text-[var(--foundation-icon-dark-secondary)]" />,
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
        icon={<IconUserLock className="size-4 text-[var(--foundation-icon-dark-secondary)]" />}
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
        icon={<IconMessaging className="size-4 text-[var(--foundation-icon-dark-secondary)]" />}
        label="With Icon"
        description="Icon on the left side"
      />
    </div>
  ),
};
