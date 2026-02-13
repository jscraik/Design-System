import { createWidget } from "../../../shared/widget-base";

function KitchenSinkBody() {
  return (
    <div className="space-y-4 text-sm text-foreground/90">
      <div className="rounded-lg border border-border bg-muted p-3">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Demo</div>
        <div className="mt-1 text-sm">Kitchen sink widget placeholder.</div>
      </div>
      <div className="grid gap-2 text-xs text-muted-foreground">
        <div>• Supports structured tool output rendering.</div>
        <div>• Used for internal UI experimentation.</div>
      </div>
    </div>
  );
}

export const KitchenSinkLite = createWidget(KitchenSinkBody, {
  title: "Kitchen Sink",
  className: "max-h-[70vh]",
});
