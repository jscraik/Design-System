import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Combobox } from "./Combobox";

const meta: Meta<typeof Combobox> = {
  title: "Components/UI/Forms/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const frameworks = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
      />
    );
  },
};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
      />
    );
  },
};

export const WithPreselectedValue: Story = {
  render: () => {
    const [value, setValue] = useState("react");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState("react");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        disabled
      />
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const optionsWithDisabled = [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue", disabled: true },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte", disabled: true },
      { value: "solid", label: "Solid" },
    ];
    return (
      <Combobox
        options={optionsWithDisabled}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
      />
    );
  },
};

export const ManyOptions: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const countries = [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
      { value: "au", label: "Australia" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "jp", label: "Japan" },
      { value: "cn", label: "China" },
      { value: "in", label: "India" },
      { value: "br", label: "Brazil" },
      { value: "mx", label: "Mexico" },
      { value: "es", label: "Spain" },
      { value: "it", label: "Italy" },
      { value: "nl", label: "Netherlands" },
      { value: "se", label: "Sweden" },
    ];
    return (
      <Combobox
        options={countries}
        value={value}
        onValueChange={setValue}
        placeholder="Select country..."
        searchPlaceholder="Search countries..."
      />
    );
  },
};

export const CustomEmptyMessage: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        emptyMessage="No frameworks match your search."
      />
    );
  },
};

export const AllowCustomValue: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="space-y-2">
        <Combobox
          options={frameworks}
          value={value}
          onValueChange={setValue}
          placeholder="Select or type framework..."
          allowCustomValue
        />
        <p className="text-sm text-foundation-text-dark-tertiary">Selected: {value || "None"}</p>
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const statusOptions = [
      { value: "active", label: "🟢 Active" },
      { value: "pending", label: "🟡 Pending" },
      { value: "inactive", label: "🔴 Inactive" },
      { value: "archived", label: "📦 Archived" },
    ];
    return (
      <Combobox
        options={statusOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Select status..."
      />
    );
  },
};
