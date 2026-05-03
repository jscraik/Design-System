import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HoloCard, holoColors } from "../src/components/card";

describe("HoloCard", () => {
  it("should render children", () => {
    render(
      <HoloCard>
        <h3>Card Title</h3>
      </HoloCard>,
    );
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("should not be clickable by default", () => {
    render(
      <HoloCard>
        <h3>Card</h3>
      </HoloCard>,
    );
    const card = screen.getByText("Card").closest('[data-slot="holo-card"]');
    expect(card).not.toHaveClass("cursor-pointer");
  });

  it("should be clickable when onClick provided", async () => {
    const handleClick = vi.fn();
    render(
      <HoloCard onClick={handleClick}>
        <h3>Clickable Card</h3>
      </HoloCard>,
    );

    const card = screen.getByText("Clickable Card").closest('[data-slot="holo-card"]');
    expect(card).toHaveClass("cursor-pointer");
    if (!card) throw new Error("Card element not found");

    await userEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should have correct variant classes", () => {
    const { rerender } = render(<HoloCard variant="glass">Glass</HoloCard>);
    let card = screen.getByText("Glass").closest('[data-slot="holo-card"]');
    expect(card).toHaveClass("backdrop-blur-sm");

    rerender(<HoloCard variant="default">Default</HoloCard>);
    card = screen.getByText("Default").closest('[data-slot="holo-card"]');
    expect(card).toHaveClass("border");
  });

  it("should have correct size classes", () => {
    const { rerender } = render(<HoloCard size="sm">Small</HoloCard>);
    let card = screen.getByText("Small").closest('[data-slot="holo-card"]');
    expect(card).toHaveClass("p-4");

    rerender(<HoloCard size="lg">Large</HoloCard>);
    card = screen.getByText("Large").closest('[data-slot="holo-card"]');
    expect(card).toHaveClass("p-8");
  });

  it("should be keyboard accessible when clickable", async () => {
    const handleClick = vi.fn();
    render(
      <HoloCard onClick={handleClick}>
        <h3>Keyboard Card</h3>
      </HoloCard>,
    );

    const card = screen.getByText("Keyboard Card").closest('[data-slot="holo-card"]');
    card?.focus();
    expect(card).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should activate with Space key when interactive", async () => {
    const handleClick = vi.fn();
    render(
      <HoloCard onClick={handleClick}>
        <h3>Space Card</h3>
      </HoloCard>,
    );

    const card = screen.getByText("Space Card").closest('[data-slot="holo-card"]');
    card?.focus();
    expect(card).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should have role=button when interactive", () => {
    render(
      <HoloCard onClick={vi.fn()}>
        <span>Interactive</span>
      </HoloCard>,
    );
    const card = screen.getByText("Interactive").closest('[data-slot="holo-card"]');
    expect(card).toHaveAttribute("role", "button");
  });

  it("should not have role=button when not interactive", () => {
    render(
      <HoloCard>
        <span>Static</span>
      </HoloCard>,
    );
    const card = screen.getByText("Static").closest('[data-slot="holo-card"]');
    expect(card).not.toHaveAttribute("role");
  });

  it("should have tabIndex=0 when interactive", () => {
    render(
      <HoloCard onClick={vi.fn()}>
        <span>Focusable</span>
      </HoloCard>,
    );
    const card = screen.getByText("Focusable").closest('[data-slot="holo-card"]');
    expect(card).toHaveAttribute("tabindex", "0");
  });

  it("should not have tabIndex when not interactive", () => {
    render(
      <HoloCard>
        <span>Not Focusable</span>
      </HoloCard>,
    );
    const card = screen.getByText("Not Focusable").closest('[data-slot="holo-card"]');
    expect(card).not.toHaveAttribute("tabindex");
  });

  it("should not render shimmer overlay when disableShimmer is true", () => {
    const { container } = render(
      <HoloCard disableShimmer>
        <span>No Shimmer</span>
      </HoloCard>,
    );
    // The holographic gradient overlay has mix-blend-overlay class; it should not be present
    const shimmer = container.querySelector(".mix-blend-overlay");
    expect(shimmer).toBeNull();
  });

  it("should render shimmer overlay by default", () => {
    const { container } = render(
      <HoloCard>
        <span>With Shimmer</span>
      </HoloCard>,
    );
    const shimmer = container.querySelector(".mix-blend-overlay");
    expect(shimmer).toBeInTheDocument();
  });

  it("should apply gradient variant class", () => {
    render(<HoloCard variant="gradient">Gradient</HoloCard>);
    const card = screen.getByText("Gradient").closest('[data-slot="holo-card"]');
    expect(card).toHaveClass("border-transparent");
  });

  it("should use customColors when provided", () => {
    const customColors = {
      color1: "#ff0000",
      color2: "#00ff00",
      color3: "#0000ff",
      color4: "#ffffff",
    };
    const { container } = render(
      <HoloCard customColors={customColors}>
        <span>Custom Colors</span>
      </HoloCard>,
    );
    const shimmer = container.querySelector(".mix-blend-overlay");
    expect(shimmer).toBeInTheDocument();
    // The custom color should appear in the rendered inline style
    expect(container.innerHTML).toContain("#ff0000");
  });

  it("should have displayName set to HoloCard", () => {
    expect(HoloCard.displayName).toBe("HoloCard");
  });

  it("should not trigger keyboard handler when not interactive", async () => {
    render(
      <HoloCard>
        <span>Static Element</span>
      </HoloCard>,
    );
    // No error should be thrown when pressing keys on a non-interactive card
    const card = screen.getByText("Static Element").closest('[data-slot="holo-card"]');
    if (!card) throw new Error("Card element not found");
    card.focus();
    // Should not throw
    await userEvent.keyboard("{Enter}");
  });
});

describe("holoColors", () => {
  it("should export all color presets", () => {
    expect(holoColors).toHaveProperty("neon");
    expect(holoColors).toHaveProperty("ocean");
    expect(holoColors).toHaveProperty("sunset");
    expect(holoColors).toHaveProperty("aurora");
  });

  it("each preset should have four color values", () => {
    for (const [name, preset] of Object.entries(holoColors)) {
      expect(preset, `preset ${name}`).toHaveProperty("color1");
      expect(preset, `preset ${name}`).toHaveProperty("color2");
      expect(preset, `preset ${name}`).toHaveProperty("color3");
      expect(preset, `preset ${name}`).toHaveProperty("color4");
    }
  });

  it("color values should be valid hex strings", () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    for (const [name, preset] of Object.entries(holoColors)) {
      for (const [key, value] of Object.entries(preset)) {
        expect(value, `${name}.${key}`).toMatch(hexPattern);
      }
    }
  });

  it("neon preset uses magenta and purple palette", () => {
    expect(holoColors.neon.color1).toBe("#ff0080");
    expect(holoColors.neon.color2).toBe("#7928ca");
  });

  it("ocean preset uses blue palette", () => {
    expect(holoColors.ocean.color1).toBe("#00b4d8");
    expect(holoColors.ocean.color4).toBe("#023e8a");
  });
});
