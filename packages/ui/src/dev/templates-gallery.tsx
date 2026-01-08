import type { ComponentType } from "react";

import { blockRegistry } from "../templates/blocks/registry";
import { DashboardTemplate } from "../templates/DashboardTemplate";
import { ChatFullWidthTemplate } from "../templates/ChatFullWidthTemplate";
import { ChatTwoPaneTemplate } from "../templates/ChatTwoPaneTemplate";
import { NewComponentsShowcase } from "../templates/_temp_import/components/templates/NewComponentsShowcase";
import {
  categories as templateCategories,
  getTemplatesByCategory,
  templateRegistry as templatesRegistry,
} from "../templates/registry";

import {
  AppsSdkCarouselExample,
  AppsSdkCarouselExampleAlt,
  AppsSdkFullscreenExample,
  AppsSdkFullscreenExampleAlt,
  AppsSdkInlineExample,
  AppsSdkInlineExampleAlt,
  AppsSdkInspectorExample,
  AppsSdkInspectorExampleAlt,
  AppsSdkPipExample,
  AppsSdkPipExampleAlt,
  AppsSdkStarterTemplate,
  AppsSdkStarterTemplateAlt,
} from "./apps-sdk-examples";

export type TemplatesGalleryCategory = keyof typeof templatesGalleryCategories;

export type TemplatesGalleryItem = {
  id: string;
  title: string;
  description: string;
  category: TemplatesGalleryCategory;
  Component: ComponentType;
  previewProps?: Record<string, unknown>;
  tags?: string[];
};

export const templatesGalleryCategories = {
  ...templateCategories,
  blocks: "Blocks",
  "apps-sdk-examples": "Apps SDK Examples",
} as const;

const legacyTemplates: TemplatesGalleryItem[] = [
  {
    id: "chat-full-width",
    title: "Chat Full Width",
    description: "Full-width chat layout with header, messages, and input slots.",
    category: "templates",
    Component: ChatFullWidthTemplate,
    previewProps: {
      header: <div className="p-4 border-b">Chat Header</div>,
      body: <div className="p-4">Chat Messages</div>,
      footer: <div className="p-4 border-t">Chat Input</div>,
    },
    tags: ["chat", "layout", "full-width"],
  },
  {
    id: "chat-two-pane",
    title: "Chat Two Pane",
    description: "Two-pane chat layout with sidebar and main content slots.",
    category: "templates",
    Component: ChatTwoPaneTemplate,
    previewProps: {
      sidebar: <div className="p-4 border-r">Sidebar</div>,
      main: <div className="p-4">Main Chat</div>,
    },
    tags: ["chat", "layout", "two-pane"],
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Dashboard template for widgets and cards.",
    category: "templates",
    Component: DashboardTemplate,
    previewProps: {
      title: "Dashboard",
      widgets: <div className="p-4">Dashboard Widgets</div>,
    },
    tags: ["dashboard", "layout", "widgets"],
  },
];

const blocks: TemplatesGalleryItem[] = blockRegistry.map((block) => ({
  id: `block-${block.id}`,
  title: block.title,
  description: block.description,
  category: "blocks",
  Component: block.Component,
  tags: ["block", block.id],
}));

const extraDevItems: TemplatesGalleryItem[] = [
  {
    id: "new-components-showcase",
    title: "New Components Showcase",
    description:
      "Interactive showcase of new primitives (alerts, code blocks, inputs, date pickers, menus, markdown, animations).",
    category: "components",
    Component: NewComponentsShowcase,
    tags: ["components", "showcase", "dev"],
  },
];

