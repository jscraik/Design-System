import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <div className="w-[360px]">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is ChatUI?</AccordionTrigger>
          <AccordionContent>
            A composable chat interface built with Radix primitives.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it themeable?</AccordionTrigger>
          <AccordionContent>
            Yes - tokens and classNames are designed to be customized.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Does it support slots?</AccordionTrigger>
          <AccordionContent>Slots allow flexible composition across app surfaces.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="w-[360px]">
      <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Multiple open panels</AccordionTrigger>
          <AccordionContent>This accordion allows more than one item open.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Useful for FAQs or grouped settings.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Third item</AccordionTrigger>
          <AccordionContent>Add as many panels as you need.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
