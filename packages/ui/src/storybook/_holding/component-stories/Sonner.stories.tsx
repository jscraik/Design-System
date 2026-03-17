import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";
import { toast } from "sonner";

import { Button, Toaster } from "@design-studio/ui";


const meta: Meta<typeof Toaster> = {
  title: "Components/UI/Feedback/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Toaster>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={() => toast("Toast notification")}>Show toast</Button>
      <Toaster />
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={() => toast.success("Saved successfully!")}>Success toast</Button>
      <Toaster />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={() => toast.error("Something went wrong")}>Error toast</Button>
      <Toaster />
    </div>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickToShowToast: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={() => toast("Hello from Sonner!")}>Trigger toast</Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.step("Click button to trigger toast", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /trigger toast/i }));
    });

    await userEvent.step("Toast notification appears", async () => {
      const toastEl = await body.findByText("Hello from Sonner!");
      expect(toastEl).toBeInTheDocument();
    });
  },
};
