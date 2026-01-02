export const SET_GLOBALS_EVENT_TYPE = "openai:globals:set" as const;

export type DisplayMode = "pip" | "inline" | "fullscreen";

export type OpenAiGlobals = {
  displayMode?: DisplayMode;
  maxHeight?: number;
};

export type SetGlobalsEvent = CustomEvent<{
  globals: OpenAiGlobals;
}>;
