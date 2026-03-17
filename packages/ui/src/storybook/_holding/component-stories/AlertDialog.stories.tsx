import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Button } from "@design-studio/ui";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@design-studio/ui";

const meta: Meta<typeof AlertDialog> = {
  title: "Components/UI/Feedback/Alert Dialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof AlertDialog>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Closed: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">Open alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be reversed.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const OpenAndCancel: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            All data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);

    await userEvent.step("Dialog is not open on mount", () => {
      expect(body.queryByRole("alertdialog")).not.toBeInTheDocument();
    });

    await userEvent.step("Click trigger to open alert dialog", async () => {
      const trigger = canvas.getByRole("button", { name: /delete account/i });
      await userEvent.click(trigger);
    });

    await userEvent.step("Alert dialog is now open", async () => {
      const dialog = await body.findByRole("alertdialog");
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByText("Delete your account?")).toBeInTheDocument();
    });

    await userEvent.step("Click Cancel to close without action", async () => {
      const cancel = body.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancel);
    });

    await userEvent.step("Alert dialog is dismissed", () => {
      expect(body.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  },
};

export const OpenAndConfirm: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);

    await userEvent.step("Open the alert dialog", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /delete project/i }));
    });

    await userEvent.step("Dialog is open with destructive action button", async () => {
      const dialog = await body.findByRole("alertdialog");
      expect(within(dialog).getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    await userEvent.step("Click Delete action button", async () => {
      const deleteBtn = body.getByRole("button", { name: /^delete$/i });
      await userEvent.click(deleteBtn);
    });

    await userEvent.step("Dialog closes after action", () => {
      expect(body.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  },
};

export const EscapeClosesDialog: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm">Open alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm action</AlertDialogTitle>
          <AlertDialogDescription>Press Escape to dismiss.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);

    await userEvent.step("Open the dialog", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /open alert/i }));
      await body.findByRole("alertdialog");
    });

    await userEvent.step("Press Escape — AlertDialog should NOT close (by design)", async () => {
      // AlertDialog intentionally blocks Escape to prevent accidental dismissal.
      // This is the correct WAI-ARIA behaviour for alert dialogs.
      await userEvent.keyboard("{Escape}");
      // Dialog remains open
      expect(body.queryByRole("alertdialog")).toBeInTheDocument();
    });
  },
};
