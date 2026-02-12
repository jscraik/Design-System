# Requirements Document: Gold-Standard UI Design System (Apps SDK UI–First)

Last updated: 2026-01-08

## Introduction

This specification defines a comprehensive UI design system that serves as the governed contract connecting brand, tokens, components, patterns, and QA/release across all target platforms: React/Vite/Tailwind web applications, SwiftUI native apps (iOS/macOS/visionOS), and embedded ChatGPT Apps SDK widgets.

**Foundation rule (non-negotiable):** The system SHALL treat Apps SDK UI (`@openai/apps-sdk-ui`) as the primary design system for all ChatGPT-embedded surfaces and the baseline for web UI foundations (tokens, component behavior, interaction patterns). Any custom system tokens or components MUST either:

1. Alias / extend Apps SDK UI foundations, or
2. Use Radix Primitives strictly as an implementation fallback when Apps SDK UI lacks a required component, while still adhering to Apps SDK UI tokens, accessibility, and interaction conventions.

The system builds upon the existing infrastructure in this monorepo:

- Design tokens in `packages/tokens/` (token source aligned to Apps SDK UI foundations and generated for CSS/Swift)
- React components in `packages/ui/` (Apps SDK UI component-first, with Radix fallback primitives via `packages/ui/src/integrations/apps-sdk/`)
- Swift packages in `platforms/apple/swift/` (modular aStudio architecture consuming generated tokens and mapped foundations)
- Embedded widgets in `packages/widgets/` (Apps SDK-compliant, iframe-hosted UI using Apps SDK UI)

The design system establishes governance, foundations, token architecture, component standards, LLM/AI interaction patterns, and quality automation to ensure visual consistency, accessibility compliance (WCAG 2.2 AA), cross-platform parity, and operational reliability.

## Glossary

- **Apps_SDK_UI**: The official Apps SDK UI design system and component library (`@openai/apps-sdk-ui`) used to build high-quality ChatGPT apps; provides Tailwind-integrated tokens and accessible components. This is the PRIMARY foundation for all UI.
- **Apps_SDK_Examples**: The official Apps SDK examples repository used as a reference baseline for supported components, patterns, and wiring.
- **Radix_Fallback**: A constrained fallback policy: Radix primitives MAY be used only when Apps SDK UI lacks a needed primitive/component; styling and behavior MUST still follow Apps SDK UI foundations.
- **Design_Token_System**: Token source aligned to Apps SDK UI foundations that generates platform-specific outputs (CSS variables, Tailwind theme, Swift constants, Asset Catalogs)
- **Token_Layers**: Three-tier architecture: Reference tokens (raw primitives) → Semantic tokens (intent-based) → Component tokens (last-mile overrides)
- **Token_Alias_Map**: Explicit mapping of semantic tokens to Apps SDK UI foundation tokens (colors/typography/spacing/motion)
- **Component_Library_React**: React components using Apps SDK UI as primary source, with Radix Primitives as fallback, consuming semantic tokens
- **Component_Coverage_Matrix**: Documentation mapping Apps SDK UI components → local wrapper names → status (re-export/composed/extended/Radix fallback)
- **Component_Library_Swift**: SwiftUI components in `platforms/apple/swift/` consuming generated Swift tokens with Apps SDK UI parity
- **Widget_Runtime**: Embedded widget system for ChatGPT Apps SDK with iframe isolation, host theming, and Apps SDK UI baseline
- **Governance_System**: Charter, principles, RFC process, component lifecycle, versioning policies, and Upstream Alignment Log
- **Upstream_Alignment_Log**: Documentation tracking apps-sdk-ui version, deltas/overrides, and sync cadence
- **Storybook_Catalog**: Living documentation and test harness for React components
- **DocC_Documentation**: Auto-generated API documentation for Swift packages
- **LLM_UX_Patterns**: Standardized patterns for AI interactions: streaming, citations, corrections, confirmations
- **Accessibility_Baseline**: WCAG 2.2 AA compliance with focus management, keyboard navigation, screen reader support
- **Visual_Regression_System**: Automated snapshot testing across themes, viewports, and platforms
- **Figma_Make_Integration**: Private npm package publishing to Figma's org registry enabling Figma Make AI to discover and use design system components, tokens, and icons for code generation

