import { Slider } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Slider> = {
  title: "Components/UI/Base/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Slider>;

// ─── Display stories ──────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <Slider className="w-64" defaultValue={[50]} />,
};

export const Range: Story = {
  render: () => <Slider className="w-64" defaultValue={[25, 75]} />,
};

export const Min: Story = {
  render: () => <Slider className="w-64" defaultValue={[0]} />,
};

export const Max: Story = {
  render: () => <Slider className="w-64" defaultValue={[100]} />,
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const SliderRendersWithRole: Story = {
  render: () => <Slider className="w-64" defaultValue={[50]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Slider renders with accessible role", () => {
      const slider = canvas.getByRole("slider");
      expect(slider).toBeInTheDocument();
    });

    await userEvent.step("Slider has correct initial value", () => {
      const slider = canvas.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "50");
    });
  },
};

export const KeyboardAdjust: Story = {
  render: () => <Slider className="w-64" defaultValue={[50]} step={10} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Focus the slider thumb", async () => {
      const slider = canvas.getByRole("slider");
      slider.focus();
      expect(slider).toHaveFocus();
    });

    await userEvent.step("Press ArrowRight to increment", async () => {
      await userEvent.keyboard("{ArrowRight}");
      const slider = canvas.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "60");
    });

    await userEvent.step("Press ArrowLeft to decrement", async () => {
      await userEvent.keyboard("{ArrowLeft}");
      const slider = canvas.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuenow", "50");
    });
  },
};
