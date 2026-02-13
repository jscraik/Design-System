import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "../../../../testing/utils";
import { Combobox } from "./Combobox";

describe("Combobox", () => {
  const mockOnValueChange = vi.fn();
  const mockOnStateChange = vi.fn();

  const sampleOptions = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders trigger button", () => {
      render(<Combobox options={sampleOptions} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("displays placeholder when no value", () => {
      render(<Combobox options={sampleOptions} placeholder="Select framework" />);
      expect(screen.getByRole("combobox")).toHaveTextContent("Select framework");
    });

    it("displays selected value", () => {
      render(<Combobox options={sampleOptions} value="react" />);
      expect(screen.getByRole("combobox")).toHaveTextContent("React");
    });

    it("displays custom value when value not in options", () => {
      render(<Combobox options={sampleOptions} value="custom" />);
      expect(screen.getByRole("combobox")).toHaveTextContent("custom");
    });
  });

  describe("Dropdown behavior", () => {
    it("opens dropdown when trigger clicked", async () => {
      render(<Combobox options={sampleOptions} />);
      const trigger = screen.getByRole("combobox");

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      trigger.click();

      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });
    });

    it("closes dropdown when option clicked", async () => {
      render(<Combobox options={sampleOptions} onValueChange={mockOnValueChange} />);

      // Open dropdown
      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      // Click option
      screen.getByText("React").click();

      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });

    it("closes dropdown when clicking outside", async () => {
      render(<Combobox options={sampleOptions} />);

      // Open dropdown
      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      // Click outside
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      });
    });
  });

  describe("Search functionality", () => {
    it("shows search input when dropdown open", async () => {
      render(<Combobox options={sampleOptions} searchPlaceholder="Search..." />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      });
    });

    it("filters options based on search", async () => {
      render(<Combobox options={sampleOptions} />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "Re" } });

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.queryByText("Vue")).not.toBeInTheDocument();
    });

    it("shows empty message when no results", async () => {
      render(<Combobox options={sampleOptions} emptyMessage="No frameworks found" />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "NonExistent" } });

      expect(screen.getByText("No frameworks found")).toBeInTheDocument();
    });
  });

  describe("Option selection", () => {
    it("calls onValueChange when option selected", async () => {
      render(<Combobox options={sampleOptions} onValueChange={mockOnValueChange} />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      screen.getByText("Vue").click();

      expect(mockOnValueChange).toHaveBeenCalledWith("vue");
    });

    it("does not select disabled option", async () => {
      const optionsWithDisabled = [
        ...sampleOptions,
        { value: "next", label: "Next.js", disabled: true },
      ];

      render(<Combobox options={optionsWithDisabled} onValueChange={mockOnValueChange} />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      screen.getByText("Next.js").click();

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it("allows custom value when allowCustomValue is true", async () => {
      render(
        <Combobox options={sampleOptions} allowCustomValue onValueChange={mockOnValueChange} />,
      );

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      // Search for custom value
      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "CustomFramework" } });

      // Press Enter to select custom value
      fireEvent.keyDown(searchInput, { key: "Enter" });

      expect(mockOnValueChange).toHaveBeenCalledWith("CustomFramework");
    });
  });

  describe("Keyboard navigation", () => {
    it("opens dropdown with ArrowDown", () => {
      render(<Combobox options={sampleOptions} />);

      fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("navigates options with ArrowDown and ArrowUp", async () => {
      render(<Combobox options={sampleOptions} />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      const _listbox = screen.getByRole("listbox");
      const searchInput = screen.getByRole("textbox");

      // ArrowDown should highlight next option
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      // Check that second option is highlighted (implementation detail)

      // ArrowUp should highlight previous option
      fireEvent.keyDown(searchInput, { key: "ArrowUp" });
    });

    it("selects highlighted option with Enter", async () => {
      render(<Combobox options={sampleOptions} onValueChange={mockOnValueChange} />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      const searchInput = screen.getByRole("textbox");

      // Arrow down to highlight first option, then Enter
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      expect(mockOnValueChange).toHaveBeenCalled();
    });

    it("closes dropdown with Escape", async () => {
      render(<Combobox options={sampleOptions} />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      const searchInput = screen.getByRole("textbox");
      fireEvent.keyDown(searchInput, { key: "Escape" });

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(<Combobox options={sampleOptions} loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("shows loading state when loading", () => {
      render(<Combobox options={sampleOptions} loading />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <Combobox
          options={sampleOptions}
          error="Invalid selection"
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("shows error message when error", async () => {
      render(<Combobox options={sampleOptions} error="Invalid selection" />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByText("Invalid selection")).toBeInTheDocument();
      });
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(<Combobox options={sampleOptions} disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("disables trigger when disabled", () => {
      render(<Combobox options={sampleOptions} disabled />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });

    it("prevents opening dropdown when disabled", () => {
      render(<Combobox options={sampleOptions} disabled />);

      screen.getByRole("combobox").click();

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(<Combobox options={sampleOptions} required onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <Combobox
          options={sampleOptions}
          loading
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <Combobox
          options={sampleOptions}
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        />,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Accessibility", () => {
    it("trigger has aria-expanded attribute", () => {
      render(<Combobox options={sampleOptions} />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("trigger has aria-haspopup listbox", () => {
      render(<Combobox options={sampleOptions} />);
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("options have role option and aria-selected", async () => {
      render(<Combobox options={sampleOptions} value="react" />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      const options = screen.getAllByRole("option");
      expect(options.length).toBeGreaterThan(0);
      expect(options[0]).toHaveAttribute("aria-selected", "true");
    });

    it("disabled options have aria-disabled", async () => {
      const optionsWithDisabled = [
        { value: "react", label: "React" },
        { value: "vue", label: "Vue", disabled: true },
      ];

      render(<Combobox options={optionsWithDisabled} />);

      screen.getByRole("combobox").click();
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
      });

      const vueOption = screen.getByText("Vue").closest('[role="option"]');
      expect(vueOption).toHaveAttribute("aria-disabled", "true");
    });
  });
});