## Requirements

### Requirement 1: Design System Governance and Charter (Apps SDK UI–First)

**User Story:** As a design system maintainer, I want a formal governance structure with Apps SDK UI as the canonical foundation, so that the system remains consistent, well-maintained, and aligned with ChatGPT-native conventions.

#### Acceptance Criteria for Requirement 1

1. THE Governance_System SHALL define a charter document specifying purpose, scope boundaries, supported platforms (Web/iOS/macOS/visionOS/Widgets), and explicit non-goals
2. THE Governance_System SHALL declare Apps_SDK_UI as the canonical foundation and SHALL document the Radix_Fallback policy (allowed cases + constraints)
3. THE Governance_System SHALL establish design principles covering clarity, consistency, accessibility-first, performance, and LLM UX (human control, transparency, correction-first)
4. WHEN new tokens or components are proposed, THE Governance_System SHALL require an RFC process with design review, accessibility signoff, and maintainer approval
5. THE Governance_System SHALL define component lifecycle stages: Proposal → Alpha → Beta → Stable → Deprecated → Removed with clear criteria for each transition
6. THE Governance_System SHALL enforce semantic versioning for all packages with documented deprecation windows and migration guides
7. WHEN breaking changes occur, THE Governance_System SHALL require release notes documenting token diffs, accessibility changes, and migration paths
8. THE Governance_System SHALL maintain an Upstream_Alignment_Log documenting: apps-sdk-ui version pinned in the repo, deltas/overrides applied by this design system, periodic sync cadence and regression checks against Apps_SDK_Examples

### Requirement 2: Token Standard and Architecture (Apps SDK UI–Aligned)

**User Story:** As a developer, I want design tokens aligned to Apps SDK UI foundations as the single source of truth, so that tokens flow consistently across all platforms without manual synchronization and match ChatGPT-native UI conventions.

#### Acceptance Criteria for Requirement 2

1. THE Design_Token_System SHALL use a pinned canonical token schema in-repo (via $schema or equivalent), with schema version recorded in `packages/tokens/SCHEMA_VERSION`
2. THE Design_Token_System SHALL implement three-tier token architecture: Reference tokens → Semantic tokens → Component tokens
3. THE Design_Token_System SHALL define a Token_Alias_Map that explicitly maps Semantic tokens to Apps_SDK_UI foundation tokens (colors/typography/spacing/motion) as the baseline
4. THE Design_Token_System SHALL encode Apps SDK UI foundation values (as a minimum baseline) for: Color foundations (light/dark, text/icon tiers, accents) consistent with Apps in ChatGPT foundations; Spacing scale (0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 128); Typography scale (SF Pro mappings for web + iOS; sizes/weights/line-heights/letter-spacing); Iconography set + naming conventions aligned to the published icon categories
5. WHEN tokens are updated, THE Design_Token_System SHALL generate CSS custom properties, Tailwind theme variables, TypeScript types, Swift constants, and Asset Catalogs automatically
6. THE Design_Token_System SHALL support theming modes: light/dark and high-contrast accessibility mode
7. WHEN token generation runs, THE Design_Token_System SHALL produce deterministic output with SHA-256 hashes in a manifest file for validation
8. WHEN tokens are invalid, THE Design_Token_System SHALL fail CI/CD builds with clear error messages and fix suggestions
9. THE Design_Token_System SHALL prohibit hardcoded hex/px usage in Stable components except within the token pipeline and documented escape hatches

### Requirement 3: Token Pipeline and Distribution

**User Story:** As a developer, I want automated token generation with hot reload during development, so that I can iterate quickly and see changes instantly across platforms.

#### Acceptance Criteria for Requirement 3

1. WHEN token source files change, THE token watcher SHALL regenerate all platform outputs (CSS, Tailwind, Swift, Asset Catalog) automatically with console feedback
2. THE token pipeline SHALL validate token format, naming conventions, and cross-platform consistency before generation
3. THE token pipeline SHALL output to: `packages/tokens/dist/` for web, `platforms/apple/swift/AStudioFoundation/` for Swift
4. WHEN Tailwind projects consume tokens, THE tailwind preset SHALL expose tokens as theme variables enabling utility class generation
5. THE token pipeline SHALL support incremental builds detecting only changed tokens for optimal performance
6. WHEN documentation is needed, THE token pipeline SHALL generate token tables with names, values, contrast checks, and usage examples

