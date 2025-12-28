import { describe, expect, it } from "vitest";

import { render, screen } from "../../../../test/utils";

import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  describe("rendering", () => {
    it("renders with default props", () => {
      render(<Alert>Alert content</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("renders with data-slot attribute", () => {
      render(<Alert>Alert content</Alert>);
      expect(screen.getByRole("alert")).toHaveAttribute("data-slot", "alert");
    });

    it("applies custom className", () => {
      render(<Alert className="custom-class">Alert content</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("custom-class");
    });
  });

  describe("variants", () => {
    it("renders default variant", () => {
      render(<Alert variant="default">Default alert</Alert>);
      expect(screen.getByRole("alert")).not.toHaveClass("border-foundation-accent-red/50");
    });

    it("renders destructive variant with correct styles", () => {
      render(<Alert variant="destructive">Destructive alert</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("border-foundation-accent-red/50");
    });
  });

  describe("composition", () => {
    it("renders with AlertTitle", () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
        </Alert>,
      );
      expect(screen.getByText("Alert Title")).toBeInTheDocument();
    });

    it("renders with AlertDescription", () => {
      render(
        <Alert>
          <AlertDescription>Alert description text</AlertDescription>
        </Alert>,
      );
      expect(screen.getByText("Alert description text")).toBeInTheDocument();
    });

    it("renders with both title and description", () => {
      render(
        <Alert>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description</AlertDescription>
        </Alert>,
      );
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("renders with icon", () => {
      render(
        <Alert>
          <span data-testid="alert-icon">⚠️</span>
          <AlertTitle>Warning</AlertTitle>
        </Alert>,
      );
      expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has correct alert role", () => {
      render(<Alert>Alert content</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Alert aria-label="Important notification">Alert content</Alert>);
      expect(screen.getByRole("alert")).toHaveAccessibleName("Important notification");
    });

    it("supports aria-describedby", () => {
      render(
        <Alert aria-describedby="desc">
          <AlertDescription id="desc">Description</AlertDescription>
        </Alert>,
      );
      expect(screen.getByRole("alert")).toHaveAttribute("aria-describedby", "desc");
    });
  });
});

describe("AlertTitle", () => {
  it("renders with data-slot attribute", () => {
    render(<AlertTitle>Title</AlertTitle>);
    expect(screen.getByText("Title")).toHaveAttribute("data-slot", "alert-title");
  });

  it("applies custom className", () => {
    render(<AlertTitle className="custom-class">Title</AlertTitle>);
    expect(screen.getByText("Title")).toHaveClass("custom-class");
  });

  it("truncates long titles", () => {
    render(<AlertTitle>Very long title that should be truncated</AlertTitle>);
    expect(screen.getByText("Very long title that should be truncated")).toHaveClass(
      "line-clamp-1",
    );
  });
});

describe("AlertDescription", () => {
  it("renders with data-slot attribute", () => {
    render(<AlertDescription>Description</AlertDescription>);
    expect(screen.getByText("Description")).toHaveAttribute("data-slot", "alert-description");
  });

  it("applies custom className", () => {
    render(<AlertDescription className="custom-class">Description</AlertDescription>);
    expect(screen.getByText("Description")).toHaveClass("custom-class");
  });
});
