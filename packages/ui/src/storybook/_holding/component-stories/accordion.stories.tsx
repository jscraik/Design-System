import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@design-studio/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta<typeof Accordion> = {
  title: "Components/UI/Base/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

// ─── Display stories ──────────────────────────────────────────────────────────

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

export const AllClosed: Story = {
  render: () => (
    <div className="w-[360px]">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>First item</AccordionTrigger>
          <AccordionContent>Content for first item.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Content for second item.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickToOpenPanel: Story = {
  render: () => (
    <div className="w-[360px]">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is ChatUI?</AccordionTrigger>
          <AccordionContent>
            A composable chat interface built with Radix primitives.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it themeable?</AccordionTrigger>
          <AccordionContent>
            Yes — tokens and classNames are designed to be customized.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("All panels start closed", () => {
      const content = canvas.queryByText(/composable chat/i);
      expect(content).not.toBeVisible();
    });

    await userEvent.step("Click first trigger to open panel", async () => {
      const trigger = canvas.getByRole("button", { name: /what is chatui/i });
      await userEvent.click(trigger);
    });

    await userEvent.step("First panel content is now visible", async () => {
      const content = await canvas.findByText(/composable chat/i);
      expect(content).toBeVisible();
    });

    await userEvent.step("Second panel content remains hidden", () => {
      const content2 = canvas.queryByText(/tokens and classNames/i);
      expect(content2).not.toBeVisible();
    });
  },
};

export const CollapseOpenPanel: Story = {
  render: () => (
    <div className="w-[360px]">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Open by default</AccordionTrigger>
          <AccordionContent>This panel starts open.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Closed by default</AccordionTrigger>
          <AccordionContent>This panel starts closed.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("First panel is open by default", async () => {
      const content = await canvas.findByText("This panel starts open.");
      expect(content).toBeVisible();
    });

    await userEvent.step("Click open trigger to close it (collapsible)", async () => {
      const trigger = canvas.getByRole("button", { name: /open by default/i });
      await userEvent.click(trigger);
    });

    await userEvent.step("Panel content is now hidden", () => {
      const content = canvas.queryByText("This panel starts open.");
      expect(content).not.toBeVisible();
    });
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div className="w-[360px]">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>First panel content.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Second panel content.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.step("Tab to focus first trigger", async () => {
      await userEvent.tab();
      const trigger = canvas.getByRole("button", { name: /first/i });
      expect(trigger).toHaveFocus();
    });

    await userEvent.step("Press Enter to open first panel", async () => {
      await userEvent.keyboard("{Enter}");
      const content = await canvas.findByText("First panel content.");
      expect(content).toBeVisible();
    });

    await userEvent.step("ArrowDown moves focus to second trigger", async () => {
      await userEvent.keyboard("{ArrowDown}");
      const trigger2 = canvas.getByRole("button", { name: /second/i });
      expect(trigger2).toHaveFocus();
    });
  },
};
