import { cn } from "../../utils";

/**
 * Renders a skeleton placeholder for loading content.
 *
 * @param props - Div props for the skeleton element.
 * @returns A skeleton element.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
