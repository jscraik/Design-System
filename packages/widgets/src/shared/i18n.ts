/**
 * Provide lightweight i18n helpers for widgets.
 *
 * Reads locale from `window.openai.locale` and exposes:
 * - Number formatting
 * - Currency formatting
 * - Date formatting
 * - Simple message translation
 *
 * For production apps, prefer a full i18n library (for example, react-intl).
 */

import { getOpenAiGlobal } from "@design-studio/runtime";

// Default locale
const DEFAULT_LOCALE = "en-US";

/**
 * Return the active locale from `window.openai` or the default fallback.
 * @returns The resolved locale string.
 */
export function getLocale(): string {
  return getOpenAiGlobal("locale") ?? DEFAULT_LOCALE;
}

/**
 * Format a number according to the current locale.
 * @param value - The numeric value to format.
 * @param options - Optional Intl.NumberFormat options.
 * @returns The formatted number string.
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const locale = getLocale();
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a currency value according to the current locale.
 * @param value - The numeric value to format.
 * @param currency - The ISO 4217 currency code (defaults to USD).
 * @param options - Optional Intl.NumberFormat options.
 * @returns The formatted currency string.
 */
export function formatCurrency(
  value: number,
  currency = "USD",
  options?: Intl.NumberFormatOptions,
): string {
  const locale = getLocale();
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...options,
  }).format(value);
}

/**
 * Format a date according to the current locale.
 * @param date - The date input to format.
 * @param options - Optional Intl.DateTimeFormat options.
 * @returns The formatted date string.
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
): string {
  const locale = getLocale();
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format a relative time string (for example, "2 hours ago").
 * @param date - The date input to compare with now.
 * @param options - Optional Intl.RelativeTimeFormat options.
 * @returns A locale-aware relative time string.
 */
export function formatRelativeTime(
  date: Date | string | number,
  options?: Intl.RelativeTimeFormatOptions,
): string {
  const locale = getLocale();
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    ...options,
  });

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, "second");
  } else if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, "minute");
  } else if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, "hour");
  } else {
    return rtf.format(diffDay, "day");
  }
}

/**
 * Simple message translations.
 * For production, use a proper i18n library like react-intl.
 */
type MessageKey =
  | "cart.empty"
  | "cart.items"
  | "cart.subtotal"
  | "cart.checkout"
  | "cart.clear"
  | "auth.signIn"
  | "auth.signOut"
  | "auth.authenticated"
  | "auth.notAuthenticated"
  | "common.loading"
  | "common.error"
  | "common.success";

const messages: Record<string, Record<MessageKey, string>> = {
  "en-US": {
    "cart.empty": "Your cart is empty",
    "cart.items": "{count} item(s)",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Checkout",
    "cart.clear": "Clear Cart",
    "auth.signIn": "Sign In",
    "auth.signOut": "Sign Out",
    "auth.authenticated": "Authenticated",
    "auth.notAuthenticated": "Not authenticated",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
  },
  "es-ES": {
    "cart.empty": "Tu carrito está vacío",
    "cart.items": "{count} artículo(s)",
    "cart.subtotal": "Subtotal",
    "cart.checkout": "Pagar",
    "cart.clear": "Vaciar carrito",
    "auth.signIn": "Iniciar sesión",
    "auth.signOut": "Cerrar sesión",
    "auth.authenticated": "Autenticado",
    "auth.notAuthenticated": "No autenticado",
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.success": "Éxito",
  },
  "fr-FR": {
    "cart.empty": "Votre panier est vide",
    "cart.items": "{count} article(s)",
    "cart.subtotal": "Sous-total",
    "cart.checkout": "Commander",
    "cart.clear": "Vider le panier",
    "auth.signIn": "Se connecter",
    "auth.signOut": "Se déconnecter",
    "auth.authenticated": "Authentifié",
    "auth.notAuthenticated": "Non authentifié",
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.success": "Succès",
  },
};

/**
 * Return a translated message string.
 * @param key - The message key.
 * @param params - Optional interpolation params.
 * @returns The localized message string.
 */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const locale = getLocale();
  // Try exact locale, then language code, then fallback to en-US
  const langCode = locale.split("-")[0];
  const messageSet =
    messages[locale] || messages[`${langCode}-${langCode.toUpperCase()}`] || messages["en-US"];

  let message = messageSet[key] || key;

  // Simple parameter interpolation
  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      message = message.replace(`{${paramKey}}`, String(value));
    });
  }

  return message;
}

/**
 * Return locale-aware formatting helpers.
 * @returns Formatting utilities and a translation helper.
 */
export function useI18n() {
  const locale = getLocale();

  return {
    locale,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    t,
  };
}
