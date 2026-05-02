import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const transformCalls = vi.hoisted(() => [] as Array<[unknown, number[], number[]]>);
const hoverCalls = vi.hoisted(() => [] as unknown[]);

vi.mock("motion/react", async () => {
  const React = await vi.importActual<typeof import("react")>("react");

  return {
    motion: {
      div: React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement> & { whileHover?: unknown }
      >(({ children, whileHover, ...props }, ref) => {
        hoverCalls.push(whileHover);
        return (
          <div ref={ref} {...props}>
            {children}
          </div>
        );
      }),
    },
    useMotionValue: () => ({ set: vi.fn() }),
    useTransform: (value: unknown, input: number[], output: number[]) => {
      transformCalls.push([value, input, output]);
      return output;
    },
  };
});

import { HoloCard } from "../src/components/card";

describe("HoloCard tilt", () => {
  it("applies tiltIntensity to rotate output ranges", () => {
    transformCalls.length = 0;

    render(<HoloCard tiltIntensity={0.25}>Tilted</HoloCard>);

    expect(transformCalls.map(([, , output]) => output)).toEqual([
      [2.5, -2.5],
      [-2.5, 2.5],
    ]);
  });

  it("clamps tiltIntensity to the documented 0-1 range", () => {
    transformCalls.length = 0;

    render(<HoloCard tiltIntensity={2}>Tilted</HoloCard>);

    expect(transformCalls.map(([, , output]) => output)).toEqual([
      [10, -10],
      [-10, 10],
    ]);
  });

  it("falls back to the default hover scale for invalid values", () => {
    hoverCalls.length = 0;

    render(<HoloCard hoverScale={Number.POSITIVE_INFINITY}>Hover</HoloCard>);

    assertHoverScale(hoverCalls.at(-1), 1.02);
  });
});

function assertHoverScale(value: unknown, expected: number): void {
  expect(value).toMatchObject({ scale: expected });
}
