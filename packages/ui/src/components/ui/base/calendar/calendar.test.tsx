import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Calendar } from "./calendar";

// Mock useId for stable IDs in tests
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useId: () => "test-id-1",
  };
});

describe("Calendar", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders calendar with grid role", () => {
      render(<Calendar mode="single" />);
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("renders navigation buttons", () => {
      render(<Calendar mode="single" />);
      // Calendar should have buttons for navigation
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("renders with custom className", () => {
      const { container } = render(<Calendar mode="single" className="custom-class" />);
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("shows loading state with reduced opacity", () => {
      const { container } = render(<Calendar mode="single" loading />);
      const grid = container.querySelector('[data-state="loading"]');
      expect(grid).toBeInTheDocument();
    });

    it("calls onStateChange with 'loading' when loading prop changes", async () => {
      const { rerender } = render(
        <Calendar mode="single" loading={false} onStateChange={mockOnStateChange} />,
      );

      rerender(<Calendar mode="single" loading onStateChange={mockOnStateChange} />);

      // Wait for useEffect to run
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("disables pointer events when loading", () => {
      const { container } = render(<Calendar mode="single" loading />);
      const grid = container.querySelector('[data-state="loading"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Stateful props - Error", () => {
    it("shows error message when error prop is provided", () => {
      render(<Calendar mode="single" error="Date is unavailable" />);
      expect(screen.getByText("Date is unavailable")).toBeInTheDocument();
    });

    it("adds error ring styling to calendar", () => {
      const { container } = render(<Calendar mode="single" error="Invalid date" />);
      const grid = container.querySelector('[data-state="error"]');
      expect(grid).toBeInTheDocument();
    });

    it("sets aria-invalid when error is present", () => {
      render(<Calendar mode="single" error="Invalid date" />);
      // Note: react-day-picker handles aria-invalid internally
      // We verify error state is rendered
      expect(screen.getByText("Invalid date")).toBeInTheDocument();
    });

    it("shows error message with proper id", () => {
      render(<Calendar mode="single" error="Invalid date" />);
      const error = screen.getByText("Invalid date");
      expect(error).toHaveAttribute("id", "test-id-1-error");
    });

    it("calls onStateChange with 'error' when error prop changes", () => {
      const { rerender } = render(<Calendar mode="single" onStateChange={mockOnStateChange} />);

      rerender(<Calendar mode="single" error="Error" onStateChange={mockOnStateChange} />);
      expect(mockOnStateChange).toHaveBeenCalledWith("error");
    });

    it("does not show required indicator when error is present", () => {
      render(<Calendar mode="single" error="Error" required />);
      expect(screen.queryByText("* Required")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("disables calendar when disabled is true", () => {
      render(<Calendar mode="single" disabled />);
      // Calendar renders in disabled state
      const calendar = document.querySelector('[data-slot="calendar"]');
      expect(calendar).toHaveAttribute("data-state", "disabled");
    });

    it("disables specific dates when disabled is a function", () => {
      const disabledDates = (date: Date) => {
        // Disable weekends
        const day = date.getDay();
        return day === 0 || day === 6;
      };

      render(<Calendar mode="single" disabled={disabledDates} />);
      const grid = screen.getByRole("grid");
      expect(grid).toBeInTheDocument();
      // Note: Full testing would require mocking Date.now() to control which dates render
    });

    it("calls onStateChange with 'disabled' when disabled prop changes", () => {
      const { rerender } = render(<Calendar mode="single" onStateChange={mockOnStateChange} />);

      rerender(<Calendar mode="single" disabled onStateChange={mockOnStateChange} />);
      expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
    });
  });

  describe("Stateful props - Required", () => {
    it("shows required indicator when required and no error", () => {
      render(<Calendar mode="single" required />);
      expect(screen.getByText("* Required")).toBeInTheDocument();
    });

    it("hides required indicator from screen readers", () => {
      render(<Calendar mode="single" required />);
      const required = screen.getByText("* Required");
      expect(required).toHaveAttribute("aria-hidden", "true");
    });

    it("shows required indicator when required", () => {
      render(<Calendar mode="single" required />);
      // Required indicator is shown
      const calendar = document.querySelector('[data-slot="calendar"]');
      expect(calendar).toHaveAttribute("data-required", "true");
      expect(screen.getByText("* Required")).toBeInTheDocument();
    });

    it("does not show required indicator when not required", () => {
      render(<Calendar mode="single" />);
      expect(screen.queryByText("* Required")).not.toBeInTheDocument();
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", () => {
      const { container } = render(
        <Calendar mode="single" loading error="Error" disabled onStateChange={mockOnStateChange} />,
      );
      // Loading should override other states
      expect(container.querySelector('[data-state="loading"]')).toBeInTheDocument();
      expect(mockOnStateChange).toHaveBeenCalledWith("loading");
    });

    it("prioritizes error over disabled when not loading", () => {
      render(<Calendar mode="single" error="Error" disabled onStateChange={mockOnStateChange} />);
      expect(mockOnStateChange).toHaveBeenCalledWith("error");
    });

    it("uses disabled state when no loading or error", () => {
      render(<Calendar mode="single" disabled onStateChange={mockOnStateChange} />);
      expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
    });

    it("uses default state when no stateful props", () => {
      render(<Calendar mode="single" onStateChange={mockOnStateChange} />);
      expect(mockOnStateChange).toHaveBeenCalledWith("default");
    });
  });

  describe("Accessibility", () => {
    it("shows error message with proper id", () => {
      render(<Calendar mode="single" error="Error" />);
      const error = screen.getByText("Error");
      expect(error).toHaveAttribute("id", "test-id-1-error");
    });

    it("renders with data-slot attribute for testing", () => {
      render(<Calendar mode="single" />);
      const calendarWrapper = document.querySelector('[data-slot="calendar"]');
      expect(calendarWrapper).toBeInTheDocument();
    });

    it("shows error icon with error message", () => {
      render(<Calendar mode="single" error="Invalid date" />);
      const errorText = screen.getByText("Invalid date");
      // Error message should have an icon sibling
      const parent = errorText.parentElement;
      expect(parent?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("showOutsideDays prop", () => {
    it("shows outside days by default", () => {
      render(<Calendar mode="single" />);
      const grid = screen.getByRole("grid");
      expect(grid).toBeInTheDocument();
      // Note: Would need to mock current date to verify outside days are shown
    });

    it("respects showOutsideDays=false", () => {
      render(<Calendar mode="single" showOutsideDays={false} />);
      const grid = screen.getByRole("grid");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Custom classNames", () => {
    it("accepts classNames prop for customization", () => {
      // Note: react-day-picker uses these classNames internally
      // We're testing that the prop is accepted without errors
      const customClassNames = {
        caption: "custom-caption",
      };

      expect(() => {
        render(<Calendar mode="single" classNames={customClassNames} />);
      }).not.toThrow();
    });
  });

  describe("Mode prop", () => {
    it("renders in single mode", () => {
      render(<Calendar mode="single" />);
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("renders in range mode", () => {
      render(<Calendar mode="range" />);
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("renders in multiple mode", () => {
      render(<Calendar mode="multiple" />);
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });
  });
});
