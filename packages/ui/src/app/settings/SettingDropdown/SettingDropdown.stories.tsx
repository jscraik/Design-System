import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "@storybook/test";
import { useState } from "react";

import { SettingDropdown, type DropdownOption } from "./SettingDropdown";

/**
 * SettingDropdown is a reusable Radix-based dropdown component for settings.
 * Supports options with descriptions and custom alignment.
 *
 * ## Usage
 * ```tsx
 * import { SettingDropdown } from "@chatui/ui";
 *
 * const options = [
 *   { value: "light", label: "Light", description: "Light theme" },
 *   { value: "dark", label: "Dark", description: "Dark theme" },
 * ];
 *
 * <SettingDropdown
 *   label="Theme"
 *   value={theme}
 *   options={options}
 *   onValueChange={setTheme}
 * />
 * ```
 */
const meta: Meta<typeof SettingDropdown> = {
  title: "Components/Settings/Setting Dropdown",
  component: SettingDropdown,
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
      description: "The label for the dropdown",
    },
    value: {
      control: "text",
      description: "The currently selected value",
    },
    description: {
      control: "text",
      description: "Optional description text below the dropdown",
    },
    align: {
      control: "select",
      options: ["start", "end", "center"],
      description: "Alignment of the dropdown menu",
    },
    onValueChange: {
      description: "Callback when selection changes",
    },
  },
  args: {
    onValueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SettingDropdown>;

const simpleOptions: DropdownOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const themeOptions: DropdownOption[] = [
  { value: "light", label: "Light", description: "Light color scheme" },
  { value: "dark", label: "Dark", description: "Dark color scheme" },
  { value: "auto", label: "Auto", description: "Match system preference" },
];

const styleOptions: DropdownOption[] = [
  { value: "default", label: "Default", description: "Preset style and tone" },
  { value: "professional", label: "Professional", description: "Polished and precise" },
  { value: "friendly", label: "Friendly", description: "Warm and chatty" },
  { value: "efficient", label: "Efficient", description: "Concise and plain" },
];

export const Default: Story = {
  args: {
    label: "Select Option",
    value: "option1",
    options: simpleOptions,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Theme",
    value: "dark",
    options: themeOptions,
    description: "Choose your preferred color scheme",
  },
};

export const WithDetailedOptions: Story = {
  args: {
    label: "Base style and tone",
    value: "default",
    options: styleOptions,
    description: "This is the main voice and tone ChatGPT uses in your conversations",
  },
};

export const AlignStart: Story = {
  args: {
    label: "Alignment",
    value: "option1",
    options: simpleOptions,
    align: "start",
  },
};

export const AlignCenter: Story = {
  args: {
    label: "Alignment",
    value: "option2",
    options: simpleOptions,
    align: "center",
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("dark");
    return (
      <SettingDropdown
        label="Theme Preference"
        value={value}
        options={themeOptions}
        onValueChange={setValue}
        description={`Currently selected: ${value}`}
      />
    );
  },
};

export const MultipleDropdowns: Story = {
  render: () => {
    const [theme, setTheme] = useState("dark");
    const [style, setStyle] = useState("default");
    return (
      <div className="space-y-4 max-w-md">
        <SettingDropdown
          label="Theme"
          value={theme}
          options={themeOptions}
          onValueChange={setTheme}
        />
        <SettingDropdown
          label="Style"
          value={style}
          options={styleOptions}
          onValueChange={setStyle}
          description="Choose your preferred communication style"
        />
      </div>
    );
  },
};
