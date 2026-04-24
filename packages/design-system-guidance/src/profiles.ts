import type { DesignProfileDefinition } from "./types.js";

export const SUPPORTED_DESIGN_PROFILES: DesignProfileDefinition[] = [
  {
    id: "astudio-default@1",
    name: "astudio-default",
    version: "1",
    status: "supported",
    source: "design-system-guidance",
  },
];

export function supportedDesignProfileIds(): string[] {
  return SUPPORTED_DESIGN_PROFILES.map((profile) => profile.id);
}
