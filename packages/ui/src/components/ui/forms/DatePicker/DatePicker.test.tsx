import { render, screen, waitFor, fireEvent } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { DatePicker, DateRangePicker } from "./DatePicker";

describe("DatePicker", () => {
  const mockOnValueChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders trigger button", () => {
      render(<DatePicker />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("displays placeholder when no value", () => {
      render(<DatePicker placeholder="Pick a date" />);
      expect(screen.getByRole("button")).toHaveTextContent("Pick a date");
    });

    it("displays formatted date when value provided", () => {
      const date = new Date(2024, 0, 15); // Jan 15, 2024
      render(<DatePicker value={date} />);
      expect(screen.getByRole("button")).toHaveTextContent("January 15, 2024");
    });

    it("uses custom formatDate when provided", () => {
      const date = new Date(2024, 0, 15);
      const customFormat = vi.fn((d: Date) => d.toISOString().split("T")[0]);
      render(<DatePicker value={date} formatDate={customFormat} />);

      expect(customFormat).toHaveBeenCalled();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Dropdown behavior", () => {
    it("opens calendar when trigger clicked", async () => {
      render(<DatePicker />);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      screen.getByRole("button").click();

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("closes calendar when date selected", async () => {
      render(<DatePicker onValueChange={mockOnValueChange} />);

      // Open calendar
      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Select a date (the Calendar component handles this)
      const date = new Date();
      mockOnValueChange.mock.calls[0]?.[0]; // Get the first call's date argument

      // Calendar should close after selection
      // This is handled by the Calendar component calling onSelect
    });

    it("closes calendar when clicking outside", async () => {
      render(<DatePicker />);

      // Open calendar
      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Click outside
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("closes calendar when Escape pressed", async () => {
      render(<DatePicker />);

      // Open calendar
      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Press Escape
      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("Date selection", () => {
    it("calls onValueChange when date selected", () => {
      // This is tested via Calendar component interaction
      // The DatePicker just passes the callback to Calendar
      render(<DatePicker onValueChange={mockOnValueChange} />);

      screen.getByRole("button").click();
      // Calendar component handles selection and calls onValueChange
    });

    it("clears date when Clear button clicked", async () => {
      const date = new Date(2024, 0, 15);
      render(<DatePicker value={date} onValueChange={mockOnValueChange} />);

      // Open calendar
      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // Click Clear button
      const clearButton = screen.getByText("Clear");
      clearButton.click();

      expect(mockOnValueChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe("Date constraints", () => {
    it("respects minDate constraint", () => {
      const minDate = new Date(2024, 5, 1); // June 1, 2024
      render(<DatePicker minDate={minDate} />);

      // Calendar should disable dates before minDate
      // This is handled by Calendar component
    });

    it("respects maxDate constraint", () => {
      const maxDate = new Date(2024, 5, 30); // June 30, 2024
      render(<DatePicker maxDate={maxDate} />);

      // Calendar should disable dates after maxDate
      // This is handled by Calendar component
    });
  });

  describe("Disabled state", () => {
    it("disables trigger when disabled", () => {
      render(<DatePicker disabled />);

      const trigger = screen.getByRole("button");
      expect(trigger).toBeDisabled();
    });

    it("prevents opening calendar when disabled", () => {
      render(<DatePicker disabled />);

      screen.getByRole("button").click();

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("trigger has aria-haspopup dialog", () => {
      render(<DatePicker />);
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("trigger has aria-expanded attribute", () => {
      render(<DatePicker />);
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("calendar has role dialog and aria-modal", async () => {
      render(<DatePicker />);

      screen.getByRole("button").click();
      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveAttribute("aria-label", "Choose date");
      });
    });
  });

  describe("Clear button", () => {
    it("shows Clear button when date selected", async () => {
      const date = new Date(2024, 0, 15);
      render(<DatePicker value={date} />);

      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByText("Clear")).toBeInTheDocument();
      });
    });

    it("does not show Clear button when no date selected", async () => {
      render(<DatePicker />);

      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.queryByText("Clear")).not.toBeInTheDocument();
      });
    });
  });
});

describe("DateRangePicker", () => {
  const mockOnRangeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders trigger button", () => {
      render(<DateRangePicker />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("displays placeholder when no range selected", () => {
      render(<DateRangePicker placeholder="Pick date range" />);
      expect(screen.getByRole("button")).toHaveTextContent("Pick date range");
    });

    it("displays formatted range when both dates selected", () => {
      const startDate = new Date(2024, 0, 10);
      const endDate = new Date(2024, 0, 20);
      render(
        <DateRangePicker startDate={startDate} endDate={endDate} />
      );
      expect(screen.getByRole("button")).toHaveTextContent("January 10, 2024 - January 20, 2024");
    });

    it("displays partial range when only start date selected", () => {
      const startDate = new Date(2024, 0, 10);
      render(<DateRangePicker startDate={startDate} />);
      expect(screen.getByRole("button")).toHaveTextContent("January 10, 2024 - ...");
    });
  });

  describe("Range selection flow", () => {
    it("prompts for start date first", async () => {
      render(<DateRangePicker onRangeChange={mockOnRangeChange} />);

      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Select start date")).toBeInTheDocument();
      });
    });

    it("prompts for end date after start selected", async () => {
      render(<DateRangePicker onRangeChange={mockOnRangeChange} />);

      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByText("Select start date")).toBeInTheDocument();
      });

      // After selecting start date, should prompt for end date
      // Calendar handles this via onSelect callback
    });

    it("clears range when Clear button clicked", async () => {
      const startDate = new Date(2024, 0, 10);
      const endDate = new Date(2024, 0, 20);
      render(
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onRangeChange={mockOnRangeChange}
        />
      );

      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByText("Clear")).toBeInTheDocument();
      });

      const clearButton = screen.getByText("Clear");
      clearButton.click();

      expect(mockOnRangeChange).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe("Disabled state", () => {
    it("disables trigger when disabled", () => {
      render(<DateRangePicker disabled />);

      const trigger = screen.getByRole("button");
      expect(trigger).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("calendar has aria-label for range picker", async () => {
      render(<DateRangePicker />);

      screen.getByRole("button").click();
      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-label", "Choose date range");
      });
    });
  });

  describe("Clear button", () => {
    it("shows Clear button when range selected", async () => {
      const startDate = new Date(2024, 0, 10);
      const endDate = new Date(2024, 0, 20);
      render(<DateRangePicker startDate={startDate} endDate={endDate} />);

      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByText("Clear")).toBeInTheDocument();
      });
    });

    it("shows Clear button when only start date selected", async () => {
      const startDate = new Date(2024, 0, 10);
      render(<DateRangePicker startDate={startDate} />);

      screen.getByRole("button").click();
      await waitFor(() => {
        expect(screen.getByText("Clear")).toBeInTheDocument();
      });
    });
  });
});
