import { Button } from "../../components/ui";
import { IconX } from "../../icons";

export function AppsSdkPipExample() {
  return (
    <div className="relative w-full max-w-[768px] aspect-[16/9] bg-card border border-border-subtle rounded-18 shadow-foundation-pip overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted to-secondary/50" />
      <Button
        aria-label="Close"
        className="absolute -top-3 -right-3 size-8 rounded-30 shadow-foundation-close bg-foreground text-text-inverted"
        size="icon"
      >
        <IconX className="h-4 w-4" aria-hidden="true" />
      </Button>
      <div className="absolute bottom-4 left-4">
        <div className="inline-flex items-center gap-2 rounded-21 bg-card/90 border border-border-subtle px-4 py-1.5 shadow-foundation-pill text-foreground">
          <span className="text-list-title">View details</span>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-16 border border-border-subtle bg-card/80 px-4 py-2 text-sm text-text-secondary">
          PiP reference surface
        </div>
      </div>
    </div>
  );
}

export function AppsSdkPipExampleAlt() {
  return (
    <div className="relative w-full max-w-[640px] aspect-[4/3] bg-card border border-border-strong rounded-24 shadow-foundation-pip overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-muted via-muted to-secondary/40" />
      <div className="absolute top-4 left-4 rounded-16 border border-border-subtle bg-card/80 px-3 py-2 text-sm text-text-secondary">
        Alternate PiP state
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="inline-flex items-center gap-2 rounded-21 bg-foreground text-text-inverted px-4 py-1.5 shadow-foundation-pill">
          <span className="text-list-title">Open</span>
        </div>
      </div>
    </div>
  );
}
