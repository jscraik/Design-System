import { Avatar, AvatarFallback, AvatarImage } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Avatar> = {
  title: "Components/UI/Base/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=120&h=120&fit=crop"
        alt="Profile"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://example.com/does-not-exist.png" alt="Profile" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const AvatarRenders: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Avatar image renders", () => {
      expect(canvas.getByRole("img", { name: /profile/i })).toBeInTheDocument();
    });
  },
};
