/**
 * Pizzaz Shop Widget
 *
 * Full e-commerce checkout flow demonstrating:
 * - Multi-view navigation (cart → checkout → confirmation)
 * - Animated transitions with Framer Motion
 * - widgetState persistence across views
 * - Integration with host APIs (openExternal, sendFollowUpMessage)
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Expand,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCallback, useMemo } from "react";

import { useDisplayMode, useSendMessage } from "../../../shared/openai-hooks";
import type { CartItem, ShopView, ShopWidgetState } from "../../../shared/tool-output-types";
import { useOpenAiGlobal } from "../../../shared/use-openai-global";
import { useWidgetState } from "../../../shared/use-widget-state";

// Sample items
const SAMPLE_ITEMS: CartItem[] = [
  {
    id: "margherita",
    name: "Margherita Pizza",
    price: 14.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop",
    description: "Fresh tomatoes, mozzarella, basil",
  },
  {
    id: "pepperoni",
    name: "Pepperoni Pizza",
    price: 16.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop",
    description: "Classic pepperoni with extra cheese",
  },
  {
    id: "garlic-bread",
    name: "Garlic Bread",
    price: 5.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=200&h=200&fit=crop",
    description: "Crispy with garlic butter",
  },
];

const SERVICE_FEE = 2.99;
const DELIVERY_FEES = { standard: 0, express: 4.99 };
const TAX_RATE = 0.0875;

const createDefaultState = (): ShopWidgetState => ({
  view: "cart",
  items: SAMPLE_ITEMS,
  deliveryOption: "standard",
  tipPercent: 10,
});

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/**
 * Renders the Pizzaz shop widget.
 *
 * @returns A shopping experience widget element.
 */
