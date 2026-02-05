import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../../testing/utils";
import { MessageActions } from "./MessageActions";

describe("MessageActions", () => {
  const mockOnCopy = vi.fn();
  const mockOnThumbsUp = vi.fn();
  const mockOnThumbsDown = vi.fn();
  const mockOnShare = vi.fn();
  const mockOnRegenerate = vi.fn();
  const mockOnMore = vi.fn();
  const mockOnStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders with all default actions", () => {
      const { container } = render(<MessageActions />);
      const actions = container.querySelectorAll("button");
      expect(actions).toHaveLength(6); // copy, thumbsUp, thumbsDown, share, regenerate, more
    });

    it("renders with custom actions", () => {
      const { container } = render(<MessageActions actions={["copy", "thumbsUp"]} />);
      const actions = container.querySelectorAll("button");
      expect(actions).toHaveLength(2);
    });

    it("renders with showOnHover class when enabled", () => {
      const { container } = render(<MessageActions showOnHover />);
      const wrapper = container.querySelector(".opacity-0");
      expect(wrapper).toBeInTheDocument();
    });

    it("renders without showOnHover class when disabled", () => {
      const { container } = render(<MessageActions showOnHover={false} />);
      const wrapper = container.querySelector(".opacity-0");
      expect(wrapper).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<MessageActions className="custom-actions" />);
      const wrapper = container.querySelector(".custom-actions");
      expect(wrapper).toBeInTheDocument();
    });

    it("renders with messageId", () => {
      const { container } = render(<MessageActions messageId="msg-123" />);
      // Component renders without error with messageId
      const wrapper = container.querySelector('[data-state="default"]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Action callbacks", () => {
    it("calls onCopy when copy button is clicked", async () => {
      const { user } = render(
        <MessageActions actions={["copy"]} onCopy={mockOnCopy} messageId="msg-1" />,
      );
      const copyButton = screen.getByTitle("Copy");
      await user.click(copyButton);
      expect(mockOnCopy).toHaveBeenCalledWith("msg-1");
    });

    it("calls onThumbsUp when thumbs up button is clicked", async () => {
      const { user } = render(
        <MessageActions actions={["thumbsUp"]} onThumbsUp={mockOnThumbsUp} messageId="msg-2" />,
      );
      const thumbsUpButton = screen.getByTitle("Good response");
      await user.click(thumbsUpButton);
      expect(mockOnThumbsUp).toHaveBeenCalledWith("msg-2");
    });

    it("calls onThumbsDown when thumbs down button is clicked", async () => {
      const { user } = render(
        <MessageActions
          actions={["thumbsDown"]}
          onThumbsDown={mockOnThumbsDown}
          messageId="msg-3"
        />,
      );
      const thumbsDownButton = screen.getByTitle("Bad response");
      await user.click(thumbsDownButton);
      expect(mockOnThumbsDown).toHaveBeenCalledWith("msg-3");
    });

    it("calls onShare when share button is clicked", async () => {
      const { user } = render(
        <MessageActions actions={["share"]} onShare={mockOnShare} messageId="msg-4" />,
      );
      const shareButton = screen.getByTitle("Share");
      await user.click(shareButton);
      expect(mockOnShare).toHaveBeenCalledWith("msg-4");
    });

    it("calls onRegenerate when regenerate button is clicked", async () => {
      const { user } = render(
        <MessageActions
          actions={["regenerate"]}
          onRegenerate={mockOnRegenerate}
          messageId="msg-5"
        />,
      );
      const regenerateButton = screen.getByTitle("Regenerate");
      await user.click(regenerateButton);
      expect(mockOnRegenerate).toHaveBeenCalledWith("msg-5");
    });

    it("calls onMore when more button is clicked", async () => {
      const { user } = render(
        <MessageActions actions={["more"]} onMore={mockOnMore} messageId="msg-6" />,
      );
      const moreButton = screen.getByTitle("More");
      await user.click(moreButton);
      expect(mockOnMore).toHaveBeenCalledWith("msg-6");
    });

    it("passes messageId to callbacks when provided", async () => {
      const { user } = render(
        <MessageActions actions={["copy"]} onCopy={mockOnCopy} messageId="test-message-id" />,
      );
      const copyButton = screen.getByTitle("Copy");
      await user.click(copyButton);
      expect(mockOnCopy).toHaveBeenCalledWith("test-message-id");
    });

    it("calls callback without messageId when not provided", async () => {
      const { user } = render(<MessageActions actions={["copy"]} onCopy={mockOnCopy} />);
      const copyButton = screen.getByTitle("Copy");
      await user.click(copyButton);
      expect(mockOnCopy).toHaveBeenCalledWith(undefined);
    });
  });

  describe("Stateful props - Loading", () => {
    it("shows loading state", () => {
      const { container } = render(<MessageActions loading />);
      const wrapper = container.querySelector('[data-state="loading"]');
      expect(wrapper).toBeInTheDocument();
    });

    it("calls onStateChange with 'loading'", async () => {
      render(<MessageActions loading onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("disables all interactions when loading", async () => {
      const { user } = render(<MessageActions actions={["copy"]} onCopy={mockOnCopy} loading />);
      const copyButton = screen.getByTitle("Copy");
      await user.click(copyButton);
      expect(mockOnCopy).not.toHaveBeenCalled();
    });

    it("applies pulse animation when loading", () => {
      const { container } = render(<MessageActions loading />);
      const wrapper = container.querySelector(".animate-pulse");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Stateful props - Error", () => {
    it("shows error state", () => {
      const { container } = render(<MessageActions error="Failed to load actions" />);
      const wrapper = container.querySelector('[data-state="error"]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveAttribute("data-error", "true");
    });

    it("applies error ring styling", () => {
      const { container } = render(<MessageActions error="Error" />);
      const wrapper = container.querySelector(".ring-status-error\\/50");
      expect(wrapper).toBeInTheDocument();
    });

    it("sets aria-invalid when error", () => {
      const { container } = render(<MessageActions error="Error" />);
      const wrapper = container.querySelector('[aria-invalid="true"]');
      expect(wrapper).toBeInTheDocument();
    });

    it("shows error styling but callbacks still work", async () => {
      const { user } = render(
        <MessageActions actions={["copy"]} onCopy={mockOnCopy} error="Error" />,
      );
      const copyButton = screen.getByTitle("Copy");
      await user.click(copyButton);
      // Error is visual only - callbacks still work unless explicitly disabled
      expect(mockOnCopy).toHaveBeenCalled();
    });
  });

  describe("Stateful props - Disabled", () => {
    it("shows disabled state", () => {
      const { container } = render(<MessageActions disabled />);
      const wrapper = container.querySelector('[data-state="disabled"]');
      expect(wrapper).toBeInTheDocument();
    });

    it("calls onStateChange with 'disabled'", async () => {
      render(<MessageActions disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("disables all interactions when disabled", async () => {
      const { user } = render(<MessageActions actions={["copy"]} onCopy={mockOnCopy} disabled />);
      const copyButton = screen.getByTitle("Copy");
      await user.click(copyButton);
      expect(mockOnCopy).not.toHaveBeenCalled();
    });

    it("applies reduced opacity when disabled", () => {
      const { container } = render(<MessageActions disabled />);
      const wrapper = container.querySelector(".opacity-50");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Stateful props - Required", () => {
    it("sets required data attribute", () => {
      const { container } = render(<MessageActions required />);
      const wrapper = container.querySelector('[data-required="true"]');
      expect(wrapper).toBeInTheDocument();
    });

    it("sets aria-required when required", () => {
      const { container } = render(<MessageActions required />);
      const wrapper = container.querySelector('[aria-required="true"]');
      expect(wrapper).toBeInTheDocument();
    });

    it("sets aria-invalid to false when required but no error", () => {
      const { container } = render(<MessageActions required />);
      const wrapper = container.querySelector('[aria-invalid="false"]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("State priority", () => {
    it("prioritizes loading over error and disabled", async () => {
      render(<MessageActions loading error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(<MessageActions error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });

  describe("Keyboard navigation", () => {
    it("action buttons are keyboard accessible", () => {
      render(<MessageActions actions={["copy", "thumbsUp"]} />);
      const copyButton = screen.getByTitle("Copy");
      const thumbsUpButton = screen.getByTitle("Good response");
      expect(copyButton).toHaveAttribute("type", "button");
      expect(thumbsUpButton).toHaveAttribute("type", "button");
    });

    it("disabled actions are not keyboard interactive", () => {
      render(<MessageActions actions={["copy"]} disabled />);
      const copyButton = screen.getByTitle("Copy");
      expect(copyButton).toHaveAttribute("disabled");
    });
  });

  describe("Accessibility", () => {
    it("sets aria-busy when loading", () => {
      const { container } = render(<MessageActions loading />);
      const wrapper = container.querySelector('[aria-busy="true"]');
      expect(wrapper).toBeInTheDocument();
    });

    it("sets aria-disabled when disabled", () => {
      const { container } = render(<MessageActions disabled />);
      const wrapper = container.querySelector('[aria-disabled="true"]');
      expect(wrapper).toBeInTheDocument();
    });

    it("action buttons have accessible titles", () => {
      render(<MessageActions actions={["copy", "thumbsUp", "thumbsDown"]} />);
      expect(screen.getByTitle("Copy")).toBeInTheDocument();
      expect(screen.getByTitle("Good response")).toBeInTheDocument();
      expect(screen.getByTitle("Bad response")).toBeInTheDocument();
    });

    it("shows on hover with proper transition", () => {
      const { container } = render(<MessageActions showOnHover />);
      const wrapper = container.querySelector(".transition-opacity");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Visual states", () => {
    it("renders all action icons", () => {
      const { container } = render(<MessageActions />);
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("applies error ring with proper styling", () => {
      const { container } = render(<MessageActions error="Test error" />);
      const wrapper = container.querySelector(".ring-2");
      expect(wrapper).toBeInTheDocument();
    });

    it("maintains flex layout for action buttons", () => {
      const { container } = render(<MessageActions />);
      const wrapper = container.querySelector(".flex");
      expect(wrapper).toBeInTheDocument();
    });
  });
});
