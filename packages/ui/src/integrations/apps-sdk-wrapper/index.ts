/**
 * Apps SDK UI Abstraction Layer
 *
 * This module provides stable wrapper components around @openai/apps-sdk-ui.
 * Purpose: Reduce brittleness of direct dependency on Apps SDK UI's potentially changing API.
 *
 * @see https://developers.openai.com/apps-sdk
 */

import type { ReactNode } from "react";
import { Badge as AppsSDKBadge, type BadgeProps as AppsSDKBadgeProps } from "@openai/apps-sdk-ui/components/Badge";
import { Button as AppsSDKButton, type ButtonProps as AppsSDKButtonProps } from "@openai/apps-sdk-ui/components/Button";
import { Checkbox as AppsSDKCheckbox, type CheckboxProps as AppsSDKCheckboxProps } from "@openai/apps-sdk-ui/components/Checkbox";
import { CodeBlock as AppsSDKCodeBlock, type CodeBlockProps as AppsSDKCodeBlockProps } from "@openai/apps-sdk-ui/components/CodeBlock";
import { Download, type IconProps as AppsSDKIconProps } from "@openai/apps-sdk-ui/components/Icon";
import { Image as AppsSDKImage, type ImageProps as AppsSDKImageProps } from "@openai/apps-sdk-ui/components/Image";
import { Input as AppsSDKInput, type InputProps as AppsSDKInputProps } from "@openai/apps-sdk-ui/components/Input";
import { Popover as AppsSDKPopover, type PopoverProps as AppsSDKPopoverProps } from "@openai/apps-sdk-ui/components/Popover";
import { Textarea as AppsSDKTextarea, type TextareaProps as AppsSDKTextareaProps } from "@openai/apps-sdk-ui/components/Textarea";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

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

/**
 * Check if current Apps SDK UI version meets minimum requirements.
 * Throws in development, logs warning in production.
 */
function assertVersion(): void {
	const currentVersion =
		// @ts-expect-error - safe access for version check
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

	const [major, minor] = currentVersion.split(".").map(Number);
	const [minMajor, minMinor] = MIN_APPSSDK_UI_VERSION.split(".").map(Number);

	if (major < minMajor || (major === minMajor && minor < minMinor)) {
		const message =
			`[@openai/apps-sdk-ui] Version ${currentVersion} is below minimum ${MIN_APPSSDK_UI_VERSION}. ` +
			"Some features may not work correctly. Update to @openai/apps-sdk-ui@^${MIN_APPSSDK_UI_VERSION}.`;

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
	// @ts-expect-error - safe access for version check
	return typeof AppsSDKUIProvider !== "undefined"
		? (AppsSDKUIProvider as { version?: string }).version
		: undefined;
}
