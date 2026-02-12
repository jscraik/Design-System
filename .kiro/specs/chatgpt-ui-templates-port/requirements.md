# Requirements Document: Port ChatGPT UI Template App into Web Platform (Apps SDK UI–First)

Last updated: 2026-01-09

## Doc requirements

- Audience: Developers (intermediate)
- Scope: Porting ChatGPT UI templates into the web platform with Apps SDK UI-first constraints
- Non-scope: Implementation details outside the template library, unrelated platform features
- Owner: TBD (confirm)
- Review cadence: TBD (confirm)

## Introduction

This document specifies requirements for porting the ChatGPT UI Template App from `_temp/ChatGPT UI Templates` into the platform web application at `platforms/web/apps/web`. The port will integrate a template library featuring production-ready ChatGPT-style UI templates, a deterministic template registry, and unified design tokens within the existing monorepo architecture.

**Non-negotiable foundation rule:** The integrated template system MUST treat Apps SDK UI (@openai/apps-sdk-ui) as the primary UI foundation. Where Apps SDK UI does not provide a component, the platform may use Radix primitives strictly as a fallback, while preserving Apps SDK UI token alignment and accessibility/interaction conventions.

## Glossary

- **Template**: A reusable UI template (component or page layout) demonstrating ChatGPT-style patterns and suitable for production reference
- **Template_Registry**: A deterministic, machine-checkable catalog of templates with metadata (id, title, description, category, tags, entry component)
- **Design_System**: Unified token + component foundations used by the web platform (tokens + themes + conventions)
- **Web_Platform**: Target application at `platforms/web/apps/web`
- **Source_App**: Template app under `_temp/ChatGPT UI Templates`
- **Category**: Grouping mechanism for templates (educational, components, design-system, templates, layouts, settings, modals, panels)
- **Widget**: Isolated UI component rendered within an iframe for the widget gallery
- **Router**: The routing system managing routes and page rendering in the web platform
- **Radix_UI**: Accessible UI primitives used only as fallback when Apps SDK UI coverage is missing
- **Design_Tokens**: Semantic colors, spacing, typography, radii, motion, etc. generated from `packages/tokens`

## Requirements

### Requirement 1: Template Library Integration

**User Story:** As a developer, I want to access the template library within the web platform, so I can browse, preview, and reuse production-ready templates.

#### Acceptance Criteria

1. THE Web_Platform SHALL integrate templates from the Source_App as a scoped library (explicit allowlist) rather than an uncontrolled copy
2. WHEN a user navigates to the templates route, THE Web_Platform SHALL display the template browser interface
3. THE Web_Platform SHALL preserve and keep functional the existing widget gallery alongside the template library
4. WHEN templates are added/modified, THE Template_Registry SHALL automatically reflect changes via a deterministic generator
5. THE Web_Platform SHALL preserve template metadata: id, title, description, category, tags, and entry component reference

### Requirement 2: Template Registry System (Deterministic)

**User Story:** As a developer, I want a deterministic registry so templates are discoverable and usable programmatically and in CI.

#### Acceptance Criteria

1. THE Web_Platform SHALL implement a Template_Registry with deterministic output
2. THE Template_Registry SHALL provide both:
   - `TEMPLATE_REGISTRY.json` (authoritative, machine-checkable)
   - `TEMPLATE_REGISTRY.md` (derived, human-readable)
3. Each template entry SHALL include: id, title, description, category, tags, route, entry, sourcePath, status (alpha/beta/stable)
4. WHEN querying the registry, THE Template_Registry SHALL support grouping by Category and filtering by title/description/tags
5. THE Template_Registry SHALL support at least 8 categories: educational, components, design-system, templates, layouts, settings, modals, panels

### Requirement 3: Design System Integration (Apps SDK UI–First)

**User Story:** As a developer, I want template styles to use the unified design system so the platform remains consistent across features.

#### Acceptance Criteria

1. THE Web_Platform SHALL use `packages/tokens` as the single source of truth for tokens consumed by templates
2. THE Design_System SHALL expose Apps SDK UI-aligned foundation + semantic tokens for colors/typography/spacing/radii/motion
3. THE Design_System SHALL support light/dark themes using the existing theme infrastructure
4. WHEN theme changes occur, THE Web_Platform SHALL apply the selected theme across templates and the template browser itself
5. THE token integration SHALL avoid conflicts by using explicit namespacing and a documented alias map for any new tokens

### Requirement 4: Component Library Migration (Apps SDK UI + Fallback Policy)

**User Story:** As a developer, I want templates to render using platform components without duplicating or fragmenting UI foundations.

#### Acceptance Criteria

1. THE Web_Platform SHALL prefer `@design-studio/ui` (Apps SDK UI–first) components as the primary component source
2. WHEN a template requires a component, THE Web_Platform SHALL:
   - use Apps SDK UI re-export/wrapper when available
   - otherwise use a Radix fallback only if no upstream equivalent exists
