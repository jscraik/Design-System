import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";

import { Button } from "../../base/Button";
import { Input } from "../../base/Input";
import { Label } from "../../base/Label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./fallback/Dialog";

/**
 * Dialog component built on Radix UI primitives.
 *
 * Dialogs are modal overlays that require user interaction before returning
 * to the main content. They're useful for confirmations, forms, and focused tasks.
 *
 * ## Usage
 * ```tsx
 * import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@design-studio/ui";
 *
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *     </DialogHeader>
 *     // Your content here
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * ## Accessibility
 * - Focus is trapped within the dialog when open
 * - Pressing Escape closes the dialog
 * - Clicking outside the dialog closes it
 * - Screen readers announce the dialog title
 */
const meta: Meta<typeof Dialog> = {
  title: "Components/UI/Feedback/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A modal dialog component for focused user interactions.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog content. It provides context for the user about what
            they're about to do.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = body.getByRole("button", { name: /open dialog/i });

    await userEvent.click(trigger);
    const dialog = await body.findByRole("dialog");
    await expect(dialog).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
  },
};

export const WithForm: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@johndoe" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: "A dialog containing a form with input fields and action buttons.",
      },
    },
  },
};

export const Confirmation: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: "A confirmation dialog for destructive actions.",
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledDialog(args) {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-sm text-muted-foreground">Dialog is {open ? "open" : "closed"}</p>
        <Dialog open={open} onOpenChange={setOpen} {...args}>
          <DialogTrigger asChild>
            <Button>Open Controlled Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog's open state is controlled by React state.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "A dialog with controlled open state using React useState.",
      },
    },
  },
};

export const LongContent: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>View Terms</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>Please read our terms of service carefully.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: "A dialog with scrollable long content.",
      },
    },
  },
};

// Interaction tests
export const OpenCloseInteraction: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>Testing dialog interactions.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the trigger button
    const triggerButton = canvas.getByRole("button", { name: /open dialog/i });
    await userEvent.click(triggerButton);

    // Wait for dialog to appear and verify it's visible
    // Note: Dialog renders in a portal, so we need to query the document
    const dialog = await within(document.body).findByRole("dialog");
    await expect(dialog).toBeInTheDocument();

    // Verify dialog title is present
    const title = within(dialog).getByText("Test Dialog");
    await expect(title).toBeInTheDocument();

    // Close the dialog
    const closeButton = within(dialog).getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);
  },
};

export const EscapeKeyClose: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escape to Close</DialogTitle>
          <DialogDescription>Press Escape to close this dialog.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dialog
    const triggerButton = canvas.getByRole("button", { name: /open dialog/i });
    await userEvent.click(triggerButton);

    // Verify dialog is open
    const dialog = await within(document.body).findByRole("dialog");
    await expect(dialog).toBeInTheDocument();

    // Press Escape to close
    await userEvent.keyboard("{Escape}");
  },
};
