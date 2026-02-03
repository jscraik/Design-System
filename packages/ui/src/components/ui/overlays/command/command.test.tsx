import { render, screen, waitFor } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as Command from "./Command";

describe("Command", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders command with data-slot attribute", () => {
      const { container } = render(
        <Command.Command>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item 1</Command.CommandItem>
            <Command.CommandItem>Item 2</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      const command = container.querySelector('[data-slot="command"]');
      expect(command).toBeInTheDocument();
    });

    it("renders command input with placeholder", () => {
      render(
        <Command.Command>
          <Command.CommandInput placeholder="Type to search..." />
          <Command.CommandList>
            <Command.CommandItem>Result</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      expect(screen.getByPlaceholderText("Type to search...")).toBeInTheDocument();
    });

    it("renders command items", () => {
      render(
        <Command.Command>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Open File</Command.CommandItem>
            <Command.CommandItem>Save File</Command.CommandItem>
            <Command.CommandItem>Close</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      expect(screen.getByText("Open File")).toBeInTheDocument();
      expect(screen.getByText("Save File")).toBeInTheDocument();
      expect(screen.getByText("Close")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <Command.Command loading onStateChange={mockOnStateChange}>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <Command.Command error="Error message" onStateChange={mockOnStateChange}>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <Command.Command disabled onStateChange={mockOnStateChange}>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("applies disabled styles", () => {
      const { container } = render(
        <Command.Command disabled>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      const command = container.querySelector('[data-slot="command"]');
      expect(command).toHaveClass("opacity-50");
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <Command.Command required onStateChange={mockOnStateChange}>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <Command.Command loading error="Error" disabled onStateChange={mockOnStateChange}>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <Command.Command error="Error" disabled onStateChange={mockOnStateChange}>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("CommandInput", () => {
    it("renders input with search icon wrapper", () => {
      const { container } = render(
        <Command.Command>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      const inputWrapper = container.querySelector('[data-slot="command-input-wrapper"]');
      expect(inputWrapper).toBeInTheDocument();
      const input = container.querySelector('[data-slot="command-input"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe("CommandList", () => {
    it("renders list container", () => {
      render(
        <Command.Command>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item 1</Command.CommandItem>
            <Command.CommandItem>Item 2</Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      const list = screen.getByText("Item 1").closest('[data-slot="command-list"]');
      expect(list).toBeInTheDocument();
    });
  });

  describe("CommandEmpty", () => {
    it("renders empty state", () => {
      render(
        <Command.Command>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandEmpty>No results found</Command.CommandEmpty>
          </Command.CommandList>
        </Command.Command>,
      );
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });
  });

  describe("CommandGroup", () => {
    it("renders grouped items", () => {
      render(
        <Command.Command>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandGroup heading="Suggestions">
              <Command.CommandItem>Suggestion 1</Command.CommandItem>
              <Command.CommandItem>Suggestion 2</Command.CommandItem>
            </Command.CommandGroup>
          </Command.CommandList>
        </Command.Command>,
      );
      expect(screen.getByText("Suggestions")).toBeInTheDocument();
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
      expect(screen.getByText("Suggestion 2")).toBeInTheDocument();
    });
  });

  describe("CommandSeparator", () => {
    it("renders separator between groups", () => {
      render(
        <Command.Command>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandGroup>
              <Command.CommandItem>Item 1</Command.CommandItem>
              <Command.CommandItem>Item 2</Command.CommandItem>
            </Command.CommandGroup>
            <Command.CommandSeparator />
            <Command.CommandGroup>
              <Command.CommandItem>Item 3</Command.CommandItem>
            </Command.CommandGroup>
          </Command.CommandList>
        </Command.Command>,
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });

  describe("CommandShortcut", () => {
    it("renders shortcut text", () => {
      render(
        <Command.Command>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>
              <span>Save</span>
              <Command.CommandShortcut>⌘S</Command.CommandShortcut>
            </Command.CommandItem>
          </Command.CommandList>
        </Command.Command>,
      );
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("⌘S")).toBeInTheDocument();
    });
  });

  describe("CommandDialog", () => {
    it("renders command in dialog wrapper", () => {
      render(
        <Command.CommandDialog open>
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Dialog Item</Command.CommandItem>
          </Command.CommandList>
        </Command.CommandDialog>,
      );
      expect(screen.getByText("Dialog Item")).toBeInTheDocument();
      expect(screen.getByText("Command Palette")).toBeInTheDocument();
    });

    it("renders custom title and description", () => {
      render(
        <Command.CommandDialog open title="Custom Title" description="Custom description">
          <Command.CommandInput placeholder="Search..." />
          <Command.CommandList>
            <Command.CommandItem>Item</Command.CommandItem>
          </Command.CommandList>
        </Command.CommandDialog>,
      );
      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom description")).toBeInTheDocument();
    });
  });

  describe("Complete command structure", () => {
    it("renders command with all components", () => {
      render(
        <Command.Command>
          <Command.CommandInput placeholder="Search commands..." />
          <Command.CommandList>
            <Command.CommandGroup heading="File Actions">
              <Command.CommandItem>
                <span>New File</span>
                <Command.CommandShortcut>⌘N</Command.CommandShortcut>
              </Command.CommandItem>
              <Command.CommandItem>
                <span>Open File</span>
                <Command.CommandShortcut>⌘O</Command.CommandShortcut>
              </Command.CommandItem>
            </Command.CommandGroup>
            <Command.CommandSeparator />
            <Command.CommandGroup heading="Edit Actions">
              <Command.CommandItem>
                <span>Undo</span>
                <Command.CommandShortcut>⌘Z</Command.CommandShortcut>
              </Command.CommandItem>
              <Command.CommandItem>
                <span>Redo</span>
                <Command.CommandShortcut>⇧⌘Z</Command.CommandShortcut>
              </Command.CommandItem>
            </Command.CommandGroup>
            <Command.CommandEmpty>No commands found</Command.CommandEmpty>
          </Command.CommandList>
        </Command.Command>,
      );
      expect(screen.getByPlaceholderText("Search commands...")).toBeInTheDocument();
      expect(screen.getByText("File Actions")).toBeInTheDocument();
      expect(screen.getByText("Edit Actions")).toBeInTheDocument();
      expect(screen.getByText("New File")).toBeInTheDocument();
      expect(screen.getByText("Open File")).toBeInTheDocument();
      expect(screen.getByText("Undo")).toBeInTheDocument();
      expect(screen.getByText("Redo")).toBeInTheDocument();
      // Empty state only renders when there are no matching items; not tested here
    });
  });
});
