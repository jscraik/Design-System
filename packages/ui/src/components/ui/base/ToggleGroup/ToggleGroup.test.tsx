import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";

describe("ToggleGroup", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByRole("group")).toHaveAttribute("data-slot", "toggle-group");
    });

    it("applies custom className", () => {
      render(
        <ToggleGroup type="single" className="custom-class">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByRole("group")).toHaveClass("custom-class");
    });
  });

  describe("single selection", () => {
    it("selects item when clicked", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <ToggleGroup type="single" onValueChange={onChange}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );

      await user.click(screen.getByText("A"));
      expect(onChange).toHaveBeenCalledWith("a");
    });

    it("shows selected state with defaultValue", () => {
      render(
        <ToggleGroup type="single" defaultValue="b">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );

      expect(screen.getByText("A")).toHaveAttribute("data-state", "off");
      expect(screen.getByText("B")).toHaveAttribute("data-state", "on");
    });

    it("deselects when clicking selected item", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <ToggleGroup type="single" defaultValue="a" onValueChange={onChange}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );

      await user.click(screen.getByText("A"));
      expect(onChange).toHaveBeenCalledWith("");
    });
  });

  describe("multiple selection", () => {
    it("allows multiple selections", async () => {
      const onChange = vi.fn();
      const { user } = render(
        <ToggleGroup type="multiple" onValueChange={onChange}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>,
      );

      await user.click(screen.getByText("A"));
      expect(onChange).toHaveBeenCalledWith(["a"]);

      await user.click(screen.getByText("B"));
      expect(onChange).toHaveBeenCalledWith(["a", "b"]);
    });

    it("shows multiple selected states", () => {
      render(
        <ToggleGroup type="multiple" defaultValue={["a", "c"]}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>,
      );

      expect(screen.getByText("A")).toHaveAttribute("data-state", "on");
      expect(screen.getByText("B")).toHaveAttribute("data-state", "off");
      expect(screen.getByText("C")).toHaveAttribute("data-state", "on");
    });
  });

  describe("disabled state", () => {
    it("disables all items when group is disabled", () => {
      render(
        <ToggleGroup type="single" disabled>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );

      expect(screen.getByText("A")).toBeDisabled();
      expect(screen.getByText("B")).toBeDisabled();
    });

    it("disables individual item", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a" disabled>
            A
          </ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );

      expect(screen.getByText("A")).toBeDisabled();
      expect(screen.getByText("B")).not.toBeDisabled();
    });
  });

  describe("keyboard navigation", () => {
    it("can be focused via keyboard", async () => {
      const { user } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );

      await user.tab();
      expectFocused(screen.getByText("A"));
    });

    it("navigates between items with arrow keys", async () => {
      const { user } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );

      await user.tab();
      await user.keyboard("{ArrowRight}");
      expectFocused(screen.getByText("B"));
    });
  });

  describe("variants", () => {
    it("applies default variant", () => {
      render(
        <ToggleGroup type="single" variant="default">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByText("A")).toHaveClass("bg-transparent");
    });

    it("applies outline variant", () => {
      render(
        <ToggleGroup type="single" variant="outline">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByText("A")).toHaveClass("border");
    });
  });

  describe("sizes", () => {
    it("applies default size", () => {
      render(
        <ToggleGroup type="single" size="default">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByText("A")).toHaveClass("h-9");
    });

    it("applies sm size", () => {
      render(
        <ToggleGroup type="single" size="sm">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByText("A")).toHaveClass("h-8");
    });

    it("applies lg size", () => {
      render(
        <ToggleGroup type="single" size="lg">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByText("A")).toHaveClass("h-10");
    });
  });

  describe("accessibility", () => {
    it("has correct group role", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("items have correct pressed state", () => {
      render(
        <ToggleGroup type="single" defaultValue="a">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>,
      );

      // Radix uses data-state instead of aria-pressed for toggle groups
      expect(screen.getByText("A")).toHaveAttribute("data-state", "on");
      expect(screen.getByText("B")).toHaveAttribute("data-state", "off");
    });

    it("has visible focus indicator styles", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(screen.getByText("A")).toHaveClass("focus-visible:ring-1");
    });
  });
});
