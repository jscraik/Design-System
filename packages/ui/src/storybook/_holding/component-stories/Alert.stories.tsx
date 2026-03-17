import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import { Alert, AlertDescription, AlertTitle } from "@design-studio/ui";

const meta: Meta<typeof Alert> = {
  title: "Components/UI/Base/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-sm">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>This is a default alert with supporting text.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-sm">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>Your request could not be completed. Try again.</AlertDescription>
    </Alert>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const AlertRendersWithRole: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Alert correctly identifies as an alert region", () => {
      const alert = canvas.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent("Heads up");
    });
  },
};

