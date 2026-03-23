import { type RenderOptions, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";

/**
 * Custom render function that wraps components with necessary providers
 */
function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
  };

  // render first so the DOM environment is fully active before user-event touches it.
  // user-event@14 captures globalThis.document at module load time (before jsdom is
  // ready), so we extract the live document from the rendered container instead.
  const renderResult = render(ui, { wrapper: Wrapper, ...options });
  const doc = renderResult.baseElement.ownerDocument;

  return {
    user: userEvent.setup({ document: doc }),
    ...renderResult,
  };
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render, userEvent };

/**
 * Helper to test keyboard navigation
 */
export async function pressKey(user: ReturnType<typeof userEvent.setup>, key: string) {
  await user.keyboard(`{${key}}`);
}

/**
 * Helper to check if element has focus
 */
export function expectFocused(element: HTMLElement) {
  expect(document.activeElement).toBe(element);
}

/**
 * Helper to check accessible name
 */
export function expectAccessibleName(element: HTMLElement, name: string) {
  expect(element).toHaveAccessibleName(name);
}

/**
 * Helper to check role
 */
export function expectRole(element: HTMLElement, role: string) {
  expect(element).toHaveAttribute("role", role);
}

// Re-export test patterns for parametrized testing
export * from "./utils/testPatterns";
