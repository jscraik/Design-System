import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement, ReactNode } from "react";

/**
 * Custom render function that wraps components with necessary providers
 */
function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
  };

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...options }),
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
