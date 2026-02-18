# ESLint "Do Not Import" Rules for Modal Boundaries (Legacy)

Last updated: 2026-01-04

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Approach: `policy check`](#approach-policy check)
- [Policy Check Configuration](#eslint-configuration)
  - [Using flat config (ESLint 9+)](#using-flat-config-eslint-9)
  - [Using legacy config (ESLint 8)](#using-legacy-config-eslint-8)
- [Complete Zone List (Copy-Paste Ready)](#complete-zone-list-copy-paste-ready)
- [Example Violations](#example-violations)
  - [❌ Violation: Infrastructure importing from modals](#violation-infrastructure-importing-from-modals)
  - [❌ Violation: Settings component importing from modals](#violation-settings-component-importing-from-modals)
  - [❌ Violation: Panel importing ModalDialog directly](#violation-panel-importing-modaldialog-directly)
- [Testing the Rules](#testing-the-rules)
  - [1. Verify rules are loaded](#1-verify-rules-are-loaded)
  - [2. Test violations manually](#2-test-violations-manually)
  - [3. Test allowed imports](#3-test-allowed-imports)
- [Troubleshooting](#troubleshooting)
  - [Rule not firing?](#rule-not-firing)
  - [Too many false positives?](#too-many-false-positives)
- [Summary Table](#summary-table)

This document is retained for historical reference. ESLint has been replaced by policy checks in `scripts/policy/run.mjs`. Use `pnpm test:policy` to enforce modal boundary rules now.

---

## Approach: `policy check`

We use the `import/no-restricted-paths` rule from `policy check` to prevent circular dependencies and enforce layer separation.

---

## Policy Check Configuration

Add to your `.eslintrc.cjs` or `eslint.config.js`:

### Using flat config (ESLint 9+)

```js
const importPlugin = require("policy check");

module.exports = [
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // ... other rules
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // RULE 1: Infrastructure CANNOT import from feature modals
            {
              target: [
                "packages/ui/src/hooks/useFocusTrap.ts",
                "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
              ],
              from: "packages/ui/src/app/modals/**",
              message:
                "Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from feature modals. See: docs/MODAL_BOUNDARIES.md",
            },

            // RULE 2: Infrastructure CANNOT import from settings components
            {
              target: [
                "packages/ui/src/hooks/useFocusTrap.ts",
                "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
              ],
              from: "packages/ui/src/app/settings/**",
              message:
                "Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from settings. Keep infrastructure stateless.",
            },

            // RULE 3: Settings components CANNOT import from modals
            {
              target: [
                "packages/ui/src/app/settings/SettingRow/SettingRow.tsx",
                "packages/ui/src/app/settings/SettingToggle/SettingToggle.tsx",
                "packages/ui/src/app/settings/SettingDropdown/SettingDropdown.tsx",
              ],
              from: "packages/ui/src/app/modals/**",
              message:
                "Settings components (SettingRow, SettingToggle, SettingDropdown) MUST NOT import from modals. See: docs/MODAL_BOUNDARIES.md",
            },

            // RULE 4: Settings components CANNOT import from panels
            {
              target: [
                "packages/ui/src/app/settings/SettingRow/SettingRow.tsx",
                "packages/ui/src/app/settings/SettingToggle/SettingToggle.tsx",
                "packages/ui/src/app/settings/SettingDropdown/SettingDropdown.tsx",
              ],
              from: [
                "packages/ui/src/app/settings/PersonalizationPanel.tsx",
                "packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx",
                "packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx",
                "packages/ui/src/app/settings/AudioSettingsPanel.tsx",
              ],
              message:
                "Settings components MUST NOT import from panels. Panels are higher-level views.",
            },

            // RULE 5: Panels CANNOT import ModalDialog directly
            {
              target: [
                "packages/ui/src/app/settings/PersonalizationPanel.tsx",
                "packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx",
                "packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx",
                "packages/ui/src/app/settings/AudioSettingsPanel.tsx",
              ],
              from: "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
              message:
                "Panels MUST NOT import ModalDialog directly. Use parent SettingsModal's modal context instead.",
            },

            // RULE 6: Infrastructure CANNOT import from panels
            {
              target: [
                "packages/ui/src/hooks/useFocusTrap.ts",
                "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
              ],
              from: [
                "packages/ui/src/app/settings/PersonalizationPanel.tsx",
                "packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx",
                "packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx",
                "packages/ui/src/app/settings/AudioSettingsPanel.tsx",
              ],
              message:
                "Infrastructure MUST NOT import from panel components. Panels belong to feature layer.",
            },
          ],
        },
      ],
    },
  },
];
```

### Using legacy config (ESLint 8)

```js
module.exports = {
  extends: ["plugin:import/recommended", "plugin:import/typescript"],
  plugins: ["import"],
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          // Same zones as above
          {
            target: [
              "packages/ui/src/hooks/useFocusTrap.ts",
              "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
            ],
            from: "packages/ui/src/app/modals/**",
            message:
              "Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from feature modals.",
          },
          // ... add remaining zones from above
        ],
      },
    ],
  },
};
```

---

## Complete Zone List (Copy-Paste Ready)

```js
"import/no-restricted-paths": [
  "error",
  {
    zones: [
      // ===== INFRASTRUCTURE RESTRICTIONS =====
      {
        target: [
          "packages/ui/src/hooks/useFocusTrap.ts",
          "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
        ],
        from: "packages/ui/src/app/modals/**",
        message: "Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from feature modals.",
      },
      {
        target: [
          "packages/ui/src/hooks/useFocusTrap.ts",
          "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
        ],
        from: "packages/ui/src/app/settings/**",
        message: "Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from settings components.",
      },
      {
        target: [
          "packages/ui/src/hooks/useFocusTrap.ts",
          "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
        ],
        from: [
          "packages/ui/src/app/settings/PersonalizationPanel.tsx",
          "packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx",
          "packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx",
          "packages/ui/src/app/settings/AudioSettingsPanel.tsx",
          "packages/ui/src/app/settings/NotificationsPanel.tsx",
          "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
          "packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.tsx",
          "packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx",
          "packages/ui/src/app/settings/CheckForUpdatesPanel.tsx",
        ],
        message: "Infrastructure MUST NOT import from panel components.",
      },

      // ===== SETTINGS COMPONENTS RESTRICTIONS =====
      {
        target: [
          "packages/ui/src/app/settings/SettingRow/SettingRow.tsx",
          "packages/ui/src/app/settings/SettingToggle/SettingToggle.tsx",
          "packages/ui/src/app/settings/SettingDropdown/SettingDropdown.tsx",
        ],
        from: "packages/ui/src/app/modals/**",
        message: "Settings components (SettingRow, SettingToggle, SettingDropdown) MUST NOT import from modals.",
      },
      {
        target: [
          "packages/ui/src/app/settings/SettingRow/SettingRow.tsx",
          "packages/ui/src/app/settings/SettingToggle/SettingToggle.tsx",
          "packages/ui/src/app/settings/SettingDropdown/SettingDropdown.tsx",
        ],
        from: [
          "packages/ui/src/app/settings/PersonalizationPanel.tsx",
          "packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx",
          "packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx",
          "packages/ui/src/app/settings/AudioSettingsPanel.tsx",
          "packages/ui/src/app/settings/NotificationsPanel.tsx",
          "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
          "packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.tsx",
          "packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx",
          "packages/ui/src/app/settings/CheckForUpdatesPanel.tsx",
        ],
        message: "Settings components MUST NOT import from panels.",
      },

      // ===== PANELS RESTRICTIONS =====
      {
        target: [
          "packages/ui/src/app/settings/PersonalizationPanel.tsx",
          "packages/ui/src/app/settings/SecurityPanel/SecurityPanel.tsx",
          "packages/ui/src/app/settings/ManageAppsPanel/ManageAppsPanel.tsx",
          "packages/ui/src/app/settings/AudioSettingsPanel.tsx",
          "packages/ui/src/app/settings/NotificationsPanel.tsx",
          "packages/ui/src/app/settings/AppsPanel/AppsPanel.tsx",
          "packages/ui/src/app/settings/DataControlsPanel/DataControlsPanel.tsx",
          "packages/ui/src/app/settings/ArchivedChatsPanel/ArchivedChatsPanel.tsx",
          "packages/ui/src/app/settings/CheckForUpdatesPanel.tsx",
        ],
        from: "packages/ui/src/components/ui/overlays/Modal/Modal.tsx",
        message: "Panels MUST NOT import ModalDialog directly. Use parent SettingsModal instead.",
      },
    ],
  },
],
```

---

## Example Violations

### ❌ Violation: Infrastructure importing from modals

**File:** `packages/ui/src/components/ui/overlays/Modal/Modal.tsx`

```tsx
// BAD: Creates circular dependency
import { DiscoverySettingsModal } from "../../modals/DiscoverySettingsModal";
```

**Error:**

```
error  Infrastructure (useFocusTrap, ModalDialog) MUST NOT import from feature modals  import/no-restricted-paths
```

**Fix:** Don't import modals in infrastructure. Infrastructure is stateless.

---

### ❌ Violation: Settings component importing from modals

**File:** `packages/ui/src/app/settings/SettingRow/SettingRow.tsx`

```tsx
// BAD: Creates circular dependency
import { SettingsModal } from "../../modals/SettingsModal";
```

**Error:**

```
error  Settings components (SettingRow, SettingToggle, SettingDropdown) MUST NOT import from modals  import/no-restricted-paths
```

**Fix:** Settings components are leaf nodes. They should be usable independently.

---

### ❌ Violation: Panel importing ModalDialog directly

**File:** `packages/ui/src/app/settings/PersonalizationPanel.tsx`

```tsx
// BAD: Bypasses parent SettingsModal
import { ModalDialog } from "../../ui/overlays/modal";

export function PersonalizationPanel() {
  return (
    <ModalDialog isOpen={...}> {/* Don't do this */} />
  );
}
```

**Error:**

```
error  Panels MUST NOT import ModalDialog directly. Use parent SettingsModal instead.  import/no-restricted-paths
```

**Fix:** Panels receive `onBack` callback from SettingsModal. They don't manage their own modal.

---

## Testing the Rules

### 1. Verify rules are loaded

```bash
pnpm test:policy --debug
```

Look for `import/no-restricted-paths` in the loaded rules.

### 2. Test violations manually

Create a test file to verify rules work:

```tsx
// packages/ui/src/components/ui/overlays/Modal/Modal-bad-test.tsx
// This should trigger an error
import { DiscoverySettingsModal } from "../../modals/DiscoverySettingsModal";

export function BadModal() {
  return <DiscoverySettingsModal />;
}
```

Run:

```bash
pnpm test:policy packages/ui/src/components/ui/overlays/Modal/Modal-bad-test.tsx
```

### 3. Test allowed imports

These should NOT trigger errors:

```tsx
// ✅ ALLOWED: Modal importing infrastructure
import { ModalDialog } from "../../ui/overlays/modal";

// ✅ ALLOWED: Modal importing settings
import { SettingRow } from "../../settings/SettingRow";

// ✅ ALLOWED: SettingsModal importing panels
import { PersonalizationPanel } from "../../settings/PersonalizationPanel";

// ✅ ALLOWED: Panel importing settings
import { SettingRow } from "./SettingRow";
import { SettingToggle } from "./SettingToggle";
```

---

## Troubleshooting

### Rule not firing?

1. **Check plugin is installed:**

   ```bash
   pnpm list policy check
   ```

2. **Check paths match your file structure:**
   The glob patterns assume `packages/ui/` monorepo structure. Adjust if yours is different.

3. **Check rule priority:**
   Other rules may override. Place `import/no-restricted-paths` last in your rules list.

### Too many false positives?

1. **Verify file paths:** Update the `target` and `from` patterns to match your exact file structure.

2. **Add exceptions sparingly:**
   ```js
   {
     target: "packages/ui/src/hooks/useFocusTrap.ts",
     from: "packages/ui/src/app/modals/**",
     // Only allow for test files
     except: ["**/*.test.ts", "**/*.spec.ts"],
   }
   ```

---

## Summary Table

| Layer                                                                      | Cannot Import From       | Reason                       |
| -------------------------------------------------------------------------- | ------------------------ | ---------------------------- |
| **Infrastructure** (`useFocusTrap`, `ModalDialog`)                         | Modals, Settings, Panels | Keep stateless, avoid cycles |
| **Settings Components** (`SettingRow`, `SettingToggle`, `SettingDropdown`) | Modals, Panels           | Leaf nodes, reusable         |
| **Panels** (`PersonalizationPanel`, `SecurityPanel`, etc.)                 | `ModalDialog`, Settings  | Parent manages modal         |

**Allowed flows:**

- ✅ Infrastructure ← (nothing, it's the base)
- ✅ Modals ← Infrastructure, Settings
- ✅ Settings ← Icons, Utils
- ✅ Panels ← Settings, Icons
- ✅ SettingsModal ← Panels, Infrastructure