### Requirement 4: React Component Library (Apps SDK UI–First, Radix Fallback)

**User Story:** As a web developer, I want a React component library that uses Apps SDK UI as the primary component foundation, so that I can build ChatGPT-native experiences quickly and safely, with Radix only used where Apps SDK UI lacks coverage.

#### Acceptance Criteria for Requirement 4

1. THE Component_Library_React SHALL treat Apps_SDK_UI as the primary component source and SHALL prefer: (a) direct re-export with thin wrappers via `packages/ui/src/integrations/apps-sdk/`, or (b) composition wrappers that add product-specific ergonomics while preserving accessibility and styling
2. THE Component_Library_React SHALL maintain a Component_Coverage_Matrix documenting: Apps_SDK_UI component → local wrapper name → status (re-export / composed / extended); Missing in Apps_SDK_UI → Radix_Fallback primitive used → documented rationale
3. WHEN Apps_SDK_UI provides a component, THE Component_Library_React SHALL NOT implement a parallel competing component
4. WHEN Apps_SDK_UI lacks a component, THE Component_Library_React MAY use Radix primitives as the base, BUT: MUST consume semantic tokens aligned to Apps_SDK_UI; MUST match Apps_SDK_UI interaction behavior conventions (focus, disabled, loading, density); MUST include parity notes and a migration plan if Apps_SDK_UI later adds an equivalent
5. THE Component_Library_React SHALL provide layout primitives: Stack, Inline, Grid, Divider, Spacer for layout composition
6. THE Component_Library_React SHALL provide typography components: Text, Heading, Code, Label, Caption with semantic token consumption
7. THE Component_Library_React SHALL provide feedback components: Badge, Alert, Toast, InlineError, Skeleton, Progress with status variants
8. THE Component_Library_React SHALL provide data display components: List, KeyValue, Table (compact), Card with consistent styling
9. THE Component_Library_React SHALL provide overlay components: Tooltip, Popover, Dialog/Modal, Drawer with focus trap and keyboard dismissal
10. WHEN components are used, THE Component_Library_React SHALL consume semantic tokens exclusively with no hardcoded values
11. WHEN components render, THE Component_Library_React SHALL provide built-in accessibility: ARIA attributes, keyboard navigation, focus management, screen reader labels
12. THE Component_Library_React SHALL include reference stories/examples derived from Apps_SDK_Examples for every supported pattern class (inline card, carousel item, fullscreen)

### Requirement 5: SwiftUI Component Library

**User Story:** As an iOS/macOS developer, I want SwiftUI components that mirror React APIs with platform-native feel and Apps SDK UI parity, so that I can build native applications with consistent design system integration.

#### Acceptance Criteria for Requirement 5

1. THE Component_Library_Swift SHALL provide foundation package (AStudioFoundation) with semantic colors via Asset Catalog, typography styles, spacing constants, and platform utilities aligned to Apps SDK UI foundations
2. THE Component_Library_Swift SHALL provide components package (AStudioComponents) with settings primitives, buttons, inputs, cards, lists, and navigation components
3. THE Component_Library_Swift SHALL provide themes package (AStudioThemes) with ChatGPT preset and native macOS/iOS default theme
4. THE Component_Library_Swift SHALL provide optional shell package (AStudioShellChatGPT) for complete application layouts
5. WHEN components render, THE Component_Library_Swift SHALL automatically support light/dark mode through Asset Catalog integration
6. WHEN building for different platforms, THE Component_Library_Swift SHALL centralize iOS/macOS/visionOS conditional logic in Platform utilities
7. THE Component_Library_Swift SHALL support Dynamic Type for accessibility with scalable typography and adaptive layouts
8. WHEN components are used, THE Component_Library_Swift SHALL provide compile-time safety preventing typos and invalid token references

### Requirement 6: Embedded Widget System (Apps SDK UI Runtime Baseline)

**User Story:** As a ChatGPT Apps developer, I want embedded widgets that comply with Apps SDK constraints and integrate seamlessly with the host environment, using Apps SDK UI as the styling/component baseline.

