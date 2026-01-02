"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { IconX } from "../../../../icons";
import { cn } from "../../utils";

/**
 * Dialog root component (Radix Dialog).
 *
 * @param props - Radix dialog root props.
 * @returns The dialog root element.
 */
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * Trigger element that opens the dialog.
 *
 * @param props - Radix dialog trigger props.
 * @returns The dialog trigger element.
 */
function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Portal for rendering dialog content.
 *
 * @param props - Radix dialog portal props.
 * @returns A portal element for dialog content.
 */
function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * Close button for the dialog.
 *
 * @param props - Radix dialog close props.
 * @returns A close control element.
 */
function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * Dialog overlay/backdrop.
 *
 * @param props - Radix dialog overlay props.
 * @returns The overlay element.
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-foundation-bg-dark-1/50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Dialog content container.
 *
 * Accessibility contract:
 * - Provide a `DialogTitle` and optionally `DialogDescription`.
 *
 * @param props - Radix dialog content props.
 * @returns The dialog content element.
 */
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-foundation-bg-dark-1 text-foundation-text-dark-primary data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-foundation-bg-dark-3 p-6 shadow-lg duration-200 sm:max-w-lg font-foundation",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="focus-visible:ring-2 focus-visible:ring-foundation-accent-blue data-[state=open]:bg-foundation-bg-light-2 dark:data-[state=open]:bg-foundation-bg-dark-2 data-[state=open]:text-foundation-text-light-primary dark:data-[state=open]:text-foundation-text-dark-primary absolute top-4 right-4 rounded-md opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <IconX />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * Header layout container for dialog title/description.
 *
 * @param props - Div props for layout.
 * @returns A header container element.
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

/**
 * Footer layout container for dialog actions.
 *
 * @param props - Div props for layout.
 * @returns A footer container element.
 */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

/**
 * Dialog title element.
 *
 * @param props - Radix dialog title props.
 * @returns A dialog title element.
 */
function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-heading-2 leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

/**
 * Dialog description element.
 *
 * @param props - Radix dialog description props.
 * @returns A dialog description element.
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-foundation-text-dark-tertiary text-body-small", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
