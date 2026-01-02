/**
 * Shopping Cart Widget
 *
 * Demonstrates the widgetSessionId pattern for cross-turn state persistence:
 * - MCP server returns `_meta["widgetSessionId"]` to identify the cart session
 * - Widget reads toolOutput for new items and merges with existing widgetState
 * - UI changes (quantity adjustments) update widgetState so the model sees them
 * - State persists across conversation turns via the host's widgetState mechanism
 *
 * This pattern is essential for stateful widgets that need to maintain context
 * across multiple tool calls in a conversation.
 */
import { ShoppingCart as CartIcon, Minus, Package, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { DisplayMode } from "../../../shared/types";
import { useOpenAiGlobal } from "../../../shared/use-openai-global";
import { useWidgetState } from "../../../shared/use-widget-state";
import type { CartItem, CartWidgetState } from "../../../shared/tool-output-types";

const isDev = Boolean(import.meta.env?.DEV);

// Default empty cart
const createDefaultState = (): CartWidgetState => ({
  items: [],
  lastUpdated: new Date().toISOString(),
});

// Merge incoming items with existing cart
function mergeCartItems(existing: CartItem[], incoming: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  // Add existing items
  existing.forEach((item) => {
    merged.set(item.id, { ...item });
  });

  // Merge incoming items (add quantities for existing, add new items)
  incoming.forEach((item) => {
    const existingItem = merged.get(item.id);
    if (existingItem) {
      merged.set(item.id, {
        ...existingItem,
        quantity: existingItem.quantity + item.quantity,
        // Update other fields if provided
        name: item.name || existingItem.name,
        price: item.price ?? existingItem.price,
        image: item.image || existingItem.image,
        description: item.description || existingItem.description,
      });
    } else {
      merged.set(item.id, { ...item });
    }
  });

  return Array.from(merged.values()).filter((item) => item.quantity > 0);
}

/**
 * Renders the shopping cart widget.
 *
 * @returns A shopping cart widget element.
 */
export function ShoppingCart() {
  const toolOutput = useOpenAiGlobal("toolOutput") as ToolOutput | null;
  const toolResponseMetadata = useOpenAiGlobal("toolResponseMetadata") as Record<
    string,
    unknown
  > | null;
  const displayMode = (useOpenAiGlobal("displayMode") ?? "inline") as DisplayMode;

  const [widgetState, setWidgetState] = useWidgetState<CartWidgetState>(createDefaultState);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract widgetSessionId from metadata (key pattern for cross-turn state)
  const widgetSessionId = toolResponseMetadata?.["widgetSessionId"] as string | undefined;

  // Process incoming tool output and merge with existing state
  useEffect(() => {
    if (!toolOutput) return;

    const { action, items } = toolOutput;

    if (action === "clear") {
      setWidgetState({
        items: [],
        lastUpdated: new Date().toISOString(),
      });
      return;
    }

    if (action === "remove" && items) {
      setWidgetState((prev: CartWidgetState | null) => {
        const itemIdsToRemove = new Set(items.map((i) => i.id));
        return {
          items: (prev?.items ?? []).filter((item) => !itemIdsToRemove.has(item.id)),
          lastUpdated: new Date().toISOString(),
        };
      });
      return;
    }

    if ((action === "add" || !action) && items && items.length > 0) {
      setWidgetState((prev: CartWidgetState | null) => ({
        items: mergeCartItems(prev?.items ?? [], items),
        lastUpdated: new Date().toISOString(),
      }));
    }
  }, [toolOutput, setWidgetState]);

  // Cart calculations
  const cartItems = useMemo(() => widgetState?.items ?? [], [widgetState?.items]);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );
  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  // Handlers that update widgetState (visible to model on next turn)
  const handleQuantityChange = useCallback(
    (itemId: string, delta: number) => {
      setIsProcessing(true);
      setWidgetState((prev: CartWidgetState | null) => {
        const items = (prev?.items ?? [])
          .map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
          )
          .filter((item) => item.quantity > 0);

        return {
          items,
          lastUpdated: new Date().toISOString(),
        };
      });
      setTimeout(() => setIsProcessing(false), 150);
    },
    [setWidgetState],
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      setWidgetState((prev: CartWidgetState | null) => ({
        items: (prev?.items ?? []).filter((item) => item.id !== itemId),
        lastUpdated: new Date().toISOString(),
      }));
    },
    [setWidgetState],
  );

  const handleClearCart = useCallback(() => {
    setWidgetState({
      items: [],
      lastUpdated: new Date().toISOString(),
    });
  }, [setWidgetState]);

  // Checkout action - could call another tool
  const handleCheckout = useCallback(async () => {
    if (!window.openai?.sendFollowUpMessage) {
      if (isDev) {
        console.warn("sendFollowUpMessage not available");
      }
      return;
    }

    await window.openai.sendFollowUpMessage({
      prompt: `I'd like to checkout with my cart containing ${itemCount} items totaling $${subtotal.toFixed(2)}`,
    });
  }, [itemCount, subtotal]);

  return (
    <div
      className="min-h-[200px] rounded-2xl border shadow-sm bg-surface border-subtle text-primary"
      role="region"
      aria-label="Shopping cart"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-2">
          <CartIcon className="w-5 h-5" aria-hidden="true" />
          <h2 className="font-semibold" id="cart-heading">
            Shopping Cart
          </h2>
          {itemCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full bg-surface-tertiary text-secondary"
              aria-live="polite"
            >
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {widgetSessionId && (
          <span className="text-xs text-tertiary" aria-hidden="true">
            Session: {widgetSessionId.slice(0, 8)}...
          </span>
        )}
      </div>

      {/* Cart Items */}
      <div className="p-4" role="list" aria-labelledby="cart-heading">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3" role="status">
            <Package className="w-12 h-12 text-tertiary" aria-hidden="true" />
            <p className="text-sm text-secondary">Your cart is empty</p>
            <p className="text-xs text-tertiary">Ask me to add items to your cart</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                role="listitem"
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary"
              >
                {/* Item Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{item.name}</h3>
                  {item.description && (
                    <p className="text-xs truncate text-secondary">{item.description}</p>
                  )}
                  <p
                    className="text-sm font-semibold mt-1"
                    aria-label={`Price: $${(item.price * item.quantity).toFixed(2)}`}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div
                  className="flex items-center gap-1"
                  role="group"
                  aria-label={`Quantity controls for ${item.name}`}
                >
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={isProcessing}
                    className="p-1.5 rounded-full transition-colors hover:bg-surface-tertiary active:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span
                    className="w-8 text-center text-sm font-medium"
                    aria-label={`Quantity: ${item.quantity}`}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    disabled={isProcessing}
                    className="p-1.5 rounded-full transition-colors hover:bg-surface-tertiary active:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 rounded-full ml-2 transition-colors hover:bg-danger-soft-hover text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with totals */}
      {cartItems.length > 0 && (
        <div className="px-4 py-3 border-t border-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-secondary">Subtotal</span>
            <span className="font-semibold" aria-label={`Subtotal: $${subtotal.toFixed(2)}`}>
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2" role="group" aria-label="Cart actions">
            <button
              onClick={handleClearCart}
              className="flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors bg-surface-secondary hover:bg-surface-tertiary text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 py-2 px-4 rounded-xl text-sm font-medium bg-primary-solid hover:bg-primary-solid-hover text-primary-solid transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Debug info in development */}
      {displayMode === "fullscreen" && (
        <div className="px-4 py-2 text-xs border-t border-subtle text-tertiary">
          <details>
            <summary className="cursor-pointer">Debug Info</summary>
            <pre className="mt-2 overflow-auto max-h-32">
              {JSON.stringify({ widgetSessionId, widgetState, toolOutput }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
