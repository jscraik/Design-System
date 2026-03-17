import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";


import { ChatInput } from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Components/Chat/Chat Input",
  component: ChatInput,
  tags: ["autodocs"],
  args: {
    selectedModel: {
      name: "Auto",
      shortName: "Auto",
      description: "Decides how long to think",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="min-h-screen bg-background flex items-end">
      <div className="w-full">
        <ChatInput {...args} />
      </div>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
  render: (args) => (
    <div className="min-h-screen bg-background flex items-end">
      <div className="w-full">
        <ChatInput {...args} />
      </div>
    </div>
  ),
};

export const WithComposerSlots: Story = {
  args: {
    composerLeft: (
      <button
        type="button"
        className="px-2 py-1 rounded-md bg-secondary text-text-secondary text-xs hover:bg-muted transition-colors"
      >
        Quick action
      </button>
    ),
    composerRight: (
      <button
        type="button"
        className="px-2 py-1 rounded-md bg-secondary text-text-secondary text-xs hover:bg-muted transition-colors"
      >
        Save draft
      </button>
    ),
  },
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const TypeMessage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Textarea is present", async () => {
      // ChatInput renders a textarea (via AppsSDKTextarea)
      const textarea = canvas.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
    });

    await userEvent.step("Type a message", async () => {
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

export const FocusableByKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Tab into the textarea", async () => {
      await userEvent.tab();
      // The textarea or first interactive element in the input should receive focus
      const focused = canvasElement.ownerDocument.activeElement;
      expect(focused).not.toBe(canvasElement.ownerDocument.body);
    });
  },
};