#### Acceptance Criteria for Requirement 6

1. THE Widget_Runtime SHALL render UI inside an iframe in ChatGPT and communicate with the host via the window.openai API
2. THE Widget_Runtime SHALL support display modes: inline cards (lightweight, max 2 CTAs), carousel items, and fullscreen layouts with safe areas
3. THE Widget_Runtime SHALL standardize reading host-provided context (theme, displayMode, safeArea, locale) and SHALL apply Apps_SDK_UI foundations accordingly
4. THE Widget_Runtime SHALL use Apps_SDK_UI tokens + components as the baseline for all widget UIs via `packages/widgets/src/shared/`
5. WHEN widgets render inline, THE Widget_Runtime SHALL enforce constraints: no deep navigation, no nested scrolling, limited primary actions
6. THE Widget_Runtime SHALL expose theming via CSS custom properties consistent with Apps_SDK_UI (accents allowed; structural overrides prevented)
7. WHEN tool annotations indicate openWorld or destructive, THE Widget_Runtime SHALL require confirmation UI before execution
8. THE Widget_Runtime SHALL keep widgetState concise (under token budget) since the model reads it verbatim
9. THE Widget_Runtime SHALL enforce style isolation (Shadow DOM OR documented encapsulation strategy)
10. THE Widget_Runtime SHALL enforce Apps SDK domain allowlists (connect/resource/frame domains) and SHALL treat iframe subframes as opt-in with stricter review implications

### Requirement 7: LLM/AI Interaction Patterns

**User Story:** As a product designer, I want standardized LLM interaction patterns for trust, transparency, and safe action execution, so that AI features provide consistent, trustworthy user experiences.

#### Acceptance Criteria for Requirement 7

1. THE LLM_UX_Patterns SHALL define onboarding patterns that set expectations about system capabilities and limitations
2. THE LLM_UX_Patterns SHALL provide streaming output components with incremental rendering and accessible announcements (avoiding screen reader spam)
3. THE LLM_UX_Patterns SHALL provide citation/source components with inline markers, source chips, and keyboard-navigable source lists
4. THE LLM_UX_Patterns SHALL provide control patterns: regenerate variants, compare outputs, apply/accept changes (diff viewer), undo/revert
5. THE LLM_UX_Patterns SHALL provide safety patterns: refusal/redirect UI, sensitive action confirmations, content warnings
6. THE LLM_UX_Patterns SHALL provide feedback patterns: thumbs up/down with structured reason tags, report issue workflow
7. WHEN AI generates content, THE LLM_UX_Patterns SHALL visually distinguish AI actions/content with labels, icons, or watermarks
8. WHEN actions affect external systems, THE LLM_UX_Patterns SHALL require confirm-before-act with explicit acknowledgment for destructive actions
9. THE LLM_UX_Patterns SHALL provide agent/task-oriented patterns: run states (queued/running/waiting/completed/failed), pause/cancel, step approval, event logs

### Requirement 8: Accessibility Foundation (WCAG 2.2 AA)

**User Story:** As a user with accessibility needs, I want all components to meet WCAG 2.2 AA standards, so that I can use the application effectively regardless of ability.

#### Acceptance Criteria for Requirement 8

1. THE Accessibility_Baseline SHALL target WCAG 2.2 AA compliance for all web UI and embedded widgets
2. THE Accessibility_Baseline SHALL enforce minimum contrast ratios through token pairs (text/background) with automated validation
3. THE Accessibility_Baseline SHALL require visible focus states that are consistent, not clipped, and meet contrast requirements
4. THE Accessibility_Baseline SHALL require keyboard interaction specs for all interactive components with documented focus order
5. THE Accessibility_Baseline SHALL support motion reduction (prefers-reduced-motion) with alternative non-animated states
6. THE Accessibility_Baseline SHALL enforce minimum touch/click target sizes (44x44px minimum)
7. THE Accessibility_Baseline SHALL require screen reader labeling rules with proper ARIA attributes and content structure
8. WHEN streaming output renders, THE Accessibility_Baseline SHALL ensure focus is not trapped and updates are announced appropriately
9. WHEN regenerate actions occur, THE Accessibility_Baseline SHALL prevent disorienting content shifts
10. FOR SwiftUI components, THE Accessibility_Baseline SHALL require Dynamic Type support and VoiceOver labels

