import { render, screen, waitFor } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as DropdownMenu from "./fallback/DropdownMenu";

describe("DropdownMenu", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders dropdown menu trigger with data-slot attribute", () => {
      const { container } = render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Click me</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>Copy</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
      expect(trigger).toBeInTheDocument();
    });

    it("renders trigger text", () => {
      render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Toggle Menu</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>Item</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      expect(screen.getByText("Toggle Menu")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <DropdownMenu.DropdownMenu loading onStateChange={mockOnStateChange}>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>Item</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <DropdownMenu.DropdownMenu error="Error message" onStateChange={mockOnStateChange}>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>Item</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <DropdownMenu.DropdownMenu disabled onStateChange={mockOnStateChange}>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>Item</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <DropdownMenu.DropdownMenu required onStateChange={mockOnStateChange}>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>Item</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <DropdownMenu.DropdownMenu
          loading
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        >
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>Item</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <DropdownMenu.DropdownMenu
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
        >
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>Item</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("DropdownMenuItem", () => {
    it("renders destructive item without error", () => {
      render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem variant="destructive">Delete</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      expect(screen.getByText("Click")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuCheckboxItem", () => {
    it("renders checkbox item without error", () => {
      render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuCheckboxItem>Check me</DropdownMenu.DropdownMenuCheckboxItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      expect(screen.getByText("Click")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuRadioItem", () => {
    it("renders radio item without error", () => {
      render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuRadioGroup>
              <DropdownMenu.DropdownMenuRadioItem value="1">Option 1</DropdownMenu.DropdownMenuRadioItem>
              <DropdownMenu.DropdownMenuRadioItem value="2">Option 2</DropdownMenu.DropdownMenuRadioItem>
            </DropdownMenu.DropdownMenuRadioGroup>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      expect(screen.getByText("Click")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuLabel", () => {
    it("renders label without error", () => {
      render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuLabel>Section Label</DropdownMenu.DropdownMenuLabel>
            <DropdownMenu.DropdownMenuItem>Item</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      expect(screen.getByText("Click")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuShortcut", () => {
    it("renders shortcut without error", () => {
      render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuItem>
              Save
              <DropdownMenu.DropdownMenuShortcut>⌘S</DropdownMenu.DropdownMenuShortcut>
            </DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      expect(screen.getByText("Click")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuGroup", () => {
    it("renders grouped items without error", () => {
      render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuGroup>
              <DropdownMenu.DropdownMenuItem>Group Item 1</DropdownMenu.DropdownMenuItem>
              <DropdownMenu.DropdownMenuItem>Group Item 2</DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuGroup>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      expect(screen.getByText("Click")).toBeInTheDocument();
    });
  });

  describe("Complete menu structure", () => {
    it("renders menu with all components without error", () => {
      render(
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger>Click</DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            <DropdownMenu.DropdownMenuLabel>Actions</DropdownMenu.DropdownMenuLabel>
            <DropdownMenu.DropdownMenuItem>Copy</DropdownMenu.DropdownMenuItem>
            <DropdownMenu.DropdownMenuSeparator />
            <DropdownMenu.DropdownMenuGroup>
              <DropdownMenu.DropdownMenuCheckboxItem>Check me</DropdownMenu.DropdownMenuCheckboxItem>
            </DropdownMenu.DropdownMenuGroup>
            <DropdownMenu.DropdownMenuSeparator />
            <DropdownMenu.DropdownMenuRadioGroup>
              <DropdownMenu.DropdownMenuRadioItem value="1">Option 1</DropdownMenu.DropdownMenuRadioItem>
              <DropdownMenu.DropdownMenuRadioItem value="2">Option 2</DropdownMenu.DropdownMenuRadioItem>
            </DropdownMenu.DropdownMenuRadioGroup>
            <DropdownMenu.DropdownMenuSeparator />
            <DropdownMenu.DropdownMenuItem variant="destructive">Delete</DropdownMenu.DropdownMenuItem>
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      );
      expect(screen.getByText("Click")).toBeInTheDocument();
    });
  });
});
