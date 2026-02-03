import { render, screen, waitFor } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as ContextMenu from "./fallback/ContextMenu";

describe("ContextMenu", () => {
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders context menu trigger with data-slot attribute", () => {
      const { container } = render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click me</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Copy</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      const trigger = container.querySelector('[data-slot="context-menu-trigger"]');
      expect(trigger).toBeInTheDocument();
    });

    it("renders trigger text", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Toggle Menu</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      expect(screen.getByText("Toggle Menu")).toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <ContextMenu.ContextMenu loading onStateChange={mockOnStateChange}>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <ContextMenu.ContextMenu error="Error message" onStateChange={mockOnStateChange}>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <ContextMenu.ContextMenu disabled onStateChange={mockOnStateChange}>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <ContextMenu.ContextMenu required onStateChange={mockOnStateChange}>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <ContextMenu.ContextMenu loading error="Error" disabled onStateChange={mockOnStateChange}>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <ContextMenu.ContextMenu error="Error" disabled onStateChange={mockOnStateChange}>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("ContextMenuItem", () => {
    it("renders item without error", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>Default Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      // Component renders without error; content requires menu to be open to be visible
      expect(screen.getByText("Right click")).toBeInTheDocument();
    });

    it("renders destructive item without error", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem variant="destructive">Delete</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      expect(screen.getByText("Right click")).toBeInTheDocument();
    });
  });

  describe("ContextMenuCheckboxItem", () => {
    it("renders checkbox item without error", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuCheckboxItem>Check me</ContextMenu.ContextMenuCheckboxItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      expect(screen.getByText("Right click")).toBeInTheDocument();
    });
  });

  describe("ContextMenuRadioItem", () => {
    it("renders radio item without error", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuRadioGroup>
              <ContextMenu.ContextMenuRadioItem value="1">
                Option 1
              </ContextMenu.ContextMenuRadioItem>
              <ContextMenu.ContextMenuRadioItem value="2">
                Option 2
              </ContextMenu.ContextMenuRadioItem>
            </ContextMenu.ContextMenuRadioGroup>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      expect(screen.getByText("Right click")).toBeInTheDocument();
    });
  });

  describe("ContextMenuLabel", () => {
    it("renders label without error", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuLabel>Section Label</ContextMenu.ContextMenuLabel>
            <ContextMenu.ContextMenuItem>Item</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      expect(screen.getByText("Right click")).toBeInTheDocument();
    });
  });

  describe("ContextMenuShortcut", () => {
    it("renders shortcut without error", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuItem>
              Save
              <ContextMenu.ContextMenuShortcut>⌘S</ContextMenu.ContextMenuShortcut>
            </ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      expect(screen.getByText("Right click")).toBeInTheDocument();
    });
  });

  describe("ContextMenuGroup", () => {
    it("renders grouped items without error", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuGroup>
              <ContextMenu.ContextMenuItem>Group Item 1</ContextMenu.ContextMenuItem>
              <ContextMenu.ContextMenuItem>Group Item 2</ContextMenu.ContextMenuItem>
            </ContextMenu.ContextMenuGroup>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      expect(screen.getByText("Right click")).toBeInTheDocument();
    });
  });

  describe("Complete menu structure", () => {
    it("renders menu with all components without error", () => {
      render(
        <ContextMenu.ContextMenu>
          <ContextMenu.ContextMenuTrigger>Right click</ContextMenu.ContextMenuTrigger>
          <ContextMenu.ContextMenuContent>
            <ContextMenu.ContextMenuLabel>Actions</ContextMenu.ContextMenuLabel>
            <ContextMenu.ContextMenuItem>Copy</ContextMenu.ContextMenuItem>
            <ContextMenu.ContextMenuSeparator />
            <ContextMenu.ContextMenuGroup>
              <ContextMenu.ContextMenuCheckboxItem>Check me</ContextMenu.ContextMenuCheckboxItem>
            </ContextMenu.ContextMenuGroup>
            <ContextMenu.ContextMenuSeparator />
            <ContextMenu.ContextMenuRadioGroup>
              <ContextMenu.ContextMenuRadioItem value="1">
                Option 1
              </ContextMenu.ContextMenuRadioItem>
              <ContextMenu.ContextMenuRadioItem value="2">
                Option 2
              </ContextMenu.ContextMenuRadioItem>
            </ContextMenu.ContextMenuRadioGroup>
            <ContextMenu.ContextMenuSeparator />
            <ContextMenu.ContextMenuItem variant="destructive">Delete</ContextMenu.ContextMenuItem>
          </ContextMenu.ContextMenuContent>
        </ContextMenu.ContextMenu>,
      );
      expect(screen.getByText("Right click")).toBeInTheDocument();
    });
  });
});
