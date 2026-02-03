import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HoloCard } from "../src/components/card";

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

    await userEvent.click(card!);
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
});
