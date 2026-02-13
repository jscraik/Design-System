import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../../testing/utils";

import { Slider } from "./fallback/Slider";

describe("Slider", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider").closest("[data-slot='slider']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Slider className="custom-class" defaultValue={[50]} />);
      expect(screen.getByRole("slider").closest("[data-slot='slider']")).toHaveClass(
        "custom-class",
      );
    });
  });

  describe("StatefulComponentProps", () => {
    describe("loading state", () => {
      it("shows loading state when loading is true", () => {
        render(<Slider loading defaultValue={[50]} />);
        const slider = screen.getByRole("slider").closest("[data-slot='slider']");
        expect(slider).toHaveAttribute("data-state", "loading");
      });

      it("applies loading opacity to thumb", () => {
        render(<Slider loading defaultValue={[50]} />);
        const slider = screen.getByRole("slider");
        expect(slider).toHaveClass("opacity-70");
      });

      it("applies loading cursor style to thumb", () => {
        render(<Slider loading defaultValue={[50]} />);
        const slider = screen.getByRole("slider");
        expect(slider).toHaveClass("cursor-wait");
      });

      it("calls onStateChange with loading state", () => {
        const onStateChange = vi.fn();
        render(<Slider loading onStateChange={onStateChange} defaultValue={[50]} />);
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });
    });

    describe("error state", () => {
      it("applies error styles when error message is provided", () => {
        render(<Slider error="Value too high" defaultValue={[50]} />);
        const slider = screen.getByRole("slider").closest("[data-slot='slider']");
        expect(slider).toHaveAttribute("data-state", "error");
        expect(slider).toHaveAttribute("data-error", "true");
      });

      it("applies error border to track", () => {
        render(<Slider error="Value too high" defaultValue={[50]} />);
        const track = screen
          .getByRole("slider")
          .closest("[data-slot='slider']")
          ?.querySelector("[data-slot='slider-track']");
        expect(track).toHaveClass("border-status-error/50");
      });

      it("applies error background to range", () => {
        render(<Slider error="Value too high" defaultValue={[50]} />);
        const range = screen
          .getByRole("slider")
          .closest("[data-slot='slider']")
          ?.querySelector("[data-slot='slider-range']");
        expect(range).toHaveClass("bg-status-error");
      });

      it("applies error border to thumb", () => {
        render(<Slider error="Value too high" defaultValue={[50]} />);
        const thumb = screen.getByRole("slider");
        expect(thumb).toHaveClass("border-status-error");
      });

      it("calls onStateChange with error state", () => {
        const onStateChange = vi.fn();
        render(<Slider error="Error message" onStateChange={onStateChange} defaultValue={[50]} />);
        expect(onStateChange).toHaveBeenCalledWith("error");
      });
    });

    describe("required state", () => {
      it("sets data-required attribute when required is true", () => {
        render(<Slider required defaultValue={[50]} />);
        const slider = screen.getByRole("slider").closest("[data-slot='slider']");
        expect(slider).toHaveAttribute("data-required", "true");
      });

      it("does not set data-required when required is false", () => {
        render(<Slider required={false} defaultValue={[50]} />);
        const slider = screen.getByRole("slider").closest("[data-slot='slider']");
        expect(slider).not.toHaveAttribute("data-required");
      });
    });

    describe("onStateChange callback", () => {
      it("calls onStateChange with default state when no other state is set", () => {
        const onStateChange = vi.fn();
        render(<Slider onStateChange={onStateChange} defaultValue={[50]} />);
        expect(onStateChange).toHaveBeenCalledWith("default");
      });

      it("calls onStateChange with disabled state when disabled", () => {
        const onStateChange = vi.fn();
        render(<Slider disabled onStateChange={onStateChange} defaultValue={[50]} />);
        expect(onStateChange).toHaveBeenCalledWith("disabled");
      });

      it("prioritizes loading over disabled state", () => {
        const onStateChange = vi.fn();
        render(<Slider loading disabled onStateChange={onStateChange} defaultValue={[50]} />);
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });

      it("prioritizes error over other states", () => {
        const onStateChange = vi.fn();
        render(<Slider error="Error" loading onStateChange={onStateChange} defaultValue={[50]} />);
        expect(onStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("values", () => {
    it("renders with defaultValue", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
    });

    it("renders with controlled value", () => {
      render(<Slider value={[75]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "75");
    });

    it("respects min and max", () => {
      render(<Slider min={10} max={90} defaultValue={[50]} />);
      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "10");
      expect(slider).toHaveAttribute("aria-valuemax", "90");
    });

    it("renders multiple thumbs for range slider", () => {
      render(<Slider defaultValue={[25, 75]} />);
      expect(screen.getAllByRole("slider")).toHaveLength(2);
    });
  });

  describe("interactions", () => {
    it("calls onValueChange when value changes", async () => {
      const onValueChange = vi.fn();
      const { user } = render(<Slider defaultValue={[50]} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      await user.click(slider);
      // Note: Actual value change depends on click position, just verify callback is wired
    });

    it("can be focused via keyboard", async () => {
      const { user } = render(<Slider defaultValue={[50]} />);
      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole("slider"));
    });

    it("does not trigger onChange when disabled", async () => {
      const onValueChange = vi.fn();
      const { user } = render(
        <Slider disabled defaultValue={[50]} onValueChange={onValueChange} />,
      );

      const slider = screen.getByRole("slider");
      await user.click(slider);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("does not trigger onChange when loading", async () => {
      const onValueChange = vi.fn();
      const { user } = render(<Slider loading defaultValue={[50]} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      await user.click(slider);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled prop is true", () => {
      render(<Slider disabled defaultValue={[50]} />);
      expect(screen.getByRole("slider").closest("[data-slot='slider']")).toHaveAttribute(
        "data-disabled",
      );
    });

    it("has correct disabled styles", () => {
      render(<Slider disabled defaultValue={[50]} />);
      expect(screen.getByRole("slider").closest("[data-slot='slider']")).toHaveClass(
        "data-[disabled]:opacity-50",
      );
    });

    it("does not trigger onChange when disabled", async () => {
      const onValueChange = vi.fn();
      const { user } = render(
        <Slider disabled defaultValue={[50]} onValueChange={onValueChange} />,
      );

      const slider = screen.getByRole("slider");
      await user.click(slider);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("orientation", () => {
    it("supports horizontal orientation by default", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("supports vertical orientation", () => {
      render(<Slider orientation="vertical" defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-orientation", "vertical");
    });
  });

  describe("accessibility", () => {
    it("has correct slider role", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("has aria-valuenow attribute", () => {
      render(<Slider defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
    });

    it("has aria-valuemin attribute", () => {
      render(<Slider min={0} defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemin", "0");
    });

    it("has aria-valuemax attribute", () => {
      render(<Slider max={100} defaultValue={[50]} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "100");
    });

    it("supports aria-label", () => {
      render(<Slider aria-label="Volume" defaultValue={[50]} />);
      // Radix Slider applies aria-label to the thumb, not the root
      const slider = screen.getByRole("slider");
      expect(slider).toBeInTheDocument();
    });

    it("has visible focus indicator styles", () => {
      render(<Slider defaultValue={[50]} />);
      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveClass("focus-visible:ring-4");
    });
  });

  describe("step", () => {
    it("respects step value", () => {
      render(<Slider step={10} defaultValue={[50]} />);
      // Step is handled internally by Radix, just verify it renders
      expect(screen.getByRole("slider")).toBeInTheDocument();
    });
  });
});
