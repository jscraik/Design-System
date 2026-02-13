import type { ComponentType } from "react";

import type { Registry } from "./types";

export function createRegistry(): Registry {
  const components = new Map<string, ComponentType<any> | string>();

  return {
    get(name: string) {
      return components.get(name);
    },
    register(name: string, component: ComponentType<any> | string) {
      components.set(name, component);
    },
    has(name: string) {
      return components.has(name);
    },
    list() {
      return Array.from(components.keys());
    },
  };
}

export type { Registry };
