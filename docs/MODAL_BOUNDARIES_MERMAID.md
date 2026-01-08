# Modal Module Boundaries (Mermaid)

Last updated: 2026-01-04

## Doc requirements
- Audience: Developers (intermediate)
- Scope: Topic defined by this document
- Non-scope: Anything not explicitly covered here
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Contents

- [Doc requirements](#doc-requirements)
- [Module Dependency Graph](#module-dependency-graph)
- [State Ownership Diagram](#state-ownership-diagram)
- [Data Flow Patterns](#data-flow-patterns)
  - [Pattern A: Synced State (DiscoverySettingsModal, IconPickerModal)](#pattern-a-synced-state-discoverysettingsmodal-iconpickermodal)
  - [Pattern B: Local-Only State (SettingsModal, Panels)](#pattern-b-local-only-state-settingsmodal-panels)
  - [Pattern C: Controlled Components (SettingRow, SettingToggle)](#pattern-c-controlled-components-settingrow-settingtoggle)
- [Component Architecture](#component-architecture)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Testing Strategy](#testing-strategy)
- [File Structure](#file-structure)
- [Import Dependencies](#import-dependencies)


## Module Dependency Graph

```mermaid
graph TB
    subgraph Infrastructure["Infrastructure Layer (Stateless)"]
        FocusTrap["useFocusTrap<br/>(hooks/useFocusTrap.ts)"]
        ModalDialog["ModalDialog<br/>(ui/overlays/modal.tsx)"]
        ModalHeader["ModalHeader"]
        ModalBody["ModalBody"]
        ModalFooter["ModalFooter"]

        FocusTrap -->|"uses"| ModalDialog
        ModalDialog -->|"composes"| ModalHeader
        ModalDialog -->|"composes"| ModalBody
        ModalDialog -->|"composes"| ModalFooter
    end

    subgraph Modals["Feature Modals (Stateful)"]
        DiscoveryModal["DiscoverySettingsModal"]
        IconPicker["IconPickerModal"]
        SettingsModal["SettingsModal"]
    end

    subgraph Settings["Settings Components (Controlled)"]
        SettingRow["SettingRow"]
        SettingToggle["SettingToggle"]
        SettingDropdown["SettingDropdown"]
    end

    subgraph Panels["Panel Components (Nested Views)"]
        Personalization["PersonalizationPanel"]
        Security["SecurityPanel"]
        ManageApps["ManageAppsPanel"]
        AudioSettings["AudioSettingsPanel"]
    end

    ModalDialog -.->|"provides focus trap"| DiscoveryModal
    ModalDialog -.->|"provides focus trap"| IconPicker
    ModalDialog -.->|"provides focus trap"| SettingsModal

    DiscoveryModal -->|"uses"| SettingRow
    DiscoveryModal -->|"uses"| SettingToggle

    IconPicker -->|"uses icons"| ChatGPTIcons[(ChatGPTIcons)]

    SettingsModal -->|"uses"| SettingRow
    SettingsModal -->|"uses"| SettingToggle
    SettingsModal -->|"uses"| SettingDropdown
    SettingsModal -->|"renders"| Personalization
    SettingsModal -->|"renders"| Security
    SettingsModal -->|"renders"| ManageApps
    SettingsModal -->|"renders"| AudioSettings

    Personalization -->|"uses"| SettingDropdown
    Personalization -->|"uses"| SettingToggle
    Security -->|"uses"| SettingRow
    Security -->|"uses"| SettingToggle

    classDef infrastructure fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef modals fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef settings fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef panels fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px

    class FocusTrap,ModalDialog,ModalHeader,ModalBody,ModalFooter infrastructure
    class DiscoveryModal,IconPicker,SettingsModal modals
    class SettingRow,SettingToggle,SettingDropdown settings
    class Personalization,Security,ManageApps,AudioSettings panels
```

## State Ownership Diagram

```mermaid
graph LR
    subgraph Parent["Parent Component"]
        P1["persistedState"]
        P2["onChange callback"]
    end

    subgraph Modal["Modal Component"]
        M1["localState"]
        M2["useEffect sync"]
        M3["userHandler"]
    end

    subgraph Infrastructure["Infrastructure"]
        I1["useFocusTrap"]
        I2["ModalDialog"]
    end

    Parent -->|"props: value"| Modal
    Parent -->|"props: onChange"| Modal
    Modal -->|"uses"| Infrastructure

    M2 -->|"on isOpen change"| M1
    M1 -->|"display"| M3
    M3 -->|"calls"| P2
    P2 -->|"updates"| P1

    classDef parent fill:#ffebee,stroke:#c62828
    classDef modal fill:#e3f2fd,stroke:#1565c0
    classDef infra fill:#f1f8e9,stroke:#2e7d32

    class P1,P2 parent
    class M1,M2,M3 modal
    class I1,I2 infra
```

## Data Flow Patterns

### Pattern A: Synced State (DiscoverySettingsModal, IconPickerModal)

```mermaid
sequenceDiagram
    participant P as Parent
    participant M as Modal
    participant I as Infrastructure

    P->>M: isOpen=true, externalValue
    M->>M: useEffect: setLocalState(externalValue)
    Note over M: Local state synced

    M->>M: User interaction (slider, dropdown, etc.)
    M->>P: onChange(newValue)
    Note over P: Parent updates persisted state

    P->>M: externalValue changed (re-render)
    M->>M: useEffect: setLocalState(externalValue)
    Note over M: Local state re-synced

    P->>M: isOpen=false
    Note over M: Modal closes, local state discarded
```

### Pattern B: Local-Only State (SettingsModal, Panels)

```mermaid
sequenceDiagram
    participant M as Modal/Panel
    participant I as Infrastructure

    M->>I: Mount with ModalDialog
    Note over M: All state local (~25 useState)

    M->>M: User interaction
    M->>M: Update local state only
    Note over M: No persistence

    M->>I: Unmount
    Note over M: State discarded
```

### Pattern C: Controlled Components (SettingRow, SettingToggle)

```mermaid
sequenceDiagram
    participant P as Parent
    participant C as Component
    participant U as User

    P->>C: value={state}, onChange={handler}
    Note over C: Display only, no state

    U->>C: User interaction (click, toggle, etc.)
    C->>P: onChange(newValue)
    Note over P: Parent updates state

    P->>C: Re-render with new value
    Note over C: Display updated
```

## Component Architecture

```mermaid
graph TB
    subgraph "ModalDialog Structure"
        MD["ModalDialog"]
        MH["ModalHeader<br/>(title, subtitle, actions, close)"]
        MB["ModalBody<br/>(scrollable content)"]
        MF["ModalFooter<br/>(right-aligned actions)"]

        MD --> MH
        MD --> MB
        MD --> MF
    end

    subgraph "SettingsModal Structure"
        SM["SettingsModal"]
        Main["Main View (SettingRow/SettingToggle sections)"]
        Panels["Panel Views (Personalization, Security, etc.)"]

        SM -->|"currentView='main'"| Main
        SM -->|"currentView!='main'"| Panels
    end

    subgraph "IconPickerModal Structure"
        IPM["IconPickerModal"]
        Preview["IconPreview<br/>(shows selected icon+color)"]
        CP["ColorPicker<br/>(color selection grid)"]
        IG["IconGrid<br/>(icon selection grid)"]

        IPM --> Preview
        IPM --> CP
        IPM --> IG
    end

    subgraph "DiscoverySettingsModal Structure"
        DSM["DiscoverySettingsModal"]
        Sections["Setting Sections:<br/>• Token Budgets<br/>• Prompt Enhancement<br/>• Clarifying Questions<br/>• Text Format<br/>• Reasoning Effort<br/>• Verbosity<br/>• Store Logs"]

        DSM --> Sections
    end

    classDef wrapper fill:#e8eaf6,stroke:#311b92
    classDef content fill:#fce4ec,stroke:#880e4f
    classDef sections fill:#fff8e1,stroke:#ff6f00

    class MD,SM,IPM,DSM wrapper
    class MH,MB,MF,Main,Preview content
    class Panels,CP,IG,Sections sections
```

## Anti-Patterns to Avoid

```mermaid
graph TB
    subgraph "Anti-Patterns (Don't Do This)"
        AP1["❌ Duplicate Focus Trap<br/>Copy-paste getFocusable()"]
        AP2["❌ Direct DOM Manipulation<br/>dialogRef.current?.focus()"]
        AP3["❌ Complex Callbacks<br/>onSave({...complex object})"]
        AP4["❌ State Drift<br/>useState(prop) without sync"]
    end

    subgraph "Best Practices (Do This Instead)"
        BP1["✅ Use ModalDialog/useFocusTrap"]
        BP2["✅ Let infrastructure handle focus"]
        BP3["✅ Return primitives<br/>onSave(iconId, colorId)"]
        BP4["✅ Sync with useEffect on isOpen"]
    end

    AP1 -.->|"replace with"| BP1
    AP2 -.->|"replace with"| BP2
    AP3 -.->|"replace with"| BP3
    AP4 -.->|"replace with"| BP4

    classDef antipattern fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef bestpractice fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px

    class AP1,AP2,AP3,AP4 antipattern
    class BP1,BP2,BP3,BP4 bestpractice
```

## Testing Strategy

```mermaid
graph LR
    subgraph "Unit Tests"
        UT1["useFocusTrap.test.ts<br/>• Focus trap behavior<br/>• Escape key handling<br/>• Focus restoration"]
        UT2["ModalDialog.test.ts<br/>• Rendering<br/>• ARIA attributes<br/>• Overlay behavior"]
    end

    subgraph "Component Tests"
        CT1["DiscoverySettingsModal.test.ts<br/>• State sync<br/>• Callback propagation<br/>• User interactions"]
        CT2["IconPickerModal.test.ts<br/>• Icon selection<br/>• Color selection<br/>• onSave callback"]
        CT3["SettingsModal.test.ts<br/>• Navigation<br/>• Panel switching<br/>• Setting components"]
    end

    subgraph "Integration Tests"
        IT1["E2E Modal Flow<br/>• Open modal<br/>• Interact<br/>• Close<br/>• Verify focus"]
    end

    UT1 --> CT1
    UT2 --> CT2
    CT1 --> IT1
    CT2 --> IT1
    CT3 --> IT1

    classDef unit fill:#e3f2fd,stroke:#1565c0
    classDef component fill:#f3e5f5,stroke:#7b1fa2
    classDef integration fill:#e8f5e9,stroke:#2e7d32

    class UT1,UT2 unit
    class CT1,CT2,CT3 component
    class IT1 integration
```

## File Structure

```mermaid
graph TB
    subgraph "packages/ui/src/"
        DIR1["hooks/"]
        DIR2["components/ui/overlays/"]
        DIR3["app/modals/"]
        DIR4["app/settings/"]
    end

    subgraph "Infrastructure Files"
        F1["useFocusTrap.ts"]
        F2["modal.tsx"]
    end

    subgraph "Modal Files"
        F3["DiscoverySettingsModal.tsx"]
        F4["IconPickerModal.tsx"]
        F5["SettingsModal.tsx"]
    end

    subgraph "Settings Files"
        F6["SettingRow.tsx"]
        F7["SettingToggle.tsx"]
        F8["SettingDropdown.tsx"]
        F9["PersonalizationPanel.tsx"]
        F10["SecurityPanel.tsx"]
        F11["ManageAppsPanel.tsx"]
        F12["AudioSettingsPanel.tsx"]
    end

    DIR1 --> F1
    DIR2 --> F2
    DIR3 --> F3
    DIR3 --> F4
    DIR3 --> F5
    DIR4 --> F6
    DIR4 --> F7
    DIR4 --> F8
    DIR4 --> F9
    DIR4 --> F10
    DIR4 --> F11
    DIR4 --> F12

    classDef dir fill:#faf5ff,stroke:#7c3aed
    classDef infra fill:#dbeafe,stroke:#2563eb
    classDef modal fill:#fce7f3,stroke:#db2777
    classDef setting fill:#fef3c7,stroke:#d97706

    class DIR1,DIR2,DIR3,DIR4 dir
    class F1,F2 infra
    class F3,F4,F5 modal
    class F6,F7,F8,F9,F10,F11,F12 setting
```

## Import Dependencies

```mermaid
graph LR
    subgraph "External Dependencies"
        React["React"]
        Radix["@radix-ui/react-dropdown-menu"]
    end

    subgraph "Internal Dependencies"
        Icons["ChatGPTIcons"]
        Utils["cn utility"]
    end

    subgraph "Our Code"
        FocusTrap["useFocusTrap"]
        ModalDialog["ModalDialog"]
        Modals["Feature Modals"]
        Settings["Settings Components"]
    end

    React --> FocusTrap
    React --> ModalDialog
    React --> Modals
    React --> Settings
    Radix --> SettingDropdown

    Utils --> ModalDialog
    Utils --> Settings

    FocusTrap --> ModalDialog
    ModalDialog --> Modals
    Icons --> Modals
    Icons --> Settings
    Settings --> Modals

    classDef external fill:#fecaca,stroke:#dc2626
    classDef internal fill:#fed7aa,stroke:#ea580c
    classDef ours fill:#bbf7d0,stroke:#16a34a

    class React,Radix external
    class Icons,Utils internal
    class FocusTrap,ModalDialog,Modals,Settings ours
```
