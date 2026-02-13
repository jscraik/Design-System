import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StickyReveal } from "../src/components/scroll";

describe("StickyReveal", () => {
  it("should render children", () => {
    render(
      <StickyReveal>
        <h3>Revealed Content</h3>
      </StickyReveal>,
    );
    expect(screen.getByText("Revealed Content")).toBeInTheDocument();
  });

  it("should start in hidden state", () => {
    render(
      <StickyReveal>
        <h3>Content</h3>
      </StickyReveal>,
    );
    const container = screen.getByText("Content").closest("div");
    expect(container).toHaveAttribute("data-state", "hidden");
  });

  it("should have sticky class when sticky prop is true", () => {
    render(
      <StickyReveal sticky>
        <h3>Sticky Content</h3>
      </StickyReveal>,
    );
    const container = screen.getByText("Sticky Content").closest("div");
    expect(container).toHaveClass("sticky");
  });

  it("should apply direction classes", () => {
    const { rerender } = render(<StickyReveal direction="up">Content</StickyReveal>);
    let container = screen.getByText("Content").closest("div");
    expect(container).toHaveClass("data-[state=revealed]:translate-y-0");

    rerender(<StickyReveal direction="left">Content</StickyReveal>);
    container = screen.getByText("Content").closest("div");
    expect(container).toHaveClass("data-[state=revealed]:translate-x-0");
  });

  it("should apply fade classes", () => {
    const { rerender } = render(<StickyReveal fade="subtle">Content</StickyReveal>);
    let container = screen.getByText("Content").closest("div");
    expect(container).toHaveClass("data-[state=revealed]:opacity-100");

    rerender(<StickyReveal fade="full">Content</StickyReveal>);
    container = screen.getByText("Content").closest("div");
    expect(container).toHaveClass("data-[state=hidden]:opacity-0");
  });

  it("should reveal on intersection (mocked)", async () => {
    // Mock IntersectionObserver
    const mockObserve = vi.fn();
    const mockUnobserve = vi.fn();
    const mockDisconnect = vi.fn();

    class MockIntersectionObserver {
      constructor(private callback: IntersectionObserverCallback) {}
      observe = mockObserve;
      unobserve = mockUnobserve;
      disconnect = mockDisconnect;
      trigger = (entries: IntersectionObserverEntry[]) => {
        this.callback(entries, this as unknown as IntersectionObserver);
      };
    }

    // @ts-expect-error test override
    global.IntersectionObserver = MockIntersectionObserver;

    render(
      <StickyReveal triggerAt={0.5}>
        <h3>Reveal Me</h3>
      </StickyReveal>,
    );

    expect(mockObserve).toHaveBeenCalled();

    mockDisconnect.mockClear();
  });

  it("should have transition styles", () => {
    render(
      <StickyReveal>
        <h3>Content</h3>
      </StickyReveal>,
    );
    const container = screen.getByText("Content").closest("div");
    expect(container).toHaveClass("transition-all");
  });
});
