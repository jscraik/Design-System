/**
 * Modal Boundaries - ESLint Rules
 *
 * Enforces module boundaries for the modal system to prevent circular dependencies
 * and maintain clear separation of concerns.
 *
 * Based on: docs/MODAL_BOUNDARIES.md
 *
 * USAGE:
 * 1. Add to your ESLint config:
 *    {
 *      "plugins": ["./eslint-rules-modal-boundaries"],
 *      "rules": {
 *        "@design-studio/modal-boundaries": "error"
 *      }
 *    }
 */

import { createRequire } from "node:module";
import { dirname } from "node:path";

const require = createRequire(import.meta.url);

/**
 * Path patterns for each layer
 */
const PATHS = {
  // Infrastructure: Stateless, reusable hooks and components
  infrastructure: [
    "packages/ui/src/hooks/useFocusTrap.ts",
    "packages/ui/src/components/ui/overlays/modal.tsx",
  ],

  // Feature modals: Stateful business logic modals
  modals: [
    "packages/ui/src/app/modals/DiscoverySettingsModal.tsx",
    "packages/ui/src/app/modals/IconPickerModal.tsx",
    "packages/ui/src/app/modals/SettingsModal.tsx",
  ],

  // Settings components: Controlled leaf components
  settings: [
    "packages/ui/src/app/settings/SettingRow.tsx",
    "packages/ui/src/app/settings/SettingToggle.tsx",
    "packages/ui/src/app/settings/SettingDropdown.tsx",
  ],

  // Panels: Nested view components (used by SettingsModal)
  panels: [
    "packages/ui/src/app/settings/PersonalizationPanel.tsx",
    "packages/ui/src/app/settings/SecurityPanel.tsx",
    "packages/ui/src/app/settings/ManageAppsPanel.tsx",
    "packages/ui/src/app/settings/AudioSettingsPanel.tsx",
    "packages/ui/src/app/settings/NotificationsPanel.tsx",
    "packages/ui/src/app/settings/AppsPanel.tsx",
    "packages/ui/src/app/settings/DataControlsPanel.tsx",
    "packages/ui/src/app/settings/ArchivedChatsPanel.tsx",
    "packages/ui/src/app/settings/CheckForUpdatesPanel.tsx",
  ],
};

/**
 * Rule: @design-studio/modal-boundaries
 *
 * Enforces:
 * 1. Infrastructure CANNOT import from modals, settings, or panels
 * 2. Settings components CANNOT import from modals
 * 3. Panels CANNOT import from ModalDialog (must use parent SettingsModal)
 */
const modalBoundariesRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce modal module boundaries to prevent circular dependencies",
      category: "Best Practices",
      recommended: "error",
      url: "https://github.com/your-repo/blob/main/docs/MODAL_BOUNDARIES.md",
    },
    schema: [], // No options
    messages: {
      infraImportModal:
        "Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from feature modals. This creates circular dependencies.",
      infraImportSettings:
        "Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from settings components. Keep infrastructure stateless.",
      infraImportPanels:
        "Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from panel components. Panels belong to feature layer.",
      settingsImportModal:
        "Settings components (SettingRow, SettingToggle, SettingDropdown) MUST NOT import from modals. This creates circular dependencies.",
      settingsImportPanel:
        "Settings components MUST NOT import from panels. Panels are higher-level views.",
      panelImportModalDialog:
        "Panels MUST NOT import ModalDialog directly. Use parent SettingsModal's modal context instead.",
    },
  },
  create(context) {
    const filename = context.getFilename();

    // Determine which layer this file belongs to
    const getLayer = (filePath) => {
      const relativePath = filePath.replace(/^.*\/packages\/ui\/src\//, "");

      for (const path of PATHS.infrastructure) {
        if (path.includes(relativePath.split("/").pop())) return "infrastructure";
      }
      for (const path of PATHS.modals) {
        if (path.includes(relativePath.split("/").pop())) return "modals";
      }
      for (const path of PATHS.settings) {
        if (path.includes(relativePath.split("/").pop())) return "settings";
      }
      for (const path of PATHS.panels) {
        if (path.includes(relativePath.split("/").pop())) return "panels";
      }
      return null;
    };

    const currentLayer = getLayer(filename);

    // If not in our system, skip
    if (!currentLayer) return {};

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        // Resolve relative imports to check layer
        const getImportLayer = (source) => {
          // Only check relative imports within packages/ui
          if (!source.startsWith(".") && !source.startsWith("../")) return null;

          const resolvedPath = require.resolve(source, {
            paths: [dirname(filename)],
          });

          const relativePath = resolvedPath.replace(/^.*\/packages\/ui\/src\//, "");

          // Check each layer
          for (const path of PATHS.infrastructure) {
            if (path.includes("modal.tsx") && relativePath.includes("ui/overlays/modal"))
              return "infrastructure";
            if (path.includes("useFocusTrap") && relativePath.includes("hooks/useFocusTrap"))
              return "infrastructure";
          }
          if (
            relativePath.includes("app/modals/") &&
            PATHS.modals.some((p) => p.includes(relativePath.split("/").pop()))
          ) {
            return "modals";
          }
          if (
            relativePath.includes("app/settings/") &&
            PATHS.settings.some((p) => p.includes(relativePath.split("/").pop()))
          ) {
            return "settings";
          }
          if (
            relativePath.includes("app/settings/") &&
            PATHS.panels.some((p) => p.includes(relativePath.split("/").pop()))
          ) {
            return "panels";
          }
          return null;
        };

        const importLayer = getImportLayer(importSource);
        if (!importLayer) return;

        // Rule 1: Infrastructure cannot import from feature layer
        if (currentLayer === "infrastructure") {
          if (importLayer === "modals") {
            context.report({
              node,
              messageId: "infraImportModal",
              loc: node.source.loc,
            });
          }
          if (importLayer === "settings") {
            context.report({
              node,
              messageId: "infraImportSettings",
              loc: node.source.loc,
            });
          }
          if (importLayer === "panels") {
            context.report({
              node,
              messageId: "infraImportPanels",
              loc: node.source.loc,
            });
          }
        }

        // Rule 2: Settings cannot import from modals
        if (currentLayer === "settings" && importLayer === "modals") {
          context.report({
            node,
            messageId: "settingsImportModal",
            loc: node.source.loc,
          });
        }

        // Rule 3: Settings cannot import from panels (panels are higher-level)
        if (currentLayer === "settings" && importLayer === "panels") {
          context.report({
            node,
            messageId: "settingsImportPanel",
            loc: node.source.loc,
          });
        }

        // Rule 4: Panels cannot import ModalDialog directly
        if (
          currentLayer === "panels" &&
          importLayer === "infrastructure" &&
          importSource.includes("modal")
        ) {
          context.report({
            node,
            messageId: "panelImportModalDialog",
            loc: node.source.loc,
          });
        }
      },
    };
  },
};

export default {
  rules: {
    "@design-studio/modal-boundaries": modalBoundariesRule,
  },
};
