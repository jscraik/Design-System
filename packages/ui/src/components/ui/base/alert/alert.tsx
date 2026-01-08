import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../utils";

/**
 * Defines base class names and variant mappings for alerts.
 */
const alertVariants = cva("relative w-full rounded-lg border p-4", {
	variants: {
		variant: {
			default:
				"bg-foundation-bg-dark-2 text-foundation-text-dark-primary border-foundation-text-dark-primary/10",
			destructive:
				"border-foundation-accent-red/50 text-foundation-accent-red dark:border-foundation-accent-red [&>svg]:text-foundation-accent-red",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

/**
 * Renders an alert container with variant styles.
 *
 * Accessibility contract:
 * - Uses `role="alert"` for assistive technologies.
 *
 * @param props - Alert props including variant.
 * @returns An alert element.
 */
const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
	<div
		ref={ref}
		role="alert"
		className={cn(alertVariants({ variant }), className)}
		{...props}
	/>
));
Alert.displayName = "Alert";

/**
 * Renders an alert title element.
 *
 * @param props - Heading props for the title.
 * @returns An alert title element.
 */
const AlertTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn("mb-1 font-medium leading-none tracking-tight", className)}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

/**
 * Renders an alert description element.
 *
 * @param props - Div props for the description.
 * @returns An alert description element.
 */
const AlertDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("text-sm [&_p]:leading-relaxed", className)}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
