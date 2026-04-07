export type SensitivityLevel = "public" | "internal" | "confidential" | "secret";

export type MaskType = "full" | "partial" | "hash" | "redact";

export interface FieldMask {
  field: string;
  level: SensitivityLevel;
  mask?: MaskType;
}

// Default masks for common sensitive fields
export const DEFAULT_MASKS: FieldMask[] = [
  { field: "token", level: "secret", mask: "redact" },
  { field: "api_key", level: "secret", mask: "redact" },
  { field: "password", level: "secret", mask: "redact" },
  { field: "secret", level: "secret", mask: "redact" },
  { field: "auth", level: "confidential", mask: "partial" },
  { field: "cookie", level: "confidential", mask: "partial" },
  { field: "home", level: "internal", mask: "partial" },
  { field: "user", level: "internal", mask: "partial" },
];

function hashValue(value: string): string {
  // Simple hash for demonstration - in production use crypto.createHash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

export function maskValue(value: string, mask: MaskType): string {
  switch (mask) {
    case "full":
      return "*".repeat(Math.min(value.length, 20));
    case "partial":
      if (value.length <= 8) return "****";
      return `${value.slice(0, 4)}...${value.slice(-4)}`;
    case "hash":
      return `[hash:${hashValue(value)}]`;
    default:
      return "[REDACTED]";
  }
}

function shouldMaskField(key: string, masks: FieldMask[]): FieldMask | undefined {
  const lowerKey = key.toLowerCase();
  return masks.find((mask) => lowerKey.includes(mask.field.toLowerCase()));
}

function maskValueRecursive(value: unknown, masks: FieldMask[], inDebugMode: boolean): unknown {
  if (inDebugMode) return value;

  if (typeof value === "string") {
    const mask = shouldMaskField(value, masks);
    if (mask) {
      return maskValue(value, mask.mask ?? "redact");
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => maskValueRecursive(item, masks, inDebugMode));
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      const mask = shouldMaskField(key, masks);
      if (mask && typeof val === "string") {
        result[key] = maskValue(val, mask.mask ?? "redact");
      } else {
        result[key] = maskValueRecursive(val, masks, inDebugMode);
      }
    }
    return result;
  }

  return value;
}

export function maskObject<T extends Record<string, unknown>>(
  obj: T,
  masks: FieldMask[] = DEFAULT_MASKS,
  inDebugMode = false,
): T {
  if (inDebugMode) return obj;
  return maskValueRecursive(obj, masks, inDebugMode) as T;
}
