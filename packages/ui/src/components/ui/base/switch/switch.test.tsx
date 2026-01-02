import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { Switch } from "./Switch";

describe("Switch", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Switch aria-label="Test switch" />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Switch aria-label="Test switch" />);
      expect(screen.getByRole("switch")).toHaveAttribute("data-slot", "switch");
    });

    it("applies custom className", () => {
      render(<Switch aria-label="Test switch" className="custom-class" />);
      expect(screen.getByRole("switch")).toHaveClass("custom-class");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to switch element", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Switch ref={ref} aria-label="Test switch" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("checked state", () => {
    it("renders unchecked by default", () => {
      render(<Switch aria-label="Test switch" />);
      expect(screen.getByRole("switch")).not.toBeChecked();
    });

    it("renders checked when checked prop is true", () => {
      render(<Switch checked aria-label="Test switch" />);
      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("renders unchecked when checked prop is false", () => {
      render(<Switch checked={false} aria-label="Test switch" />);
      expect(screen.getByRole("switch")).not.toBeChecked();
    });

    it("supports defaultChecked for uncontrolled usage", () => {
      render(<Switch defaultChecked aria-label="Test switch" />);
      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("has correct data-state attribute when checked", () => {
      render(<Switch checked aria-label="Test switch" />);
      expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked");
    });

    it("has correct data-state attribute when unchecked", () => {
      render(<Switch checked={false} aria-label="Test switch" />);
      expect(screen.getByRole("switch")).toHaveAttribute("data-state", "unchecked");
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled prop is true", () => {
      render(<Switch disabled aria-label="Disabled switch" />);
      expect(screen.getByRole("switch")).toBeDisabled();
    });

    it("does not toggle when disabled", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Switch disabled onCheckedChange={onCheckedChange} aria-label="Disabled switch" />,
      );
      await user.click(screen.getByRole("switch"));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("has correct disabled styles", () => {
      render(<Switch disabled aria-label="Disabled switch" />);
      expect(screen.getByRole("switch")).toHaveClass("disabled:opacity-50");
    });
  });

  describe("interactions", () => {
    it("toggles on click", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Switch onCheckedChange={onCheckedChange} aria-label="Test switch" />,
      );
      await user.click(screen.getByRole("switch"));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("can be focused via keyboard", async () => {
      const { user } = render(<Switch aria-label="Test switch" />);
      await user.tab();
      expectFocused(screen.getByRole("switch"));
    });

    it("toggles on Space key", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Switch onCheckedChange={onCheckedChange} aria-label="Test switch" />,
      );
      await user.tab();
      await user.keyboard(" ");
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("toggles on Enter key", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Switch onCheckedChange={onCheckedChange} aria-label="Test switch" />,
      );
      await user.tab();
      await user.keyboard("{Enter}");
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("toggles from checked to unchecked", async () => {
      const onCheckedChange = vi.fn();
      const { user } = render(
        <Switch checked onCheckedChange={onCheckedChange} aria-label="Test switch" />,
      );
      await user.click(screen.getByRole("switch"));
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("works as controlled switch", async () => {
      const onCheckedChange = vi.fn();
      const { rerender } = render(
        <Switch checked={false} onCheckedChange={onCheckedChange} aria-label="Controlled" />,
      );
      expect(screen.getByRole("switch")).not.toBeChecked();

      rerender(<Switch checked={true} onCheckedChange={onCheckedChange} aria-label="Controlled" />);
      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("works as uncontrolled switch", async () => {
      const { user } = render(<Switch defaultChecked={false} aria-label="Uncontrolled" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).not.toBeChecked();

      await user.click(switchEl);
      expect(switchEl).toBeChecked();
    });
  });

  describe("accessibility", () => {
    it("has correct switch role", () => {
      render(<Switch aria-label="Test switch" />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Switch aria-label="Custom label" />);
      expect(screen.getByRole("switch")).toHaveAccessibleName("Custom label");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <label id="label">Switch label</label>
          <Switch aria-labelledby="label" />
        </>,
      );
      expect(screen.getByRole("switch")).toHaveAccessibleName("Switch label");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Switch aria-describedby="desc" aria-label="Switch" />
          <span id="desc">Description text</span>
        </>,
      );
      expect(screen.getByRole("switch")).toHaveAccessibleDescription("Description text");
    });

    it("has visible focus indicator styles", () => {
      render(<Switch aria-label="Test switch" />);
      // The actual class uses foundation tokens
      expect(screen.getByRole("switch")).toHaveClass("focus-visible:ring-2");
    });
  });

  describe("HTML attributes", () => {
    // Note: Radix Switch uses a hidden input for form submission
    // The name attribute is on the hidden input, not the visible switch button
    it("supports name attribute via hidden input in form context", () => {
      const { container } = render(
        <form>
          <Switch name="notifications" aria-label="Notifications switch" />
        </form>,
      );
      const hiddenInput = container.querySelector('input[name="notifications"]');
      expect(hiddenInput).toBeInTheDocument();
    });

    it("supports value attribute", () => {
      render(<Switch value="on" aria-label="Switch" />);
      expect(screen.getByRole("switch")).toHaveAttribute("value", "on");
    });

    it("supports aria-required attribute", () => {
      render(<Switch aria-required="true" aria-label="Required switch" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-required", "true");
    });
  });
});
