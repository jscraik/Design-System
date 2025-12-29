import { describe, expect, it } from "vitest";

import { render, screen } from "../../../../test/utils";

import { Label } from "./label";

describe("Label", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toHaveAttribute("data-slot", "label");
    });

    it("applies custom className", () => {
      render(<Label className="custom-class">Username</Label>);
      expect(screen.getByText("Username")).toHaveClass("custom-class");
    });
  });

  describe("htmlFor association", () => {
    it("associates with input via htmlFor", () => {
      render(
        <>
          <Label htmlFor="username">Username</Label>
          <input id="username" type="text" aria-label="Username" />
        </>,
      );
      const label = screen.getByText("Username");
      expect(label).toHaveAttribute("for", "username");
    });

    it("clicking label focuses associated input", async () => {
      const { user } = render(
        <>
          <Label htmlFor="email">Email</Label>
          <input id="email" type="email" aria-label="Email" />
        </>,
      );

      await user.click(screen.getByText("Email"));
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });

  describe("content", () => {
    it("renders with icon", () => {
      render(
        <Label>
          <span data-testid="icon">📧</span>
          Email
        </Label>,
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("renders with required indicator", () => {
      render(
        <Label>
          Username
          <span className="text-red-500">*</span>
        </Label>,
      );
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("is a label element", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username").tagName).toBe("LABEL");
    });

    it("supports aria-label", () => {
      render(<Label aria-label="User name field">Username</Label>);
      expect(screen.getByText("Username")).toHaveAttribute("aria-label", "User name field");
    });
  });

  describe("disabled state styling", () => {
    it("has disabled styles when peer is disabled", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toHaveClass("peer-disabled:opacity-50");
    });

    it("has disabled styles when in disabled group", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toHaveClass("group-data-[disabled=true]:opacity-50");
    });
  });

  describe("styling", () => {
    it("has correct font styles", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toHaveClass("font-foundation", "font-medium");
    });

    it("prevents text selection", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toHaveClass("select-none");
    });

    it("has flex layout for icon support", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toHaveClass("flex", "items-center", "gap-2");
    });
  });
});
