type BudgetOptions = {
  maxBytes?: number;
  strict?: boolean;
};

const DEFAULT_BUDGET_BYTES = 4096;

function isStrictMode(options?: BudgetOptions): boolean {
  if (options?.strict !== undefined) return options.strict;
  return typeof globalThis.process !== "undefined" && Boolean(globalThis.process?.env?.CI);
}

export function validateWidgetStateBudget(state: unknown, options?: BudgetOptions) {
  const maxBytes = options?.maxBytes ?? DEFAULT_BUDGET_BYTES;
  const strict = isStrictMode(options);

  let serialized = "";
  try {
    serialized = JSON.stringify(state) ?? "";
  } catch (error) {
    if (strict) {
      throw new Error("Widget state must be JSON-serializable.");
    }
    console.warn("Widget state budget check failed to serialize state.", error);
    return;
  }

  if (serialized.length <= maxBytes) return;

  const message = `Widget state exceeds ${maxBytes} bytes (${serialized.length}). Keep widgetState concise.`;

  if (strict) {
    throw new Error(message);
  }

  console.warn(message);
}
