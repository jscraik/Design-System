import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Textarea } from "@design-studio/ui";

const meta: Meta<typeof Textarea> = {
  title: "Components/UI/Base/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <Textarea className="w-72" placeholder="Write a note..." />,
};

export const WithValue: Story = {
  render: () => <Textarea className="w-72" defaultValue="This is a pre-filled message." />,
};

export const Disabled: Story = {
  render: () => <Textarea className="w-72" placeholder="Disabled..." disabled />,
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const TypeAndClear: Story = {
  render: () => <Textarea className="w-72" placeholder="Type here..." />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Textarea renders with placeholder", () => {
      const textarea = canvas.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("placeholder", "Type here...");
    });

    await userEvent.step("Type into the textarea", async () => {
      const textarea = canvas.getByRole("textbox");
      await userEvent.click(textarea);
      await userEvent.type(textarea, "Hello, world!");
      expect(textarea).toHaveValue("Hello, world!");
    });

    await userEvent.step("Clear the textarea", async () => {
      const textarea = canvas.getByRole("textbox");
      await userEvent.clear(textarea);
      expect(textarea).toHaveValue("");
    });
  },
};

export const FocusByTab: Story = {
  render: () => <Textarea className="w-72" placeholder="Focus me..." />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Tab to focus textarea", async () => {
      await userEvent.tab();
      const textarea = canvas.getByRole("textbox");
      expect(textarea).toHaveFocus();
    });
  },
};
