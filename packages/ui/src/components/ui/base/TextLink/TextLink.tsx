import type { ComponentState, StatefulComponentProps } from "@design-studio/tokens";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { IconArrowTopRightSm } from "../../../../icons";
import { cn } from "../../utils";

const textLinkVariants = cva(
  "inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm",
  {
    variants: {
      variant: {
        default: "text-interactive hover:text-interactive-hover underline-offset-4 hover:underline",
        subtle: "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline",
        inline:
          "text-foreground underline underline-offset-4 decoration-muted-foreground hover:decoration-interactive",
        nav: "text-muted-foreground hover:text-foreground no-underline",
        destructive:
          "text-status-error hover:text-status-error-muted underline-offset-4 hover:underline",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface TextLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof textLinkVariants>,
    StatefulComponentProps {
  external?: boolean;
  showExternalIcon?: boolean;
}

function TextLink({
  className,
  variant,
  size,
  external = false,
  showExternalIcon = false,
  loading = false,
  error,
  disabled = false,
  required,
  onStateChange,
  children,
  href,
  target: userTarget,
  rel: userRel,
  ...props
}: TextLinkProps) {
  const isExternal = external || (href ? href.startsWith("http") : false);

  // Determine effective state
  const effectiveState: ComponentState = loading
    ? "loading"
    : error
      ? "error"
      : disabled
        ? "disabled"
        : "default";

  // Notify parent of state changes
  React.useEffect(() => {
    onStateChange?.(effectiveState);
  }, [effectiveState, onStateChange]);

  // Security: Determine target (external links always use _blank)
  const effectiveTarget = isExternal ? "_blank" : userTarget;

  // Security: When target="_blank", ALWAYS enforce rel="noopener noreferrer"
  // This prevents tabnabbing attacks even if user manually passes target="_blank"
  const needsSecureRel = effectiveTarget === "_blank" && !disabled;
  const effectiveRel = needsSecureRel ? "noopener noreferrer" : userRel;

  return (
    <a
      data-slot="text-link"
      data-state={effectiveState}
      data-error={error ? "true" : undefined}
      data-required={required ? "true" : undefined}
      href={disabled ? undefined : href}
      className={cn(
        textLinkVariants({ variant, size }),
        // Disabled state styling
        disabled && "pointer-events-none opacity-50 no-underline",
        // Error state styling
        error && "text-status-error hover:text-status-error-muted",
        className,
      )}
      aria-disabled={disabled || undefined}
      aria-invalid={error ? "true" : required ? "false" : undefined}
      aria-required={required || undefined}
      target={effectiveTarget}
      rel={effectiveRel}
      {...props}
    >
      {children}
      {showExternalIcon && isExternal && !disabled && (
        <IconArrowTopRightSm className="size-3.5" aria-label="Opens in new tab" />
      )}
    </a>
  );
}

export { TextLink, textLinkVariants };
