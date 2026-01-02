import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Checkbox aria-label="Test checkbox" />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Checkbox aria-label="Test checkbox" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("data-slot", "checkbox");
    });

    it("applies custom className", () => {
      render(<Checkbox aria-label="Test checkbox" className="custom-class" />);
      expect(screen.getByRole("checkbox")).toHaveClass("custom-class");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to checkbox element", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Checkbox ref={ref} aria-label="Test checkbox" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("checked state", () => {
    it("renders unchecked by default", () => {
      render(<Checkbox aria-label="Test checkbox" />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("renders checked when checked prop is true", () => {
      render(<Checkbox checked aria-label="Test checkbox" />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("renders unchecked when checked prop is false", () => {
      render(<Checkbox checked={false} aria-label="Test checkbox" />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("supports defaultChecked for uncontrolled usage", () => {
      render(<Checkbox defaultChecked aria-label="Test checkbox" />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled prop is true", () => {
      render(<Checkbox disabled aria-label="Disabled checkbox" />);
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("does not toggle when disabled", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Checkbox disabled onCheckedChange={onCheckedChange} aria-label="Disabled checkbox" />,
      );
      await user.click(screen.getByRole("checkbox"));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("has correct disabled styles", () => {
      render(<Checkbox disabled aria-label="Disabled checkbox" />);
      expect(screen.getByRole("checkbox")).toHaveClass("disabled:opacity-50");
    });
  });

  describe("interactions", () => {
    it("toggles on click", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Checkbox onCheckedChange={onCheckedChange} aria-label="Test checkbox" />,
      );
      await user.click(screen.getByRole("checkbox"));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("can be focused via keyboard", async () => {
      const { user } = render(<Checkbox aria-label="Test checkbox" />);
      await user.tab();
      expectFocused(screen.getByRole("checkbox"));
    });

    it("toggles on Space key", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Checkbox onCheckedChange={onCheckedChange} aria-label="Test checkbox" />,
      );
      await user.tab();
      await user.keyboard(" ");
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    // Note: Radix Checkbox doesn't toggle on Enter key by default (only Space)
    // This is standard checkbox behavior per WAI-ARIA

    it("toggles from checked to unchecked", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Checkbox checked onCheckedChange={onCheckedChange} aria-label="Test checkbox" />,
      );
      await user.click(screen.getByRole("checkbox"));
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("works as controlled checkbox", async () => {
      const onCheckedChange = vi.fn();
      const { rerender } = render(
        <Checkbox checked={false} onCheckedChange={onCheckedChange} aria-label="Controlled" />,
      );
      expect(screen.getByRole("checkbox")).not.toBeChecked();

      rerender(
        <Checkbox checked={true} onCheckedChange={onCheckedChange} aria-label="Controlled" />,
      );
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("works as uncontrolled checkbox", async () => {
      const { user } = render(<Checkbox defaultChecked={false} aria-label="Uncontrolled" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe("accessibility", () => {
    it("has correct checkbox role", () => {
      render(<Checkbox aria-label="Test checkbox" />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Checkbox aria-label="Custom label" />);
      expect(screen.getByRole("checkbox")).toHaveAccessibleName("Custom label");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <label id="label">Checkbox label</label>
          <Checkbox aria-labelledby="label" />
        </>,
      );
      expect(screen.getByRole("checkbox")).toHaveAccessibleName("Checkbox label");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Checkbox aria-describedby="desc" aria-label="Checkbox" />
          <span id="desc">Description text</span>
        </>,
      );
      expect(screen.getByRole("checkbox")).toHaveAccessibleDescription("Description text");
    });

    it("supports aria-invalid for error states", () => {
      render(<Checkbox aria-invalid="true" aria-label="Invalid checkbox" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("supports aria-required", () => {
      render(<Checkbox aria-required="true" aria-label="Required checkbox" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-required", "true");
    });

    it("has visible focus indicator styles", () => {
      render(<Checkbox aria-label="Test checkbox" />);
      expect(screen.getByRole("checkbox")).toHaveClass("focus-visible:ring-ring/50");
    });

    it("has error state styles for aria-invalid", () => {
      render(<Checkbox aria-invalid="true" aria-label="Invalid checkbox" />);
      expect(screen.getByRole("checkbox")).toHaveClass("aria-invalid:border-destructive");
    });
  });

  describe("indeterminate state", () => {
    it("supports indeterminate checked state", () => {
      render(<Checkbox checked="indeterminate" aria-label="Indeterminate checkbox" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("data-state", "indeterminate");
    });
  });

  describe("HTML attributes", () => {
    // Note: Radix Checkbox uses a hidden input for form submission
    // The name attribute is on the hidden input, not the visible checkbox button
    it("supports name attribute via hidden input in form context", () => {
      const { container } = render(
        <form>
          <Checkbox name="terms" aria-label="Terms checkbox" />
        </form>,
      );
      const hiddenInput = container.querySelector('input[name="terms"]');
      expect(hiddenInput).toBeInTheDocument();
    });

    it("supports value attribute", () => {
      render(<Checkbox value="accepted" aria-label="Accept checkbox" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("value", "accepted");
    });

    it("supports required attribute", () => {
      render(<Checkbox required aria-label="Required checkbox" />);
      expect(screen.getByRole("checkbox")).toBeRequired();
    });
  });
});