const appsSdkExamples: TemplatesGalleryItem[] = [
  {
    id: "apps-sdk-carousel",
    title: "Apps SDK Carousel (Example)",
    description: "Reference carousel layout adapted from the Apps SDK examples.",
    category: "apps-sdk-examples",
    Component: AppsSdkCarouselExample,
    tags: ["apps-sdk", "example", "carousel"],
  },
  {
    id: "apps-sdk-carousel-alt",
    title: "Apps SDK Carousel (Example B)",
    description: "Alternate carousel configuration for sizing and copy.",
    category: "apps-sdk-examples",
    Component: AppsSdkCarouselExampleAlt,
    tags: ["apps-sdk", "example", "carousel", "variant"],
  },
  {
    id: "apps-sdk-inline",
    title: "Apps SDK Inline List (Example)",
    description: "Reference inline list layout adapted from the Apps SDK examples.",
    category: "apps-sdk-examples",
    Component: AppsSdkInlineExample,
    tags: ["apps-sdk", "example", "inline"],
  },
  {
    id: "apps-sdk-inline-alt",
    title: "Apps SDK Inline List (Example B)",
    description: "Alternate inline list configuration for compact layouts.",
    category: "apps-sdk-examples",
    Component: AppsSdkInlineExampleAlt,
    tags: ["apps-sdk", "example", "inline", "variant"],
  },
  {
    id: "apps-sdk-fullscreen",
    title: "Apps SDK Fullscreen (Example)",
    description: "Reference fullscreen viewer adapted from the Apps SDK examples.",
    category: "apps-sdk-examples",
    Component: AppsSdkFullscreenExample,
    tags: ["apps-sdk", "example", "fullscreen"],
  },
  {
    id: "apps-sdk-fullscreen-alt",
    title: "Apps SDK Fullscreen (Example B)",
    description: "Fullscreen viewer with always-open state and album picker.",
    category: "apps-sdk-examples",
    Component: AppsSdkFullscreenExampleAlt,
    tags: ["apps-sdk", "example", "fullscreen", "variant"],
  },
  {
    id: "apps-sdk-inspector",
    title: "Apps SDK Inspector (Example)",
    description: "Reference inspector panel adapted from the Apps SDK examples.",
    category: "apps-sdk-examples",
    Component: AppsSdkInspectorExample,
    tags: ["apps-sdk", "example", "inspector"],
  },
  {
    id: "apps-sdk-inspector-alt",
    title: "Apps SDK Inspector (Example B)",
    description: "Static inspector layout for quick review states.",
    category: "apps-sdk-examples",
    Component: AppsSdkInspectorExampleAlt,
    tags: ["apps-sdk", "example", "inspector", "variant"],
  },
  {
    id: "apps-sdk-pip",
    title: "Apps SDK PiP (Reference)",
    description: "PiP reference surface aligned to Apps SDK style guidance.",
    category: "apps-sdk-examples",
    Component: AppsSdkPipExample,
    tags: ["apps-sdk", "example", "pip"],
  },
  {
    id: "apps-sdk-pip-alt",
    title: "Apps SDK PiP (Example B)",
    description: "Alternate PiP configuration for state exploration.",
    category: "apps-sdk-examples",
    Component: AppsSdkPipExampleAlt,
    tags: ["apps-sdk", "example", "pip", "variant"],
  },
  {
    id: "apps-sdk-starter-template",
    title: "Apps SDK Starter Template",
    description: "Starter layout combining inline, carousel, inspector, fullscreen, and PiP.",
    category: "apps-sdk-examples",
    Component: AppsSdkStarterTemplate,
    tags: ["apps-sdk", "example", "starter"],
  },
  {
    id: "apps-sdk-starter-template-alt",
    title: "Apps SDK Starter Template (Example B)",
    description: "Alternate starter layout for compact flows and pairing.",
    category: "apps-sdk-examples",
    Component: AppsSdkStarterTemplateAlt,
    tags: ["apps-sdk", "example", "starter", "variant"],
  },
];

export const templatesGalleryRegistry: TemplatesGalleryItem[] = [
  ...legacyTemplates,
  ...extraDevItems,
  ...appsSdkExamples,
  ...templatesRegistry,
  ...blocks,
];

const isTemplateCategory = (
  category: TemplatesGalleryCategory,
): category is keyof typeof templateCategories => category in templateCategories;

export function getTemplatesGalleryByCategory(
  category: TemplatesGalleryCategory,
): TemplatesGalleryItem[] {
  if (category === "blocks") {
    return blocks;
  }

  const legacy = legacyTemplates.filter((item) => item.category === category);
  const extras = extraDevItems.filter((item) => item.category === category);
  const appsSdk = appsSdkExamples.filter((item) => item.category === category);
  const canonical = isTemplateCategory(category) ? getTemplatesByCategory(category) : [];

  return [...legacy, ...extras, ...appsSdk, ...canonical];
}
