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
  const keySegments = getKeySegments(key);
  const lowerKey = key.toLowerCase();
  return masks.find((mask) => {
    const field = mask.field.toLowerCase();
    if (field === "token") {
      return keySegments.includes("token");
    }
    return lowerKey.includes(field);
  });
}

function getKeySegments(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function isPublicDesignTokenContractKey(key: string): boolean {
  return getKeySegments(key).join("_") === "design_token_contract";
}

function maskFieldValue(
  key: string,
  val: unknown,
  masks: FieldMask[],
  inDebugMode: boolean,
): unknown {
  const mask = shouldMaskField(key, masks);
  if (mask) {
    return typeof val === "string" ? maskValue(val, mask.mask ?? "redact") : "[REDACTED]";
  }
  return maskValueRecursive(val, masks, inDebugMode);
}

const publicDesignTokenContractKeys = new Set([
  "mode",
  "allowedRoles",
  "forbiddenTokenPatterns",
  "sourceRefs",
]);

const publicDesignTokenRoleKeys = new Set(["role", "cssVariable", "useFor", "avoidFor"]);

function isPublicPrimitive(value: unknown): value is string | number | boolean | null {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isPublicPrimitiveArray(value: unknown): value is Array<string | number | boolean | null> {
  return Array.isArray(value) && value.every((item) => isPublicPrimitive(item));
}

function isPublicContractValue(key: string, value: unknown): boolean {
  if (key === "mode") return typeof value === "string";
  if (key === "forbiddenTokenPatterns" || key === "sourceRefs")
    return isPublicPrimitiveArray(value);
  return false;
}

function isPublicRoleValue(key: string, value: unknown): boolean {
  if (key === "role" || key === "cssVariable") return typeof value === "string";
  if (key === "useFor" || key === "avoidFor") return isPublicPrimitiveArray(value);
  return false;
}

function maskPublicDesignTokenRole(
  value: unknown,
  masks: FieldMask[],
  inDebugMode: boolean,
): unknown {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return maskValueRecursive(value, masks, inDebugMode);
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    result[key] =
      publicDesignTokenRoleKeys.has(key) && isPublicRoleValue(key, val)
        ? val
        : maskFieldValue(key, val, masks, inDebugMode);
  }
  return result;
}

function maskPublicDesignTokenContract(
  value: unknown,
  masks: FieldMask[],
  inDebugMode: boolean,
): unknown {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return maskValueRecursive(value, masks, inDebugMode);
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    if (key === "allowedRoles" && Array.isArray(val)) {
      result[key] = val.map((role) => maskPublicDesignTokenRole(role, masks, inDebugMode));
    } else if (publicDesignTokenContractKeys.has(key) && isPublicContractValue(key, val)) {
      result[key] = val;
    } else {
      result[key] = maskFieldValue(key, val, masks, inDebugMode);
    }
  }
  return result;
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
      if (isPublicDesignTokenContractKey(key)) {
        result[key] = maskPublicDesignTokenContract(val, masks, inDebugMode);
        continue;
      }
      result[key] = maskFieldValue(key, val, masks, inDebugMode);
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
