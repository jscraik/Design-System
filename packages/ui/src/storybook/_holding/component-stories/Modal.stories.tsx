import { Button, ModalDialog } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import type { ComponentProps } from "react";
import { useState } from "react";

const meta: Meta<typeof ModalDialog> = {
  title: "Components/UI/Overlays/Modal",
  component: ModalDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper = (
  args: Omit<ComponentProps<typeof ModalDialog>, "isOpen" | "onClose" | "children">,
) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ModalDialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Modal Title</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This is a modal dialog example with some content.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </div>
        </div>
      </ModalDialog>
    </>
  );
};

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: ModalWrapper,
  args: {
    title: "Example Modal",
    description: "This is an example modal dialog",
  },
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const OpenAndClose: Story = {
  render: ModalWrapper,
  args: {
    title: "Confirm Action",
    description: "Are you sure you want to proceed?",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.step("Modal is closed on mount", () => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await userEvent.step("Click trigger to open modal", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /open modal/i }));
    });

    await userEvent.step("Modal dialog is now visible", async () => {
      const dialog = await body.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByText("Modal Title")).toBeInTheDocument();
    });

    await userEvent.step("Click Cancel to close", async () => {
      const cancelBtn = body.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancelBtn);
    });

    await userEvent.step("Modal is dismissed", () => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const ConfirmAndClose: Story = {
  render: ModalWrapper,
  args: {
    title: "Save Changes",
    description: "Do you want to save?",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.step("Open the modal", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /open modal/i }));
      await body.findByRole("dialog");
    });

    await userEvent.step("Click Confirm to close", async () => {
      await userEvent.click(body.getByRole("button", { name: /confirm/i }));
    });

    await userEvent.step("Modal closes after confirm", () => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};
