import { cn } from "../../../components/ui/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/** Card displays content in a styled card container. */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 bg-foundation-bg-light-1 dark:bg-foundation-bg-dark-2 border border-foundation-bg-light-3 dark:border-foundation-bg-dark-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
