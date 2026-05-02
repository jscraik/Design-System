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

/**
 * Apply a masking strategy to a string value based on the specified mask type.
 *
 * @param value - The input string to be masked.
 * @param mask - The masking strategy: `"full"`, `"partial"`, `"hash"`, or other.
 * @returns For `"full"`, a string of `*` characters (up to 20); for `"partial"`, `"****"` when the input length is 8 or less otherwise the first 4 and last 4 characters joined with `...`; for `"hash"`, a `[hash:<hex>]` token representing the value's hash; for any other mask, the literal `"[REDACTED]"`.
 */
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

/**
 * Determine which configured FieldMask, if any, applies to a given object key.
 *
 * Matches case-insensitively; for masks whose `field` equals `"token"` the key is tokenized via `getKeySegments` and a match occurs if any segment equals `"token"`. For all other masks a match occurs if the lowercased key contains the mask's `field` substring.
 *
 * @param key - The object property name to test
 * @param masks - Array of FieldMask definitions to match against
 * @returns The first matching `FieldMask` if one is found, `undefined` otherwise
 */
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

/**
 * Split a key into lowercase alphanumeric segments suitable for tokenized matching.
 *
 * Converts camelCase and other delimiters into segment tokens and omits empty segments.
 *
 * @param key - The input key to tokenize
 * @returns An array of lowercase alphanumeric segments extracted from `key`
 */
function getKeySegments(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Determines whether a property name normalizes to `design_token_contract`.
 *
 * @param key - The object property name to test
 * @returns `true` if the key, after normalization to underscore-separated segments, equals `design_token_contract`, `false` otherwise.
 */
function isPublicDesignTokenContractKey(key: string): boolean {
  return getKeySegments(key).join("_") === "design_token_contract";
}

/**
 * Applies the appropriate configured mask for a single object property or falls back to recursive masking.
 *
 * @param key - The property name used to determine whether a configured `FieldMask` applies
 * @param val - The value of the property to be masked
 * @param masks - The list of configured `FieldMask` rules to check against `key`
 * @param inDebugMode - When true, recursive masking returns values unchanged
 * @returns The masked value: for a matched mask, a masked string according to the mask type or `"[REDACTED]"` for non-strings; otherwise the result of recursive masking
 */
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

/**
 * Provide a redacted placeholder for malformed public values while preserving the original in debug mode.
 *
 * @param value - The value to inspect and potentially redact
 * @param _masks - Unused; present for API compatibility with masking helpers
 * @param inDebugMode - When `true`, the original `value` is returned unchanged
 * @returns The original `value` if `inDebugMode` is `true`; otherwise the string `"[REDACTED]"`
 */
function maskMalformedPublicValue(
  value: unknown,
  _masks: FieldMask[],
  inDebugMode: boolean,
): unknown {
  if (inDebugMode) return value;
  return "[REDACTED]";
}

/**
 * Validates and sanitizes a public design token "role" object, keeping only expected fields
 * and replacing malformed or unexpected values with masked representations.
 *
 * @param value - The input to validate; expected to be a non-null, non-array object representing a role.
 * @param masks - Field mask definitions used when producing masked replacements for malformed values.
 * @param inDebugMode - If true, malformed values are returned unchanged by the masking helpers.
 * @returns An object containing validated `role` and `cssVariable` string fields and `useFor`/`avoidFor` string-array fields when they pass type checks; malformed or unrecognized fields are replaced with masked values.
 */
function maskPublicDesignTokenRole(
  value: unknown,
  masks: FieldMask[],
  inDebugMode: boolean,
): unknown {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return maskMalformedPublicValue(value, masks, inDebugMode);
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    if (key === "role" || key === "cssVariable") {
      result[key] =
        typeof val === "string" ? val : maskMalformedPublicValue(val, masks, inDebugMode);
    } else if (key === "useFor" || key === "avoidFor") {
      result[key] =
        Array.isArray(val) && val.every((entry) => typeof entry === "string")
          ? val
          : maskMalformedPublicValue(val, masks, inDebugMode);
    } else {
      result[key] = maskMalformedPublicValue(val, masks, inDebugMode);
    }
  }
  return result;
}

/**
 * Validate and mask a public design token contract object, preserving only expected fields with type-checked values.
 *
 * Detailed behavior:
 * - If `value` is null, an array, or not an object, returns a masked placeholder for the whole value.
 * - `allowedRoles`: if an array, returns an array of validated/masked design-token-role entries; otherwise returns a masked placeholder.
 * - `mode`: returns the original string value if present; otherwise returns a masked placeholder.
 * - `forbiddenTokenPatterns` and `sourceRefs`: return the original array only if every entry is a string; otherwise return a masked placeholder.
 * - Any other keys are replaced with a masked placeholder.
 *
 * @param value - The value to validate and mask as a design token contract
 * @param masks - Field mask configuration used when masking nested values
 * @param inDebugMode - When true, preserves values that would otherwise be replaced with masked placeholders
 * @returns The masked contract object or a masked placeholder when the value or specific fields are malformed
 */
function maskPublicDesignTokenContract(
  value: unknown,
  masks: FieldMask[],
  inDebugMode: boolean,
): unknown {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return maskMalformedPublicValue(value, masks, inDebugMode);
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    if (key === "allowedRoles") {
      result[key] = Array.isArray(val)
        ? val.map((role) => maskPublicDesignTokenRole(role, masks, inDebugMode))
        : maskMalformedPublicValue(val, masks, inDebugMode);
    } else if (key === "mode") {
      result[key] =
        typeof val === "string" ? val : maskMalformedPublicValue(val, masks, inDebugMode);
    } else if (key === "forbiddenTokenPatterns" || key === "sourceRefs") {
      result[key] =
        Array.isArray(val) && val.every((entry) => typeof entry === "string")
          ? val
          : maskMalformedPublicValue(val, masks, inDebugMode);
    } else {
      result[key] = maskMalformedPublicValue(val, masks, inDebugMode);
    }
  }
  return result;
}

/**
 * Recursively applies configured field-masking rules to a value tree.
 *
 * Processes arrays and objects deeply, applying per-key masking rules from `masks`.
 * - Returns `value` unchanged when `inDebugMode` is true.
 * - Leaves plain strings unchanged (strings are masked only when they are values of sensitive object keys).
 * - For arrays, returns a new array with each element processed recursively.
 * - For objects, returns a new object whose properties are masked according to `masks`; keys that normalize to the public design token contract are validated and masked using the specialized contract rules.
 *
 * @param value - The input value to mask (may be any JSON-like value)
 * @param masks - Array of `FieldMask` entries that determine which object properties should be masked and how
 * @param inDebugMode - When true, masking is disabled and the original value is returned unchanged
 * @returns The masked value with the same structure as `value`, or the original value when masking is disabled
 */
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
