import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { IconArrowTopRightSm } from "../../../../icons";
import { cn } from "../../utils";

const textLinkVariants = cva(
  "inline-flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm",
  {
    variants: {
      variant: {
        default: "text-accent hover:text-accent/80 underline-offset-4 hover:underline",
        subtle: "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline",
        inline:
          "text-foreground underline underline-offset-4 decoration-muted-foreground hover:decoration-accent",
        nav: "text-muted-foreground hover:text-foreground no-underline",
        destructive:
          "text-destructive hover:text-destructive/80 underline-offset-4 hover:underline",
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
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof textLinkVariants> {
  external?: boolean;
  showExternalIcon?: boolean;
}

function TextLink({
  className,
  variant,
  size,
  external = false,
  showExternalIcon = false,
  children,
  href,
  ...props
}: TextLinkProps) {
  const isExternal = external || (href ? href.startsWith("http") : false);

  return (
    <a
      data-slot="text-link"
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
        <IconArrowTopRightSm className="size-3.5" aria-label="Opens in new tab" />
      )}
    </a>
  );
}

export { TextLink, textLinkVariants };
