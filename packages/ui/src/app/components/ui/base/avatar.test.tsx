import { describe, expect, it } from "vitest";

import { render, screen } from "../../../../test/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD").closest("[data-slot='avatar']")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Avatar className="custom-class">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD").closest("[data-slot='avatar']")).toHaveClass("custom-class");
    });
  });

  describe("AvatarImage", () => {
    it("renders image with src", () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      const img = screen.getByRole("img", { hidden: true });
      expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    });

    it("renders with data-slot attribute", () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      const img = screen.getByRole("img", { hidden: true });
      expect(img).toHaveAttribute("data-slot", "avatar-image");
    });

    it("applies custom className to image", () => {
      render(
        <Avatar>
          <AvatarImage
            src="https://example.com/avatar.jpg"
            alt="User avatar"
            className="custom-image"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      const img = screen.getByRole("img", { hidden: true });
      expect(img).toHaveClass("custom-image");
    });
  });

  describe("AvatarFallback", () => {
    it("renders fallback content", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD")).toHaveAttribute("data-slot", "avatar-fallback");
    });

    it("applies custom className to fallback", () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback">JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD")).toHaveClass("custom-fallback");
    });

    it("renders icon as fallback", () => {
      render(
        <Avatar>
          <AvatarFallback>
            <span data-testid="user-icon">👤</span>
          </AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("image has alt text", () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe's avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      const img = screen.getByRole("img", { hidden: true });
      expect(img).toHaveAttribute("alt", "John Doe's avatar");
    });

    it("fallback is accessible when image fails", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      // Fallback should be visible and accessible
      expect(screen.getByText("JD")).toBeVisible();
    });
  });

  describe("styling", () => {
    it("has rounded-full class for circular shape", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD").closest("[data-slot='avatar']")).toHaveClass("rounded-full");
    });

    it("has default size", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD").closest("[data-slot='avatar']")).toHaveClass("size-10");
    });

    it("fallback centers content", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD")).toHaveClass("flex", "items-center", "justify-center");
    });
  });
});
