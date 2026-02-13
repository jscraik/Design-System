import { describe, expect, it } from "vitest";

import { render, screen } from "../../../../testing/utils";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./fallback/Accordion";

describe("Accordion", () => {
  it("renders with data-slot attributes", () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole("button", { name: "Section 1" })).toHaveAttribute(
      "data-slot",
      "accordion-trigger",
    );
    expect(screen.getByText("Content 1").closest("[data-slot='accordion-content']")).toBeTruthy();
  });

  it("toggles open and closed state", async () => {
    const { user } = render(
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "Section 1" });
    const item = trigger.closest("[data-slot='accordion-item']");
    expect(item).toHaveAttribute("data-state", "open");

    await user.click(trigger);
    expect(item).toHaveAttribute("data-state", "closed");
  });
});
