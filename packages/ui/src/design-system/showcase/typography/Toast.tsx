import { cn } from "../../../components/ui/utils";

import { IconCheck } from "./icons";

interface ToastProps {
  message: string;
  value: string;
  visible: boolean;
}

/** Toast notification for clipboard copy feedback. */
export function Toast({ message, value, visible }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-lg bg-foundation-bg-dark-2 border border-foundation-bg-dark-3 flex items-center gap-3 transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="size-8 rounded-full bg-foundation-accent-green/10 flex items-center justify-center">
        <IconCheck className="size-4 text-foundation-accent-green" />
      </div>
      <div>
        <p className="text-sm font-medium text-foundation-text-dark-primary">{message}</p>
        <p className="text-xs font-mono text-foundation-text-dark-tertiary max-w-[200px] truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
