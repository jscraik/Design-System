import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "@storybook/test";

import { Button } from "../../base/Button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./fallback/Sheet";

const meta: Meta<typeof Sheet> = {
  title: "Components/UI/Overlays/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button size="sm">Open sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Profile settings</SheetTitle>
          <SheetDescription>Update your account preferences.</SheetDescription>
        </SheetHeader>
        <div className="px-4 text-sm">Sheet body content.</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByRole("dialog")).toBeInTheDocument();
  },
};
