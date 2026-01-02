/**
 * Globals injected by the OpenAI host runtime for widget integration.
 */
export type OpenAiGlobals<
  ToolInput = UnknownObject,
  ToolOutput = UnknownObject,
  ToolResponseMetadata = UnknownObject,
  WidgetState = UnknownObject,
> = {
  // visuals
  theme: Theme;

  userAgent: UserAgent;
  locale: string;

  // layout
  maxHeight: number;
  displayMode: DisplayMode;
  safeArea: SafeArea;

  // state
  toolInput: ToolInput;
  toolOutput: ToolOutput | null;
  toolResponseMetadata: ToolResponseMetadata | null;
  widgetState: WidgetState | null;
  setWidgetState: (state: WidgetState) => Promise<void>;
};

// currently copied from types.ts in chatgpt/web-sandbox.
// Will eventually use a public package.
type API = {
  callTool: CallTool;
  sendFollowUpMessage: (args: { prompt: string }) => Promise<void>;
  openExternal(payload: { href: string }): void;

  // Layout controls
  requestDisplayMode: RequestDisplayMode;
  requestModal: (args: { title?: string; params?: UnknownObject }) => Promise<unknown>;
  requestClose: () => Promise<void>;
};

/**
 * Generic object map for dynamic payloads.
 */
export type UnknownObject = Record<string, unknown>;

/**
 * Host-provided theme mode.
 */
export type Theme = "light" | "dark";

/**
 * Safe area inset values in pixels.
 */
export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

/**
 * Safe area metadata for the current display.
 */
export type SafeArea = {
  insets: SafeAreaInsets;
};

/**
 * Device type classification from the host user agent.
 */
export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

/**
 * User agent capabilities and device info from the host.
 */
export type UserAgent = {
  device: { type: DeviceType };
  capabilities: {
    hover: boolean;
    touch: boolean;
  };
};

/**
 * Display mode for widget rendering.
 */
export type DisplayMode = "pip" | "inline" | "fullscreen";
/**
 * Requests a host display mode change.
 */
export type RequestDisplayMode = (args: { mode: DisplayMode }) => Promise<{
  /**
   * The granted display mode. The host may reject the request.
   * For mobile, PiP is always coerced to fullscreen.
   */
  mode: DisplayMode;
}>;

/**
 * Response payload for tool calls.
 */
export type CallToolResponse = {
  result: string;
};

/**
 * Calls a host tool by name with arguments.
 */
export type CallTool = (name: string, args: Record<string, unknown>) => Promise<CallToolResponse>;

/**
 * DOM event type emitted when globals are updated.
 */
export const SET_GLOBALS_EVENT_TYPE = "openai:set_globals";
/**
 * Custom event carrying updated globals.
 */
export class SetGlobalsEvent extends CustomEvent<{
  globals: Partial<OpenAiGlobals>;
}> {
  readonly type = SET_GLOBALS_EVENT_TYPE;
}

/**
 * Global oai object injected by the web sandbox for communicating with chatgpt host page.
 */
declare global {
  interface Window {
    openai: API & OpenAiGlobals;
  }

  interface WindowEventMap {
    [SET_GLOBALS_EVENT_TYPE]: SetGlobalsEvent;
  }
}

/**
 * Re-export shared widget data types.
 */
export type {
  Photo,
  Album,
  CartItem,
  ShopView,
  CartWidgetState,
  ShopWidgetState,
} from "./data-types";

/**
 * Re-export tool output types.
 */
export type {
  BaseToolOutput,
  CartToolOutput,
  ShopToolOutput,
  DashboardToolOutput,
  ExampleToolOutput,
  SearchToolOutput,
} from "./tool-output-types";
