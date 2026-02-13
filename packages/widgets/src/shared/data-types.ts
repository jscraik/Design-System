/**
 * Shared Data Types
 *
 * Common data model types used across multiple widgets.
 * Consolidates duplicate type definitions to ensure consistency.
 */

/**
 * Photo entity for gallery widgets
 */
export type Photo = {
  id: string;
  title: string;
  url: string;
  description?: string;
};

/**
 * Album entity containing photos
 */
export type Album = {
  id: string;
  title: string;
  cover: string;
  photos: Photo[];
};

/**
 * Shopping cart item
 */
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
};

/**
 * Shop/checkout view states
 */
export type ShopView = "cart" | "checkout" | "confirmation";

/**
 * Shopping cart widget state
 */
export type CartWidgetState = {
  items: CartItem[];
  lastUpdated: string;
};

/**
 * Full shop widget state with checkout flow
 */
export type ShopWidgetState = {
  view: ShopView;
  items: CartItem[];
  deliveryOption: "standard" | "express";
  tipPercent: number;
  orderId?: string;
};
