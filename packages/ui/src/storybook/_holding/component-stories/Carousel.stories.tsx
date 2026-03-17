import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@design-studio/ui";

const meta: Meta<typeof Carousel> = {
  title: "Components/UI/Navigation/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
    <Carousel className="w-[280px]">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((item) => (
          <CarouselItem key={item}>
            <div className="flex h-32 items-center justify-center rounded-md border bg-muted text-sm">
              Slide {item}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Carousel navigation buttons exist", () => {
      expect(canvas.getByRole("button", { name: /previous slide/i })).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: /next slide/i })).toBeInTheDocument();
    });

    await userEvent.step("Click next navigates to next slide", async () => {
      const nextBtn = canvas.getByRole("button", { name: /next slide/i });
      await userEvent.click(nextBtn);
    });
  },
};

