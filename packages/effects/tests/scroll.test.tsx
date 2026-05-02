import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { ScrollProgress, StickyReveal, TocMarker } from "../src/components/scroll";

function setScrollMetrics(
  element: Element,
  metrics: { scrollTop: number; scrollHeight: number; clientHeight: number },
) {
  Object.defineProperties(element, {
    scrollTop: { configurable: true, value: metrics.scrollTop },
    scrollHeight: { configurable: true, value: metrics.scrollHeight },
    clientHeight: { configurable: true, value: metrics.clientHeight },
  });
}

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

describe("ScrollProgress", () => {
  it("tracks parent scroll progress in JavaScript fallback mode", () => {
    const { container } = render(
      <div data-testid="scroll-parent">
        <ScrollProgress native={false} target="parent" />
      </div>,
    );
    const parent = screen.getByTestId("scroll-parent");
    setScrollMetrics(parent, { scrollTop: 50, scrollHeight: 200, clientHeight: 100 });

    fireEvent.scroll(parent);

    const indicator = container.querySelector(".bg-foreground");
    expect(indicator).toHaveStyle({ width: "50%" });
  });

  it("tracks selector targets in JavaScript fallback mode", () => {
    const { container } = render(
      <>
        <div data-testid="custom-scroll-target" className="scroll-source" />
        <ScrollProgress native={false} target=".scroll-source" />
      </>,
    );
    const scrollTarget = screen.getByTestId("custom-scroll-target");
    setScrollMetrics(scrollTarget, { scrollTop: 25, scrollHeight: 125, clientHeight: 25 });

    fireEvent.scroll(scrollTarget);

    const indicator = container.querySelector(".bg-foreground");
    expect(indicator).toHaveStyle({ width: "25%" });
  });

  it("supports object refs and function refs", () => {
    const objectRef = createRef<HTMLDivElement>();
    const functionRef = vi.fn();
    const { rerender } = render(<ScrollProgress ref={objectRef} />);

    expect(objectRef.current).toHaveClass("ds-scroll-progress");

    rerender(<ScrollProgress ref={functionRef} />);
    expect(functionRef).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

describe("TocMarker", () => {
  it("applies marker style variables and position classes", () => {
    const { container } = render(<TocMarker color="red" position="right" size="4px" />);
    const marker = container.firstElementChild;

    expect(marker).toHaveClass("right-0");
    expect(marker).toHaveStyle({
      "--marker-size": "4px",
      "--marker-color": "red",
    });
  });
});
