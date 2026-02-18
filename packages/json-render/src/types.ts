import type { ComponentType, ReactNode } from "react";

export interface ComponentSchema {
  component: string;
  props?: Record<string, unknown>;
  children?: ComponentSchema[] | string;
}

export interface JsonRenderProps {
  schema: ComponentSchema | ComponentSchema[];
  registry?: Registry;
  fallback?: ReactNode;
}

export interface Registry {
  get(name: string): ComponentType<any> | string | undefined;
  register(name: string, component: ComponentType<any> | string): void;
  has(name: string): boolean;
  list(): string[];
}
