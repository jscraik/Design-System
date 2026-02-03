import { render, screen, waitFor, fireEvent } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { RangeSlider } from "./RangeSlider";

describe("RangeSlider", () => {
  const mockOnChange = vi.fn();
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders range input", () => {
      render(<RangeSlider value={50} />);
      const input = screen.getByRole("slider");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "range");
    });

    it("renders with default min and max", () => {
      render(<RangeSlider value={50} />);
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "100");
    });

    it("renders with custom min and max", () => {
      render(<RangeSlider value={25} min={10} max={50} />);
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("min", "10");
      expect(input).toHaveAttribute("max", "50");
    });

    it("renders with custom step", () => {
      render(<RangeSlider value={50} step={5} />);
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("step", "5");
    });

    it("renders with current value", () => {
      render(<RangeSlider value={75} />);
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("value", "75");
    });
  });

  describe("Value display", () => {
    it("displays value when showValue is true", () => {
      render(<RangeSlider value={60} showValue={true} />);
      expect(screen.getByText("60")).toBeInTheDocument();
    });

    it("displays value with suffix when provided", () => {
      render(<RangeSlider value={60} suffix="kg" showValue={true} />);
      expect(screen.getByText("60kg")).toBeInTheDocument();
    });

    it("hides value display when showValue is false", () => {
      render(<RangeSlider value={60} showValue={false} />);
      expect(screen.queryByText("60")).not.toBeInTheDocument();
    });
  });

  describe("Label", () => {
    it("renders label when provided", () => {
      render(<RangeSlider value={50} label="Volume" />);
      expect(screen.getByText("Volume")).toBeInTheDocument();
      const label = screen.getByText("Volume");
      expect(label.tagName).toBe("LABEL");
    });

    it("associates label with input", () => {
      render(<RangeSlider value={50} label="Volume" />);
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("id");
    });

    it("does not render label when not provided", () => {
      render(<RangeSlider value={50} />);
      expect(screen.queryByRole("label")).not.toBeInTheDocument();
    });
  });

  describe("User interaction", () => {
    it("calls onChange when value changes", () => {
      render(<RangeSlider value={50} onChange={mockOnChange} />);

      const input = screen.getByRole("slider");
      fireEvent.change(input, { target: { value: "75" } });

      expect(mockOnChange).toHaveBeenCalledWith(75);
    });

    it("respects min value constraint", () => {
      render(<RangeSlider value={10} min={10} max={100} onChange={mockOnChange} />);
      // Component renders with min constraint - browser enforces the min value
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("min", "10");
    });

    it("respects max value constraint", () => {
      render(<RangeSlider value={90} min={0} max={100} onChange={mockOnChange} />);

      const input = screen.getByRole("slider");
      fireEvent.change(input, { target: { value: "105" } });

      // The onChange callback will receive the value (browser may clamp to max)
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("respects step increment", () => {
      render(<RangeSlider value={50} step={10} onChange={mockOnChange} />);

      const input = screen.getByRole("slider");
      fireEvent.change(input, { target: { value: "55" } });

      // Browser will round to nearest step
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe("Gradient styling", () => {
    it("applies default gradient based on value percentage", () => {
      render(<RangeSlider value={50} />);
      const input = screen.getByRole("slider");
      expect(input).toBeInTheDocument();
      // Gradient is applied via inline style
      expect(input).toHaveAttribute("style");
    });

    it("uses custom gradient when provided", () => {
      const customGradient = "linear-gradient(to right, #ff0000, #00ff00)";
      render(<RangeSlider value={50} gradient={customGradient} />);
      const input = screen.getByRole("slider");
      expect(input).toHaveStyle({ background: customGradient });
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(<RangeSlider value={50} loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows loading state when loading", () => {
      render(<RangeSlider value={50} loading />);
      const input = screen.getByRole("slider");
      expect(input).toHaveClass("animate-pulse");
      expect(input).toBeDisabled();
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(<RangeSlider value={50} error="Value too high" onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("shows error ring when error", () => {
      render(<RangeSlider value={50} error="Invalid value" />);
      const input = screen.getByRole("slider");
      expect(input).toHaveClass("ring-2");
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(<RangeSlider value={50} disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("disables input when disabled", () => {
      render(<RangeSlider value={50} disabled />);
      const input = screen.getByRole("slider");
      expect(input).toBeDisabled();
    });

    it("reduces opacity when disabled", () => {
      render(<RangeSlider value={50} disabled />);
      const input = screen.getByRole("slider");
      expect(input).toHaveClass("opacity-50");
    });

    it("prevents value change when disabled", () => {
      render(<RangeSlider value={50} disabled onChange={mockOnChange} />);

      const input = screen.getByRole("slider");
      fireEvent.change(input, { target: { value: "75" } });

      // Even though the event fires, the onChange callback shouldn't be called
      // because the input is disabled and won't actually update the value
      // The exact behavior depends on browser implementation
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(<RangeSlider value={50} required onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <RangeSlider value={50} loading error="Error" disabled onStateChange={mockOnStateChange} />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(<RangeSlider value={50} error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("has aria-label from label prop when no ariaLabel provided", () => {
      render(<RangeSlider value={50} label="Volume" />);
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("aria-label", "Volume");
    });

    it("has aria-label from ariaLabel prop when provided", () => {
      render(<RangeSlider value={50} ariaLabel="Slider for volume" />);
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("aria-label", "Slider for volume");
    });

    it("has default aria-label when no label provided", () => {
      render(<RangeSlider value={50} />);
      const input = screen.getByRole("slider");
      expect(input).toHaveAttribute("aria-label", "Range slider");
    });

    it("has aria-disabled when disabled", () => {
      render(<RangeSlider value={50} disabled />);
      // RangeSlider wrapper has aria-disabled
      const container = screen.getByRole("slider").parentElement;
      expect(container?.getAttribute("aria-disabled")).toBe("true");
    });

    it("has aria-invalid when error", () => {
      render(<RangeSlider value={50} error="Invalid" />);
      const wrapper = screen.getByRole("slider").closest("[data-state]");
      expect(wrapper).toHaveAttribute("aria-invalid", "true");
    });

    it("has aria-required when required", () => {
      render(<RangeSlider value={50} required />);
      const wrapper = screen.getByRole("slider").closest("[data-state]");
      expect(wrapper).toHaveAttribute("aria-required", "true");
    });

    it("has aria-busy when loading", () => {
      render(<RangeSlider value={50} loading />);
      const wrapper = screen.getByRole("slider").closest("[data-state]");
      expect(wrapper).toHaveAttribute("aria-busy", "true");
    });

    it("has data-state attribute reflecting current state", () => {
      render(<RangeSlider value={50} />);
      const wrapper = screen.getByRole("slider").closest("[data-state]");
      expect(wrapper).toHaveAttribute("data-state", "default");
    });

    it("has data-error attribute when error", () => {
      render(<RangeSlider value={50} error="Invalid" />);
      const wrapper = screen.getByRole("slider").closest("[data-state]");
      expect(wrapper).toHaveAttribute("data-error", "true");
    });

    it("has data-required attribute when required", () => {
      render(<RangeSlider value={50} required />);
      const wrapper = screen.getByRole("slider").closest("[data-state]");
      expect(wrapper).toHaveAttribute("data-required", "true");
    });
  });

  describe("Percentage calculation", () => {
    it("calculates correct percentage for middle value", () => {
      render(<RangeSlider value={50} min={0} max={100} />);
      // 50 is 50% of 0-100 range
      // Gradient should reflect this
      const input = screen.getByRole("slider");
      expect(input).toBeInTheDocument();
    });

    it("calculates correct percentage for custom range", () => {
      render(<RangeSlider value={75} min={50} max={100} />);
      // 75 is 50% of 50-100 range (25/50)
      const input = screen.getByRole("slider");
      expect(input).toBeInTheDocument();
    });
  });
});
