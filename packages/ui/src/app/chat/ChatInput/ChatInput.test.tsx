import { render, screen, waitFor, fireEvent } from "../../../../testing/utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ChatInput } from "./ChatInput";

describe("ChatInput", () => {
  const mockOnSendMessage = vi.fn();
  const mockOnAttachmentAction = vi.fn();
  const mockOnMoreAction = vi.fn();
  const mockOnSearchToggle = vi.fn();
  const mockOnResearchToggle = vi.fn();
  const mockOnAutoClear = vi.fn();

  const mockSelectedModel = {
    name: "GPT-4o",
    shortName: "4o",
    description: "Latest model",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Props API (default variant)", () => {
    it("renders chat input with data-testid", () => {
      const { container } = render(<ChatInput />);
      const input = container.querySelector('[data-testid="chat-input"]');
      expect(input).toBeInTheDocument();
    });

    it("renders form element", () => {
      const { container } = render(<ChatInput />);
      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("renders model badge when selectedModel provided", () => {
      render(<ChatInput selectedModel={mockSelectedModel} />);
      expect(screen.getByText("4o")).toBeInTheDocument();
    });

    it("renders default model badge when no selectedModel", () => {
      render(<ChatInput />);
      expect(screen.getByText("4o")).toBeInTheDocument();
    });

    it("renders action buttons", () => {
      render(<ChatInput />);
      expect(screen.getByTitle("Web search")).toBeInTheDocument();
      expect(screen.getByTitle("Research")).toBeInTheDocument();
      expect(screen.getByTitle("History")).toBeInTheDocument();
      expect(screen.getByTitle("Voice input")).toBeInTheDocument();
      expect(screen.getByTitle("Advanced features")).toBeInTheDocument();
    });
  });

  describe("Compound API (variant='compound')", () => {
    it("provides context to compound components", () => {
      const { container } = render(
        <ChatInput variant="compound" selectedModel={mockSelectedModel}>
          <ChatInput.ComposerArea />
        </ChatInput>
      );
      // Should render without error
      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("renders ActionBar with children", () => {
      render(
        <ChatInput variant="compound">
          <ChatInput.ActionBar>
            <div data-testid="custom-action">Custom</div>
          </ChatInput.ActionBar>
        </ChatInput>
      );
      expect(screen.getByTestId("custom-action")).toBeInTheDocument();
    });

    it("throws error when compound component used without compound variant", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<ChatInput.ComposerArea />);
      }).toThrow();

      console.error = originalError;
    });
  });

  describe("Action buttons", () => {
    it("toggles search indicator when search button clicked", () => {
      render(<ChatInput onSearchToggle={mockOnSearchToggle} />);
      const searchButton = screen.getByTitle("Web search");

      fireEvent.click(searchButton);
      expect(mockOnSearchToggle).toHaveBeenCalledWith(true);
    });

    it("toggles research indicator when research button clicked", () => {
      render(<ChatInput onResearchToggle={mockOnResearchToggle} />);
      const researchButton = screen.getByTitle("Research");

      fireEvent.click(researchButton);
      expect(mockOnResearchToggle).toHaveBeenCalledWith(true);
    });

    it("toggles voice input when voice button clicked", () => {
      render(<ChatInput />);
      const voiceButton = screen.getByTitle("Voice input");

      expect(voiceButton).toHaveAttribute("aria-pressed", "false");
      fireEvent.click(voiceButton);
      expect(voiceButton).toHaveAttribute("aria-pressed", "true");
    });

    it("calls onAutoClear when auto-clear button clicked", () => {
      render(<ChatInput onAutoClear={mockOnAutoClear} />);
      const autoClearButton = screen.getByText("Auto-clear");

      fireEvent.click(autoClearButton);
      expect(mockOnAutoClear).toHaveBeenCalled();
    });
  });

  describe("Auto-clear button", () => {
    it("does not render auto-clear button when onAutoClear not provided", () => {
      render(<ChatInput />);
      expect(screen.queryByText("Auto-clear")).not.toBeInTheDocument();
    });

    it("renders auto-clear button when onAutoClear provided", () => {
      render(<ChatInput onAutoClear={mockOnAutoClear} />);
      expect(screen.getByText("Auto-clear")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("disables send button when message is empty", () => {
      render(<ChatInput />);
      const sendButton = screen.getByTitle("Send message (Enter)");
      expect(sendButton).toBeDisabled();
    });

    it("renders send button", () => {
      render(<ChatInput />);
      const sendButton = screen.getByTitle("Send message (Enter)");
      expect(sendButton).toBeInTheDocument();
    });
  });

  describe("Custom slots", () => {
    it("renders composerLeft content", () => {
      render(
        <ChatInput
          composerLeft={<div data-testid="composer-left">Left</div>}
        />
      );
      expect(screen.getByTestId("composer-left")).toBeInTheDocument();
    });

    it("renders composerRight content", () => {
      render(
        <ChatInput
          composerRight={<div data-testid="composer-right">Right</div>}
        />
      );
      expect(screen.getByTestId("composer-right")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("search button has aria-pressed attribute", () => {
      render(<ChatInput />);
      const searchButton = screen.getByTitle("Web search");
      expect(searchButton).toHaveAttribute("aria-pressed", "false");
    });

    it("research button has aria-pressed attribute", () => {
      render(<ChatInput />);
      const researchButton = screen.getByTitle("Research");
      expect(researchButton).toHaveAttribute("aria-pressed", "false");
    });

    it("voice button has aria-pressed attribute", () => {
      render(<ChatInput />);
      const voiceButton = screen.getByTitle("Voice input");
      expect(voiceButton).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("SendButton compound component", () => {
    it("renders in compound mode", () => {
      render(
        <ChatInput variant="compound">
          <ChatInput.ComposerArea />
          <ChatInput.ActionBar>
            <ChatInput.RightActions>
              <ChatInput.SendButton />
            </ChatInput.RightActions>
          </ChatInput.ActionBar>
        </ChatInput>
      );
      const sendButton = screen.getByTitle("Send message (Enter)");
      expect(sendButton).toBeInTheDocument();
    });

    it("is disabled when message is empty", () => {
      render(
        <ChatInput variant="compound">
          <ChatInput.ComposerArea />
          <ChatInput.ActionBar>
            <ChatInput.RightActions>
              <ChatInput.SendButton />
            </ChatInput.RightActions>
          </ChatInput.ActionBar>
        </ChatInput>
      );
      const sendButton = screen.getByTitle("Send message (Enter)");
      expect(sendButton).toBeDisabled();
    });
  });

  describe("LeftActions compound component", () => {
    it("renders attachment menu and toggle buttons", () => {
      render(
        <ChatInput variant="compound">
          <ChatInput.ComposerArea />
          <ChatInput.ActionBar>
            <ChatInput.LeftActions />
          </ChatInput.ActionBar>
        </ChatInput>
      );
      expect(screen.getByTitle("Add attachment")).toBeInTheDocument();
      expect(screen.getByTitle("Web search")).toBeInTheDocument();
      expect(screen.getByTitle("Research")).toBeInTheDocument();
    });
  });

  describe("RightActions compound component", () => {
    it("renders action buttons", () => {
      render(
        <ChatInput variant="compound">
          <ChatInput.ComposerArea />
          <ChatInput.ActionBar>
            <ChatInput.RightActions />
          </ChatInput.ActionBar>
        </ChatInput>
      );
      expect(screen.getByTitle("History")).toBeInTheDocument();
      expect(screen.getByTitle("Voice input")).toBeInTheDocument();
      expect(screen.getByTitle("Advanced features")).toBeInTheDocument();
    });
  });

  describe("ComposerArea compound component", () => {
    it("renders textarea area in compound mode", () => {
      const { container } = render(
        <ChatInput variant="compound" selectedModel={mockSelectedModel}>
          <ChatInput.ComposerArea />
        </ChatInput>
      );
      // Should render without error - the AppsSDK Textarea component
      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("ActionBar compound component", () => {
    it("renders action bar with children", () => {
      render(
        <ChatInput variant="compound">
          <ChatInput.ActionBar>
            <div data-testid="action-content">Actions</div>
          </ChatInput.ActionBar>
        </ChatInput>
      );
      expect(screen.getByTestId("action-content")).toBeInTheDocument();
    });
  });
});