### Requirement 9: Component Documentation Standard (Apps SDK UI Mapping)

**User Story:** As a developer, I want comprehensive component documentation with interactive examples and Apps SDK UI mapping, so that I can understand and use components correctly.

#### Acceptance Criteria for Requirement 9

1. WHEN documenting components, THE documentation SHALL include: purpose, when to use/not use, anatomy diagram, variants, sizes, intents
2. WHEN documenting components, THE documentation SHALL include: states (default/hover/active/disabled/loading/error/success), accessibility notes (keyboard, ARIA, focus, SR)
3. WHEN documenting components, THE documentation SHALL include: content rules (labeling, error messages), theming hooks (which tokens apply), platform notes (React vs SwiftUI differences)
4. WHEN documenting a component, THE documentation SHALL include an "Apps_SDK_UI Mapping" section: upstream component name/version, wrapper/extension notes, fallback notes (if Radix_Fallback used), parity notes for widget-safe variants
5. THE Storybook_Catalog SHALL provide interactive examples with controls for all props and variants
6. THE Storybook_Catalog SHALL include accessibility checks (axe) and keyboard navigation smoke tests
7. THE DocC_Documentation SHALL generate comprehensive API documentation for Swift packages from code comments
8. WHEN components are updated, THE documentation SHALL be updated in the same PR with breaking changes clearly noted

### Requirement 10: Testing and Quality Automation (Upstream Drift Control)

**User Story:** As a quality engineer, I want automated testing infrastructure for visual regression, accessibility, cross-platform consistency, and upstream drift detection, so that I can catch bugs before production.

#### Acceptance Criteria for Requirement 10

1. THE Visual_Regression_System SHALL provide snapshot testing for all components across light/dark modes, high contrast, and viewport sizes
2. THE Visual_Regression_System SHALL detect visual regressions in CI via Chromatic-style snapshot diffs
3. WHEN components are modified, THE test suite SHALL run automated accessibility tests (axe) and keyboard navigation validation
4. THE test suite SHALL include property-based tests validating component behavior across randomized input combinations
5. WHEN tokens are invalid or inconsistent, THE CI/CD pipeline SHALL fail builds before merge
6. THE testing infrastructure SHALL validate pixel-close consistency between React and SwiftUI components through automated visual comparison
7. FOR SwiftUI components, THE test suite SHALL include snapshot tests per Dynamic Type category and dark mode coverage
8. THE test suite SHALL enforce performance budgets: bundle size limits, render time thresholds
9. THE test suite SHALL include linting rules: no raw hex colors, no hardcoded spacing, accessibility lint
10. THE test suite SHALL include upstream drift tests: snapshot comparisons for key Apps_SDK_UI components used in this repo, contract tests verifying Token_Alias_Map remains valid after dependency upgrades, alerting when Apps_SDK_UI introduces components that can replace local Radix_Fallback implementations

### Requirement 10a: Apps SDK UI Usage Enforcement

**User Story:** As a maintainer, I want automated enforcement of Apps SDK UI–First policy, so that drift from upstream is prevented and detected early.

#### Acceptance Criteria for Requirement 10a

1. THE CI/CD pipeline SHALL include ESLint rule disallowing `@radix-ui/*` imports outside `packages/ui/src/components/**/fallback/**`
2. THE CI/CD pipeline SHALL include ESLint rule disallowing creation of parallel components when upstream Apps_SDK_UI provides equivalent (config-based allowlist)
3. WHEN apps-sdk-ui version changes, THE CI/CD pipeline SHALL require drift tests to run and stamp the Upstream_Alignment_Log
4. THE CI/CD pipeline SHALL validate Component_Coverage_Matrix is up-to-date with upstream exports
5. THE CI/CD pipeline SHALL fail if a new component is added without a matrix entry
6. THE CI/CD pipeline SHALL fail if a local component duplicates upstream capability without explicit waiver

### Requirement 10b: Host Contract Compliance

**User Story:** As a widget developer, I want the runtime layer to only use supported host APIs and be tested against mocks, so that widgets work reliably in ChatGPT.