export function PizzazShop() {
  const toolOutput = useOpenAiGlobal("toolOutput") as ToolOutput | null;

  const [widgetState, setWidgetState] = useWidgetState<ShopWidgetState>(() => {
    const defaultState = createDefaultState();
    if (toolOutput?.items) {
      return { ...defaultState, items: toolOutput.items };
    }
    if (toolOutput?.view) {
      return { ...defaultState, view: toolOutput.view };
    }
    return defaultState;
  });

  const items = useMemo(() => widgetState?.items ?? [], [widgetState?.items]);
  const view = widgetState?.view ?? "cart";
  const deliveryOption = widgetState?.deliveryOption ?? "standard";
  const tipPercent = widgetState?.tipPercent ?? 10;
  const { mode: displayMode, requestMode } = useDisplayMode();
  const sendMessage = useSendMessage();

  // Request fullscreen for better checkout experience
  const handleExpandToFullscreen = useCallback(async () => {
    if (requestMode) {
      await requestMode({ mode: "fullscreen" });
    }
  }, [requestMode]);

  // Calculations
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const deliveryFee = DELIVERY_FEES[deliveryOption];
  const tip = subtotal * (tipPercent / 100);
  const tax = (subtotal + SERVICE_FEE + deliveryFee) * TAX_RATE;
  const total = subtotal + SERVICE_FEE + deliveryFee + tip + tax;

  // Handlers
  const handleQuantityChange = useCallback(
    (itemId: string, delta: number) => {
      setWidgetState((prev: ShopWidgetState | null) => ({
        ...prev!,
        items: (prev?.items ?? [])
          .map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
          )
          .filter((item) => item.quantity > 0),
      }));
    },
    [setWidgetState],
  );

  const handleSetView = useCallback(
    (newView: ShopView) => {
      setWidgetState((prev: ShopWidgetState | null) => ({ ...prev!, view: newView }));
    },
    [setWidgetState],
  );

  const handleSetDelivery = useCallback(
    (option: "standard" | "express") => {
      setWidgetState((prev: ShopWidgetState | null) => ({ ...prev!, deliveryOption: option }));
    },
    [setWidgetState],
  );

  const handleSetTip = useCallback(
    (percent: number) => {
      setWidgetState((prev: ShopWidgetState | null) => ({ ...prev!, tipPercent: percent }));
    },
    [setWidgetState],
  );

  const handlePlaceOrder = useCallback(() => {
    const orderId = `PZ-${Date.now().toString(36).toUpperCase()}`;
    setWidgetState((prev: ShopWidgetState | null) => ({
      ...prev!,
      view: "confirmation",
      orderId,
    }));

    // Notify the model about the order
    if (sendMessage) {
      void sendMessage(`Order ${orderId} placed successfully! Total: $${total.toFixed(2)}`);
    }
  }, [sendMessage, setWidgetState, total]);

  const baseClasses = "bg-surface text-primary border-subtle";

  return (
    <div className={`min-h-[400px] rounded-2xl border shadow-sm overflow-hidden ${baseClasses}`}>
      <AnimatePresence mode="wait">
        {view === "cart" && (
          <motion.div
            key="cart"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <CartView
              items={items}
              subtotal={subtotal}
              displayMode={displayMode}
              onQuantityChange={handleQuantityChange}
              onCheckout={() => handleSetView("checkout")}
              onExpand={handleExpandToFullscreen}
            />
          </motion.div>
        )}

        {view === "checkout" && (
          <motion.div
            key="checkout"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <CheckoutView
              subtotal={subtotal}
              serviceFee={SERVICE_FEE}
              deliveryFee={deliveryFee}
              deliveryOption={deliveryOption}
              tip={tip}
              tipPercent={tipPercent}
              tax={tax}
              total={total}
              onBack={() => handleSetView("cart")}
              onSetDelivery={handleSetDelivery}
              onSetTip={handleSetTip}
              onPlaceOrder={handlePlaceOrder}
            />
          </motion.div>
        )}

        {view === "confirmation" && (
          <motion.div
            key="confirmation"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <ConfirmationView
              orderId={widgetState?.orderId ?? ""}
              total={total}
              onNewOrder={() => {
                setWidgetState(createDefaultState());
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Cart View Component
function CartView({
  items,
  subtotal,
  displayMode,
  onQuantityChange,
  onCheckout,
  onExpand,
}: {
  items: CartItem[];
  subtotal: number;
  displayMode: string;
  onQuantityChange: (id: string, delta: number) => void;
  onCheckout: () => void;
  onExpand: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-semibold">Your Order</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-tertiary text-secondary">
              {items.reduce((sum, i) => sum + i.quantity, 0)} items
            </span>
          </div>
          {displayMode === "inline" && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-full transition-colors hover:bg-surface-secondary"
              aria-label="Expand to fullscreen"
            >
              <Expand className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary"
          >
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-xs text-secondary">{item.description}</p>
              <p className="text-sm font-semibold mt-1">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onQuantityChange(item.id, -1)}
                className="p-1.5 rounded-full hover:bg-surface-tertiary"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => onQuantityChange(item.id, 1)}
                className="p-1.5 rounded-full hover:bg-surface-tertiary"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-subtle">
        <div className="flex items-center justify-between mb-3">
          <span className="text-secondary">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-success-solid hover:bg-success-solid-hover disabled:opacity-50 disabled:cursor-not-allowed text-success-solid transition-colors"
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}

// Checkout View Component
function CheckoutView({
  subtotal,
  serviceFee,
  deliveryFee,
  deliveryOption,
  tip,
  tipPercent,
  tax,
  total,
  onBack,
  onSetDelivery,
  onSetTip,
  onPlaceOrder,
}: {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  deliveryOption: "standard" | "express";
  tip: number;
  tipPercent: number;
  tax: number;
  total: number;
  onBack: () => void;
  onSetDelivery: (option: "standard" | "express") => void;
  onSetTip: (percent: number) => void;
  onPlaceOrder: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-surface-secondary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold">Checkout</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Delivery Address */}
        <section className="p-4 rounded-xl bg-surface-secondary">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Delivery Address</h3>
              <p className="text-sm text-secondary">123 Main Street, Apt 4B</p>
              <p className="text-xs text-tertiary">San Francisco, CA 94102</p>
            </div>
          </div>
        </section>

        {/* Delivery Options */}
        <section>
          <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Truck className="w-4 h-4" /> Delivery Speed
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "standard" as const, label: "Standard", time: "45-60 min", price: "Free" },
              { id: "express" as const, label: "Express", time: "20-30 min", price: "$4.99" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => onSetDelivery(option.id)}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  deliveryOption === option.id
                    ? "border-success-outline bg-success-soft"
                    : "border-subtle hover:border-strong"
                }`}
              >
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-secondary">{option.time}</p>
                <p className="text-sm font-semibold text-success mt-1">{option.price}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Tip */}
        <section>
          <h3 className="font-medium text-sm mb-2">Delivery Tip</h3>
          <div className="flex gap-2">
            {[0, 10, 15, 20].map((percent) => (
              <button
                key={percent}
                onClick={() => onSetTip(percent)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  tipPercent === percent
                    ? "bg-success-solid text-success-solid"
                    : "bg-surface-secondary hover:bg-surface-tertiary"
                }`}
              >
                {percent === 0 ? "None" : `${percent}%`}
              </button>
            ))}
          </div>
        </section>

        {/* Payment Method */}
        <section className="p-4 rounded-xl bg-surface-secondary">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5" />
            <div className="flex-1">
              <h3 className="font-medium text-sm">Payment Method</h3>
              <p className="text-sm text-secondary">•••• •••• •••• 4242</p>
            </div>
            <span className="text-xs text-tertiary">Change</span>
          </div>
        </section>

        {/* Order Summary */}
        <section className="p-4 rounded-xl space-y-2 bg-surface-secondary">
          <h3 className="font-medium text-sm mb-3">Order Summary</h3>
          {[
            { label: "Subtotal", value: subtotal },
            { label: "Service Fee", value: serviceFee },
            { label: "Delivery", value: deliveryFee },
            { label: `Tip (${tipPercent}%)`, value: tip },
            { label: "Tax", value: tax },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-secondary">{label}</span>
              <span>${value.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-subtle">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </section>
      </div>

      {/* Place Order Button */}
      <div className="px-4 py-3 border-t border-subtle">
        <button
          onClick={onPlaceOrder}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-success-solid hover:bg-success-solid-hover text-success-solid transition-colors"
        >
          Place Order • ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

// Confirmation View Component
function ConfirmationView({
  orderId,
  total,
  onNewOrder,
}: {
  orderId: string;
  total: number;
  onNewOrder: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-16 h-16 rounded-full bg-success-solid flex items-center justify-center mb-4"
      >
        <Check className="w-8 h-8 text-success-solid" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-2">Order Confirmed!</h2>
        <p className="text-sm mb-1 text-secondary">Order #{orderId}</p>
        <p className="text-sm mb-6 text-secondary">Total: ${total.toFixed(2)}</p>

        <div className="p-4 rounded-xl mb-6 bg-surface-secondary">
          <p className="text-sm font-medium mb-1">Estimated Delivery</p>
          <p className="text-lg font-semibold text-success">45-60 minutes</p>
        </div>

        <button
          onClick={onNewOrder}
          className="py-2 px-6 rounded-xl text-sm font-medium transition-colors bg-surface-secondary hover:bg-surface-tertiary"
        >
          Start New Order
        </button>
      </motion.div>
    </div>
  );
}
