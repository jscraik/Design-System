import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ExternalLink } from "lucide-react";

import { cn } from "./utils";

const textLinkVariants = cva(
  "inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-sm",
  {
    variants: {
      variant: {
        default:
          "text-foundation-accent-blue hover:text-foundation-accent-blue/80 underline-offset-4 hover:underline",
        subtle:
          "text-foundation-text-dark-secondary hover:text-foundation-text-dark-primary underline-offset-4 hover:underline",
        inline:
          "text-foundation-text-dark-primary underline underline-offset-4 decoration-foundation-text-dark-tertiary hover:decoration-foundation-accent-blue",
        nav: "text-foundation-text-dark-secondary hover:text-foundation-text-dark-primary no-underline",
        destructive:
          "text-foundation-accent-red hover:text-foundation-accent-red/80 underline-offset-4 hover:underline",
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
  }
);

export interface TextLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof textLinkVariants> {
  external?: boolean;
  showExternalIcon?: boolean;
}

const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    {
      className,
      variant,
      size,
      external = false,
      showExternalIcon = false,
      children,
      href,
      ...props
    },
    ref
  ) => {
    const isExternal = external || href?.startsWith("http");

    return (
      <a
        ref={ref}
        href={href}
        className={cn(textLinkVariants({ variant, size }), className)}
        {...(isExternal && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        {...props}
      >
        {children}
        {showExternalIcon && isExternal && (
          <ExternalLink className="size-3.5" aria-label="Opens in new tab" />
        )}
      </a>
    );
  }
);
TextLink.displayName = "TextLink";

export { TextLink, textLinkVariants };
