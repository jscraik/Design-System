import { Combobox } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";

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

// ─── Interaction tests ────────────────────────────────────────────────────────

export const OpenAndSelect: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="space-y-2">
        <Combobox
          options={frameworks}
          value={value}
          onValueChange={setValue}
          placeholder="Select framework..."
        />
        <p className="text-sm opacity-60">Selected: {value || "None"}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.step("Combobox trigger shows placeholder", () => {
      expect(canvas.getByText("Select framework...")).toBeInTheDocument();
    });

    await userEvent.step("Click trigger to open listbox", async () => {
      const trigger = canvas.getByRole("combobox");
      await userEvent.click(trigger);
    });

    await userEvent.step("Listbox options are visible", async () => {
      await body.findByRole("listbox");
      expect(body.getByRole("option", { name: /react/i })).toBeInTheDocument();
      expect(body.getByRole("option", { name: /vue/i })).toBeInTheDocument();
    });

    await userEvent.step("Select 'Svelte'", async () => {
      await userEvent.click(body.getByRole("option", { name: /svelte/i }));
    });

    await userEvent.step("Listbox closes and selected value is shown", async () => {
      await canvas.findByText("Svelte");
      expect(canvas.queryByText("Selected: svelte")).toBeInTheDocument();
    });
  },
};

export const TypeToFilter: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        placeholder="Select framework..."
        searchPlaceholder="Search..."
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.step("Open the combobox", async () => {
      await userEvent.click(canvas.getByRole("combobox"));
      await body.findByRole("listbox");
    });

    await userEvent.step("Type 'sv' to filter", async () => {
      const search = body.getByRole("searchbox");
      await userEvent.type(search, "sv");
    });

    await userEvent.step("Only 'Svelte' is shown", async () => {
      expect(body.getByRole("option", { name: /svelte/i })).toBeInTheDocument();
      expect(body.queryByRole("option", { name: /react/i })).not.toBeInTheDocument();
      expect(body.queryByRole("option", { name: /vue/i })).not.toBeInTheDocument();
    });
  },
};

export const DisabledComboboxNotInteractive: Story = {
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
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);

    await userEvent.step("Trigger is disabled", () => {
      const trigger = canvas.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });

    await userEvent.step("Clicking disabled trigger does not open listbox", async () => {
      const trigger = canvas.getByRole("combobox");
      await userEvent.click(trigger, { pointerEventsCheck: 0 });
      expect(body.queryByRole("listbox")).not.toBeInTheDocument();
    });
  },
};