#### Acceptance Criteria for Requirement 10b

1. THE @design-studio/runtime package SHALL provide a typed wrapper of window.openai host API
2. THE @design-studio/runtime package SHALL provide a mock host for Storybook/Gallery parity testing
3. THE test suite SHALL include contract tests validating the widget runtime only calls documented Apps SDK APIs
4. WHEN new host APIs are used, THE documentation SHALL reference the Apps SDK reference documentation

### Requirement 11: Brand System and Voice

**User Story:** As a brand manager, I want consistent brand application across all platforms, so that the product maintains visual identity while respecting platform conventions.

#### Acceptance Criteria for Requirement 11

1. THE brand system SHALL define logo usage rules, clear space requirements, and misuse examples
2. THE brand system SHALL define color philosophy: semantic usage rules, theming constraints, contrast targets
3. THE brand system SHALL define typography mapping: web tokens to iOS text styles with platform-appropriate fallbacks
4. THE brand system SHALL define iconography standards: stroke/fill rules, sizes, alignment grid, naming conventions
5. THE brand system SHALL define voice and tone: UI copy patterns for labels, errors, confirmations, empty states
6. WHEN embedded in host surfaces, THE brand system SHALL follow platform-first rule: brand in accents/icons/CTAs, not structural UI
7. THE brand system SHALL define AI voice constraints: avoid anthropomorphic emotional framing, be explicit about limits

### Requirement 12: Motion and Interaction System

**User Story:** As a designer, I want standardized motion and interaction patterns, so that the UI feels responsive and consistent across all platforms.

#### Acceptance Criteria for Requirement 12

1. THE motion system SHALL define duration tokens: standard (0.25s), fast (0.15s), slow (0.35s), reduced (0.1s)
2. THE motion system SHALL define easing tokens: ease-out for entrances, ease-in for exits, ease-in-out for state changes
3. THE motion system SHALL define interaction feedback rules: hover states (web/macOS), pressed states (all), loading states, disabled states
4. WHEN prefers-reduced-motion is enabled, THE motion system SHALL provide alternative non-animated states
5. THE motion system SHALL define "no surprise motion" rules for embedded contexts preventing unexpected animations
6. THE motion system SHALL define skeleton/loading patterns: when to use skeletons vs spinners, streaming state indicators

### Requirement 13: Layout and Spacing System

**User Story:** As a developer, I want consistent layout and spacing rules, so that UIs are visually harmonious across all screens and platforms.

#### Acceptance Criteria for Requirement 13

1. THE layout system SHALL define spacing scale tokens: 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 128 (matching existing Apps SDK UI scale)
2. THE layout system SHALL define grid rules for web: 12-column grid, responsive breakpoints, container max-widths
3. THE layout system SHALL define adaptive layout rules for SwiftUI: size classes, safe areas, Dynamic Type adaptation
4. THE layout system SHALL define density modes: compact (for data-dense UIs) and comfortable (default)
5. THE layout system SHALL define component padding conventions: consistent internal spacing for cards, buttons, inputs
6. WHEN building responsive layouts, THE layout system SHALL provide breakpoint tokens mapped to Tailwind and SwiftUI size classes

### Requirement 14: Pattern Library (Product Flows)

**User Story:** As a product designer, I want standardized patterns for common product flows, so that teams don't reinvent solutions and users have consistent experiences.

#### Acceptance Criteria for Requirement 14

1. THE pattern library SHALL define form patterns: validation (sync/async), error summaries, field-level errors, success states
2. THE pattern library SHALL define search and filtering patterns: search inputs, filter chips, sort controls, results display
3. THE pattern library SHALL define empty state patterns: first-use, no results, error states with recovery actions
4. THE pattern library SHALL define loading patterns: initial load, pagination, infinite scroll, optimistic updates
5. THE pattern library SHALL define notification patterns: toast positioning, banner types, inline alerts, notification center
6. THE pattern library SHALL define navigation patterns: sidebar, tabs, breadcrumbs, back navigation (especially for embedded contexts)
7. THE pattern library SHALL define authentication patterns: login, signup, password reset, OAuth flows
8. THE pattern library SHALL define settings patterns: grouped settings, toggles, dropdowns, dangerous actions

