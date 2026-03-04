/**
 * Apps SDK UI Abstraction Layer
 *
 * This module provides stable wrapper components around @openai/apps-sdk-ui.
 * Purpose: Reduce brittleness of direct dependency on Apps SDK UI's potentially changing API.
 *
 * @see https://developers.openai.com/apps-sdk
 */

import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import {
  Badge as AppsSDKBadge,
  type BadgeProps as AppsSDKBadgeProps,
} from "@openai/apps-sdk-ui/components/Badge";
import {
  Button as AppsSDKButton,
  type ButtonProps as AppsSDKButtonProps,
} from "@openai/apps-sdk-ui/components/Button";
import {
  Checkbox as AppsSDKCheckbox,
  type CheckboxProps as AppsSDKCheckboxProps,
} from "@openai/apps-sdk-ui/components/Checkbox";
import { CodeBlock as AppsSDKCodeBlock } from "@openai/apps-sdk-ui/components/CodeBlock";
import { Download } from "@openai/apps-sdk-ui/components/Icon";
import { Image as AppsSDKImage } from "@openai/apps-sdk-ui/components/Image";
import {
  Input as AppsSDKInput,
  type InputProps as AppsSDKInputProps,
} from "@openai/apps-sdk-ui/components/Input";
import {
  Popover as AppsSDKPopover,
  type PopoverProps as AppsSDKPopoverProps,
} from "@openai/apps-sdk-ui/components/Popover";
import {
  Textarea as AppsSDKTextarea,
  type TextareaProps as AppsSDKTextareaProps,
} from "@openai/apps-sdk-ui/components/Textarea";
import type { ComponentProps, ReactNode } from "react";

// Re-export types for consumers
export type {
  BadgeProps,
  ButtonProps,
  CheckboxProps,
  CodeBlockProps,
  IconProps,
  ImageProps,
  InputProps,
  PopoverProps,
  TextareaProps,
} from "./types";

/**
 * Minimum supported Apps SDK UI version for this wrapper.
 * Bump this when upgrading to new Apps SDK UI features.
 */
export const MIN_APPSSDK_UI_VERSION = "0.2.1";

type AppsSDKCodeBlockProps = ComponentProps<typeof AppsSDKCodeBlock>;
type AppsSDKIconProps = ComponentProps<typeof Download>;
type AppsSDKImageProps = ComponentProps<typeof AppsSDKImage>;

type SemverTriplet = [number, number, number];

function parseSemverTriplet(version: string): SemverTriplet | null {
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;

  const [, majorRaw, minorRaw, patchRaw] = match;
  const major = Number(majorRaw);
  const minor = Number(minorRaw);
  const patch = Number(patchRaw);

  if ([major, minor, patch].some((part) => Number.isNaN(part))) {
    return null;
  }

  return [major, minor, patch];
}

function compareSemverTriplets(a: SemverTriplet, b: SemverTriplet): number {
  for (let index = 0; index < 3; index += 1) {
    if (a[index] > b[index]) return 1;
    if (a[index] < b[index]) return -1;
  }
  return 0;
}

/**
 * Check if current Apps SDK UI version meets minimum requirements.
 * Throws in development, logs warning in production.
 */
function assertVersion(): void {
  const currentVersion =
    typeof AppsSDKUIProvider !== "undefined"
      ? (AppsSDKUIProvider as { version?: string }).version || "unknown"
      : "unknown";

  if (currentVersion === "unknown") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[AppsSDKWrapper] " +
          "Unable to detect @openai/apps-sdk-ui version. " +
          "Components may not work as expected.",
      );
    }
    return;
  }

  const current = parseSemverTriplet(currentVersion);
  const minimum = parseSemverTriplet(MIN_APPSSDK_UI_VERSION);
  if (!current || !minimum) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[AppsSDKWrapper] Unable to parse semver while checking version '${currentVersion}'.`,
      );
    }
    return;
  }

  if (compareSemverTriplets(current, minimum) < 0) {
    const message =
      `[@openai/apps-sdk-ui] Version ${currentVersion} is below minimum ${MIN_APPSSDK_UI_VERSION}. ` +
      `Some features may not work correctly. Update to @openai/apps-sdk-ui@^${MIN_APPSSDK_UI_VERSION}.`;

    if (process.env.NODE_ENV !== "production") {
      console.error("[AppsSDKWrapper]", message);
      throw new Error(message);
    } else {
      console.warn("[AppsSDKWrapper]", message);
    }
  }
}

/**
 * Wrapper around Apps SDK UI Badge with version safety.
 */
export function Badge(props: AppsSDKBadgeProps) {
  assertVersion();
  return <AppsSDKBadge {...props} />;
}

/**
 * Wrapper around Apps SDK UI Button with version safety.
 */
export function Button(props: AppsSDKButtonProps) {
  assertVersion();
  return <AppsSDKButton {...props} />;
}

/**
 * Wrapper around Apps SDK UI Checkbox with version safety.
 */
export function Checkbox(props: AppsSDKCheckboxProps) {
  assertVersion();
  return <AppsSDKCheckbox {...props} />;
}

/**
 * Wrapper around Apps SDK UI CodeBlock with version safety.
 */
export function CodeBlock(props: AppsSDKCodeBlockProps) {
  assertVersion();
  return <AppsSDKCodeBlock {...props} />;
}

/**
 * Wrapper around Apps SDK UI Icon (Download/Sparkles) with version safety.
 */
export function Icon(props: AppsSDKIconProps) {
  assertVersion();
  return <Download {...props} />;
}

/**
 * Wrapper around Apps SDK UI Image with version safety.
 */
export function Image(props: AppsSDKImageProps) {
  assertVersion();
  return <AppsSDKImage {...props} />;
}

/**
 * Wrapper around Apps SDK UI Input with version safety.
 */
export function Input(props: AppsSDKInputProps) {
  assertVersion();
  return <AppsSDKInput {...props} />;
}

/**
 * Wrapper around Apps SDK UI Popover with version safety.
 */
export function Popover(props: AppsSDKPopoverProps) {
  assertVersion();
  return <AppsSDKPopover {...props} />;
}

/**
 * Wrapper around Apps SDK UI Textarea with version safety.
 */
export function Textarea(props: AppsSDKTextareaProps) {
  assertVersion();
  return <AppsSDKTextarea {...props} />;
}

/**
 * Provider wrapper that includes AppsSDKUIProvider with version check.
 * Use this at the root of your app instead of Apps SDK UI's provider directly.
 */
export function AppsSDKWrapper({
  children,
  ...providerProps
}: {
  children: ReactNode;
} & Omit<React.ComponentProps<typeof AppsSDKUIProvider>, "children">) {
  assertVersion();
  return <AppsSDKUIProvider {...providerProps}>{children}</AppsSDKUIProvider>;
}

/**
 * Get the current Apps SDK UI version (if detectable).
 * Returns undefined if version cannot be detected.
 */
export function getAppsSDKVersion(): string | undefined {
  return typeof AppsSDKUIProvider !== "undefined"
    ? (AppsSDKUIProvider as { version?: string }).version
    : undefined;
}
