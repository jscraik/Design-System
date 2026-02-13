import { Receipt, RotateCcw } from "lucide-react";

import { useWidgetProps } from "../../../shared/use-widget-props";
import { mountWidget, WidgetErrorBoundary } from "../../../shared/widget-base";
import "../../../styles.css";

interface Order {
  orderId: string;
  restaurantName?: string;
  items: string[] | string;
  status: "delivered" | "refunded" | "preparing";
  total: string;
  placedAt: string;
  location: string;
}

const statusStyles: Record<string, string> = {
  delivered: "bg-status-success-muted/10 text-status-success ring-status-success/20",
  refunded: "bg-status-error-muted/10 text-status-error ring-status-error/20",
  preparing: "bg-status-warning-muted/10 text-status-warning ring-status-warning/20",
};

function PastOrdersWidget() {
  const { orders = [] } = useWidgetProps<{ orders: Order[] }>({ orders: [] });
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="antialiased w-full text-foreground rounded-2xl border border-border bg-background overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-border">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-orange/15 text-accent-orange">
          <Receipt strokeWidth={1.5} className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-semibold">Past orders</div>
          <div className="text-sm text-text-secondary">Synced from your account</div>
        </div>
        <div className="ml-auto text-xs uppercase tracking-wide text-muted-foreground">
          Last 30 days
        </div>
      </div>
      <div className="flex flex-col">
        {safeOrders.map((order) => (
          <div key={order.orderId} className="px-5 py-4 border-b border-border">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold">{order.orderId}</div>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                      statusStyles[order.status] ?? "bg-muted text-muted-foreground ring-border/40"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
                <div className="mt-1 text-sm text-text-secondary">
                  {order.restaurantName || "Shop"} · {order.location}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{order.placedAt}</div>
                <div className="mt-2 text-sm text-foreground/90">
                  {Array.isArray(order.items) ? order.items.join(", ") : String(order.items || "")}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <div className="text-base font-semibold">{order.total}</div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <RotateCcw strokeWidth={1.5} className="h-3.5 w-3.5" />
                  Reorder
                </button>
              </div>
            </div>
          </div>
        ))}
        {safeOrders.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No past orders yet.
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <WidgetErrorBoundary>
      <PastOrdersWidget />
    </WidgetErrorBoundary>
  );
}

mountWidget(<App />);