### Requirement 15: Content and Microcopy Standards

**User Story:** As a content designer, I want standardized microcopy patterns, so that UI text is consistent, clear, and accessible.

#### Acceptance Criteria for Requirement 15

1. THE content system SHALL define terminology dictionary: product nouns/verbs, consistent naming for AI features
2. THE content system SHALL define microcopy patterns: confirmations, warnings, empty states, rate limits, latency messages
3. THE content system SHALL define prompting affordances: placeholders, helper prompts, tips, example queries
4. THE content system SHALL define safety language guidelines: neutral, non-judgmental, directs to alternatives
5. THE content system SHALL define localization rules: no idioms in critical flows, gender/grammar handling, string expansion allowances
6. THE content system SHALL define error message patterns: what went wrong, why, how to fix it

### Requirement 16: Build Pipeline and Distribution

**User Story:** As a platform engineer, I want a unified build pipeline that handles all platforms seamlessly, so that I can build and deploy from a single codebase.

#### Acceptance Criteria for Requirement 16

1. THE build pipeline SHALL generate artifacts for: npm (React components, tokens), Swift Package Manager (SwiftUI packages), embedded widget bundles
2. THE build pipeline SHALL synchronize versions across package.json, Package.swift, and widget manifests
3. THE build pipeline SHALL support incremental builds detecting changes in specific packages for optimal CI performance
4. THE build pipeline SHALL validate cross-platform consistency: token values match across CSS and Swift outputs
5. THE build pipeline SHALL support parallel compilation and build caching
6. WHEN CI/CD runs, THE build pipeline SHALL test: React unit tests, SwiftUI tests, accessibility tests, visual regression, token validation
7. THE build pipeline SHALL generate release artifacts: npm packages, Swift packages, widget bundles, documentation sites

### Requirement 17: Developer Experience and Tooling

**User Story:** As a developer, I want excellent developer experience with fast feedback loops, so that I can iterate quickly and catch errors early.

#### Acceptance Criteria for Requirement 17

1. THE development environment SHALL provide hot reload for token changes with instant preview updates
2. THE development environment SHALL provide Storybook for React component development with live examples
3. THE development environment SHALL provide SwiftUI previews for native component development
4. THE development environment SHALL provide Component Gallery app for visual testing across themes and states
5. THE development environment SHALL provide lint rules catching: hardcoded colors, hardcoded spacing, accessibility violations, deprecated imports
6. WHEN errors occur, THE development environment SHALL provide clear error messages with suggestions for fixes
7. THE development environment SHALL provide TypeScript types for all tokens enabling autocomplete and compile-time validation
8. THE development environment SHALL provide migration tools and codemods for breaking changes

### Requirement 18: Figma Integration and Design Handoff

**User Story:** As a designer, I want Figma libraries that stay synchronized with code, so that design-to-dev handoff is seamless and designs match implementation.

#### Acceptance Criteria for Requirement 18

1. THE Figma integration SHALL provide token variables in Figma matching the DTCG source of truth
2. THE Figma integration SHALL provide component libraries matching React and SwiftUI implementations
3. WHEN tokens are updated in code, THE Figma integration SHALL provide sync workflow to update Figma variables
4. THE Figma integration SHALL provide design review checklist ensuring designs use system tokens and components
5. THE Figma integration SHALL provide export guides for icons, illustrations, and other assets
6. WHEN new components are designed, THE Figma integration SHALL require design spec including anatomy, variants, states, and accessibility notes

### Requirement 19: Responsible AI UX Standards

**User Story:** As a product owner, I want UI standards that support responsible AI practices, so that users can trust and verify AI outputs.

#### Acceptance Criteria for Requirement 19

1. THE responsible AI standards SHALL require data handling disclosures: what is stored, shared, retained
2. THE responsible AI standards SHALL require user controls: history management, export, delete, memory controls where applicable
3. THE responsible AI standards SHALL define PII handling UX: warnings, inline detection, confirm before sending
4. THE responsible AI standards SHALL require provenance indicators: citations, "AI-generated" labels, audit-friendly logs
5. THE responsible AI standards SHALL define human review requirements for specific actions: publish, send, apply changes
6. THE responsible AI standards SHALL define confidence/uncertainty signals without fake precision
7. THE responsible AI standards SHALL define refusal patterns: clear, calm messaging with next steps and alternatives

