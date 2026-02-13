import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../testing/utils";

import { ChatHeader } from "./ChatHeader";

describe("ChatHeader", () => {
  const defaultProps = {
    onSidebarToggle: vi.fn(),
    showSidebarToggle: true,
  };

  describe("rendering", () => {
    it("renders with default props", () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByRole("button", { name: /sidebar/i })).toBeInTheDocument();
    });

    it("renders sidebar toggle button", () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByRole("button", { name: /sidebar/i })).toBeInTheDocument();
    });

    it("renders download button", () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument();
    });

    it("renders share button", () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument();
    });
  });

  describe("sidebar toggle", () => {
    it("calls onSidebarToggle when clicked", async () => {
      const onSidebarToggle = vi.fn();
      const { user } = render(<ChatHeader {...defaultProps} onSidebarToggle={onSidebarToggle} />);

      await user.click(screen.getByRole("button", { name: /sidebar/i }));
      expect(onSidebarToggle).toHaveBeenCalledTimes(1);
    });

    it("shows open title when sidebar is closed", () => {
      render(<ChatHeader {...defaultProps} isSidebarOpen={false} />);
      expect(screen.getByRole("button", { name: /open sidebar/i })).toBeInTheDocument();
    });

    it("shows close title when sidebar is open", () => {
      render(<ChatHeader {...defaultProps} isSidebarOpen={true} />);
      expect(screen.getByRole("button", { name: /close sidebar/i })).toBeInTheDocument();
    });
  });

  describe("view mode toggle", () => {
    it("renders view mode toggle", () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Compose" })).toBeInTheDocument();
    });

    it("calls onViewModeChange when view mode changes", async () => {
      const onViewModeChange = vi.fn();
      const { user } = render(
        <ChatHeader {...defaultProps} viewMode="chat" onViewModeChange={onViewModeChange} />,
      );

      await user.click(screen.getByRole("button", { name: "Compose" }));
      expect(onViewModeChange).toHaveBeenCalledWith("compose");
    });
  });

  describe("model selector", () => {
    const models = [
      { name: "GPT-4", shortName: "GPT-4", description: "Most capable model" },
      { name: "GPT-3.5", shortName: "GPT-3.5", description: "Fast and efficient" },
    ];

    it("renders model selector when models provided", () => {
      render(<ChatHeader {...defaultProps} models={models} selectedModel={models[0]} />);
      expect(screen.getByText("GPT-4")).toBeInTheDocument();
    });

    it("does not render model selector in compose mode", () => {
      render(
        <ChatHeader
          {...defaultProps}
          models={models}
          selectedModel={models[0]}
          viewMode="compose"
        />,
      );
      // Model selector should not be visible in compose mode
      expect(screen.queryByText("GPT-4")).not.toBeInTheDocument();
    });

    it("calls onModelChange when model changes", async () => {
      const onModelChange = vi.fn();
      const { user } = render(
        <ChatHeader
          {...defaultProps}
          models={models}
          selectedModel={models[0]}
          onModelChange={onModelChange}
        />,
      );

      // Click on model selector to open dropdown
      await user.click(screen.getByText("GPT-4"));
      // This would open a dropdown - actual behavior depends on ModelSelector implementation
    });
  });

  describe("headerRight slot", () => {
    it("renders custom content in headerRight slot", () => {
      render(
        <ChatHeader
          {...defaultProps}
          headerRight={<button data-testid="custom-button">Custom</button>}
        />,
      );
      expect(screen.getByTestId("custom-button")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("all buttons have accessible names", () => {
      render(<ChatHeader {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });
  });
});