3. WHEN duplicate components exist, THE Web_Platform SHALL reconcile by:
   - using existing platform component where functionally equivalent, or
   - extracting shared logic and deleting duplicates
4. Radix_UI packages SHALL be included only for the minimal set of fallback components used
5. All migrated components SHALL consume semantic tokens only (no raw hex/px) except within the token pipeline

### Requirement 5: Template Browser Interface

**User Story:** As a user, I want a fast, searchable template browser with previews so I can find and evaluate templates quickly.

#### Acceptance Criteria

1. THE template browser SHALL display a sidebar with categorized templates
2. THE browser SHALL support search filtering across title/description/tags
3. WHEN selecting a template, THE browser SHALL render a preview in the main content area
4. Categories SHALL be collapsible and show counts
5. THE browser SHALL support "copy usage" affordances (import path + minimal snippet) for developers

### Requirement 6: Theme Management

**User Story:** As a user, I want theme toggling so templates can be previewed in light/dark consistently.

#### Acceptance Criteria

1. THE template browser SHALL provide a theme toggle control
2. Theme changes SHALL apply to all templates and surrounding UI
3. Theme preference SHALL persist across sessions
4. Theme changes SHALL update document/root theme mechanism consistently with the platform
5. Default theme SHALL follow platform default (do not hardcode dark unless the platform standard is dark)

### Requirement 7: Routing Integration

**User Story:** As a developer, I want templates routable so users can deep link to templates via URL.

#### Acceptance Criteria

1. THE Router SHALL include a route for the template library (for example, `/templates`)
2. The templates route SHALL render the template browser interface
3. THE Router SHALL support deep linking to templates via stable template IDs
4. Navigation SHALL preserve widget gallery routes and functionality
5. THE UI SHALL provide navigation links between widget gallery and template library

### Requirement 8: Dependency Management (Minimal + Workspace-first)

**User Story:** As a developer, I want minimal dependencies and clean workspace usage.

#### Acceptance Criteria

1. THE Web_Platform SHALL prefer workspace dependencies (`@design-studio/ui`, `@design-studio/runtime`, `@design-studio/tokens`) where available
2. Radix_UI dependencies SHALL be included only for required fallback components
3. Supporting libraries (lucide-react, class-variance-authority, clsx, tailwind-merge, etc.) SHALL be deduplicated where possible
4. The port SHALL maintain compatibility with the existing build system (Vite, Tailwind CSS v4)
5. The dependency graph SHALL be free of duplicate UI foundations (no parallel "button systems")

### Requirement 9: Template Categories and Organization

**User Story:** As a user, I want consistent template organization and stable ordering.

#### Acceptance Criteria

1. The registry SHALL organize templates into 8 categories: educational, components, design-system, templates, layouts, settings, modals, panels
2. The UI SHALL show category icons and template counts
3. Categories SHALL be collapsible and state MAY persist in local storage
4. Search results SHOULD preserve grouping (with empty groups hidden)
5. Categories SHALL display in stable order: educational, templates, components, design-system, layouts, settings, modals, panels

### Requirement 10: Build and Development Workflow

**User Story:** As a developer, I want the port to work cleanly with existing dev/build/test workflows.

#### Acceptance Criteria

1. WHEN running `pnpm dev:web`, THE Web_Platform SHALL start with HMR and render templates reliably
2. The port SHALL preserve existing build commands (`pnpm build`, `pnpm build:widget`)
3. Production builds SHALL bundle templates and dependencies correctly without dynamic import breakage
4. Environment variables SHALL remain compatible with platform expectations (no new required vars without documentation)
5. Widget build functionality SHALL remain intact for MCP server integration

### Requirement 11: Quality Gates (A11y, Performance, Determinism)

**User Story:** As a maintainer, I want automated quality gates so the template library stays safe and stable.

#### Acceptance Criteria

1. THE template browser and templates SHALL pass automated a11y checks (axe) for WCAG 2.2 AA baseline
2. THE registry generator SHALL be deterministic (running twice yields no diff)
3. THE template browser SHALL meet performance budgets (route load time + bundle size thresholds)
4. CI SHALL fail if:
   - registry outputs drift without regeneration
   - templates import forbidden dependencies (Radix outside fallback boundaries)
   - templates use hardcoded colors/spacing outside allowed cases

### Requirement 12: Security and Isolation (Template Preview)

**User Story:** As a maintainer, I want template preview to be safe and not introduce obvious web security footguns.

#### Acceptance Criteria

1. Templates SHALL not execute arbitrary user-provided HTML without sanitization
2. Any template that renders Markdown/HTML MUST use a safe renderer with explicit allowlist
3. The template browser SHALL not expose secrets via client logs
4. Any external links in templates SHOULD use `rel="noopener noreferrer"` and target safety
