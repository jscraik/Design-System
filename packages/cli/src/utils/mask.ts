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

import { createHash } from "node:crypto";

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
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
  const keySegments = key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const lowerKey = key.toLowerCase();
  return masks.find((mask) => {
    const field = mask.field.toLowerCase();
    if (field === "token") {
      return keySegments.includes("token");
    }
    return lowerKey.includes(field);
  });
}

function maskValueRecursive(value: unknown, masks: FieldMask[], inDebugMode: boolean): unknown {
  if (inDebugMode) return value;

  // Strings are only masked when they're values of sensitive keys (handled in object branch)
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => maskValueRecursive(item, masks, inDebugMode));
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      const mask = shouldMaskField(key, masks);
      if (mask) {
        // Mask any value type, not just strings
        result[key] =
          typeof val === "string" ? maskValue(val, mask.mask ?? "redact") : "[REDACTED]";
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
