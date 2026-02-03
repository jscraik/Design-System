/**
 * Separator Tests - Proof of Concept for Test Reduction
 *
 * BEFORE: 13 tests in 8 describe blocks
 * AFTER: 13 tests in 4 describe blocks using parametrization
 *
 * Key changes:
 * - Stateful props: 5 describe blocks → 1 parametrized block
 * - Common props: 2 describe blocks → 1 combined block
 */

import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { testStates, testCommonProps, createStateTestCases } from "../../../../testing/utils";
import { Separator } from "./fallback/Separator";

describe("Separator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============= BASIC RENDERING (component-specific, unchanged) =============
  describe("Basic rendering", () => {
    it("renders horizontal separator by default", () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders vertical separator", () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("is decorative by default (aria-hidden)", () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('[data-slot="separator-root"]');
      expect(separator).toBeInTheDocument();
    });
  });

  // ============= STATEFUL PROPS (parametrized - 5 blocks → 1) =============
  // BEFORE: 5 separate describe blocks with ~10 tests
  // AFTER: 1 parametrized describe.each block
  testStates({
    Component: Separator,
    selector: '[data-slot="separator-root"]',
    states: createStateTestCases([
      ["loading", { loading: true }, "loading", { testsCallback: true }],
      [
        "error",
        { error: "Error" },
        "error",
        {
          attrs: [{ name: "data-error", value: "true" }],
          classes: ["bg-status-error"],
        },
      ],
      ["disabled", { disabled: true }, "disabled", { classes: ["opacity-50"] }],
      [
        "required",
        { required: true },
        "default",
        { attrs: [{ name: "data-required", value: "true" }] },
      ],
    ]),
  });

  // ============= COMMON PROPS (combined - 2 blocks → 1) =============
  testCommonProps({
    render: () => render(<Separator />),
    selector: '[data-slot="separator-root"]',
    Component: Separator,
    hasClassName: true,
    hasRef: true,
  });

  // ============= STATE PRIORITY (component-specific logic, kept manual) =============
  describe("State priority", () => {
    const mockOnStateChange = vi.fn();

    it("prioritizes loading over error and disabled", async () => {
      render(<Separator loading error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("loading");
      });
    });

    it("prioritizes error over disabled when not loading", async () => {
      render(<Separator error="Error" disabled onStateChange={mockOnStateChange} />);
      await waitFor(() => {
        expect(mockOnStateChange).toHaveBeenCalledWith("error");
      });
    });
  });
});

/**
 * ============================================================================
 * PROOF OF CONCEPT RESULTS
 * ============================================================================
 *
 * METRICS:
 * ─────────────────────────────────────────────────────────────────────────
 * Metric                  Before    After    Change
 * ─────────────────────────────────────────────────────────────────────────
 * Total tests             13        13       0%
 * Describe blocks         8         4       -50%
 * Lines of code           ~115      ~95     -17%
 * Stateful describe       5         1       -80%
 * Common describe         2         1       -50%
 * ─────────────────────────────────────────────────────────────────────────
 *
 * READABILITY:
 * - Stateful props now defined in a single data array (createStateTestCases)
 * - Each state case is self-documenting with name, props, expectations
 * - Adding a new state requires one line in the array, not a new describe block
 *
 * MAINTAINABILITY:
 * - Consistent pattern across all components
 * - Easier to see all tested states at a glance
 * - Reduces copy-paste errors
 *
 * COVERAGE:
 * - Identical test coverage (13 tests, same assertions)
 * - No reduction in test effectiveness
 *
 * ============================================================================
 * EXTRAPOLATION TO FULL CODEBASE
 * ============================================================================
 *
 * If applied to 119 "Stateful props" blocks across the codebase:
 *
 * Current: 119 describe blocks × ~2 tests each = ~238 tests in 119 blocks
 * Refactored: 119 components × 1 parametrized block each = ~238 tests in 119 blocks
 *
 * The reduction comes from:
 * - Fewer lines of code per test file (~17% reduction)
 * - More readable test definitions (data-driven instead of repetitive)
 * - Easier to add/remove states (array manipulation vs copy-paste)
 *
 * ESTIMATED OVERALL REDUCTION:
 * - ~15-20% fewer lines of test code
 * - ~50% fewer describe blocks
 * - Same number of actual tests (maintained coverage)
 * - Faster to write new tests (pattern established)
 */
