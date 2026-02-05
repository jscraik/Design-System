import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GlowText, GradientText } from "../src/components/text";

describe("GlowText", () => {
  it("should render children as text", () => {
    render(<GlowText>Glowing</GlowText>);
    expect(screen.getByText("Glowing")).toBeInTheDocument();
  });

  it("should apply custom color", () => {
    render(<GlowText color="#ff0000">Red Glow</GlowText>);
    const text = screen.getByText("Red Glow");
    expect(text).toHaveStyle({ "--glow-color": "#ff0000" });
  });

  it("should apply intensity classes", () => {
    const { rerender } = render(<GlowText intensity="subtle">Text</GlowText>);
    let text = screen.getByText("Text");
    expect(text).toHaveClass("glow-layer-1");

    rerender(<GlowText intensity="intense">Text</GlowText>);
    text = screen.getByText("Text");
    expect(text).toHaveClass("glow-layer-3");
  });

  it("should apply animation classes", () => {
    const { rerender } = render(<GlowText animate="pulse">Text</GlowText>);
    let text = screen.getByText("Text");
    expect(text).toHaveClass("animate-glow-pulse");

    rerender(<GlowText animate="breathe">Text</GlowText>);
    text = screen.getByText("Text");
    expect(text).toHaveClass("animate-glow-breathe");
  });
});

describe("GradientText", () => {
  it("should render children as text", () => {
    render(<GradientText>Gradient</GradientText>);
    expect(screen.getByText("Gradient")).toBeInTheDocument();
  });

  it("should apply preset colors", () => {
    render(<GradientText preset="sunset">Sunset</GradientText>);
    const text = screen.getByText("Sunset");
    expect(text).toHaveClass("bg-clip-text");
    expect(text).toHaveStyle({
      backgroundImage: expect.stringContaining("linear-gradient"),
    });
  });

  it("should apply custom colors", () => {
    render(<GradientText colors={["#ff0000", "#00ff00", "#0000ff"]}>Custom</GradientText>);
    const text = screen.getByText("Custom");
    expect(text.style.backgroundImage).toContain("#ff0000");
    expect(text.style.backgroundImage).toContain("#00ff00");
    expect(text.style.backgroundImage).toContain("#0000ff");
  });

  it("should apply direction classes", () => {
    const { rerender } = render(<GradientText direction="horizontal">Text</GradientText>);
    let text = screen.getByText("Text");
    expect(text).toHaveClass("bg-gradient-to-r");

    rerender(<GradientText direction="vertical">Text</GradientText>);
    text = screen.getByText("Text");
    expect(text).toHaveClass("bg-gradient-to-b");
  });

  it("should apply animation classes", () => {
    const { rerender } = render(<GradientText animate="flow">Text</GradientText>);
    let text = screen.getByText("Text");
    expect(text).toHaveClass("animate-gradient-flow");

    rerender(<GradientText animate="shimmer">Text</GradientText>);
    text = screen.getByText("Text");
    expect(text).toHaveClass("animate-gradient-shimmer");
  });

  it("should have larger background when animated", () => {
    render(<GradientText animate="flow">Animated</GradientText>);
    const text = screen.getByText("Animated");
    expect(text.style.backgroundSize).toBe("200% auto");
  });
});
