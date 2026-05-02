import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const transformCalls = vi.hoisted(() => [] as Array<[unknown, number[], number[]]>);

vi.mock("motion/react", async () => {
  const React = await vi.importActual<typeof import("react")>("react");

  return {
    motion: {
      div: React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement> & { whileHover?: unknown }
      >(({ children, whileHover: _whileHover, ...props }, ref) => (
        <div ref={ref} {...props}>
          {children}
        </div>
      )),
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
});
