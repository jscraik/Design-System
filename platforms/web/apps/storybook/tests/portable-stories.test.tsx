/**
 * Portable Stories — compose and run stories in plain Vitest outside Storybook UI.
 *
 * Why: lets you assert story behaviour in CI without a running Storybook server,
 * and catches regressions that only surface when stories are rendered in isolation
 * (missing providers, wrong default args, etc.).
 *
 * Pattern: `composeStories` wraps each story with its meta decorators and args
 * so the rendered output is identical to what Storybook shows.
 */

import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as MagneticButtonStories from "../../../../packages/effects/stories/button.stories";
import * as HoloCardStories from "../../../../packages/effects/stories/card.stories";

// ─── MagneticButton ───────────────────────────────────────────────────────────

const { Default: MagneticDefault, NoMagnetic, Variants } = composeStories(MagneticButtonStories);

describe("MagneticButton portable stories", () => {
  it("Default renders a button", () => {
    render(<MagneticDefault />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("NoMagnetic renders with disableMagnetic prop", () => {
    render(<NoMagnetic />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("Variants renders all four variant buttons", () => {
    render(<Variants />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });
});

// ─── HoloCard ─────────────────────────────────────────────────────────────────

const { Default: HoloDefault, NonClickableCard } = composeStories(HoloCardStories);

describe("HoloCard portable stories", () => {
  it("Default renders card content", () => {
    render(<HoloDefault />);
    expect(screen.getByText(/holographic card/i)).toBeInTheDocument();
  });

  it("NonClickableCard has no button role", () => {
    render(<NonClickableCard />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
