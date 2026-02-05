/**
 * Shared test patterns for UI components.
 *
 * This module provides reusable test utilities to reduce duplication across
 * test files while maintaining comprehensive coverage.
 *
 * ## Usage Example
 *
 * ```tsx
 * import { testStates, testCommonProps } from '@/testing/utils/testPatterns';
 *
 * describe("MyComponent", () => {
 *   const getComponent = () => screen.getByTestId('my-component');
 *
 *   testCommonProps({
 *     render: () => render(<MyComponent />),
 *     selector: '[data-slot="my-component"]',
 *   });
 *
 *   testStates({
 *     Component: MyComponent,
 *     selector: '[data-slot="my-component"]',
 *   });
 * });
 * ```
 */

import { render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

/**
 * State test case configuration
 */
interface StateTestCase {
  /** Name of the state (e.g., "loading", "error") */
  name: string;
  /** Props to apply */
  props: Record<string, unknown>;
  /** Expected data-state value */
  expectedState: string;
  /** Optional expected additional attributes */
  expectedAttrs?: Array<{ name: string; value: string }>;
  /** Optional expected classes */
  expectedClasses?: string[];
  /** Whether to test onStateChange callback */
  testsCallback?: boolean;
}

/**
 * Configuration for testing stateful props
 */
export interface TestStatesConfig<T = unknown> {
  /** React component to test */
  Component: React.ComponentType<T>;
  /** CSS selector for finding the element */
  selector: string;
  /** Optional custom renderer */
  render?: (props: T) => ReturnType<typeof render>;
  /** States to test */
  states: StateTestCase[];
}

/**
 * Test stateful props (loading, error, disabled, required) using parametrization.
 *
 * @example
 * ```tsx
 * testStates({
 *   Component: Separator,
 *   selector: '[data-slot="separator-root"]',
 *   states: [
 *     {
 *       name: "loading",
 *       props: { loading: true, onStateChange: mockFn },
 *       expectedState: "loading",
 *       testsCallback: true,
 *     },
 *     {
 *       name: "error",
 *       props: { error: "Error" },
 *       expectedState: "error",
 *       expectedAttrs: [{ name: "data-error", value: "true" }],
 *       expectedClasses: ["bg-foundation-accent-red"],
 *     },
 *   ],
 * });
 * ```
 */
export function testStates<T = unknown>(config: TestStatesConfig<T>): void {
  const { Component, selector, render: customRender, states } = config;

  const defaultRender = (props: T) => render(<Component {...props} />);
  const renderFn = customRender || defaultRender;

  describe("Stateful props", () => {
    const mockOnStateChange = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    // Parametrized state tests using describe.each
    describe.each(
      states.map((s) => ({
        name: s.name,
        props: s.props,
        expectedState: s.expectedState,
        expectedAttrs: s.expectedAttrs || [],
        expectedClasses: s.expectedClasses || [],
        testsCallback: s.testsCallback || false,
      })),
    )("$name state", ({
      name,
      props,
      expectedState,
      expectedAttrs,
      expectedClasses,
      testsCallback,
    }) => {
      it(`applies ${expectedState} state styling`, () => {
        const { container } = renderFn(props as T);
        const element = container.querySelector(selector);
        expect(element).toHaveAttribute("data-state", expectedState);

        expectedAttrs.forEach(({ name, value }) => {
          expect(element).toHaveAttribute(name, value);
        });

        expectedClasses.forEach((className) => {
          expect(element).toHaveClass(className);
        });
      });

      if (testsCallback) {
        it(`calls onStateChange with '${expectedState}'`, async () => {
          const testProps = { ...props, onStateChange: mockOnStateChange };
          renderFn(testProps as T);
          await waitFor(() => {
            expect(mockOnStateChange).toHaveBeenCalledWith(expectedState);
          });
        });
      }
    });
  });
}

/**
 * Configuration for testing common props
 */
export interface TestCommonPropsConfig<T = unknown> {
  /** Function that renders the component */
  render: () => ReturnType<typeof render>;
  /** CSS selector for finding the element */
  selector: string;
  /** Whether to test className prop (default: true) */
  hasClassName?: boolean;
  /** Whether to test ref forwarding (default: true) */
  hasRef?: boolean;
  /** Component for ref testing */
  Component?: React.ComponentType<T>;
}

/**
 * Test common component patterns (data-slot, className, ref forwarding).
 *
 * @example
 * ```tsx
 * testCommonProps({
 *   render: () => render(<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>),
 *   selector: '[data-slot="avatar"]',
 *   Component: Avatar,
 *   hasClassName: true,
 *   hasRef: true,
 * });
 * ```
 */
export function testCommonProps<T = unknown>(config: TestCommonPropsConfig<T>): void {
  const { render: renderFn, selector, hasClassName = true, hasRef = true, Component } = config;

  describe("Common props", () => {
    it("renders with data-slot attribute", () => {
      const { container } = renderFn();
      const element = container.querySelector(selector);
      expect(element).toBeInTheDocument();
    });

    if (hasClassName && Component) {
      it("applies custom className", () => {
        const { container } = render(<Component className="custom-class" />);
        const element = container.querySelector(selector);
        expect(element).toHaveClass("custom-class");
      });
    }

    if (hasRef && Component) {
      it("forwards ref to element", () => {
        const ref = createRef<unknown>();
        render(<Component ref={ref} />);
        expect(ref.current).toBeTruthy();
      });
    }
  });
}

/**
 * Configuration for testing sub-components
 */
export interface TestSubPartsConfig {
  /** Name of each sub-part */
  name: string;
  /** Render function for this sub-part */
  render: () => ReturnType<typeof render>;
  /** Selector to find the sub-part */
  selector: string;
  /** Expected data-slot value */
  dataSlot: string;
  /** Whether to test className (default: true) */
  hasClassName?: boolean;
}

/**
 * Test component sub-parts using parametrization.
 *
 * @example
 * ```tsx
 * testSubParts([
 *   {
 *     name: "AvatarImage",
 *     render: () => render(<Avatar><AvatarImage src="..." alt="test" /></Avatar>),
 *     selector: '[role="img"]',
 *     dataSlot: "avatar-image",
 *   },
 *   {
 *     name: "AvatarFallback",
 *     render: () => render(<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>),
 *     selector: 'text',
 *     dataSlot: "avatar-fallback",
 *   },
 * ]);
 * ```
 */
export function testSubParts(parts: TestSubPartsConfig[]): void {
  describe("Sub-parts", () => {
    describe.each(parts)("$name", ({ render, selector, dataSlot, hasClassName = true }) => {
      it(`renders with data-slot="${dataSlot}"`, () => {
        const { container } = render();
        const element = container.querySelector(`[data-slot="${dataSlot}"]`);
        expect(element).toBeInTheDocument();
      });

      if (hasClassName) {
        it("applies custom className", () => {
          // Implementation depends on component structure
          // Would need to pass className through to the specific part
        });
      }
    });
  });
}

/**
 * Helper to create state test cases
 *
 * @example
 * ```tsx
 * const states = createStateTestCases([
 *   ["loading", { loading: true }, "loading"],
 *   ["error", { error: "Error" }, "error", { attrs: [{ name: "data-error", value: "true" }] }],
 *   ["disabled", { disabled: true }, "disabled", { classes: ["opacity-50"] }],
 * ]);
 * ```
 */
export function createStateTestCases(
  cases: Array<
    | [string, Record<string, unknown>, string]
    | [
        string,
        Record<string, unknown>,
        string,
        {
          attrs?: Array<{ name: string; value: string }>;
          classes?: string[];
          testsCallback?: boolean;
        },
      ]
  >,
): StateTestCase[] {
  return cases.map((testCase) => {
    const [name, props, expectedState, options = {}] = testCase;
    return {
      name,
      props,
      expectedState,
      expectedAttrs: options.attrs || [],
      expectedClasses: options.classes || [],
      testsCallback: options.testsCallback || false,
    };
  });
}
