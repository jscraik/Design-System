import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../test/utils";

import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );
      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });

    it("renders with data-slot attribute", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAttribute("data-slot", "radio-group");
      expect(screen.getByRole("radio")).toHaveAttribute("data-slot", "radio-group-item");
    });

    it("applies custom className to group", () => {
      render(
        <RadioGroup className="custom-class">
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveClass("custom-class");
    });

    it("applies custom className to item", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" className="item-class" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toHaveClass("item-class");
    });
  });

  describe("selection", () => {
    it("selects item when clicked", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <RadioGroup onValueChange={onChange}>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      await user.click(screen.getAllByRole("radio")[0]);
      expect(onChange).toHaveBeenCalledWith("option1");
    });

    it("shows selected state with defaultValue", () => {
      render(
        <RadioGroup defaultValue="option2">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it("shows selected state with controlled value", () => {
      render(
        <RadioGroup value="option1">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });
  });

  describe("disabled state", () => {
    it("disables all items when group is disabled", () => {
      render(
        <RadioGroup disabled>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      screen.getAllByRole("radio").forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it("disables individual item", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" disabled />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).not.toBeDisabled();
    });

    it("does not trigger onChange when disabled", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <RadioGroup onValueChange={onChange} disabled>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );

      await user.click(screen.getByRole("radio"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("keyboard navigation", () => {
    it("can be focused via keyboard", async () => {
      const { user } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      await user.tab();
      expectFocused(screen.getAllByRole("radio")[0]);
    });

    it("navigates between items with arrow keys", async () => {
      const { user } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      await user.tab();
      await user.keyboard("{ArrowDown}");
      expectFocused(screen.getAllByRole("radio")[1]);
    });

    it("selects item with Space key", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <RadioGroup onValueChange={onChange}>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );

      await user.tab();
      await user.keyboard(" ");
      expect(onChange).toHaveBeenCalledWith("option1");
    });
  });

  describe("accessibility", () => {
    it("has correct radiogroup role", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("has correct radio role for items", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toBeInTheDocument();
    });

    it("supports aria-label on group", () => {
      render(
        <RadioGroup aria-label="Select option">
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Select option");
    });

    it("has visible focus indicator styles", () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toHaveClass("focus-visible:ring-ring/50");
    });
  });

  describe("orientation", () => {
    it("supports horizontal orientation", () => {
      render(
        <RadioGroup orientation="horizontal">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("supports vertical orientation", () => {
      render(
        <RadioGroup orientation="vertical">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-orientation", "vertical");
    });
  });
});
