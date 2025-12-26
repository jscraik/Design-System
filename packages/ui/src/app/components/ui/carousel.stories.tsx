import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

const meta: Meta<typeof Carousel> = {
  title: "UI/Carousel",
  component: Carousel,
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
};