### Requirement 20: Figma Make Private Package Publishing

**User Story:** As a designer using Figma Make, I want to install our design system packages from Figma's org private npm registry, so that Make's AI can inspect and use our components, tokens, and icons when generating code.

#### Acceptance Criteria for Requirement 20

1. THE Figma_Make_Integration SHALL publish three scoped packages to Figma's org private npm registry: `@design-studio/tokens`, `@design-studio/ui`, `@design-studio/icons`
2. THE Figma_Make_Integration SHALL configure the Figma org private registry with an admin-generated authentication key stored in `.npmrc`
3. WHEN publishing `@design-studio/tokens`, THE package SHALL include CSS variables, Tailwind preset, and TypeScript token types aligned to Apps SDK UI foundations
4. WHEN publishing `@design-studio/ui`, THE package SHALL include Apps SDK UI-first React component wrappers that are React 18+ and Vite compatible
5. WHEN publishing `@design-studio/icons`, THE package SHALL include: SVG source files, generated React icon components (via SVGR), and a typed `IconName` union with `<Icon name="..." />` renderer
6. THE `@design-studio/icons` package SHALL organize icons into categories matching the published Apps-in-ChatGPT icon taxonomy: Arrows, Interface, Settings, Chat and Tools, Account & User, Platform, Misc
7. THE `@design-studio/icons` package SHALL re-export any upstream icons from `@openai/apps-sdk-ui` that are used in the system
8. WHEN a Figma Make file installs the packages, THE packages SHALL be discoverable and usable by Make's AI for code generation
9. THE Figma_Make_Integration SHALL include a `guidelines/` folder in the Make template file with: `Guidelines.md`, `overview-components.md`, `overview-icons.md`, and `design-tokens/*.md` files
10. THE Figma_Make_Integration SHALL provide a Make template file that installs all three packages and includes the guidelines folder
11. WHEN packages are published, THE Figma_Make_Integration SHALL synchronize versions across all three packages using the same versioning as the main design system

### Requirement 21: Cross-Platform Parity and Consistency (Apps SDK Parity Anchor)

**User Story:** As a user, I want consistent experiences across web, iOS, macOS, and embedded widgets, so that I can use the product seamlessly on any platform.

#### Acceptance Criteria for Requirement 21

1. THE cross-platform system SHALL maintain parity anchored on Apps_SDK_UI foundations for web/widgets and SHALL document SwiftUI equivalence mappings for: color roles (light/dark, tiers, accents), spacing scale, typography scale, iconography categories and naming
2. THE cross-platform system SHALL respect platform conventions: native interactions, system fonts where appropriate, platform-specific affordances
3. THE cross-platform system SHALL provide parity checklist documenting React vs SwiftUI component alignment
4. WHEN components differ between platforms, THE cross-platform system SHALL document the differences and rationale
5. THE cross-platform system SHALL validate parity through automated visual comparison in CI
6. THE cross-platform system SHALL support future platforms (visionOS) through platform detection utilities and modular architecture

## Appendix: Canonical Foundations (Apps in ChatGPT)

The following canonical foundations from Apps SDK UI serve as the baseline for this design system:

### Colors (Light/Dark + Accents)

Baseline hex values for backgrounds, text tiers, icon tiers, and accents as defined in `packages/tokens/src/tokens/index.dtcg.json`:

- Background: primary (#FFFFFF/#212121), secondary (#E8E8E8/#303030), tertiary (#F3F3F3/#414141)
- Text: primary (#0D0D0D/#FFFFFF), secondary (#5D5D5D/#CDCDCD), tertiary (#8F8F8F/#AFAFAF)
- Accents: blue (#0285FF/#48AAFF), green (#008635/#40C977), red (#E02E2A/#FF8583), etc.

### Spacing Scale

0–128px scale as defined: 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 128

### Typography

SF Pro scale with weights/line-heights/letter-spacing for web + iOS as defined in token source.

### Iconography

Published categories: Arrows, Interface, Settings, Chat/Tools, Account/User, Platform, Misc (350+ icons in `packages/ui/src/icons/`).
