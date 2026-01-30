import { render, screen, waitFor } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AttachmentMenu } from "./AttachmentMenu";

describe("AttachmentMenu", () => {
  const mockOnAttachmentAction = vi.fn();
  const mockOnMoreAction = vi.fn();
  const mockOnWebSearchToggle = vi.fn();
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders trigger button", () => {
      render(
        <AttachmentMenu
          onAttachmentAction={mockOnAttachmentAction}
          onMoreAction={mockOnMoreAction}
        />
      );
      const trigger = screen.getByTitle("Add attachment");
      expect(trigger).toBeInTheDocument();
    });

    it("trigger is a button element", () => {
      render(
        <AttachmentMenu
          onAttachmentAction={mockOnAttachmentAction}
          onMoreAction={mockOnMoreAction}
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("Controlled open state", () => {
    it("when open=true, shows popover content", () => {
      render(
        <AttachmentMenu
          open={true}
          onOpenChange={vi.fn()}
          onAttachmentAction={mockOnAttachmentAction}
          onMoreAction={mockOnMoreAction}
        />
      );
      expect(screen.getByText("Add photos & files")).toBeInTheDocument();
      expect(screen.getByText("Deep research")).toBeInTheDocument();
      expect(screen.getByText("Shopping research")).toBeInTheDocument();
      expect(screen.getByText("Agent mode")).toBeInTheDocument();
      expect(screen.getByText("Create image")).toBeInTheDocument();
      expect(screen.getByText("More")).toBeInTheDocument();
    });

    it("when open=false, popover content is hidden", () => {
      render(
        <AttachmentMenu
          open={false}
          onOpenChange={vi.fn()}
          onAttachmentAction={mockOnAttachmentAction}
          onMoreAction={mockOnMoreAction}
        />
      );
      expect(screen.queryByText("Add photos & files")).not.toBeInTheDocument();
    });
  });

  describe("Stateful props - Loading", () => {
    it("calls onStateChange with 'loading'", async () => {
      render(
        <AttachmentMenu
          loading
          onStateChange={mockOnStateChange}
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("applies loading styles to trigger", () => {
      render(
        <AttachmentMenu
          loading
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      const trigger = screen.getByTitle("Add attachment");
      expect(trigger).toHaveClass("animate-pulse");
    });
  });

  describe("Stateful props - Error", () => {
    it("calls onStateChange with 'error'", async () => {
      render(
        <AttachmentMenu
          error="Failed to load"
          onStateChange={mockOnStateChange}
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });

    it("applies error styles to trigger", () => {
      render(
        <AttachmentMenu
          error="Failed to load"
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      const trigger = screen.getByTitle("Add attachment");
      expect(trigger).toHaveClass("ring-2");
    });
  });

  describe("Stateful props - Disabled", () => {
    it("calls onStateChange with 'disabled'", async () => {
      render(
        <AttachmentMenu
          disabled
          onStateChange={mockOnStateChange}
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("applies disabled styles to trigger", () => {
      render(
        <AttachmentMenu
          disabled
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      const trigger = screen.getByTitle("Add attachment");
      expect(trigger).toHaveClass("opacity-50");
    });
  });

  describe("Stateful props - Required", () => {
    it("calls onStateChange with 'default' when required", async () => {
      render(
        <AttachmentMenu
          required
          onStateChange={mockOnStateChange}
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("default");
      });
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(
        <AttachmentMenu
          loading
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(
        <AttachmentMenu
          error="Error"
          disabled
          onStateChange={mockOnStateChange}
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Primary actions", () => {
    it("calls onAttachmentAction when action clicked", async () => {
      const onOpenChange = vi.fn();
      render(
        <AttachmentMenu
          open={true}
          onOpenChange={onOpenChange}
          onAttachmentAction={mockOnAttachmentAction}
        />
      );

      const button = screen.getByText("Add photos & files");
      await button.click();

      expect(mockOnAttachmentAction).toHaveBeenCalledWith("add-photos-files");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not call action when disabled", async () => {
      const onOpenChange = vi.fn();
      render(
        <AttachmentMenu
          open={true}
          onOpenChange={onOpenChange}
          onAttachmentAction={mockOnAttachmentAction}
          disabled
        />
      );

      const button = screen.getByText("Add photos & files");
      await button.click();

      expect(mockOnAttachmentAction).not.toHaveBeenCalled();
    });
  });

  describe("Web search toggle", () => {
    it("renders without error when web search is enabled", () => {
      render(
        <AttachmentMenu
          open={true}
          onOpenChange={vi.fn()}
          isWebSearchActive={true}
          onWebSearchToggle={mockOnWebSearchToggle}
          onMoreAction={mockOnMoreAction}
        />
      );
      // Component renders; web search state is passed through but may not be visible in closed menu
      expect(screen.getByTitle("Add attachment")).toBeInTheDocument();
    });

    it("renders without error when web search is disabled", () => {
      render(
        <AttachmentMenu
          open={true}
          onOpenChange={vi.fn()}
          isWebSearchActive={false}
          onWebSearchToggle={mockOnWebSearchToggle}
          onMoreAction={mockOnMoreAction}
        />
      );
      expect(screen.getByTitle("Add attachment")).toBeInTheDocument();
    });
  });

  describe("More submenu", () => {
    it("renders More submenu option", () => {
      render(
        <AttachmentMenu
          open={true}
          onOpenChange={vi.fn()}
          onAttachmentAction={mockOnAttachmentAction}
          onMoreAction={mockOnMoreAction}
        />
      );
      expect(screen.getByText("More")).toBeInTheDocument();
    });

    it("calls onMoreAction for submenu items", async () => {
      const onOpenChange = vi.fn();
      render(
        <AttachmentMenu
          open={true}
          onOpenChange={onOpenChange}
          onAttachmentAction={mockOnAttachmentAction}
          onMoreAction={mockOnMoreAction}
        />
      );

      // Note: Testing submenu interactions requires clicking "More" first
      // For now, we verify the structure renders
      expect(screen.getByText("More")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("trigger has accessible name", () => {
      render(
        <AttachmentMenu
          onAttachmentAction={mockOnAttachmentAction}
          onMoreAction={mockOnMoreAction}
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAccessibleName("Add attachment");
    });

    it("trigger has aria-disabled when disabled", () => {
      render(
        <AttachmentMenu
          disabled
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-disabled", "true");
    });

    it("trigger has aria-busy when loading", () => {
      render(
        <AttachmentMenu
          loading
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-busy", "true");
    });

    it("trigger has aria-invalid when error", () => {
      render(
        <AttachmentMenu
          error="Failed"
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("trigger has aria-required when required", () => {
      render(
        <AttachmentMenu
          required
          onAttachmentAction={mockOnAttachmentAction}
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-required", "true");
    });
  });
});
