/**
 * Re-exported types from @openai/apps-sdk-ui components.
 *
 * These types are provided for TypeScript consumers of our wrapper components.
 * Import types from here to avoid direct dependency on Apps SDK UI types.
 */

import type { BadgeProps as AppsSDKBadgeProps } from "@openai/apps-sdk-ui/components/Badge";
import type { ButtonProps as AppsSDKButtonProps } from "@openai/apps-sdk-ui/components/Button";
import type { CheckboxProps as AppsSDKCheckboxProps } from "@openai/apps-sdk-ui/components/Checkbox";
import type { CodeBlock } from "@openai/apps-sdk-ui/components/CodeBlock";
import type { Download } from "@openai/apps-sdk-ui/components/Icon";
import type { Image } from "@openai/apps-sdk-ui/components/Image";
import type { InputProps as AppsSDKInputProps } from "@openai/apps-sdk-ui/components/Input";
import type { PopoverProps as AppsSDKPopoverProps } from "@openai/apps-sdk-ui/components/Popover";
import type { TextareaProps as AppsSDKTextareaProps } from "@openai/apps-sdk-ui/components/Textarea";
import type { ComponentProps } from "react";

export type BadgeProps = AppsSDKBadgeProps;
export type ButtonProps = AppsSDKButtonProps;
export type CheckboxProps = AppsSDKCheckboxProps;
export type CodeBlockProps = ComponentProps<typeof CodeBlock>;
export type IconProps = ComponentProps<typeof Download>;
export type ImageProps = ComponentProps<typeof Image>;
export type InputProps = AppsSDKInputProps;
export type PopoverProps = AppsSDKPopoverProps;
export type TextareaProps = AppsSDKTextareaProps;
