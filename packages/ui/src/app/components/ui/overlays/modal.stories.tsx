import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Button } from "../base/button";

import { ModalDialog } from "./modal";

const meta: Meta<typeof ModalDialog> = {
  title: "UI/Overlays/Modal Dialog",
  component: ModalDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper = (args: any) => {
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
            <Button onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </ModalDialog>
    </>
  );
};

export const Default: Story = {
  render: ModalWrapper,
  args: {
    title: "Example Modal",
    description: "This is an example modal dialog",
  },
};