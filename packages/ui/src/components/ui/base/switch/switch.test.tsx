import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { expectFocused, render, screen } from "../../../../testing/utils";

import { Switch } from "./fallback/Switch";

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

  describe("StatefulComponentProps", () => {
    describe("loading state", () => {
      it("shows loading spinner when loading is true", () => {
        render(<Switch loading aria-label="Loading switch" />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl).toHaveAttribute("data-state", "loading");
        expect(switchEl).toHaveClass("opacity-70");
      });

      it("disables switch when loading", () => {
        render(<Switch loading aria-label="Loading switch" />);
        expect(screen.getByRole("switch")).toBeDisabled();
      });

      it("does not toggle when loading", async () => {
        const onCheckedChange = vi.fn();
        const { user } = render(
          <Switch loading onCheckedChange={onCheckedChange} aria-label="Loading switch" />,
        );
        await user.click(screen.getByRole("switch"));
        expect(onCheckedChange).not.toHaveBeenCalled();
      });

      it("calls onStateChange with loading state", () => {
        const onStateChange = vi.fn();
        render(<Switch loading onStateChange={onStateChange} aria-label="Loading switch" />);
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });
    });

    describe("error state", () => {
      it("applies error styles when error message is provided", () => {
        render(<Switch error="Must enable to continue" aria-label="Error switch" />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl).toHaveAttribute("data-state", "error");
        expect(switchEl).toHaveAttribute("data-error", "true");
        expect(switchEl).toHaveClass("border-status-error");
      });

      it("applies error focus styles", () => {
        render(<Switch error="Connection failed" aria-label="Error switch" />);
        expect(screen.getByRole("switch")).toHaveClass("focus:border-status-error");
        expect(screen.getByRole("switch")).toHaveClass("focus:ring-status-error");
      });

      it("applies error state to thumb when checked", () => {
        render(<Switch error="Sync failed" checked aria-label="Error checked switch" />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl).toHaveAttribute("data-state", "error");
      });

      it("calls onStateChange with error state", () => {
        const onStateChange = vi.fn();
        render(
          <Switch error="Error message" onStateChange={onStateChange} aria-label="Error switch" />,
        );
        expect(onStateChange).toHaveBeenCalledWith("error");
      });
    });

    describe("required state", () => {
      it("sets data-required attribute when required is true", () => {
        render(<Switch required aria-label="Required switch" />);
        expect(screen.getByRole("switch")).toHaveAttribute("data-required", "true");
      });

      it("sets aria-required attribute for accessibility when required is true", () => {
        render(<Switch required aria-label="Required switch" />);
        expect(screen.getByRole("switch")).toHaveAttribute("aria-required", "true");
      });

      it("does not set data-required when required is false", () => {
        render(<Switch required={false} aria-label="Optional switch" />);
        expect(screen.getByRole("switch")).not.toHaveAttribute("data-required");
      });
    });

    describe("onStateChange callback", () => {
      it("calls onStateChange with unchecked state when no other state is set", () => {
        const onStateChange = vi.fn();
        render(<Switch onStateChange={onStateChange} aria-label="Test switch" />);
        expect(onStateChange).toHaveBeenCalledWith("unchecked");
      });

      it("calls onStateChange with checked state when checked", () => {
        const onStateChange = vi.fn();
        render(<Switch checked onStateChange={onStateChange} aria-label="Test switch" />);
        expect(onStateChange).toHaveBeenCalledWith("checked");
      });

      it("calls onStateChange with disabled state when disabled", () => {
        const onStateChange = vi.fn();
        render(<Switch disabled onStateChange={onStateChange} aria-label="Disabled switch" />);
        expect(onStateChange).toHaveBeenCalledWith("disabled");
      });

      it("prioritizes loading over disabled state", () => {
        const onStateChange = vi.fn();
        render(
          <Switch
            loading
            disabled
            onStateChange={onStateChange}
            aria-label="Loading disabled switch"
          />,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });

      it("prioritizes error over other states", () => {
        const onStateChange = vi.fn();
        render(
          <Switch
            error="Error"
            loading
            onStateChange={onStateChange}
            aria-label="Error loading switch"
          />,
        );
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });
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
      expect(screen.getByRole("switch")).toHaveClass("focus-visible:ring-2");
    });

    it("has error state styles for error prop", () => {
      render(<Switch error="Connection error" aria-label="Error switch" />);
      expect(screen.getByRole("switch")).toHaveClass("border-status-error");
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
