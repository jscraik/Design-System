import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";

import { IconBook, IconChevronRightMd, IconSettings } from "../icons/ChatGPTIcons";

import { SettingRow } from "./SettingRow";

/**
 * SettingRow is a reusable settings row component.
 * Can be used as a display row or clickable button.
 * Supports optional icon on the left and custom content on the right.
 *
 * ## Usage
 * ```tsx
 * import { SettingRow } from "@chatui/ui";
 *
 * <SettingRow
 *   icon={<IconSettings />}
 *   label="General"
 *   description="App preferences"
 *   onClick={fn()}
 * />
 * ```
 */
const meta: Meta<typeof SettingRow> = {
  title: "Settings/SettingRow",
  component: SettingRow,
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
    label: {
      control: "text",
      description: "The main label text",
    },
    description: {
      control: "text",
      description: "Optional description text below the label",
    },
    onClick: {
      description: "Optional click handler (makes row interactive)",
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SettingRow>;

export const Default: Story = {
  args: {
    label: "General Settings",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Notifications",
    description: "Manage your notification preferences",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <IconSettings className="size-4 text-[var(--foundation-icon-dark-secondary)]" />,
    label: "Account Settings",
    description: "Manage your account preferences",
  },
};

export const WithRightContent: Story = {
  args: {
    icon: <IconBook className="size-4 text-[var(--foundation-icon-dark-secondary)]" />,
    label: "Memory",
    right: <IconChevronRightMd className="size-4 text-[var(--foundation-icon-dark-tertiary)]" />,
  },
};

export const Clickable: Story = {
  args: {
    icon: <IconSettings className="size-4 text-[var(--foundation-icon-dark-secondary)]" />,
    label: "Privacy Settings",
    description: "Control your privacy and data",
    right: <IconChevronRightMd className="size-4 text-[var(--foundation-icon-dark-tertiary)]" />,
    onClick: fn(),
  },
};

export const NonClickable: Story = {
  args: {
    label: "Display Only",
    description: "This row is not interactive",
    onClick: undefined,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <SettingRow label="Simple Row" />
      <SettingRow label="With Description" description="Additional context here" />
      <SettingRow
        icon={<IconSettings className="size-4 text-[var(--foundation-icon-dark-secondary)]" />}
        label="With Icon"
      />
      <SettingRow
        icon={<IconBook className="size-4 text-[var(--foundation-icon-dark-secondary)]" />}
        label="Clickable Row"
        description="Click to navigate"
        right={
          <IconChevronRightMd className="size-4 text-[var(--foundation-icon-dark-tertiary)]" />
        }
        onClick={fn()}
      />
    </div>
  ),
};
